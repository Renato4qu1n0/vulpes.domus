"use client";

import { useAnalyticsConsent } from "./lib/analytics/AnalyticsProvider";
import Link from "next/link";

export default function CookieConsent() {
  const { consent, preferencesOpen, closePreferences, chooseConsent } =
    useAnalyticsConsent();
  const isVisible = consent === "unknown" || preferencesOpen;

  if (!isVisible) return null;

  return (
    <section
      aria-label="Preferências de privacidade"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-[#cfc3b4] bg-[#f5f2ef] px-4 py-5 text-[#3d3428] shadow-[0_-12px_40px_rgba(44,36,28,0.16)] sm:px-6"
      role="region"
    >
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-5">
            <h2 className="text-lg font-medium text-[#4b3b27]">
              Preferências de privacidade
            </h2>
            {preferencesOpen && consent !== "unknown" && (
              <button
                aria-label="Fechar preferências de privacidade"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-sm text-xl text-[#6f552d] transition hover:bg-[#e8e2db] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f552d]"
                onClick={closePreferences}
                type="button"
              >
                ×
              </button>
            )}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6e675f]">
            Usamos o Google Analytics para entender como as pessoas interagem com
            projetos, serviços e contatos do site. O Analytics só é carregado se
            você aceitar. Você pode alterar sua escolha quando quiser em
            Preferências de privacidade.
          </p>
          <Link
            className="mt-2 inline-flex min-h-11 items-center text-sm text-[#6f552d] underline decoration-[#b99a68] underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f552d]"
            href="/privacidade/"
          >
            Leia o aviso de privacidade
          </Link>
          {consent !== "unknown" && (
            <p className="text-xs text-[#81796d]">
              Escolha atual: {consent === "granted" ? "aceita" : "recusada"}.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-[21rem]">
          <button
            className="min-h-12 rounded-sm border border-[#6f552d] bg-[#6f552d] px-3 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition hover:bg-[#594321] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f552d] sm:text-sm"
            onClick={() => chooseConsent("granted")}
            type="button"
          >
            Aceitar cookies analíticos
          </button>
          <button
            className="min-h-12 rounded-sm border border-[#6f552d] bg-[#6f552d] px-3 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition hover:bg-[#594321] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f552d] sm:text-sm"
            onClick={() => chooseConsent("denied")}
            type="button"
          >
            Recusar cookies analíticos
          </button>
        </div>
      </div>
    </section>
  );
}
