# Vulpes Domus — Arquitetura & Interiores

Site institucional desenvolvido para apresentar o escritório Vulpes Domus, seus projetos e formas de contato.

## Sobre o site

O site reúne as seções Início, Projetos, Sobre e Contato em uma experiência responsiva. A galeria de projetos utiliza um carrossel de imagens, e a área de contato oferece acesso por e-mail, WhatsApp e Instagram.

## Tecnologias utilizadas

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Google Analytics e privacidade

O Google Analytics 4 usa o Measurement ID `G-0CN22SFDJL` e só é carregado após o visitante aceitar cookies analíticos. A escolha pode ser alterada em **Preferências de privacidade**, no rodapé. A implementação e os eventos medidos estão descritos em [`docs/GOOGLE_ANALYTICS.md`](docs/GOOGLE_ANALYTICS.md), e o aviso público está em `/privacidade/`.

O ID é público e está configurado no código; não é necessária uma variável no GitHub Actions. O workflow mantém o export estático e a publicação no domínio personalizado. A auditoria de segurança está em [`docs/ANALYTICS_SECURITY_AUDIT.md`](docs/ANALYTICS_SECURITY_AUDIT.md).
