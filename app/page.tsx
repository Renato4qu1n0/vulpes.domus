import Image from "next/image";
import { Rouge_Script } from "next/font/google";
import ProjectCarousel from "./ProjectCarousel";
import CopyEmailButton from "./CopyEmailButton";
import { publicAssetPath } from "./publicAssetPath";

const rouge = Rouge_Script({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f5f2ef] pt-[72px] text-[#3d3428] md:pt-20">

      {/* HEADER */}
      <header className="fixed left-0 top-0 z-50 h-[72px] w-full border-b border-[#ddd6cf] bg-[#f5f2ef]/95 backdrop-blur-md md:h-20">

        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-12">

          <div className="flex min-w-0 items-center gap-2 sm:gap-4">

            <Image
              src={publicAssetPath("/logo-cabecalho.png")}
              width={75}
              height={75}
              alt="Logo"
              className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14 md:h-[75px] md:w-[75px]"
            />

            <div>
              <h1 className={`${rouge.className} whitespace-nowrap text-3xl leading-none text-[#6f552d] sm:text-4xl md:text-5xl`}>
                Vulpes Domus</h1>

              <p className="whitespace-nowrap text-[9px] tracking-[0.12em] text-[#8a7a61] uppercase sm:text-[10px] sm:tracking-[0.2em] md:text-xs">
                Arquitetura & Interiores
              </p>
            </div>

          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <nav className="hidden md:flex gap-10 uppercase text-sm tracking-[0.2em]">
              <a href="#inicio">Início</a>
              <a href="#projetos">Projetos</a>
              <a href="#sobre">Sobre</a>
              <a href="#servicos">Nossos serviços</a>
              <a href="#contato">Contato</a>
            </nav>

            <div className="flex items-center gap-3 border-l border-[#ddd6cf] pl-3 sm:gap-4 sm:pl-5">
              <a
                href="https://www.instagram.com/vulpes.domus/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Vulpes Domus"
                className="text-[#6f552d] transition hover:opacity-70"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://wa.me/5511960759135"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp da Vulpes Domus"
                className="text-[#6f552d] transition hover:opacity-70"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2a9.87 9.87 0 0 0-8.49 14.9L2 22l5.24-1.37A9.94 9.94 0 1 0 12.04 2Zm0 18.08a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.12 8.12 0 1 1 6.9 3.83Zm4.46-6.08c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </a>
              <a
                href="mailto:vulpesdomusarquitetura@protonmail.com"
                aria-label="Enviar e-mail para a Vulpes Domus"
                className="text-[#6f552d] transition hover:opacity-70"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

        </div>

      </header>

      {/* HERO */}
      <section id="inicio" className="scroll-mt-[72px] px-5 py-12 sm:px-6 sm:py-16 md:min-h-[calc(100vh-5rem)] md:scroll-mt-20 md:py-10">

        <div className="mx-auto grid w-full max-w-6xl min-w-0 items-center gap-10 md:grid-cols-2 md:gap-16">

          {/* TEXTO */}
          <div>

            <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#8a7a61] sm:mb-6 sm:text-sm sm:tracking-[0.3em]">
              Arquitetura contemporânea
            </p>

            <h2 className="text-4xl font-light leading-[1.12] sm:text-5xl md:text-7xl">
              Projetos sofisticados para espaços únicos.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#6e675f] sm:mt-8 sm:text-lg sm:leading-8">
              Criamos ambientes elegantes, funcionais e atemporais,
              unindo estética, conforto e identidade em cada projeto.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">

              <a
                href="https://wa.me/5511960759135"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-sm border border-[#6f552d] bg-[#6f552d] px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f552d] sm:px-5 sm:text-xs sm:tracking-[0.14em] md:text-sm"
              >
                Solicite um orçamento
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2a9.87 9.87 0 0 0-8.49 14.9L2 22l5.24-1.37A9.94 9.94 0 1 0 12.04 2Zm0 18.08a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.12 8.12 0 1 1 6.9 3.83Zm4.46-6.08c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </a>

              <a href="#projetos" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-sm border border-[#6f552d] px-5 py-3 text-xs uppercase tracking-[0.14em] transition hover:bg-[#6f552d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f552d] md:text-sm">
                Ver projetos
              </a>

            </div>

          </div>

          {/* CARD LOGO */}
          <div className="relative">

            <div className="absolute inset-0 bg-[#c8b69a] rounded-[40px] rotate-3"></div>

            <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-[28px] bg-[#e8e2db] shadow-2xl sm:h-[400px] sm:rounded-[36px] md:h-[500px] md:rounded-[40px]">

              <Image
                src={publicAssetPath("/logo.png")}
                width={800}
                height={800}
                alt="Logo"
                className="h-auto w-[min(82%,420px)] object-contain"
              />

            </div>

          </div>

        </div>

      </section>

      {/* SOBRE */}
      <section id="sobre" className="scroll-mt-[72px] bg-white px-5 py-16 sm:px-6 sm:py-20 md:scroll-mt-20 md:px-12 md:py-28">

        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-20">

          <div>

            <p className="uppercase tracking-[0.3em] text-sm text-[#8a7a61] mb-6">
              Sobre nós
            </p>

            <h3 className="mb-6 text-3xl font-light sm:mb-8 sm:text-4xl">
              Arquitetura com personalidade e propósito.
            </h3>

          </div>

          <div className="max-w-xl space-y-6">
            <p className="text-lg leading-8 text-[#666]">
              Nosso escritório desenvolve <strong className="text-[#2C2C2C]">projetos arquitetônicos e de interiores</strong>,
              acompanhando cada etapa do processo, desde a ideia inicial com o sonho do cliente até a entrega
              final da obra.
            </p>

            <p className="text-lg leading-8 text-[#666]">
              Criamos soluções personalizadas para clientes que valorizam
              sofisticação, funcionalidade e autenticidade, projetando ambientes que
              unem estética contemporânea, conforto e identidade visual.
            </p>

            <p className="text-lg leading-8 text-[#666]">
              Também atuamos com <strong className="text-[#2C2C2C]">regularização e vistoria de imóveis</strong>,
              oferecendo suporte técnico para garantir segurança, conformidade com as
              normas e tranquilidade em todas as etapas do empreendimento.
            </p>
          </div>

        </div>

      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="scroll-mt-[72px] bg-[#f8f5f1] px-5 py-16 sm:px-6 sm:py-20 md:scroll-mt-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="mb-4 uppercase tracking-[0.3em] text-sm text-[#8a7a61]">
              Nossos serviços
            </p>
            <h3 className="text-4xl font-light sm:text-5xl">
              Soluções para cada etapa do seu projeto.
            </h3>
            <p className="mt-5 text-base leading-7 text-[#6e675f] sm:text-lg sm:leading-8">
              Conheça as áreas em que a Vulpes Domus pode acompanhar você, da concepção à avaliação do imóvel.
            </p>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              "Projetos arquitetônicos",
              "Projetos de interiores",
              "Regularização de imóveis",
              "Vistoria de imóveis",
            ].map((service, index) => (
              <li key={service} className="flex min-h-28 items-start gap-5 border border-[#ddd6cf] bg-white p-6 sm:p-8">
                <span className="pt-1 text-sm tracking-[0.2em] text-[#8a7a61]">0{index + 1}</span>
                <h4 className="text-xl font-light leading-snug text-[#3d3428] sm:text-2xl">{service}</h4>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PROJETOS */}
      <section id="projetos" className="scroll-mt-[72px] bg-[#f8f5f1] px-5 py-16 sm:px-6 sm:py-20 md:scroll-mt-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-16">
            <p className="mb-4 uppercase tracking-[0.3em] text-sm text-[#8a7a61]">
              Projetos
            </p>
            <h3 className="text-4xl font-light sm:text-5xl">
              Ambientes que inspiram.
            </h3>
          </div>
          <ProjectCarousel />
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="scroll-mt-[72px] bg-[#3d3428] px-5 py-20 text-white sm:px-6 sm:py-24 md:scroll-mt-20 md:px-12 md:py-32">

        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-20">
          <div>

            <p className="uppercase tracking-[0.3em] text-sm text-[#d0bea0] mb-6">
              Contato
            </p>

            <h3 className="text-3xl font-light leading-tight sm:text-4xl md:text-5xl">
              Vamos conversar sobre o seu projeto?
            </h3>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#d7d2cb]">
              Atendemos pessoas físicas e jurídicas em projetos de arquitetura
              e interiores. Conte-nos o que você precisa e escolha como prefere
              falar com a equipe da Vulpes Domus.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="group flex min-h-[80px] items-center gap-6 rounded-sm border border-[#6d6254] px-5 py-3 text-left transition hover:border-[#c2a46f] sm:px-6">
              <span aria-hidden="true" className="text-[#c2a46f] transition-transform group-hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="5" width="18" height="14" rx="1.5" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <a
                href="mailto:vulpesdomusarquitetura@protonmail.com"
                aria-label="Enviar e-mail para Vulpes Domus"
                className="min-w-0 flex-1 break-all text-base leading-relaxed text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c2a46f] sm:break-normal sm:text-lg"
              >
                vulpesdomusarquitetura@protonmail.com
              </a>
              <CopyEmailButton email="vulpesdomusarquitetura@protonmail.com" />
            </div>

            <a
              href="https://wa.me/5511960759135"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar com a Vulpes Domus pelo WhatsApp"
              className="group flex min-h-[80px] items-center gap-6 rounded-sm border border-[#6d6254] px-5 py-3 text-left transition hover:border-[#c2a46f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c2a46f] sm:px-6"
            >
              <span aria-hidden="true" className="text-[#c2a46f] transition-transform group-hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor">
                  <path d="M12.04 2a9.87 9.87 0 0 0-8.49 14.9L2 22l5.24-1.37A9.94 9.94 0 1 0 12.04 2Zm0 18.08a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.12 8.12 0 1 1 6.9 3.83Zm4.46-6.08c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </span>
              <span className="text-base leading-relaxed text-white sm:text-lg">Converse com o escritório</span>
            </a>

            <a
              href="https://www.instagram.com/vulpes.domus/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conhecer a Vulpes Domus no Instagram"
              className="group flex min-h-[80px] items-center gap-6 rounded-sm border border-[#6d6254] px-5 py-3 text-left transition hover:border-[#c2a46f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c2a46f] sm:px-6"
            >
              <span aria-hidden="true" className="text-[#c2a46f] transition-transform group-hover:-translate-y-0.5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="text-base leading-relaxed text-white sm:text-lg">Conheça nosso trabalho</span>
            </a>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#2c241c] px-5 py-10 text-center text-xs tracking-[0.12em] text-[#a59a8b] sm:px-6 sm:text-sm sm:tracking-[0.2em]">
        <div className="flex flex-col items-center gap-5">
          <p>VULPES DOMUS © 2026 — Todos os direitos reservados</p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/vulpes.domus/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Vulpes Domus"
              className="transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://wa.me/5511960759135"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Vulpes Domus"
              className="transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2a9.87 9.87 0 0 0-8.49 14.9L2 22l5.24-1.37A9.94 9.94 0 1 0 12.04 2Zm0 18.08a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.1.81.83-3.02-.2-.31a8.12 8.12 0 1 1 6.9 3.83Zm4.46-6.08c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            </a>
            <a
              href="mailto:vulpesdomusarquitetura@protonmail.com"
              aria-label="Enviar e-mail para a Vulpes Domus"
              className="transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs tracking-normal">
            <a
              href="https://github.com/aqs-group"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Perfil da AqS Group no GitHub"
              className="flex items-center gap-2 rounded-sm text-[#81796d] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c2a46f]"
            >
              <Image
                src={publicAssetPath("/aqs-group-logo.png")}
                width={30}
                height={30}
                alt="AqS Group"
                className="rounded-sm"
              />
              <span className="tracking-[0.04em]">Powered by AqS Group</span>
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
