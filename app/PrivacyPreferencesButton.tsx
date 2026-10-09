"use client";

import { useAnalyticsConsent } from "./lib/analytics/AnalyticsProvider";

export default function PrivacyPreferencesButton() {
  const { openPreferences } = useAnalyticsConsent();

  return (
    <button
      className="min-h-11 rounded-sm px-3 text-xs tracking-normal text-[#d0bea0] underline decoration-[#8a7a61] underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2a46f]"
      onClick={openPreferences}
      type="button"
    >
      Preferências de privacidade
    </button>
  );
}
