import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  type AnalyticsConsent,
} from "./config";

export type AnalyticsEventParameters = {
  click_whatsapp: {
    contact_method: "whatsapp";
    button_location: "header" | "contact_section" | "footer";
  };
  click_email: {
    contact_method: "email";
    button_location: "header" | "contact_section" | "footer" | "privacy_page";
  };
  click_instagram: {
    contact_method: "instagram";
    button_location: "header" | "contact_section" | "footer";
  };
  click_orcamento: {
    contact_method: "whatsapp";
    button_location: "hero";
  };
  view_projetos: {
    button_location: "header_navigation" | "mobile_navigation" | "hero";
  };
  view_servicos: {
    button_location: "header_navigation" | "mobile_navigation";
  };
  select_service_category: {
    service_category: "projetos" | "legalizacao";
  };
};

export type AnalyticsEventName = keyof AnalyticsEventParameters;

type GoogleConsentStatus = "granted" | "denied";
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
    __vulpesAnalyticsConfigured?: boolean;
    __vulpesAnalyticsReady?: boolean;
    __vulpesConsentDefaultSet?: boolean;
    __vulpesConsentChoice?: AnalyticsConsent;
    __vulpesConsentStoragePersisted?: boolean;
  }
}

function getGtag(): Gtag {
  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  return window.gtag;
}

function consentPayload(analyticsStorage: GoogleConsentStatus) {
  return {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  };
}

export function prepareAnalyticsAfterConsent(): void {
  if (typeof window === "undefined") return;

  const gtag = getGtag();
  if (window.__vulpesConsentDefaultSet) {
    gtag("consent", "update", consentPayload("granted"));
  } else {
    gtag("consent", "default", consentPayload("granted"));
    window.__vulpesConsentDefaultSet = true;
  }
  window.__vulpesConsentChoice = "granted";
}

export function initializeGoogleAnalytics(): void {
  if (typeof window === "undefined") return;

  const gtag = getGtag();
  gtag("consent", "update", consentPayload("granted"));

  if (!window.__vulpesAnalyticsConfigured) {
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    window.__vulpesAnalyticsConfigured = true;
  }

  window.__vulpesConsentChoice = "granted";
  window.__vulpesAnalyticsReady = true;
}

export function revokeGoogleAnalyticsConsent(): void {
  if (typeof window === "undefined") return;

  window.__vulpesAnalyticsReady = false;
  window.__vulpesConsentChoice = "denied";
  if (window.gtag) {
    window.gtag("consent", "update", consentPayload("denied"));
  }
  clearAnalyticsCookies();
}

export function getStoredAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unknown";

  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (stored === "granted" || stored === "denied") return stored;
    if (stored !== null || window.__vulpesConsentStoragePersisted) return "unknown";
  } catch {
    // A session-only choice remains available if browser storage is disabled.
  }

  return window.__vulpesConsentChoice ?? "unknown";
}

function clearAnalyticsCookies(): void {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=", 1)[0]?.trim())
    .filter((name): name is string => Boolean(name?.startsWith("_ga")));

  const domains = new Set(["", `;domain=${window.location.hostname}`, `;domain=.${window.location.hostname}`]);
  if (window.location.hostname.endsWith("vulpesdomus.com.br")) {
    domains.add(";domain=vulpesdomus.com.br");
    domains.add(";domain=.vulpesdomus.com.br");
  }

  for (const name of cookieNames) {
    for (const domain of domains) {
      document.cookie = `${name}=;max-age=0;path=/${domain};samesite=lax`;
    }
  }
}

function hasAnalyticsConsent(): boolean {
  const consent = getStoredAnalyticsConsent();
  return consent === "granted" && window.__vulpesConsentChoice === "granted";
}

function pageLocation(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

function safePageReferrer(): string {
  if (!document.referrer) return "";

  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === window.location.origin
      ? `${referrer.origin}${referrer.pathname}`
      : referrer.origin;
  } catch {
    return "";
  }
}

export function trackEvent<EventName extends AnalyticsEventName>(
  eventName: EventName,
  parameters: AnalyticsEventParameters[EventName],
): void {
  if (
    typeof window === "undefined" ||
    !window.__vulpesAnalyticsReady ||
    !window.gtag ||
    !hasAnalyticsConsent()
  ) {
    return;
  }

  try {
    window.gtag("event", eventName, {
      ...parameters,
      page_location: pageLocation(),
      page_referrer: safePageReferrer(),
    });
  } catch {
    // Analytics must never interrupt navigation or other site interactions.
  }
}

export function trackPageView(): boolean {
  if (
    typeof window === "undefined" ||
    !window.__vulpesAnalyticsReady ||
    !window.gtag ||
    !hasAnalyticsConsent()
  ) {
    return false;
  }

  try {
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: pageLocation(),
      page_path: window.location.pathname,
      page_referrer: safePageReferrer(),
    });
    return true;
  } catch {
    // Analytics must never interrupt site rendering.
    return false;
  }
}
