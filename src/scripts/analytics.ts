import { getGaMeasurementId } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = getGaMeasurementId(import.meta.env.PUBLIC_GA_MEASUREMENT_ID);
const CONSENT_KEY = "acosa_consent";
type Params = Record<string, string>;
type Choice = "granted" | "denied";

/** True only while the visitor has accepted AND gtag has been loaded.
 *  Nothing is sent, queued or buffered while this is false. */
let analyticsOn = false;

function track(name: string, params: Params): void {
  if (!analyticsOn || typeof window.gtag !== "function") return;
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

/** Handles normal clicks, and middle-clicks (which browsers report as
 *  "auxclick", not "click"), so links opened in a new tab are still counted. */
function handleLinkClick(event: MouseEvent): void {
  if (event.type === "auxclick" && event.button !== 1) return;
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
  });
}

document.addEventListener("click", handleLinkClick);
document.addEventListener("auxclick", handleLinkClick);

function trackPropertyView(): void {
  const page = document.querySelector<HTMLElement>(
    '[data-property-page="true"]',
  );
  if (page) track("property_view", readContext(page));
}

/* ---------- GA loading (only ever after Accept) ---------- */

function loadGa(): void {
  if (!GA_ID || analyticsOn) return;
  if (document.getElementById("acosa-gtag")) {
    // Re-accepted on the same page after withdrawing: gtag is already loaded.
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    analyticsOn = true;
    return;
  }
  window.dataLayer = window.dataLayer || [];
  // gtag.js requires the real `arguments` object to be pushed, not an array.
  window.gtag = function gtag(..._args: unknown[]): void {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
  const script = document.createElement("script");
  script.id = "acosa-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
  analyticsOn = true;
}

function deleteGaCookies(): void {
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = new Set<string | undefined>([undefined, host, `.${host}`]);
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");
    domains.add(parent);
    domains.add(`.${parent}`);
  }
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0]?.trim() ?? "")
    .filter((n) => n === "_ga" || n.startsWith("_ga_"));
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/** Withdrawal: stop sending, tell Google, and remove the analytics cookies. */
function stopGa(): void {
  analyticsOn = false;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  deleteGaCookies();
}

/* ---------- consent ---------- */

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
  if (choice === "granted") {
    loadGa();
    trackPropertyView();
  } else {
    stopGa();
  }
}

function setBanner(visible: boolean): void {
  const banner = document.getElementById("acosa-consent");
  if (!banner) return;
  banner.classList.toggle("hidden", !visible);
  banner.classList.toggle("flex", visible);
}

function initConsent(): void {
  if (!GA_ID || !document.getElementById("acosa-consent")) return;
  const choice = storedChoice();
  setBanner(choice === null);
  if (choice === "granted") {
    loadGa();
    trackPropertyView();
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const choiceEl = event.target.closest<HTMLElement>("[data-consent]");
    if (choiceEl) {
      const picked = choiceEl.dataset.consent;
      if (picked === "granted" || picked === "denied") {
        applyChoice(picked);
        setBanner(false);
      }
      return;
    }
    if (event.target.closest("[data-consent-reset]")) {
      stopGa();
      try {
        localStorage.removeItem(CONSENT_KEY);
      } catch {
        /* ignore */
      }
      setBanner(true);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initConsent);
} else {
  initConsent();
}

export {};
