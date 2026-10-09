"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  type AnalyticsConsent,
} from "./config";
import {
  getStoredAnalyticsConsent,
  initializeGoogleAnalytics,
  prepareAnalyticsAfterConsent,
  revokeGoogleAnalyticsConsent,
  trackPageView,
} from "./events";

type AnalyticsConsentContextValue = {
  consent: AnalyticsConsent;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  chooseConsent: (choice: "granted" | "denied") => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | null>(null);

export function useAnalyticsConsent(): AnalyticsConsentContextValue {
  const context = useContext(AnalyticsConsentContext);
  if (!context) {
    throw new Error("useAnalyticsConsent deve ser usado dentro de AnalyticsProvider.");
  }
  return context;
}

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<AnalyticsConsent>("unknown");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const consentRef = useRef<AnalyticsConsent>("unknown");
  const consentSessionRef = useRef(0);
  const sentPageViewRef = useRef<{ session: number; pathname: string } | null>(null);
  const hasReadInitialConsentRef = useRef(false);
  const pathname = usePathname();

  const sendPageViewForCurrentConsent = useCallback(() => {
    if (
      consentRef.current !== "granted" ||
      (sentPageViewRef.current?.session === consentSessionRef.current &&
        sentPageViewRef.current.pathname === window.location.pathname)
    ) {
      return;
    }

    if (!trackPageView()) return;
    sentPageViewRef.current = {
      session: consentSessionRef.current,
      pathname: window.location.pathname,
    };
  }, []);

  useEffect(() => {
    if (hasReadInitialConsentRef.current) return;
    hasReadInitialConsentRef.current = true;

    const savedConsent = getStoredAnalyticsConsent();
    consentRef.current = savedConsent;
    setConsent(savedConsent);

    if (savedConsent === "granted") {
      window.__vulpesConsentStoragePersisted = true;
      consentSessionRef.current += 1;
      prepareAnalyticsAfterConsent();
    }
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY && event.key !== null) return;

      const nextConsent: AnalyticsConsent =
        event.newValue === "granted" || event.newValue === "denied"
          ? event.newValue
          : "unknown";
      const previousConsent = consentRef.current;
      consentRef.current = nextConsent;
      window.__vulpesConsentChoice = nextConsent;
      window.__vulpesConsentStoragePersisted = true;
      setConsent(nextConsent);

      if (nextConsent === "granted") {
        if (previousConsent !== "granted") consentSessionRef.current += 1;
        prepareAnalyticsAfterConsent();
      } else {
        revokeGoogleAnalyticsConsent();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const chooseConsent = useCallback(
    (choice: "granted" | "denied") => {
      const previousChoice = consentRef.current;

      try {
        window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, choice);
        window.__vulpesConsentStoragePersisted = true;
      } catch {
        // Honor the current explicit choice for this tab if storage is unavailable.
        window.__vulpesConsentStoragePersisted = false;
      }

      consentRef.current = choice;
      setConsent(choice);
      setPreferencesOpen(false);

      if (choice === "granted") {
        prepareAnalyticsAfterConsent();
        if (previousChoice !== "granted") {
          consentSessionRef.current += 1;
        }

        if (window.__vulpesAnalyticsConfigured) {
          initializeGoogleAnalytics();
          sendPageViewForCurrentConsent();
        }
      } else {
        revokeGoogleAnalyticsConsent();
      }
    },
    [sendPageViewForCurrentConsent],
  );

  const handleAnalyticsReady = useCallback(() => {
    if (consentRef.current !== "granted") {
      revokeGoogleAnalyticsConsent();
      return;
    }

    initializeGoogleAnalytics();
    sendPageViewForCurrentConsent();
  }, [sendPageViewForCurrentConsent]);

  useEffect(() => {
    sendPageViewForCurrentConsent();
  }, [pathname, consent, sendPageViewForCurrentConsent]);

  const contextValue: AnalyticsConsentContextValue = {
    consent,
    preferencesOpen,
    openPreferences: () => setPreferencesOpen(true),
    closePreferences: () => setPreferencesOpen(false),
    chooseConsent,
  };

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      {consent === "granted" && (
        <Script
          id="vulpes-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
          onReady={handleAnalyticsReady}
        />
      )}
    </AnalyticsConsentContext.Provider>
  );
}
