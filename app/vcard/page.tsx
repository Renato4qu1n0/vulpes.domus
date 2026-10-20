import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Vulpes Domus | Cartão de contato",
  description:
    "Salve os dados de contato da Vulpes Domus — Arquitetura e Interiores.",
  alternates: {
    canonical: "https://vulpesdomus.com.br/vcard/",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const contactDetails = [
  {
    label: "Celular",
    value: "11 93624-7726",
    href: "tel:+5511936247726",
    icon: "phone",
  },
  {
    label: "E-mail",
    value: "vulpesdomusarquitetura@protonmail.com",
    href: "mailto:vulpesdomusarquitetura@protonmail.com",
    icon: "mail",
  },
  {
    label: "Website",
    value: "vulpesdomus.com.br",
    href: "https://vulpesdomus.com.br",
    icon: "globe",
  },
  {
    label: "Atuação",
    value: "Arquitetura e Legalização",
    href: null,
    icon: "briefcase",
  },
] as const;

function ContactIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    phone: (
      <path d="M5.1 3.8 7.4 3c.7-.2 1.4.1 1.7.8l1.1 2.7c.2.6.1 1.2-.4 1.6L8.3 9.4a13.7 13.7 0 0 0 6.3 6.3l1.3-1.5c.4-.5 1-.6 1.6-.4l2.7 1.1c.7.3 1 1 .8 1.7l-.8 2.3c-.2.7-.9 1.1-1.6 1.1A16.8 16.8 0 0 1 3.9 5.4c0-.7.5-1.4 1.2-1.6Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

export default function VcardPage() {
  return (
    <main className="min-h-screen bg-[#f4f3f1] px-4 py-8 text-[#2d261e] sm:px-6 sm:py-12">
      <article className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(54,42,25,0.14)] ring-1 ring-black/5">
        <header className="relative flex min-h-[400px] flex-col items-center overflow-hidden bg-[linear-gradient(155deg,#594321_0%,#8c7046_48%,#c2a46f_100%)] px-7 pb-12 pt-16 text-center text-white sm:min-h-[420px]">
          <div
            aria-hidden="true"
            className="absolute -bottom-10 left-[-12%] h-20 w-[124%] rotate-[-1.5deg] rounded-[50%] bg-white"
          />
          <div className="relative grid h-40 w-40 place-items-center overflow-hidden rounded-full border-[7px] border-white bg-[#f2eee8] shadow-lg">
            <Image
              alt="Vulpes Domus"
              className="h-full w-full rounded-full object-cover"
              height={160}
              priority
              src="/vcard-logo.webp"
              width={160}
            />
          </div>
          <h1 className="relative mt-7 text-2xl font-semibold tracking-tight text-[#17130f]">
            Vulpes Domus
          </h1>
          <p className="relative mt-2 text-base font-medium text-[#20190f]">
            Arquitetura e Legalização
          </p>
          <div className="relative mt-auto flex translate-y-7 items-center gap-4 pt-10">
            <a
              aria-label="Ligar para Vulpes Domus"
              className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#594321] shadow-[0_8px_24px_rgba(44,34,20,0.12)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href="tel:+5511936247726"
            >
              <ContactIcon name="phone" />
            </a>
            <a
              aria-label="Enviar e-mail para Vulpes Domus"
              className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#594321] shadow-[0_8px_24px_rgba(44,34,20,0.12)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              href="mailto:vulpesdomusarquitetura@protonmail.com"
            >
              <ContactIcon name="mail" />
            </a>
          </div>
        </header>

        <section className="px-6 pb-8 pt-12 text-center sm:px-8">
          <a
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#c2a46f] px-5 py-3 text-sm font-medium text-[#21190f] transition hover:bg-[#b39662] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#594321]"
            download="vulpes-domus.vcf"
            href="/vulpes-domus.vcf"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-3v6m3-3h-6" />
            </svg>
            Adicionar contato
          </a>

          <p className="mt-7 text-[15px] leading-7 text-[#77716a]">
            Criamos espaços elegantes, funcionais e atemporais, com projetos de
            arquitetura e interiores que refletem sua identidade. Oferecemos
            também consultoria, regularização e legalização de imóveis.
          </p>

          <ul className="mt-7 divide-y divide-[#eeeae5] rounded-xl bg-white px-4 text-left shadow-[0_10px_35px_rgba(45,38,30,0.07)]">
            {contactDetails.map((item) => (
              <li key={item.label} className="flex min-h-[76px] items-center gap-4 py-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f7f6f4] text-[#858b8e]">
                  <ContactIcon name={item.icon} className="h-[19px] w-[19px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-[#8a8580]">{item.label}</span>
                  {item.href ? (
                    <a
                      className="mt-0.5 block break-all text-[15px] font-medium text-[#25211d] underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c2a46f]"
                      href={item.href}
                      rel={item.href.startsWith("https:") ? "noopener noreferrer" : undefined}
                      target={item.href.startsWith("https:") ? "_blank" : undefined}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="mt-0.5 block text-[15px] font-medium text-[#25211d]">
                      {item.value}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <section className="mt-8 text-left" aria-labelledby="social-title">
            <h2 id="social-title" className="mb-3 px-1 text-lg font-medium text-[#31281d]">
              Encontre-nos
            </h2>
            <div className="space-y-3">
              <a
                className="flex min-h-[76px] items-center gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-[0_10px_35px_rgba(45,38,30,0.06)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c2a46f]"
                href="https://www.instagram.com/vulpes.domus/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-[#7542d8] via-[#e13c83] to-[#ffae45] text-white">
                  <ContactIcon name="instagram" className="h-7 w-7" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-[#25211d]">Instagram</span>
                  <span className="mt-0.5 block text-xs leading-5 text-[#88817a]">
                    Conheça nossa página e nossas inspirações
                  </span>
                </span>
                <ContactIcon name="arrow" className="h-5 w-5 shrink-0 text-[#858b8e]" />
              </a>
              <a
                className="flex min-h-[76px] items-center gap-3 rounded-xl bg-white px-4 py-3 text-left shadow-[0_10px_35px_rgba(45,38,30,0.06)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c2a46f]"
                href="https://wa.me/5511936247726"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1ecb68] text-white">
                  <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2a9.8 9.8 0 0 0-8.36 14.9L2.4 22l5.22-1.24A9.8 9.8 0 1 0 12.04 2Zm0 17.83a8 8 0 0 1-4.08-1.12l-.3-.18-3.1.74.77-3.02-.2-.31a8.02 8.02 0 1 1 6.91 3.9Zm4.4-6c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.55.12-.16.24-.63.78-.77.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.5.58.18 1.1.15 1.51.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-[#25211d]">WhatsApp</span>
                  <span className="mt-0.5 block text-xs leading-5 text-[#88817a]">
                    Solicite seu orçamento personalizado
                  </span>
                </span>
                <ContactIcon name="arrow" className="h-5 w-5 shrink-0 text-[#858b8e]" />
              </a>
            </div>
          </section>
          <p className="mt-8 text-xs tracking-[0.15em] text-[#aaa198]">
            VULPES DOMUS · ARQUITETURA
          </p>
        </section>
      </article>
    </main>
  );
}
