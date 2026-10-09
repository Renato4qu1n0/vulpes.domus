"use client";

import { useState } from "react";
import AnalyticsLink from "./AnalyticsLink";

type NavigationLink =
  | { href: string; label: string }
  | {
      href: string;
      label: string;
      analyticsEvent: "view_projetos" | "view_servicos";
      analyticsParams: { button_location: "mobile_navigation" };
    };

const navigationLinks: NavigationLink[] = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  {
    href: "#servicos",
    label: "Nossos serviços",
    analyticsEvent: "view_servicos",
    analyticsParams: { button_location: "mobile_navigation" },
  },
  {
    href: "#projetos",
    label: "Projetos",
    analyticsEvent: "view_projetos",
    analyticsParams: { button_location: "mobile_navigation" },
  },
  { href: "#contato", label: "Contato" },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        className="grid h-11 w-11 place-items-center rounded-sm text-[#6f552d] transition hover:bg-[#e8e2db] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f552d]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          {isOpen ? (
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação principal"
          className="absolute right-0 top-full mt-3 grid w-[min(19rem,calc(100vw-2rem))] gap-1 rounded-sm border border-[#ddd6cf] bg-[#f5f2ef] p-2 shadow-xl"
        >
          {navigationLinks.map((link) => {
            const className =
              "flex min-h-11 items-center px-4 text-sm uppercase tracking-[0.16em] text-[#3d3428] transition hover:bg-[#e8e2db] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#6f552d]";
            const onClick = () => setIsOpen(false);

            if ("analyticsEvent" in link) {
              return (
                <AnalyticsLink
                  key={link.href}
                  href={link.href}
                  analyticsEvent={link.analyticsEvent}
                  analyticsParams={link.analyticsParams}
                  onClick={onClick}
                  className={className}
                >
                  {link.label}
                </AnalyticsLink>
              );
            }

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={onClick}
                className={className}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
