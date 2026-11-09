declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "acosa_consent";
type Params = Record<string, string>;

function track(name: string, params: Params): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/** Property context for an element: the page wrapper first, the element's own
 *  property overrides it. If the element belongs to a different property than
 *  the page wrapper (e.g. a card), the wrapper is ignored entirely. */
function readContext(el: Element): Params {
  const own = el.closest<HTMLElement>("[data-property-id]");
  const page = el.closest<HTMLElement>("[data-property-page]");
  const sources: HTMLElement[] = [];
  if (page && (!own || own.dataset.propertyId === page.dataset.propertyId)) {
    sources.push(page);
  }
  if (own) sources.push(own);

  const out: Params = {};
  for (const source of sources) {
    const d = source.dataset;
    if (d.propertyId) out.property_id = d.propertyId;
    if (d.propertyName) out.property_name = d.propertyName;
    if (d.businessNode) out.business_node = d.businessNode;
    if (d.province) out.province = d.province;
    if (d.propertyType) out.property_type = d.propertyType;
  }
  // Never send a property_name without a property_id.
  if (!out.property_id) delete out.property_name;
  return out;
}

function describeLink(href: string): Params {
  if (href.startsWith("mailto:")) return { link_type: "email" };
  if (href.startsWith("tel:")) return { link_type: "phone" };
  try {
    const url = new URL(href, window.location.href);
    if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) {
      return { link_type: "whatsapp" };
    }
    if (url.origin === window.location.origin) return { link_type: "internal" };
    const isMaps =
      url.hostname.startsWith("maps.") || url.pathname.startsWith("/maps");
    return {
      link_type: isMaps ? "maps" : "website",
      link_domain: url.hostname,
    };
  } catch {
    return { link_type: "unknown" };
  }
}

const EVENT_NAME = /^[a-z][a-z0-9_]{0,39}$/;

document.addEventListener("click", (event) => {
  const el =
    event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>("a[data-acosa-track]")
      : null;
  if (!el) return;
  const name = el.dataset.acosaTrack ?? "";
  if (!EVENT_NAME.test(name)) return;
  track(name, {
    ...readContext(el),
    ...describeLink(el.getAttribute("href") ?? ""),
    transport_type: "beacon",
  });
});

function trackPropertyView(): void {
  const page = document.querySelector<HTMLElement>(
    '[data-property-page="true"]',
  );
  if (page) track("property_view", readContext(page));
}

/* ---------- consent ---------- */
type Choice = "granted" | "denied";

function storedChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function applyChoice(choice: Choice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  window.gtag?.("consent", "update", { analytics_storage: choice });
}

function setBanner(visible: boolean): void {
  const banner = document.getElementById("acosa-consent");
  if (!banner) return;
  banner.classList.toggle("hidden", !visible);
  banner.classList.toggle("flex", visible);
}

function initConsent(): void {
  if (!document.getElementById("acosa-consent")) return; // GA not configured
  setBanner(storedChoice() === null);

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const choiceEl = event.target.closest<HTMLElement>("[data-consent]");
    if (choiceEl) {
      const choice = choiceEl.dataset.consent;
      if (choice === "granted" || choice === "denied") {
        applyChoice(choice);
        setBanner(false);
      }
      return;
    }
    if (event.target.closest("[data-consent-reset]")) {
      applyChoice("denied");
      try {
        localStorage.removeItem(CONSENT_KEY);
      } catch {
        /* ignore */
      }
      setBanner(true);
    }
  });
}

function init(): void {
  trackPropertyView();
  initConsent();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export {};
