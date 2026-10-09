# Executive Summary

Auditoria da integração GA4 `G-0CN22SFDJL` no site estático Next.js 16, realizada em 9 de outubro de 2026. Não foi identificada vulnerabilidade de execução no fluxo de eventos nem coleta programada pelo código antes do consentimento. A tag usa uma origem fixa HTTPS e só é incluída após aceite. Foram corrigidos a falta de sincronização da escolha entre abas, a propagação de parâmetros de URL no `page_referrer` e o escaping do JSON-LD.

O `npm audit` encontrou uma vulnerabilidade **HIGH** em `braces@3.0.3`, dependência indireta de desenvolvimento usada pelo plugin ESLint do Next. A advisory oficial não lista versão corrigida; o `npm audit fix --force` sugeriria um downgrade incompatível do `eslint-config-next` para 14.2.35. O risco não alcança o bundle de produção, confirmado por `npm audit --omit=dev`, mas permanece no toolchain local/CI. A propriedade GA4 e o tráfego em produção não foram acessados. Resultado: **CONDITIONALLY READY**.

Esta auditoria não declara o projeto 100% seguro nem conformidade jurídica.

## Scope

- Código-fonte do GA4, consentimento, links instrumentados, eventos e aviso de privacidade.
- `package.json`, `package-lock.json`, configuração Next.js e workflow do GitHub Pages.
- Análise estática, `npm audit`, testes Node locais e fluxo visual no navegador local.
- Sem exploração, varredura ou teste ofensivo contra Google, GitHub Pages ou outros serviços externos; sem alteração de propriedade GA4, DNS, domínio, deploy ou push.

## Architecture

- App Router Next.js 16, React 19, `output: "export"`, publicação estática no GitHub Pages e domínio configurado no build existente.
- Uma única tag `next/script` aponta para `https://www.googletagmanager.com/gtag/js?id=G-0CN22SFDJL`. O ID é constante pública no código e não é uma credencial.
- A escolha `granted`/`denied` fica em `localStorage`. O estado desconhecido ou inválido falha fechado. A tag não é montada até o aceite.
- Eventos passam por `trackEvent`; page views são manuais, não disparam por rolagem ou mudança de hash. `send_page_view: false` evita o page view automático de configuração.
- No aceite, o Consent Mode recebe `analytics_storage: granted`, com armazenamento e personalização de anúncios negados. Na recusa/revogação, o estado volta a `denied`, eventos internos são bloqueados e cookies `_ga*` acessíveis são expirados.

## Threat Model

| Ativo | Ameaça considerada | Mitigação/limite |
|---|---|---|
| Escolha de consentimento | Valor inválido, alteração manual ou escolha diferente em outra aba | Validação estrita, fail-closed e evento `storage` para sincronização |
| Dados analíticos | Query string/referrer ou dado pessoal chegar ao GA | `page_location` sem query/hash, referrer reduzido e parâmetros tipados fixos |
| Integridade do site | Script externo ou URL de script manipulada | URL HTTPS e ID constantes no código, sem entrada de usuário |
| Navegação | Bloqueio/falha do GA interromper contato | Chamadas envoltas em `try/catch`; links continuam sendo links HTML normais |
| Build/deploy | Dependência comprometida ou privilégio excessivo no workflow | `npm ci`, Actions pinadas por SHA, permissões mínimas e auditoria runtime |
| JSON-LD | Fechamento da tag script por conteúdo serializado | JSON estático e caracteres `<` escapados |

## Findings

| ID | Severity | Vulnerability | Location | Status |
|---|---|---|---|---|
| VD-GA-01 | HIGH upstream / risco contextual restrito ao toolchain | `braces@3.0.3` vulnerável a exaustão de stack com padrões aninhados; dependência transitiva do ESLint | `package-lock.json:2638` | Aberto: sem versão corrigida publicada na advisory consultada; não afeta dependências de produção |
| VD-GA-02 | MEDIUM | Consentimento não era sincronizado entre abas; uma aba poderia seguir coletando depois da revogação em outra | `app/lib/analytics/AnalyticsProvider.tsx:86` | Corrigido: sincronização via `storage`, revogação local e fail-closed para remoção/valor inválido |
| VD-GA-03 | LOW | Referrer automático podia conter query string ou fragmento com dados pessoais | `app/lib/analytics/events.ts:155` | Corrigido: mesma origem transmite origem+caminho; origem externa transmite somente a origem |
| VD-GA-04 | LOW | JSON-LD via `dangerouslySetInnerHTML` poderia permitir fechamento de `<script>` se dados futuros fossem dinâmicos | `app/page.tsx:37` | Mitigado: dados atuais são constantes e `<` é escapado após serialização |
| VD-GA-05 | INFO | Não há Content Security Policy configurada | `next.config.ts:3` / `.github/workflows/deploy.yml:1` | Limitação documentada; não há cabeçalho CSP controlado por este repositório/workflow |
| VD-GA-06 | LOW | Consentimento no `localStorage` não expira automaticamente | `app/lib/analytics/config.ts:2` | Decisão de privacidade pendente: definir prazo de renovação com responsável da política |

### Detalhes dos findings

- **VD-GA-01:** Evidência: `npm audit` completo e `npm explain` mostram o caminho transitivo. Impacto: possível encerramento do processo Node ao processar padrão profundamente aninhado. Exploração: exige que tal padrão chegue ao parser; não foi demonstrado caminho vindo de visitante, e o pacote não compõe o runtime exportado. Correção: aguardar release corrigida ou adotar substituição compatível; não aplicar downgrade major. Estado: aberto, residual de desenvolvimento.
- **VD-GA-02:** Evidência anterior: estado era somente React/localStorage da aba. Impacto: revogação em outra aba não atualizava a aba atual. Correção: listener `storage` nega a coleta em mudança, remoção ou valor inválido. Validação: navegador local confirmou que a preferência recusada passou a aparecer na outra aba.
- **VD-GA-03:** Evidência anterior: `document.referrer` podia ser encaminhado pelo Google tag com query e fragmento. Impacto: URL de origem poderia conter identificador pessoal ou texto de formulário. Correção: `safePageReferrer()` remove query/fragmento e reduz origens externas. Validação: teste unitário com query contendo payload/PII só observou a origem no evento.
- **VD-GA-04:** Evidência: JSON-LD é inserido via `dangerouslySetInnerHTML`. Impacto: um valor futuro que contivesse `</script>` poderia sair do contexto JSON-LD e alterar o HTML. Exploração atual: não identificada, pois os dados são constantes. Correção: serialização seguida de escape de `<`. Estado: mitigado preventivamente.
- **VD-GA-05:** Evidência: busca nos arquivos não encontrou cabeçalho/regra CSP. Impacto: defesa adicional limitada contra scripts injetados. Correção dentro do escopo: documentar; a política de cabeçalhos precisa da camada de hospedagem ou CDN. Não foi introduzida uma CSP meta não validada.
- **VD-GA-06:** Evidência: chave de consentimento persiste sem timestamp. Impacto: escolha pode permanecer indefinidamente neste navegador. Exploração: não é bypass técnico; é risco de governança caso a organização exija renovação. Correção: definir prazo institucional e então codificar expiração. Estado: decisão pendente, sem prazo jurídico presumido.

### VD-GA-01 — evidência e impacto

`npm audit` completo identifica `braces@3.0.3` pelo caminho `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. O pacote é de desenvolvimento e não aparece no relatório `npm audit --omit=dev` (zero vulnerabilidades de produção). A advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) classifica o caso como High, afeta versões até 3.0.3 e atualmente lista **nenhuma versão corrigida**. Não foi executada exploração. O cenário relevante é indisponibilidade de um processo Node que processe um padrão de chaves profundamente aninhado; não há evidência de que o site público envie padrões a esse pacote. Não apliquei downgrade de Next/ESLint nem vendoring de uma correção não publicada.

## Script Security

- Uma referência de loader GA4 encontrada; nenhum outro Measurement ID, `gtag.js` ou Analytics package adicional no código da aplicação.
- Origem fixa HTTPS e ID constante com formato validado por teste. Não há concatenação com parâmetros de URL, formulário ou outra entrada de visitante.
- A tag de terceiro tem privilégios de JavaScript da página enquanto executa; carregamento após aceite reduz exposição, mas não elimina risco de comprometimento da origem externa.
- Sem SRI: `gtag.js` é conteúdo remoto mutável do fornecedor e um hash estático impediria atualizações normais. O domínio fixo e o aceite explícito são as restrições aplicadas no cliente.
- `next/script` mantém seu cache de carregamento na sessão. Por isso, após revogação o elemento já carregado pode permanecer no DOM; a integração envia estado negado, bloqueia eventos do site e apaga cookies acessíveis. O teste local confirmou que reaceitar na mesma sessão continua funcionando. Uma recarga com recusa não inclui a tag.

## Consent Management

- Estado inicial `unknown`; sem aceite não há chamadas `gtag` pela aplicação nem inclusão condicional do script. O HTML exportado é verificado sem referências ao loader.
- Aceite e recusa persistem como valores simples, sem identificador pessoal ou conteúdo de autenticação. Exceção de armazenamento permite escolha somente em memória durante a sessão; uma recarga volta ao padrão seguro.
- Recusa persistida bloqueia a montagem da tag. Revogação na sessão de aceite chama `consent update denied`, bloqueia imediatamente `trackEvent`/`trackPageView` e tenta expirar cookies GA.
- `storage` sincroniza mudanças entre abas. Remoção da chave, `localStorage.clear()` ou valor não reconhecido resulta em `unknown` e revogação; `trackEvent` também relê e valida o estado persistido antes de enviar.
- Nenhum cookie é gravado pelo código do banner antes do aceite. Cookies criados pelo Google só podem ser observados depois da carga da tag; verificação direta de rede/cookies em navegador limpo ficou pendente.
- Persistência atualmente não expira. Não foi inventado um prazo jurídico; o responsável do site deve decidir a renovação e refletir essa política na interface/aviso se necessário.

## Cookie Security

- O código só seleciona nomes que começam por `_ga`, incluindo `_ga_*`; não expira cookies sem esse prefixo.
- A expiração tenta `path=/`, host e domínio raiz `vulpesdomus.com.br`. JavaScript não consegue remover cookies `HttpOnly`, cookies de escopo diferente, nem dados já enviados/retidos no Google.
- Os testes unitários simulam preservação de um cookie alheio; não substituem a inspeção do armazenamento do navegador após publicação.

## Data Privacy

- `page_location` transmite apenas `origin + pathname`; query e fragmento não são incluídos.
- `page_referrer` remove query e fragmento: em mesma origem mantém o caminho; para origem externa mantém somente a origem.
- `page_title` é o título estático da página. Eventos usam nomes/valores e posições de botão definidos em TypeScript; não são enviados campos de formulário, conteúdo de WhatsApp, nome, telefone ou e-mail do visitante.
- O email e telefone da empresa são apenas destino de links HTML. Nenhum deles é passado como parâmetro dos eventos customizados.
- A propriedade do Google, retenção, consentimento configurado no painel e tráfego recebido não foram inspecionados.

## XSS Prevention

- `dangerouslySetInnerHTML` existe somente para JSON-LD fixo do `LocalBusiness`; `<` é convertido em `\\u003c` antes da inserção. Não há dado de usuário no objeto.
- A tag externa não é construída com entrada dinâmica. `AnalyticsLink` apenas chama o dispatcher com eventos e parâmetros tipados; não monta HTML nem usa `eval`, `innerHTML` ou navegação a partir do evento.
- Não foi identificado fluxo de dado controlado pelo visitante para contexto executável. O teste local usa referrer com payload codificado e confirma que somente a origem é enviada; não foi realizado pentest dinâmico da aplicação completa.

## CSP Review

Não há CSP no `next.config.ts`, metadados, workflow ou arquivos do projeto. O workflow apenas gera e publica arquivos estáticos no GitHub Pages; não configura cabeçalhos HTTP arbitrários do servidor. Não inseri CSP por `<meta>`: no export estático, políticas precisam ser conciliadas com scripts inline de bootstrap/hidratação do Next e com a tag JSON-LD, e uma política incompleta poderia quebrar o site sem proteger adequadamente.

Se a hospedagem/CDN for alterada para suportar cabeçalhos, deve-se medir primeiro os requests reais e começar por `default-src 'self'`, scripts e conexões restritos ao que o build e GA4 realmente usam, sem `unsafe-eval`; `frame-src` não é necessário para o loader GA4 básico. Uma política completa precisa considerar os scripts inline emitidos pelo build, além de `connect-src`/`img-src` do endpoint observado. Isso permanece como defesa em profundidade, não como configuração aplicada.

## Supply Chain

- `npm audit --omit=dev`: zero vulnerabilidades; 17 dependências de produção.
- `npm audit` completo: cinco registros HIGH na cadeia, correspondentes ao mesmo advisory de `braces@3.0.3`, e não cinco CVEs independentes. `npm explain` confirma que a cadeia é de desenvolvimento.
- Não há pacote dedicado de Analytics ou pacote de consentimento. O código usa React/Next já presentes e APIs do navegador.
- A versão atual do registry consultado lista `braces` somente até 3.0.3. `npm audit fix --dry-run` propõe um downgrade breaking para `eslint-config-next@14.2.35`; rejeitado para preservar Next 16. Reavaliar quando o mantenedor publicar correção compatível.

## GitHub Actions Security

- Checkout, setup-node, configure-pages, upload e deploy usam SHA imutável com versão comentada.
- Build tem `contents: read`; job de deploy recebe somente `pages: write` e `id-token: write`. `concurrency` cancela execuções concorrentes.
- Instalação usa `npm ci`; não há segredo administrativo do Google nem credencial GA no workflow. O ID é público.
- A etapa `npm audit --omit=dev` protege dependências de runtime, mas não falha para a vulnerabilidade no linter/build tooling. Não alterei o gate para `npm audit` porque isso bloquearia o workflow sem versão corrigida e sem mudança segura de dependência; o risco deve ser acompanhado.
- `output: "export"`, domínio e caminho raiz do workflow foram preservados. Nenhum deploy foi executado.

## Automated Tests

- `npm run test:analytics`: 7 testes com `node:test`, sem dependências adicionais. Cobrem ID, bloqueio sem consentimento, parâmetros minimizados, estado corrompido, referrer malicioso, falha do gtag e revogação/cookies.
- Navegador local automatizado: tag ausente com escolha recusada; um script após aceite; revogação mantém o script carregado, mas nega consentimento; reaceite continua ativando a tag; recusa em outra aba atualiza a escolha exibida na primeira.
- `npm run lint`: PASS. `npm run build` com `NEXT_PUBLIC_BASE_PATH=""`: PASS, incluindo `/` e `/privacidade` como rotas estáticas.
- `npm audit --omit=dev`: PASS. `npm audit` completo: FAIL pelo advisory descrito em VD-GA-01.
- Não houve interceptação da camada de rede do navegador. Assim, ausência absoluta de requests antes de consentir, ausência de requests após revogar, criação real de cookies e recebimento no GA DebugView não são declarados testados. O código/HTML e os fluxos de interface foram verificados localmente.

## Applied Fixes

1. Consentimento sincronizado entre abas, com remoção/valor inválido tratados como desconhecidos e sem coleta.
2. Remoção de query e fragmento do `page_referrer`, mantendo somente a origem externa.
3. Escaping de `<` no JSON-LD antes de inserção via `dangerouslySetInnerHTML`.
4. Testes de segurança locais com ferramentas nativas do Node, sem dependência de navegador/teste adicionada.
5. Comportamento de revogação ajustado para manter o script já carregado em memória e permitir reaceite na sessão; chamadas próprias bloqueadas e estado Consent Mode negado.

## Residual Risks

- Vulnerabilidade HIGH upstream em dependência de desenvolvimento `braces@3.0.3`, sem release corrigida listada pela advisory consultada.
- Script GA4 é código de terceiro com execução no navegador depois do aceite.
- Sem CSP aplicada no GitHub Pages a partir deste projeto.
- `localStorage` persiste até mudança/limpeza do navegador; sem expiração automática.
- Não foi possível comprovar em DevTools de rede que nenhum ping é emitido antes/depois do consentimento, nem validar o estado real dos cookies em produção.
- Configuração da propriedade GA4 (Enhanced Measurement, retenção, DebugView e Key Events) depende de acesso administrativo externo.

## Manual Validation Required

1. Em navegador limpo na produção, usar DevTools Network e Storage para confirmar que antes do aceite não há requests aos domínios de medição nem cookies `_ga*`.
2. Aceitar, conferir `page_view` e eventos no DebugView; recusar/revogar e confirmar ausência de novos eventos de coleta e remoção dos cookies visíveis.
3. No painel GA4, verificar Enhanced Measurement e desativar pageviews de histórico/cliques automáticos caso dupliquem o rastreamento explícito; marcar como Key Events somente `click_orcamento`, `click_whatsapp` e `click_email` se essa decisão continuar desejada.
4. Definir com o responsável de privacidade se a escolha de consentimento deve expirar e em qual prazo.
5. Acompanhar a advisory de `braces`; atualizar a cadeia quando existir release segura compatível e repetir os testes.
6. Avaliar CSP somente após escolher camada de hosting que permita cabeçalhos e medir os recursos necessários do build/GA.

## Final Security Assessment

| Controle | Resultado |
|---|---|
| Scripts externos confiáveis | PASS — origem e ID fixos; uma integração encontrada |
| Ausência de XSS identificado | PASS — no escopo analisado; JSON-LD escapado e sem origem dinâmica |
| Ausência de coleta antes do consentimento | NOT TESTED — HTML/código não carregam a tag antes do aceite, mas não houve captura de rede |
| Recusa de consentimento | PASS — estado persistido, sem tag em novo carregamento; fluxo local conferido |
| Revogação de consentimento | PASS — bloqueio de eventos, update denied e limpeza de cookies GA acessíveis; captura de rede pós-revogação pendente |
| Cookies analíticos | PASS — exclusão limitada a `_ga*` coberta por teste; inspeção real em produção pendente |
| Proteção contra vazamento de PII | PASS — parâmetros e referrer minimizados nos testes locais |
| Eventos sem duplicidade | PASS no dispatcher/código; configuração Enhanced Measurement da propriedade não testada |
| Segurança das dependências | FAIL no audit completo — um advisory HIGH de desenvolvimento, sem patch publicado; `npm audit --omit=dev` PASS |
| Segurança do GitHub Actions | PASS na inspeção estática — SHAs pinados e permissões reduzidas; gate não audita dev dependencies |
| CSP avaliada | PASS — ausência registrada e limitação do GitHub Pages documentada; política não aplicada |
| Build de produção | PASS — Next static export |
| Integração GA4 funcional | PASS local — script apareceu após aceite/reaceite; recebimento no DebugView não testado |

**CONDITIONALLY READY** para a integração de código no escopo local: não foi identificado problema crítico ou alto no bundle de produção, e os fluxos locais de consentimento, revogação, reaceite, sincronização e minimização passaram. Não é uma aprovação da implantação/conta de Analytics. A advisory HIGH em dependência de desenvolvimento continua aberta e verificações de rede/produção e painel GA4 permanecem pendentes. Não publicar até o responsável aceitar esse risco residual ou a cadeia ser atualizada quando houver correção compatível.
