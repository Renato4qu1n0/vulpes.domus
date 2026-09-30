"use client";

import { useState } from "react";

export default function CopyEmailButton({ email }: { email: string }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
    }
  }

  return (
    <button
      type="button"
      onClick={copyEmail}
      aria-label={copyState === "copied" ? "E-mail copiado" : "Copiar e-mail"}
      className="flex shrink-0 items-center gap-2 rounded-sm px-2 py-2 text-xs uppercase tracking-[0.1em] text-[#d0bea0] transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2a46f]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="8" y="8" width="12" height="13" rx="1.5" />
        <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v11A1.5 1.5 0 0 0 5.5 18H8" />
      </svg>
      <span aria-live="polite">
        {copyState === "copied" ? "Copiado" : copyState === "error" ? "Falhou" : "Copiar"}
      </span>
    </button>
  );
}
