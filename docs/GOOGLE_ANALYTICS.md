# Google Analytics 4 — Vulpes Domus

## Configuração

- Measurement ID: `G-0CN22SFDJL`.
- Site público: `https://vulpesdomus.com.br/`.
- Integração: Google tag (`gtag.js`) carregada por `next/script` com `afterInteractive`, somente depois do aceite de analytics.
- O site usa Next.js App Router com `output: "export"`. Não há dependência adicional nem segredo/variável de ambiente para o ID.

O Measurement ID identifica o fluxo de dados e é público. O código não contém credenciais administrativas do Google.

## Arquivos

- `app/lib/analytics/config.ts`: Measurement ID, chave de persistência e tipo de consentimento.
- `app/lib/analytics/events.ts`: fila do Google tag, Consent Mode, envio centralizado de eventos, page views e tentativa de remoção de cookies `_ga*` ao revogar.
- `app/lib/analytics/AnalyticsProvider.tsx`: lê a escolha salva, injeta o script após aceite, coordena revogação e evita page views duplicadas.
- `app/AnalyticsLink.tsx` e `app/TrackedServiceDetails.tsx`: instrumentação dos links e das categorias de serviço.
- `app/CookieConsent.tsx` e `app/PrivacyPreferencesButton.tsx`: banner e reabertura das preferências no rodapé.
- `app/privacidade/page.tsx`: aviso público sobre o Analytics e a escolha do visitante.
- `app/layout.tsx`: provider global e URLs canônicas do domínio personalizado.

## Consentimento e carregamento

1. Antes da primeira escolha, nenhum elemento `gtag.js` é renderizado nem requisitado.
2. A escolha `granted` ou `denied` é gravada em `localStorage` no navegador. Essa chave guarda somente a preferência; não é autenticação.
3. Só `granted` monta o `next/script` do Google. Após carregar, o provider inicializa o tag e envia um page view manual.
4. `denied` mantém o site funcionando sem carregar o script em novas páginas. A preferência pode ser alterada em **Preferências de privacidade**, no rodapé.
5. Ao revogar durante uma sessão em que a tag já carregou, a integração bloqueia imediatamente os eventos do site, comunica `analytics_storage: denied` e tenta expirar os cookies `_ga*` visíveis no domínio. O elemento de script carregado permanece na página porque o `next/script` mantém cache por URL e removê-lo impedia um novo aceite de reativar a tag naquela mesma sessão. Após recarregar com recusa salva, a tag não é incluída. O navegador não consegue recolher dados já transmitidos ao Google, e cookies inacessíveis por escopo/atributos podem não ser apagáveis por JavaScript.
6. `ad_storage`, `ad_user_data` e `ad_personalization` permanecem negados; o site não implementa Google Ads.

Esta é a abordagem de Consent Mode básico: a tag não é carregada até o visitante aceitar; pessoas que recusam não enviam ping de consentimento ao Google. A tag permanece carregada na sessão em que houve aceite, mas após revogação o estado é atualizado e a camada própria bloqueia novos eventos. A preferência também é sincronizada entre abas da mesma origem; um valor removido ou inválido falha fechado. A documentação do Google descreve a diferença entre Consent Mode básico e avançado em [Consent mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode).

## Eventos

Todos os eventos personalizados passam por `trackEvent`. Ele exige consentimento persistido e inicialização concluída, inclui `page_location` com origem e caminho (sem query string ou fragmento) e sanitiza `page_referrer` para remover query/fragmentos de origem. Captura erros para que o Analytics nunca interrompa navegação. Os parâmetros são enums/categorias fixas; não se enviam nome, e-mail, telefone, conteúdo de mensagem ou URL externa.

| Evento | Ação registrada | Parâmetros relevantes |
| --- | --- | --- |
| `click_orcamento` | Clique no CTA “Solicite um orçamento”, que abre o WhatsApp | `contact_method=whatsapp`, `button_location=hero` |
| `click_whatsapp` | Clique nos links de WhatsApp do cabeçalho, seção Contato ou rodapé | `contact_method=whatsapp`, `button_location` |
| `click_email` | Clique nos links `mailto:` do cabeçalho, Contato, rodapé ou aviso de privacidade | `contact_method=email`, `button_location` |
| `click_instagram` | Clique nos links do Instagram do cabeçalho, Contato ou rodapé | `contact_method=instagram`, `button_location` |
| `view_projetos` | Clique em Projetos no menu ou em “Ver projetos” no início | `button_location` |
| `view_servicos` | Clique em Nossos serviços no menu | `button_location` |
| `select_service_category` | Abertura de uma categoria expansível de serviços | `service_category=projetos` ou `legalizacao` |

O CTA de orçamento registra **somente** `click_orcamento`, com `contact_method=whatsapp`; ele não dispara também `click_whatsapp`. Assim não se conta a mesma ação duas vezes. O evento significa intenção de iniciar contato, não envio confirmado, venda ou contratação; não é `generate_lead`.

`view_projetos` e `view_servicos` registram cliques intencionais de navegação, não rolagem nem mera visualização. A página tem navegação por âncoras e rolagem, então essas ações não criam novos `page_view`. A rota independente `/privacidade/` recebe um page view quando o Analytics foi aceito.

Para entender melhor parâmetros no GA4, crie definições personalizadas com escopo de evento para `button_location`, `contact_method` e `service_category`. `page_location` é um parâmetro padrão.

## Preparação no painel do GA4

O código controla page views para evitar duplicidade. No fluxo de dados Web da propriedade, desative **Enhanced measurement** para que a propriedade receba apenas os eventos definidos neste projeto. Se preferir manter parte dessa medição, desative no mínimo “Page changes based on browser history events” e cliques externos; as âncoras e links de contato já têm eventos intencionais próprios. O GA4 pode enviar page views por configuração da tag e por Enhanced Measurement; a documentação explica como evitar duplicidade em [Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views).

## Testes e DebugView

1. Abra o site em uma janela limpa e, no DevTools, filtre a aba Network por `google-analytics`, `googletagmanager`, `collect` e `g/collect`.
2. Antes de escolher, confirme que o banner aparece, a navegação continua utilizável e não há requisição à tag do Google nem a endpoints de coleta.
3. Recuse e atualize a página: a escolha recusada deve persistir e a tag permanecer ausente. Reabra as preferências no rodapé e aceite; a tag só deve aparecer então.
4. Após o aceite, confirme um único `page_view` inicial. Clique uma vez no CTA de orçamento e nos contatos e navegue para `/privacidade/`; confira os eventos e os parâmetros sem dados pessoais.
5. Abra **Preferências de privacidade**, recuse, e confirme que os próximos cliques não chegam a `trackEvent`, que `analytics_storage` passa a `denied` e que cookies `_ga*` visíveis são expirados.
6. No GA4, abra **Administrador → Exibição de dados → DebugView**. Inicie uma sessão no [Google Tag Assistant](https://tagassistant.google.com/), conecte o domínio e confira os comandos de consentimento e os eventos; o [guia do DebugView](https://support.google.com/analytics/answer/7201382) explica como habilitar o modo de depuração. Em **Relatórios → Tempo real**, confira recebimento recente. As interfaces do Google podem levar alguns instantes para exibir eventos novos.

O projeto não tem um stream de teste separado. Ao aceitar Analytics em desenvolvimento/local, os eventos usam o ID configurado neste documento e podem chegar à propriedade real; prefira uma propriedade de teste ou limite os cliques de validação. Bloqueadores, consentimento recusado e restrições do navegador impedem a confirmação de recebimento no Google, ainda que o build esteja correto.

## Eventos principais (Key Events)

Após o primeiro recebimento, no GA4 abra **Administrador → Exibição de dados → Eventos** e marque como evento principal (ícone de estrela) apenas:

1. `click_orcamento`
2. `click_whatsapp`
3. `click_email`

São sinais de intenção de contato, não confirmações de lead ou venda. Não marque `page_view`, `view_projetos`, `view_servicos`, `click_instagram` nem `select_service_category` como eventos principais. O GA4 também permite preparar um evento principal novo antes de sua primeira ocorrência, dependendo da interface/permissão disponível.

## Desativar ou trocar o ID

- Para desativar coleta, remova o Measurement ID do arquivo `app/lib/analytics/config.ts` e ajuste o provider para não montar `next/script`; mantenha o banner apenas se outra tecnologia continuar exigindo consentimento.
- Para trocar de propriedade/fluxo, altere `GA_MEASUREMENT_ID` em `app/lib/analytics/config.ts`. Não é necessário criar secret nem variável no GitHub Actions.
- Não adicione outro snippet `gtag.js` no layout, em HTML ou no painel do GitHub Pages: a tag deste provider é a única implementação.

## Validação local e em produção

Execute `npm run test:analytics`, `npm run lint` e `npm run build`. O export estático inclui `/privacidade/` e mantém o domínio personalizado porque a publicação usa caminho raiz. O workflow do GitHub Pages permanece responsável pelo deploy; esta implementação não o altera e não exige `NEXT_PUBLIC_BASE_PATH=/vulpes.domus`. Limitações de auditoria e validações pendentes estão em [`docs/ANALYTICS_SECURITY_AUDIT.md`](./ANALYTICS_SECURITY_AUDIT.md).

Depois de uma publicação autorizada, repita as verificações de consentimento no domínio `https://vulpesdomus.com.br/`, confirme `page_location` no DebugView e confira os três eventos prioritários no relatório de eventos. A validação local não confirma DNS, publicação, configuração da propriedade do Google, resposta da tag em todos os navegadores ou configuração de retenção do GA4.
