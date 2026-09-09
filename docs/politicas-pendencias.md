# Políticas legais — decisões pendentes e o que a engenharia precisa entregar

Registro do que ficou **assumido** na redação de `/termos`, `/privacidade`,
`/subprocessadores`, `/suporte` e `/cookies` (revisão de 09/09/2026), para
que cada item seja confirmado, alterado ou virar tarefa. Os textos foram
escritos a partir do que a plataforma de fato faz (auditoria em
`faradays-monfiza-demo/docs/auditoria-dados-seguranca-v2.md`), sem prometer
o que não existe. Nada aqui é jurídico: **os quatro textos precisam de revisão
por advogado antes de valerem como oficiais.**

## 1. Decisões comerciais assumidas (confirmar ou alterar)

| #    | Onde                 | Assumido                                                                                | Alternativas                                                     |
| ---- | -------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1.1  | Termos §6            | Renovação automática; cancelamento tem efeito no fim do ciclo, sem multa                | Aviso prévio de 30 dias; multa no anual                          |
| 1.2  | Termos §6            | Sem reembolso proporcional, exceto 7 dias após a 1ª contratação                         | Reembolso proporcional no anual; sem janela de 7 dias (B2B puro) |
| 1.3  | Termos §6            | Inadimplência: aviso → suspensão após 15 dias → encerramento após 60                    | Prazos diferentes                                                |
| 1.4  | Termos §6            | Reajuste só na renovação, com 30 dias de aviso                                          | Reajuste anual por índice (IPCA/IGP-M)                           |
| 1.5  | Termos §6            | Representante excedente: cobrança proporcional ou upgrade                               | Bloqueio ao atingir o limite                                     |
| 1.6  | Termos §12 / Suporte | Meta de disponibilidade 99,5% mensal para Basic/Pro, sem crédito                        | Outro número; SLA com crédito também no Pro                      |
| 1.7  | Suporte §2           | Primeira resposta: Basic 8h úteis (crítico) a 3 dias úteis; Pro 4h úteis a 2 dias úteis | Outros prazos                                                    |
| 1.8  | Suporte §1           | Horário seg–sex 9h–18h (Brasília); só admin/gestor abrem chamado                        | Estender horário; canal para representante                       |
| 1.9  | Termos §15           | Limite de responsabilidade = 12 meses pagos; exclusão de lucros cessantes               | Múltiplo (ex.: 2×); teto fixo                                    |
| 1.10 | Termos §16           | Encerramento pela Faradays com 60 dias de aviso; por violação, 15 dias para corrigir    | Outros prazos                                                    |
| 1.11 | Termos §7            | Conta WhatsApp Business é do Cliente (ou "conforme contrato")                           | Faradays fornece o número como Tech Provider — muda a redação    |
| 1.12 | Termos §19           | Foro: Comarca de São Paulo/SP                                                           | Arbitragem; outro foro                                           |
| 1.13 | Termos §14           | Personalizações sob encomenda pertencem à Faradays, com licença ao Cliente              | Pertencem ao Cliente (comum em Enterprise)                       |

## 2. Fatos que precisam de confirmação (podem estar errados na página)

| #   | Onde                        | O que está escrito                                                           | Como confirmar                                                                                                                                                                                         |
| --- | --------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | Subprocessadores §1         | Vultr, "datacenter na região contratada para cada cliente"                   | **Região da VM de prod não está documentada em lugar nenhum** — ver painel da Vultr. Se for fora do Brasil, o Aviso §12 precisa citar o país                                                           |
| 2.2 | Subprocessadores §4         | "Provedor de hospedagem do site" e "provedor de e-mail corporativo" sem nome | Onde a `faradays-lp` está publicada (Vercel? Cloudflare Pages?) e qual o provedor do e-mail (Google Workspace? M365?). Nomear.                                                                         |
| 2.3 | Subprocessadores §2         | OpenAI, Google e Anthropic via OpenRouter                                    | É o que `AI_MODEL`, `AI_AUDIO_MODEL` e `AI_VISION_MODEL` apontam hoje (gpt-4o-mini, whisper-1, gemini-2.5-flash; claude-haiku selecionável). Toda troca de modelo exige atualizar a tabela             |
| 2.4 | Privacidade §6.3, Termos §9 | "provedores contratados sob termos que vedam o uso para treinamento"         | **Não há contrato nem ZDR (zero data retention) com a OpenRouter hoje.** Ativar a política de ZDR/provider allowlist na conta OpenRouter e guardar o comprovante, ou suavizar a frase                  |
| 2.5 | Privacidade §13             | Encarregado (DPO) = contato@faradays.io                                      | Nomear a pessoa internamente (a ANPD não exige nome público, mas exige que exista). Recomendado criar `privacidade@faradays.io` e trocar em `src/lib/links.ts` + textos                                |
| 2.6 | Cookies                     | Site só grava `faradays-lang`                                                | Verdade hoje (`grep` em `src/`). O metatag `facebook-domain-verification` no layout **não** instala pixel — mas se alguém instalar o Meta Pixel, Cookies + Aviso + banner de consentimento mudam antes |
| 2.7 | Privacidade §3.3            | "arquivos de áudio e imagem não são guardados pela Plataforma"               | Verdade no código (só `media_id`). Manter assim ou atualizar se passar a persistir mídia                                                                                                               |

## 3. O que a engenharia precisa entregar para as páginas serem verdadeiras

Promessas feitas nas páginas que **ainda não existem no código** do
`faradays-monfiza-demo` (ref. auditoria v2, 11/08/2026, e checagem de 09/09):

| #    | Promessa                                                                            | Estado hoje                                                                                                                       | Tarefa                                                                                                                |
| ---- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 3.1  | Aviso §8: logs ≥ 6 meses; auditoria até 5 anos; eliminação em 90 dias após o fim    | **Nenhuma política de retenção/expurgo existe** (M13); logs de contêiner rodam em ~50 MB e somem                                  | Job de expurgo por tabela + retenção de logs fora do contêiner (≥ 6 meses, Marco Civil)                               |
| 3.2  | Aviso §8 / Termos §16: exportação em 30 dias, CSV/XLSX                              | Só há export Excel de cotações e "a receber"; sem export geral                                                                    | Endpoint/rotina de exportação completa por Cliente                                                                    |
| 3.3  | Aviso §10: atender pedidos de titular (eliminação, acesso)                          | Sem endpoint de eliminação/anonimização por titular; `Cliente` é hard delete bloqueado por FK (L5)                                | Rotina de anonimização por titular (representante, contato de cliente)                                                |
| 3.4  | Aviso §9: "trilha de auditoria imutável das ações relevantes"                       | `audit_log` **não grava quem fez** (sem coluna de ator — M21/L4)                                                                  | Adicionar `actor` (usuário do header) ao `AuditLog` e popular nos CRUDs                                               |
| 3.5  | Aviso §9: "cada representante consulta e escreve apenas sobre os próprios clientes" | Verdade no bot; **a REST API não aplica carteira** (M5, M6, M23)                                                                  | Estender a fronteira de carteira aos endpoints REST ou restringir a redação ao assistente (já está restrita — manter) |
| 3.6  | Aviso §9: "credenciais de integração cifradas"                                      | Verdade (Fernet), mas chave única sem rotação e não validada no boot (L2)                                                         | Validar `db_encryption_key` no boot; `MultiFernet` para rotação                                                       |
| 3.7  | Aviso §9: "sem portas abertas além do acesso administrativo"                        | Verdade (Cloudflare Tunnel) — mas `/webhooks/*` passa direto ao backend sem Caddy e `WA_APP_SECRET` vazio pula o HMAC (M4)        | Preencher `wa_app_secret` em prod; rotear webhooks pelo Caddy                                                         |
| 3.8  | Aviso §9: "acesso interno restrito a pessoas nomeadas"                              | Keycloak admin `admin/admin` exposto (C2); usuários demo com senha fixa no realm (H2/H3); `oauth2_cookie_secret` não montado (C1) | Fechar C1, C2, H2, H3 antes de publicar o Aviso                                                                       |
| 3.9  | Termos §7: "assistente só conversa com Representantes cadastrados"                  | Verdade                                                                                                                           | —                                                                                                                     |
| 3.10 | Aviso §3.3: e-mail — "mensagens da caixa conectada"                                 | Primeiro poll copia a caixa inteira, corpo + anexos, sem filtro (M26); anexos em BYTEA sem teto (M34)                             | Filtro por módulo antes de persistir; teto de tamanho; expurgo de anexos                                              |
| 3.11 | Aviso §9 / Suporte §5: "cópias diárias, 14 dias"                                    | Verdade — mas em texto claro, no mesmo host, sem cópia externa (M9)                                                               | Cifrar backup + cópia off-site                                                                                        |
| 3.12 | Aviso §4: "não usamos Dados do Cliente para treinar modelos"                        | Verdade (não há treino)                                                                                                           | —                                                                                                                     |
| 3.13 | Repositório                                                                         | DANFE real e planilha reidentificável no histórico git (M31)                                                                      | Reescrever histórico ou aceitar e registrar como incidente interno                                                    |

## 4. Como os textos se ligam

- `/politicas` é o índice (`LegalIndex`), no molde da central "Diretrizes e
  Políticas" que serviu de referência (ajuda.zdg.com.br).
- Termos ⇄ Aviso remetem um ao outro; ambos remetem a `/subprocessadores` e
  `/suporte`; Cookies remete ao Aviso. Trocar um slug exige atualizar os
  links inline `[texto](/rota)` nos conteúdos.
- Rodapés da home e das páginas de produto mostram `FOOTER_LEGAL_LINKS`
  (Políticas · Termos · Privacidade · Cookies); o rodapé das páginas legais
  mostra tudo.
- Datas: `originalAt` é a primeira publicação; `updatedAt` muda a cada
  revisão de conteúdo — e os textos prometem avisar clientes ativos com 30
  dias em mudanças relevantes.
