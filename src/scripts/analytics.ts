import { getGaMeasurementId } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    /** Google's opt-out switch for one GA property: true stops gtag.js sending. */
    [gaDisable: `ga-disable-${string}`]: boolean | undefined;
  }
}

const GA_ID = getGaMeasurementId(import.meta.env.PUBLIC_GA_MEASUREMENT_ID);
const OPTOUT_KEY = "acosa_analytics_optout";
const DISABLE_FLAG = `ga-disable-${GA_ID}` as const;
type Params = Record<string, string>;

/** True only while gtag has been loaded AND the visitor has not switched
 *  analytics off. Nothing is sent, queued or buffered while this is false. */
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

function trackPropertyView(): void {
  const page = document.querySelector<HTMLElement>(
    '[data-property-page="true"]',
  );
  if (page) track("property_view", readContext(page));
}

/* GA loading. Skipped on every page while the visitor has analytics off. */

function loadGa(): void {
  if (!GA_ID || analyticsOn) return;
  if (document.getElementById("acosa-gtag")) {
    // Switched back on after switching off on this page: gtag is already loaded.
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
  window.gtag("config", GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
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

/* Opt-out, remembered in localStorage as "1". If storage is blocked, reading
   it means "not opted out" and an opt-out lasts for the current page only. */

function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPTOUT_KEY) === "1";
  } catch {
    return false;
  }
}

function optOut(): void {
  try {
    localStorage.setItem(OPTOUT_KEY, "1");
  } catch {
    /* storage blocked: the opt-out lasts for this page only */
  }
  window[DISABLE_FLAG] = true;
  analyticsOn = false;
  deleteGaCookies();
  refreshToggleUi();
}

function optIn(): void {
  try {
    localStorage.removeItem(OPTOUT_KEY);
  } catch {
    /* storage blocked: nothing was stored */
  }
  window[DISABLE_FLAG] = false;
  loadGa();
  trackPropertyView();
  refreshToggleUi();
}

/** Brings the status text and the toggle label on /privacy in line with the
 *  current state. */
function refreshToggleUi(): void {
  const status = analyticsOn
    ? "Analytics is currently on in this browser."
    : "Analytics is currently off in this browser.";
  const label = analyticsOn ? "Switch off analytics" : "Switch on analytics";
  document.querySelectorAll("[data-analytics-status]").forEach((el) => {
    el.textContent = status;
  });
  document.querySelectorAll("[data-analytics-toggle]").forEach((el) => {
    // The label sits in a styled span; replacing the button's own text
    // would drop that styling.
    (el.querySelector("span") ?? el).textContent = label;
  });
}

function handleToggleClick(event: Event): void {
  if (!(event.target instanceof Element)) return;
  if (!event.target.closest("[data-analytics-toggle]")) return;
  if (analyticsOn) optOut();
  else optIn();
}

function onDomReady(fn: () => void): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

function init(): void {
  const optedOut = isOptedOut();
  // Google requires this flag on every page, before any gtag() call.
  window[DISABLE_FLAG] = optedOut;
  document.addEventListener("click", handleLinkClick);
  document.addEventListener("auxclick", handleLinkClick);
  document.addEventListener("click", handleToggleClick);
  if (!optedOut) {
    loadGa();
    onDomReady(trackPropertyView);
  }
  onDomReady(refreshToggleUi);
}

if (GA_ID) init();

export {};
