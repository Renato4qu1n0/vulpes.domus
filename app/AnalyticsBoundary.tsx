"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import CookieConsent from "./CookieConsent";
import AnalyticsProvider from "./lib/analytics/AnalyticsProvider";

export default function AnalyticsBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isVcard = pathname?.replace(/\/$/, "") === "/vcard";

  if (isVcard) return children;

  return (
    <AnalyticsProvider>
      {children}
      <CookieConsent />
    </AnalyticsProvider>
  );
}
