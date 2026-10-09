# Security Audit

**Data:** 6 de outubro de 2026  
**Escopo:** repositório e configuração local. Nenhum teste foi executado contra GitHub Pages ou outro serviço externo.

> Atualização de 9 de outubro de 2026: a publicação atual usa o domínio personalizado `https://vulpesdomus.com.br/` e caminho raiz. As referências ao caminho de projeto `/vulpes.domus` abaixo registram a configuração e validação históricas da auditoria; não devem ser usadas no build atual.

## Executive Summary

O projeto é um site institucional estático, sem backend ou dados de usuários. A auditoria não encontrou secrets nos arquivos atuais nem nos 26 commits alcançáveis do Git. A análise de dependências não encontrou vulnerabilidades na árvore de produção (`npm audit --omit=dev`); o `npm audit` completo ainda reporta cinco avisos altos, todos parte da cadeia de ferramentas de lint em `devDependencies`.

Foram fixadas em SHAs as Actions do workflow de publicação e a publicação manual foi limitada à branch `main`. O build estático e o lint passaram após uma instalação limpa. O deploy depende de cabeçalhos HTTP fornecidos pela plataforma, que não podem ser configurados por este export estático e não foram verificados externamente.

**Parecer: CONDITIONALLY READY.** Não há vulnerabilidade crítica ou alta identificada no conteúdo estático entregue aos visitantes. Antes do lançamento, confirme os cabeçalhos HTTP servidos por GitHub Pages e registre a aceitação temporária do aviso alto ainda sem correção segura na ferramenta de lint.

## Application Architecture

- **Stack:** Next.js 16.3.8, React 19.2.4, TypeScript, Tailwind CSS 4, npm com `package-lock.json`.
- **Build/deploy:** `output: "export"`; o GitHub Actions executa `npm ci`, exporta `out/` com `NEXT_PUBLIC_BASE_PATH=/vulpes.domus` e publica no GitHub Pages.
- **Entrypoint/rota:** `app/layout.tsx` e `app/page.tsx`; página inicial estática e página estática de não encontrado.
- **Componentes cliente:** menu móvel, carrossel e botão de cópia de e-mail. Não existe lógica de autorização ou estado de conta.
- **Dados e persistência:** não há banco, armazenamento de sessão, cookies de aplicação, upload, painel administrativo ou endpoints próprios.
- **Integrações:** fontes Google são baixadas durante o build pelo `next/font`; Instagram, WhatsApp e e-mail são links acionados pelo visitante. Telefone e e-mail comercial são publicados intencionalmente no site.
- **Variáveis de ambiente:** somente `NEXT_PUBLIC_BASE_PATH`, valor de configuração pública usado nos caminhos do site; não é um secret.

### Trust boundaries

1. O visitante recebe HTML, JavaScript, fontes e imagens estáticas do GitHub Pages.
2. O runner do GitHub Actions obtém o código e pacotes npm para gerar o artefato.
3. O job de publicação usa o token efêmero do GitHub com `pages: write` e `id-token: write`; o job de build recebe apenas `contents: read`.
4. Os links externos só são seguidos por ação do visitante. Não há requisições server-side para URLs fornecidas por usuários.

## Attack Surface

- Arquivos públicos: `/`, página de não encontrado, imagens e assets estáticos sob `/vulpes.domus/`.
- JavaScript no navegador: menu, rotação do carrossel e escrita de um endereço de e-mail fixo na área de transferência após clique.
- Workflow de publicação em `.github/workflows/deploy.yml`, acionado por push em `main` ou execução manual.
- Não há superfícies de login, autorização, API, banco de dados, CORS, CSRF, SSRF, upload, JWT ou operações de negócio autenticadas.

## Findings Summary

| ID | Severity | Finding | Component | Status |
|---|---|---|---|---|
| SEC-001 | MEDIUM | Referências mutáveis de Actions e dispatch fora de `main` | GitHub Actions | Corrigido |
| SEC-002 | LOW* | Aviso alto sem correção segura na cadeia de lint | Dependências de desenvolvimento | Aberto; mitigado por escopo |
| SEC-003 | MEDIUM | Cabeçalhos HTTP de produção dependem da plataforma e aguardam verificação | GitHub Pages | Ação manual pendente |

\* A base de avisos npm classifica os pacotes como HIGH. A severidade deste finding considera que a cadeia está restrita às ferramentas de lint, não ao artefato estático nem a um serviço público em execução.

### SEC-001 — Actions de CI/CD não estavam fixadas em commits

**Severity:** MEDIUM (corrigido)  
**CWE:** CWE-829 — Inclusion of Functionality from Untrusted Control Sphere  
**OWASP:** A08 — Software and Data Integrity Failures  
**Affected component:** `.github/workflows/deploy.yml`

**Description:** as Actions eram referenciadas por tags móveis (`@v4`, `@v5`). O workflow também aceitava `workflow_dispatch` sem restringir o job de publicação a `main`.

**Attack scenario:** uma tag de Action retargeted poderia executar código não revisado no runner; o job de deploy tem permissão de publicar o site. Uma execução manual numa branch diferente também poderia selecionar conteúdo inesperado para publicação.

**Impact:** alteração do artefato público do site e uso indevido das permissões do job de publicação.

**Evidence:** todas as cinco referências `uses:` estavam em tags móveis; o gatilho manual aceitava refs diferentes de `main`.

**Remediation:** fixar cada Action no SHA completo de seu release oficial e permitir o job `deploy` apenas quando `github.ref == 'refs/heads/main'`.

**Status:** corrigido. SHAs conferidos contra as refs dos releases oficiais; YAML validado localmente.

### SEC-002 — Avisos altos na cadeia de dependências de lint

**Severity:** LOW*  
**CWE:** CWE-400 — Uncontrolled Resource Consumption  
**OWASP:** A06 — Vulnerable and Outdated Components  
**Affected component:** `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`.

**Description:** em 6 de outubro de 2026, `npm audit` reportou cinco entradas HIGH relacionadas à mesma cadeia transitiva de `braces`/glob. São dependências de desenvolvimento. `npm audit --omit=dev` reportou zero vulnerabilidades. O arquivo `out/` exportado não contém source maps nem a árvore de dependências do servidor.

**Attack scenario:** padrões de arquivos maliciosos processados por uma execução de lint poderiam consumir CPU ou pilha no ambiente de desenvolvimento. O workflow atual não executa lint em pull requests e não há endpoint público que invoque esse código.

**Impact:** indisponibilidade local ou do processo de lint; não foi identificada execução da biblioteca vulnerável no site estático publicado.

**Evidence:** o `npm audit` completo mantém cinco avisos HIGH em `braces`, `micromatch`, `fast-glob`, `@next/eslint-plugin-next` e `eslint-config-next`. `npm audit fix` recusa a correção sem `--force`, que tentaria substituir o ESLint do Next 16 por `eslint-config-next@14.2.35`. O `eslint-config-next` foi alinhado à versão 16.3.8 do Next, mas a cadeia transitiva ainda não tem correção compatível publicada.

**Remediation:** manter o lint isolado de entradas não confiáveis e atualizar quando o Next publicar uma cadeia corrigida; reavaliar com `npm audit` antes do próximo release. Não aplicar o downgrade major sugerido automaticamente.

**Status:** aberto, restrito a ferramentas de desenvolvimento; aceite temporário recomendado até correção upstream.

### SEC-003 — Cabeçalhos HTTP ainda não verificados no host

**Severity:** MEDIUM  
**CWE:** CWE-693 — Protection Mechanism Failure  
**OWASP:** A05 — Security Misconfiguration  
**Affected component:** configuração de resposta HTTP do GitHub Pages.

**Description:** o repositório exporta arquivos estáticos e não configura cabeçalhos de resposta. A política de CSP, HSTS, proteção contra MIME sniffing, referrer e permissões depende do host/CDN. A resposta de produção não foi consultada nesta auditoria, conforme o limite de não testar serviços externos.

**Attack scenario:** se cabeçalhos adequados não forem enviados pelo host, o navegador pode ter menos proteção contra framing, MIME sniffing, carregamento de recursos ou downgrade de transporte.

**Impact:** redução de defesa em profundidade para os visitantes. Não há sessão nem conteúdo personalizado no site.

**Evidence:** não há configuração de headers em `next.config.ts` ou no workflow; `output: "export"` publica arquivos estáticos. A presença dos headers na resposta real permanece desconhecida.

**Remediation:** antes do lançamento, verificar a resposta HTTPS do host. Se CSP ou outros cabeçalhos estiverem ausentes, configurar um serviço de borda que os suporte. Testar CSP primeiro em `Report-Only`, pois a exportação Next pode depender de scripts inline gerados no HTML.

**Status:** validação manual pendente; não foi alegada ausência na resposta do GitHub Pages.

## Security Checklist

### Authentication
- [x] Não há autenticação, contas, sessões ou recuperação de senha.

### Authorization
- [x] Não há recursos privados nem operações privilegiadas.

### Input Validation
- [x] Não há formulários ou dados de usuário enviados ao servidor.
- [x] O texto da cópia de e-mail é constante e definido pelo site.

### XSS
- [x] Nenhuma entrada controlada pelo visitante é renderizada como HTML.
- [x] `dangerouslySetInnerHTML` é usado somente para serializar objeto JSON-LD estático definido no código.

### CSRF
- [x] Sem endpoints mutáveis ou cookies de autenticação.

### CORS
- [x] Sem API própria ou configuração CORS no repositório.

### SSRF
- [x] Sem requisições server-side baseadas em URL fornecida por visitantes.

### SQL/NoSQL Injection
- [x] Não há banco nem consultas.

### Secrets
- [x] Scanner local não encontrou padrões de secrets nem arquivos `.env` no working tree.
- [x] Scanner de padrões percorreu os 26 commits alcançáveis sem encontrar correspondências.
- [x] Nenhum secret foi impresso durante a auditoria.

### Dependencies
- [x] `npm ci` reproduziu a instalação do lockfile.
- [x] `npm audit --omit=dev`: zero vulnerabilidades.
- [ ] `npm audit` completo: cinco entradas HIGH na mesma cadeia de lint; sem correção compatível indicada.

### Cookies
- [x] A aplicação não cria nem lê cookies.

### JWT
- [x] JWT não é utilizado.

### Security Headers
- [ ] Verificar manualmente os headers servidos pelo GitHub Pages antes do deploy.

### CSP
- [ ] Validar CSP em modo Report-Only no host/CDN antes de impor uma política.

### API Security
- [x] Não há API ou endpoint de aplicação.

### Logging
- [x] Não há logging de dados de visitantes no código.

### Error Handling
- [x] Não há backend que exponha stack traces ou erros internos.

### Database
- [x] Não há banco, credenciais ou políticas de acesso.

### CI/CD
- [x] Permissões do workflow são separadas entre build e deploy.
- [x] Actions fixadas em SHA; job de deploy restrito a `main`.

### Infrastructure
- [x] O artefato é estático e não requer runtime, container ou serviço de dados.
- [ ] Confirmar proteção da branch e configuração Pages do repositório.

### Business Logic
- [x] Não há transações, pagamentos, propriedade de recursos ou estado mutável.

## Validation

- `npm ci`: **PASS**; 359 pacotes instalados a partir do lockfile.
- `npm audit --omit=dev` foi adicionado ao job de build para bloquear advisories em dependências de produção.
- `npm run build` com `NEXT_PUBLIC_BASE_PATH=/vulpes.domus`: **PASS**.
- `npm run lint`: **PASS**.
- Parse do workflow YAML e verificação das cinco refs SHA: **PASS**.
- Verificação da exportação: assets presentes, prefixo `/vulpes.domus`, OG image e JSON-LD presentes, sem source maps; **PASS**.
- `npm audit --omit=dev`: **PASS**, zero findings.
- `npm audit`: **5 HIGH** residuais na cadeia de lint descrita em SEC-002.
- Testes de runtime, headers, HTTPS e preview Open Graph em produção: **não executados**; são verificações manuais no checklist de release.

## Release Gate

**CONDITIONALLY READY.** Não há vulnerabilidades críticas/altas conhecidas no conteúdo estático de produção. O release depende de confirmar os cabeçalhos HTTP do host, proteger a branch `main` e aceitar formalmente o risco baixo e restrito à cadeia de lint até que haja correção upstream.
