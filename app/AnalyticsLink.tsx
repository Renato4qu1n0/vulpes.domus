"use client";

import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import {
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsEventParameters,
} from "./lib/analytics/events";

type AnalyticsLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick"
> & {
  analyticsEvent: AnalyticsEventName;
  analyticsParams: AnalyticsEventParameters[AnalyticsEventName];
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
};

export default function AnalyticsLink({
  analyticsEvent,
  analyticsParams,
  onClick,
  ...anchorProps
}: AnalyticsLinkProps) {
  return (
    <a
      {...anchorProps}
      onClick={(event) => {
        trackEvent(analyticsEvent, analyticsParams);
        onClick?.(event);
      }}
    />
  );
}
