import type { Metadata } from "next";
import Link from "next/link";
import AnalyticsLink from "../AnalyticsLink";

export const metadata: Metadata = {
  title: "Privacidade | Vulpes Domus",
  description:
    "Saiba como a Vulpes Domus utiliza dados de navegação e como gerenciar o consentimento para analytics.",
  alternates: {
    canonical: "https://vulpesdomus.com.br/privacidade/",
  },
};

const sections = [
  {
    title: "Medição de uso do site",
    paragraphs: [
      "Com sua autorização, usamos o Google Analytics 4 para medir visualizações e interações com o portfólio, os serviços e os canais de contato. A tag do Google não é carregada antes do aceite de cookies analíticos.",
      "A medição pode envolver informações técnicas de navegação, como página acessada, tipo de dispositivo e navegador, horário e informações aproximadas de localização disponibilizadas pelo Google Analytics. Os eventos criados pelo site registram apenas categorias e posições dos botões; não enviamos nome, telefone, endereço de e-mail ou o conteúdo de mensagens dos visitantes.",
    ],
  },
  {
    title: "Sua escolha",
    paragraphs: [
      "Você pode aceitar ou recusar cookies analíticos. A escolha fica salva neste navegador para que o site a respeite nas próximas visitas. Recusar não impede a navegação nem o uso dos links do site.",
      "Para mudar de ideia, use “Preferências de privacidade” no rodapé. Ao revogar o aceite, interrompemos novos eventos do site, atualizamos o consentimento do Google e tentamos remover os cookies analíticos _ga que estiverem acessíveis neste domínio. A exclusão feita pelo navegador não apaga informações que já tenham sido recebidas pelo Google.",
    ],
  },
  {
    title: "Serviços externos",
    paragraphs: [
      "Os links para WhatsApp, Instagram e e-mail podem levar você a serviços de terceiros, sujeitos às práticas de privacidade desses serviços. O site não envia o endereço de e-mail ou o número de telefone comercial como parâmetro de evento ao Google Analytics.",
      "O Google trata os dados enviados pelo Analytics conforme seus próprios termos e políticas. Consulte a política de privacidade do Google para saber mais sobre esse tratamento.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f5f2ef] px-5 py-16 text-[#3d3428] sm:py-20">
      <article className="mx-auto max-w-3xl">
        <Link
          className="inline-flex min-h-11 items-center text-sm uppercase tracking-[0.16em] text-[#6f552d] underline decoration-[#b99a68] underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f552d]"
          href="/"
        >
          Voltar ao site
        </Link>
        <p className="mb-4 mt-10 text-sm uppercase tracking-[0.3em] text-[#8a7a61]">
          Vulpes Domus
        </p>
        <h1 className="text-4xl font-light leading-tight sm:text-5xl">
          Aviso de privacidade
        </h1>
        <p className="mt-5 text-base leading-7 text-[#6e675f] sm:text-lg sm:leading-8">
          Este aviso explica como funciona a medição de audiência neste site e
          como você pode controlar essa escolha.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-light text-[#4b3b27]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-7 text-[#6e675f]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-[#d8cec1] pt-5 text-sm leading-6 text-[#81796d]">
          Dúvidas sobre este aviso: {" "}
          <AnalyticsLink
            className="text-[#6f552d] underline decoration-[#b99a68] underline-offset-4"
            href="mailto:vulpesdomusarquitetura@protonmail.com"
            analyticsEvent="click_email"
            analyticsParams={{ contact_method: "email", button_location: "privacy_page" }}
          >
            vulpesdomusarquitetura@protonmail.com
          </AnalyticsLink>
        </p>
      </article>
    </main>
  );
}
