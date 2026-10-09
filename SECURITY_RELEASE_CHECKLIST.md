# Security Release Checklist

## Code
- [ ] Revisar o diff final e confirmar que nenhum secret ou dado de teste foi adicionado.
- [ ] Executar `npm ci`, `npm run lint` e `npm run build` com `NEXT_PUBLIC_BASE_PATH` vazio para publicar na raiz do domínio personalizado.
- [ ] Registrar a aceitação temporária dos cinco avisos HIGH de lint em `SEC-002`; confirmar `npm audit --omit=dev` sem findings.

## Environment Variables
- [ ] Confirmar que o build usa caminho raiz e publica em `https://vulpesdomus.com.br/`; não inserir secrets no bundle.

## Authentication
- [ ] N/A: o site não tem login, contas ou sessão.

## Database
- [ ] N/A: o site não usa banco de dados.

## Infrastructure
- [ ] Confirmar que GitHub Pages publica o artefato do workflow e que a branch `main` tem proteção adequada.
- [ ] Verificar cabeçalhos HTTP: CSP (começar em Report-Only), HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy e `frame-ancestors` via CSP.

## DNS / HTTPS
- [ ] Abrir o endereço de produção por HTTPS e confirmar redirecionamento de HTTP para HTTPS e certificado válido.

## CI/CD
- [ ] Confirmar SHAs das Actions, `deploy` restrito a `main` e permissões mínimas de cada job.
- [ ] Conferir que o workflow terminou com sucesso e publicou o artefato esperado.

## Monitoring
- [ ] Confirmar notificações de falha do GitHub Actions e revisar o resultado do deploy.

## Backups
- [ ] Confirmar que `main` contém o código e assets necessários para reconstruir o site; não há banco a copiar.

## External Services
- [ ] Confirmar que links públicos de Instagram, WhatsApp e e-mail são os contatos corretos.

## Final Smoke Test
- [ ] Abrir a página publicada em celular e desktop; testar menu, âncoras, imagens, carrossel e botão de cópia.
- [ ] Validar o preview Open Graph em uma ferramenta de inspeção de compartilhamento antes de divulgar o link.
