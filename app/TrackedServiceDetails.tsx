"use client";

import { useRef, type ReactNode, type ToggleEvent } from "react";
import { trackEvent } from "./lib/analytics/events";

export default function TrackedServiceDetails({
  children,
  className,
  serviceCategory,
}: {
  children: ReactNode;
  className: string;
  serviceCategory: "projetos" | "legalizacao";
}) {
  const wasOpen = useRef(false);

  return (
    <details
      className={className}
      onToggle={(event: ToggleEvent<HTMLDetailsElement>) => {
        const isOpen = event.currentTarget.open;
        if (isOpen && !wasOpen.current) {
          trackEvent("select_service_category", {
            service_category: serviceCategory,
          });
        }
        wasOpen.current = isOpen;
      }}
    >
      {children}
    </details>
  );
}
