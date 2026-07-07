# Migração Nuxt → Next.js (Aventis Asset Dashboard)

Guia para portar o frontend antigo (`aventis-asset-dash/apps/frontend`, Nuxt 4 SPA)
para este boilerplate (Next 16 App Router). Backend FastAPI fica **inalterado**.

---

## 0. Diagnóstico — o que falta no boilerplate

O boilerplate é **design system + infra**, não app de features. Conventions prontas
(shadcn `radix-vega`, Tailwind v4, fonts, lenis, `cn()`, import-sort, env t3). Mas:

| Camada                          | Nuxt antigo                              | Boilerplate                    | Ação                                    |
| ------------------------------- | ---------------------------------------- | ------------------------------ | --------------------------------------- |
| Cliente HTTP tipado             | `nuxt-open-fetch` (gera de OpenAPI)      | **ausente**                    | Construir                               |
| Data fetching reativo           | `useApi` / `useLazyApi` / `useAsyncData` | **ausente**                    | Construir (React Query)                 |
| Auth                            | `useAuth` → `GET /api/auth/me`           | **ausente**                    | Construir hook                          |
| WebSocket notificações          | `useNotifications`                       | **ausente**                    | Construir provider                      |
| UI lib                          | `@nuxt/ui` v4                            | shadcn/ui                      | Trocar componente a componente          |
| State                           | só `ref` local (sem Pinia)               | Context                        | Direto, sem store global                |
| Páginas `catalogo/*`, `metas/*` | —                                        | demo e-commerce com dados fake | **Deletar/substituir** pelo domínio EDP |
| Páginas `sistema/*`             | iguais                                   | placeholders                   | Reaproveitar shell, plugar dados        |

**Núcleo do trabalho = recriar a camada de dados que o Nuxt tinha de graça via
`nuxt-open-fetch`.** O resto é portar telas Vue→React.

---

## 1. Stack de dados recomendada

Espelha o que o Nuxt fazia (tipos gerados do OpenAPI + fetch reativo):

| Função                 | Nuxt                     | Next (recomendado)        | Por quê                                   |
| ---------------------- | ------------------------ | ------------------------- | ----------------------------------------- |
| Gerar tipos do backend | `nuxt-open-fetch`        | `openapi-typescript`      | gera `schema.d.ts` de `/api/openapi.json` |
| Cliente fetch tipado   | `$api()`                 | `openapi-fetch`           | ~6kb, mesmo paradigma, type-safe por path |
| Cache/reatividade      | `useAsyncData`/`refresh` | `@tanstack/react-query`   | substitui `refresh()`, dedup, invalidação |
| Validação form         | (manual)                 | `react-hook-form` + `zod` | zod já é dep                              |

```bash
pnpm add openapi-fetch @tanstack/react-query
pnpm add -D openapi-typescript
pnpm add react-hook-form @hookform/resolvers   # quando chegar nos forms
```

Alternativa mais pesada: tRPC (não cabe — backend é Python, não Node).

---

## 2. Scaffolding da camada de dados

### 2.1 Env (`src/env.ts`)

```ts
client: {
  NEXT_PUBLIC_API_BASE: z.url().default('http://localhost:8000'),
},
experimental__runtimeEnv: {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
},
```

> Em prod o Nuxt usava URLs relativas atrás de reverse-proxy (Caddy/Cloudflare).
> Manter: `NEXT_PUBLIC_API_BASE=""` em prod → chamadas a `/api/*` no mesmo host.

### 2.2 Gerar tipos do OpenAPI

`package.json`:

```json
"scripts": {
  "api:types": "openapi-typescript http://localhost:8000/api/openapi.json -o src/lib/api/schema.d.ts"
}
```

Rodar com backend de pé: `pnpm api:types`. **`/api/openapi.json` é a fonte de verdade
dos endpoints e DTOs** — não escrever tipos à mão.

### 2.3 Cliente (`src/lib/api/client.ts`)

```ts
import createClient from 'openapi-fetch'
import { env } from '@/env'
import type { paths } from './schema'

export const api = createClient<paths>({
	baseUrl: `${env.NEXT_PUBLIC_API_BASE}/api`,
	credentials: 'include' // cookies do reverse-proxy (Authelia/oauth2-proxy)
})
```

> Auth é **header-based via reverse-proxy** (`X-Remote-User`, `X-Remote-Groups`).
> Frontend **não** guarda token. `credentials: 'include'` carrega o cookie de sessão.

### 2.4 Provider React Query (`src/components/query-provider.tsx`)

Client component com `QueryClientProvider`. Inserir no `src/app/layout.tsx` dentro de
`ThemeProvider`, envolvendo `LenisProvider`.

### 2.5 Hooks por domínio (`src/lib/api/hooks/`)

Padrão para substituir `useApi`/`useAsyncData`:

```ts
export function useCedentes(query: CedentesQuery) {
	return useQuery({
		queryKey: ['cedentes', query],
		queryFn: async () => {
			const { data, error } = await api.GET('/edp/cedentes', {
				params: { query }
			})
			if (error) throw error
			return data
		}
	})
}
// mutation → useMutation + queryClient.invalidateQueries(['cedentes'])
```

---

## 3. Mapa completo de endpoints (do source FastAPI)

Prefixo base `/api`. Módulo EDP em `/api/edp/*`. Serviços framework em `/api/<service>/*`.

> ⚠️ **Quirk de prefixo duplo:** serviços do framework montam
> `service.prefix` + prefixo do router interno. Resultado real observado no Nuxt:
> `/api/notifications/notifications`, `/api/audit/audit`, `/api/tasks/tasks`,
> `/api/settings/settings`. **Sempre confirme o path exato no `/api/openapi.json`**
> (por isso a geração de tipos é obrigatória). Tabela abaixo usa paths do source.

### EDP — Dashboard

| Método | Path                 | Uso                   |
| ------ | -------------------- | --------------------- |
| GET    | `/api/edp/dashboard` | stats agregadas, KPIs |

### EDP — Cedentes (fornecedores) `modules/edp/entities/cedente.py`

| Método | Path                                      | Uso                                               |
| ------ | ----------------------------------------- | ------------------------------------------------- |
| GET    | `/api/edp/cedentes`                       | listar (paginado, filtro status/envio_automatico) |
| POST   | `/api/edp/cedentes`                       | criar                                             |
| GET    | `/api/edp/cedentes/stats`                 | contagens por status                              |
| GET    | `/api/edp/cedentes/options`               | dropdown                                          |
| GET    | `/api/edp/cedentes/template`              | baixar template CSV                               |
| POST   | `/api/edp/cedentes/parse`                 | parse de arquivo (preview import)                 |
| POST   | `/api/edp/cedentes/import`                | import em massa                                   |
| GET    | `/api/edp/cedentes/{id}`                  | detalhe (inclui contatos)                         |
| PATCH  | `/api/edp/cedentes/{id}`                  | atualizar                                         |
| POST   | `/api/edp/cedentes/{id}/ativar`           | ativar                                            |
| POST   | `/api/edp/cedentes/{id}/inativar`         | inativar                                          |
| POST   | `/api/edp/cedentes/{id}/pausar`           | pausar                                            |
| POST   | `/api/edp/cedentes/{id}/despausar`        | despausar                                         |
| POST   | `/api/edp/cedentes/{id}/envio-automatico` | toggle envio automático                           |
| GET    | `/api/edp/cedentes/{id}/mesclar-preview`  | preview merge                                     |
| POST   | `/api/edp/cedentes/{id}/mesclar`          | executar merge                                    |

### EDP — Contatos `contato.py`

| Método | Path                                                   |
| ------ | ------------------------------------------------------ |
| GET    | `/api/edp/cedentes/{cedente_id}/contatos`              |
| POST   | `/api/edp/cedentes/{cedente_id}/contatos`              |
| GET    | `/api/edp/cedentes/{cedente_id}/contatos/{contato_id}` |
| PATCH  | `/api/edp/cedentes/{cedente_id}/contatos/{contato_id}` |
| DELETE | `/api/edp/cedentes/{cedente_id}/contatos/{contato_id}` |

### EDP — Taxas do cedente `cedente_taxa.py`

| Método | Path                                         |
| ------ | -------------------------------------------- |
| GET    | `/api/edp/cedentes/{cedente_id}/taxas`       |
| GET    | `/api/edp/cedentes/{cedente_id}/taxas/ativa` |
| POST   | `/api/edp/cedentes/{cedente_id}/taxas`       |

### EDP — Sacados `sacado.py`

| Método   | Path                                                              | Uso                  |
| -------- | ----------------------------------------------------------------- | -------------------- |
| GET/POST | `/api/edp/sacados`                                                | CRUD base (fastcrud) |
| PATCH    | `/api/edp/sacados/{id}`                                           | atualizar            |
| POST     | `/api/edp/sacados/{id}/pausar` `/despausar` `/ativar` `/inativar` | transições status    |

### EDP — Notas `nota.py`

| Método | Path                                                                 | Uso                          |
| ------ | -------------------------------------------------------------------- | ---------------------------- |
| GET    | `/api/edp/notas`                                                     | listar (filtro status/datas) |
| GET    | `/api/edp/notas/stats`                                               | contagens                    |
| GET    | `/api/edp/notas/{id}`                                                | detalhe                      |
| PATCH  | `/api/edp/notas/{id}`                                                | atualizar (fastcrud update)  |
| POST   | `/api/edp/notas/{id}/bloquear` `/desbloquear` `/liberar` `/reativar` | ações                        |
| POST   | `/api/edp/notas/reativar`                                            | reativar em lote             |

### EDP — Propostas `proposta.py` (router prefix `/propostas`)

| Método | Path                                                           | Uso                                    |
| ------ | -------------------------------------------------------------- | -------------------------------------- |
| GET    | `/api/edp/propostas`                                           | listar (paginado, filtro status/datas) |
| POST   | `/api/edp/propostas`                                           | criar                                  |
| GET    | `/api/edp/propostas/stats`                                     | contagens                              |
| GET    | `/api/edp/propostas/{id}`                                      | detalhe                                |
| GET    | `/api/edp/propostas/{id}/eventos`                              | timeline                               |
| GET    | `/api/edp/propostas/{id}/versoes`                              | versionamento                          |
| PATCH  | `/api/edp/propostas/{id}/versao`                               | editar versão                          |
| POST   | `/api/edp/propostas/{id}/enviar`                               | enviar                                 |
| POST   | `/api/edp/propostas/{id}/enviar-sacados`                       | enviar a sacados                       |
| POST   | `/api/edp/propostas/{id}/reenviar-cedente` `/reenviar-sacados` | reenviar                               |
| POST   | `/api/edp/propostas/{id}/aprovar-cedente` `/rejeitar-cedente`  | decisão cedente                        |
| POST   | `/api/edp/propostas/{id}/aprovar-sacado` `/rejeitar-sacado`    | decisão sacado                         |
| POST   | `/api/edp/propostas/{id}/cancelar`                             | cancelar                               |
| POST   | `/api/edp/propostas/{id}/editar-reenviar`                      | editar+reenviar                        |
| POST   | `/api/edp/propostas/{id}/notas/adicionar` `/notas/remover`     | gerir notas                            |

### EDP — Importações `importacao.py`

| Método | Path                                                                |
| ------ | ------------------------------------------------------------------- |
| GET    | `/api/edp/importacoes` · `/importacoes/stats` · `/importacoes/{id}` |
| POST   | `/api/edp/importacoes/upload` · `/importacoes/delete`               |
| GET    | `/api/edp/importacoes/{id}/download`                                |
| DELETE | `/api/edp/importacoes/{id}`                                         |

### EDP — Configurações `settings.py` (prefix `/configuracoes`)

| Método | Path                                                              |
| ------ | ----------------------------------------------------------------- |
| GET    | `/api/edp/configuracoes` · `/configuracoes/preview-min-dias`      |
| PATCH  | `/api/edp/configuracoes`                                          |
| POST   | `/api/edp/configuracoes/pause` · `/unpause` · `/preview-template` |

### EDP — Fila de envios `send_queue.py` (prefix `/fila-envios`)

| Método | Path                                          |
| ------ | --------------------------------------------- |
| GET    | `/api/edp/fila-envios` · `/fila-envios/depth` |
| POST   | `/api/edp/fila-envios/{queue_id}/retry`       |

### Framework — Auth

| GET | `/api/auth/me` | contexto do usuário (user, email, groups, is_authenticated) |

### Framework — Status

| GET | `/api/status` · `/api/health` | health + template_version |

### Framework — Notifications `/api/notifications/*`

| Método    | Path                                                         |
| --------- | ------------------------------------------------------------ |
| GET       | `/api/notifications/notifications` · `/notifications/{id}`   |
| POST      | `/api/notifications/notifications/{id}/dismiss` · `/{id}/go` |
| GET/PATCH | `/api/notifications/settings` (preferências)                 |
| WS        | `/api/ws/notifications` (tempo real)                         |

### Framework — Email `/api/email/*`

| Método       | Path                                                                                          | Uso                    |
| ------------ | --------------------------------------------------------------------------------------------- | ---------------------- |
| GET          | `/api/email/mailboxes` · `/mailboxes/{id}`                                                    | caixas                 |
| DELETE       | `/api/email/mailboxes/{id}`                                                                   | remover                |
| POST         | `/api/email/mailboxes/{id}/poll` · `/mailboxes/poll-all`                                      | poll manual            |
| POST         | `/api/email/mailboxes/{id}/reconnect`                                                         | reconectar             |
| GET          | `/api/email/oauth/connect` · `/oauth/callback`                                                | OAuth flow             |
| POST         | `/api/email/oauth/verify` · `/oauth/save`                                                     | verificar/salvar caixa |
| GET          | `/api/email/bindings`                                                                         | vínculos módulo→caixa  |
| POST         | `/api/email/bindings` · `/bindings/{id}/move`                                                 | criar/mover            |
| PATCH/DELETE | `/api/email/bindings/{id}`                                                                    | editar/remover         |
| GET          | `/api/email/modules` · `/modules/{id}`                                                        | módulos vinculáveis    |
| GET          | `/api/email/emails` · `/emails/{id}` · `/emails/{id}/links`                                   | log emails             |
| POST         | `/api/email/emails/{id}/reprocess` · `/emails/{id}/links/reset` · `/emails/reprocess-pending` | reprocessar            |
| GET          | `/api/email/emails/attachments/{id}/download`                                                 | anexo                  |

### Framework — Tasks `/api/tasks/*`

| GET | `/api/tasks/tasks` · `/tasks/{id}/runs` |
| POST | `/api/tasks/tasks/{id}/run` · `/enable` · `/disable` |

### Framework — Audit `/api/audit/*`

| GET | `/api/audit/audit` (lista, fastcrud read-only) |

### Framework — Settings (sistema) `/api/settings/*`

| GET/PATCH | `/api/settings/settings` |

### Framework — Calendar `/api/calendar/*`

| GET | `/api/calendar/exchanges` · `/info` · `/check` · `/next` · `/previous` · `/offset` · `/count` · `/range` |

---

## 4. Mapa de páginas (Nuxt → Next)

`pages/*.vue` → `src/app/(app)/<rota>/page.tsx`. `[id].vue` → `[id]/page.tsx`.
Reaproveitar o route-group `(app)` (shell com sidebar já existe).

| Rota                       | Nuxt                  | Next destino                       | Endpoints                              |
| -------------------------- | --------------------- | ---------------------------------- | -------------------------------------- |
| `/`                        | index.vue             | `(app)/page.tsx`                   | notifications, email/mailboxes, status |
| `/edp`                     | edp/index.vue         | `(app)/edp/page.tsx`               | `/edp/dashboard`                       |
| `/edp/cedentes`            | edp/cedentes/index    | `(app)/edp/cedentes/page.tsx`      | cedentes, stats                        |
| `/edp/cedentes/[id]`       | cedentes/[id]         | `cedentes/[id]/page.tsx`           | cedente detail, contatos, taxas        |
| `/edp/cedentes/importar`   | cedentes/importar     | `cedentes/importar/page.tsx`       | parse, import, template                |
| `/edp/notas` `/[id]`       | edp/notas/\*          | `edp/notas/[id]`                   | notas, stats                           |
| `/edp/propostas` `/[id]`   | edp/propostas/\*      | `edp/propostas/[id]`               | propostas, stats, eventos, versoes     |
| `/edp/proposta/nova`       | proposta/nova         | `edp/propostas/nova/page.tsx`      | POST propostas                         |
| `/edp/sacados` `/[id]`     | edp/sacados/\*        | `edp/sacados/[id]`                 | sacados                                |
| `/edp/importacoes` `/[id]` | edp/importacoes/\*    | `edp/importacoes/[id]`             | importacoes, upload                    |
| `/edp/configuracoes`       | edp/configuracoes     | `edp/configuracoes/page.tsx`       | configuracoes, pause                   |
| `/sistema`                 | sistema/index         | `(app)/sistema/page.tsx` (existe)  | —                                      |
| `/sistema/notificacoes`    | sistema/notificacoes  | existe                             | notifications + settings               |
| `/sistema/emails`          | sistema/emails        | existe                             | email/emails                           |
| `/sistema/caixas`          | sistema/caixas        | `caixas-postais/page.tsx` (existe) | mailboxes, bindings, oauth             |
| `/sistema/tarefas`         | sistema/tarefas       | existe                             | tasks                                  |
| `/sistema/auditoria`       | sistema/auditoria     | existe                             | audit                                  |
| `/sistema/configuracoes`   | sistema/configuracoes | existe                             | settings                               |

> **Deletar** `(app)/catalogo/*` e `(app)/metas/*` — são demo e-commerce do boilerplate,
> não pertencem ao domínio EDP. Aproveitar componentes genéricos deles
> (`data-table`, `editable-table`, `pill-filter`, `search-bar`) ao portar.

---

## 5. Composables Vue → Hooks React

| Composable (Nuxt)                  | Vira                                                                                  | Notas                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `useApi`/`$api`                    | `src/lib/api/client.ts` + hooks React Query                                           | §2                                                                   |
| `useAuth`                          | `useAuth()` → React Query em `/api/auth/me`; expor `hasRole()`, `hasAnyRole()`        | sem token; proxy decide                                              |
| `useNotifications`                 | `NotificationsProvider` (Context + WebSocket `/api/ws/notifications`)                 | ping `{action:'ping'}` a cada 30s; trata `{type:'pong'}`             |
| `useNotificationRefresh(keys, fn)` | listener no provider → `queryClient.invalidateQueries` quando `metadata.refresh` casa | backend manda `metadata.refresh:['edp_dashboard']`                   |
| `useMailboxOAuth`                  | `useMailboxOAuth()` — popup → postMessage → verify → save                             | 3 passos: connect/verify/save                                        |
| `useFormatters`                    | `src/lib/format.ts` (funções puras)                                                   | `formatCurrency`, `formatDate`, `formatCnpj`, `apiErrorMessage` (11) |
| `useNotaStatus`                    | `src/lib/edp-status.ts` (puras)                                                       | `getEffectiveNotaStatus`, `isNotaVencida`, `diasAteVencimento`, etc  |
| `useNavigation` (`goBack`)         | `useRouter().back()` do `next/navigation`                                             | —                                                                    |
| `useFormatters`/types UI           | portar `app/types/edp.ts` (281 ln) e `ui.ts` → `src/lib/edp-status.ts`                | labels/cores/ícones; DTOs vêm do `schema.d.ts` gerado                |

---

## 6. UI: `@nuxt/ui` → shadcn

Maior volume de trabalho manual. Mapeamento dos componentes mais usados:

| @nuxt/ui                         | shadcn (`pnpm dlx shadcn@latest add ...`)           |
| -------------------------------- | --------------------------------------------------- |
| `UButton`                        | `button`                                            |
| `UInput`/`UTextarea`/`USelect`   | `input` `textarea` `select`                         |
| `UTable`                         | `data-table` (já existe em `custom-ui/`) ou `table` |
| `UModal`/`USlideover`            | `dialog` / `sheet`                                  |
| `UCard`                          | `card`                                              |
| `UBadge`                         | `badge`                                             |
| `UForm`+`UFormGroup`             | `react-hook-form` + `form` + zod resolver           |
| `UDropdown`                      | `dropdown-menu`                                     |
| `UTabs`                          | `tabs`                                              |
| `UToast`/`useToast`              | `sonner` ou `toast`                                 |
| `UPagination`                    | `pagination`                                        |
| `UPopover`/`UTooltip`            | `popover` / `tooltip`                               |
| cores semânticas `app.config.ts` | tokens oklch em `globals.css` (já configurado)      |

Regras do boilerplate ao escrever JSX: `cn()` sempre p/ className dinâmico (nunca template
literal); imports ordenados (eslint `simple-import-sort`); tabs largura 4, sem `;`, aspas
simples (prettier).

---

## 7. Gotchas (do código Nuxt — replicar exatamente)

1. **snake_case**: backend (fastcrud) retorna `created_at`, `cedente_id`, `valor_liquido`.
   Não camelizar — tipos gerados já vêm em snake_case.
2. **Datas UTC naive**: backend manda `"2024-03-15T12:00:00"` sem `Z`. Frontend **anexa `Z`**
   para interpretar como UTC. Datas só-dia (`YYYY-MM-DD`) parsear como local. Portar `parseDateTime`.
3. **Listas**: formato `{ data: T[], total_count?: number }`.
4. **pt-BR**: usar `src/lib/number.ts` (`sanitizeDecimal`, `parseDecimal` — vírgula decimal) já no boilerplate.
5. **Refresh por notificação**: WS manda `metadata.refresh: ['edp_dashboard']` → invalidar query keys correspondentes.
6. **Prefixo duplo** nos serviços framework (§3) — confirmar no openapi.json.
7. **Auth**: nada de login no front. `GET /api/auth/me`; UI mostra/esconde por `hasRole()`. Reverse-proxy protege.
8. **OAuth de caixa**: fluxo separado via popup, não confundir com auth do app.

---

## 8. Ordem de execução (checklist)

- [ ]   1. `pnpm add openapi-fetch @tanstack/react-query` + `-D openapi-typescript`
- [ ]   2. Env: `NEXT_PUBLIC_API_BASE` em `src/env.ts` + `.env.local`
- [ ]   3. `pnpm api:types` (backend de pé) → `src/lib/api/schema.d.ts`
- [ ]   4. `client.ts` + `QueryProvider` no layout
- [ ]   5. `useAuth` + (opcional) `middleware.ts`
- [ ]   6. `NotificationsProvider` (WebSocket)
- [ ]   7. Portar helpers puros: `format.ts`, `edp-status.ts`, `number.ts`
- [ ]   8. Popular sidebar nav com rotas EDP/sistema reais
- [ ]   9. Deletar `catalogo/*` e `metas/*`
- [ ]   10. Portar telas por domínio: dashboard → cedentes → notas → propostas → sacados → importações → configuracoes → sistema/\*
- [ ]   11. Para cada tela: hook React Query → componente shadcn → mutations + invalidação
- [ ]   12. `pnpm typecheck` + `pnpm lint` antes de commit (husky roda no pre-commit/pre-push)
