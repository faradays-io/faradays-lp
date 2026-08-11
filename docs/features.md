# Monfiza Dashboard — Principais Funcionalidades

Dashboard interno de operações da Monfiza (distribuição e importação de insumos): cotações de venda e compra, catálogo de produtos, carteira de clientes, documentos regulatórios e um assistente de IA no WhatsApp para os representantes. Backend modular em FastAPI + PostgreSQL, frontend Next.js, integrações com Microsoft 365 (e-mail e SharePoint via MS Graph), WhatsApp (Meta Cloud API) e IA via OpenRouter.

> Atualizado em 11/08/2026. Visão de produto — detalhes técnicos em `docs/modules.md`, `docs/whatsapp-cotacao.md` e `docs/ia-arquitetura.md`.

---

## 1. Assistente de WhatsApp para representantes (IA-first)

O coração do produto: cada representante conversa com um bot no WhatsApp que entende linguagem natural (texto, **áudio e foto** — mídia vira texto antes de qualquer decisão) e opera o sistema por ele.

- **Cotação por conversa**: o rep descreve o pedido ("2 ton de creatina pra Nestlé SP"), a IA coleta o que falta numa pergunta consolidada e gera a **cotação formalizada em PDF** direto na conversa.
- **Menu de opções** (list message com 10 itens) como ferramenta sob demanda — consultas de preço, estoque, pedidos, notas fiscais, boletos, vendas e atendimento.
- **Entender é da IA; decidir e validar é do código**: todo palpite da IA passa por validadores determinísticos. Preço em dólar só sai de ferramenta (nunca inventado), a IA nunca escolhe marca/variante sozinha (2+ candidatos viram pergunta), quantidade é convertida pelo sistema (unidade canônica: kg) e recusas sempre explicam o motivo.
- **Fronteira de carteira**: rep comum só vê clientes, cotações, pedidos, NFs e boletos da própria carteira; gestor vê tudo. Escrita para cliente alheio é recusada com o motivo.
- **Painel de conversas** na plataforma: histórico por representante, envio manual, indicador de digitação, deep-links para as cotações geradas e seletor do modelo de IA do bot.
- **Motor de workflows** com canvas visual: fluxos guiados (agendado/manual) com sub-workflows, timers e portas de decisão; espera padrão de 10 min com aviso antes de expirar.
- **Agentes especialistas de IA** *(em desenvolvimento)*: personas nomeadas (papel, prompt, modelo, recorte de ferramentas, blocos de conhecimento) acionáveis por nós do workflow — sem nunca afrouxar as guardas nem ampliar a permissão do representante.

## 2. Cotação de Venda

- **Cotação multi-item** com número sequencial (COT-V-NNNN), vínculo a cliente cadastrado, status e busca por produto contido.
- **PDF = o próprio modelo Excel do cliente**: o sistema preenche o "MODELO COTAÇÃO MONFIZA" real (xlsx) e converte para PDF via LibreOffice — cores, layout e fórmulas (já calculadas) idênticos ao documento que o cliente sempre usou. O modelo pode ser **atualizado por upload** na própria plataforma, com validação na entrada.
- **Motor de precificação tributária**: ICMS por UF × regime do produto (IMP, IMP-CAMEX, IMP-RE), redução de PIS/COFINS por produto, IPI, PTAX do dia com **snapshot congelado na 1ª emissão** (reemitir não muda valores).
- **Tabela de preços mensal por upload**: o arquivo NET-USD que o cliente publica todo mês entra por preview/aplicar — atualiza preços, marca, NCM, tributação e disponibilidade, **reativa/inativa produtos** (a tabela do mês é a linha comercial) com proteção contra upload parcial, e é re-exportável no layout original.
- **Histórico de preços** append-only por produto (gráfico), alimentado por qualquer caminho que altere o preço (import, painel, WhatsApp).
- **Exportação Excel** da carteira de cotações (uma linha por item).

## 3. Cotação de Compra (RFQ automatizada)

- **Bid multi-item em esteira automática**: o disparo resolve os fornecedores pelo mapeamento fornecedor×produto (nunca envia item que o fornecedor não cota) e envia por **e-mail e/ou WhatsApp**.
- E-mail leva **planilha xlsx anexa** e token `[RFQ-XXXXXX]` no assunto; a resposta do fornecedor é casada pelo token e **interpretada automaticamente** (parser determinístico da planilha → IA como fallback → rascunho para revisão humana).
- **Vencedora por item** (não por envelope), com toggle exclusivo.
- **Contra-oferta automática** aos perdedores no fechamento (% configurável por item, sem nunca expor o preço vencedor), templates em pt/en.
- Automação configurável num card único (auto-confirmação, canais, contra-oferta).

## 4. Catálogo de Produtos e Fornecedores

- **Catálogo-mestre do cliente como fonte da verdade** (tributação, NCM, embalagem, fabricante, preço NET), sincronizado por seeds idempotentes.
- **Marca é parte da identidade**: o mesmo nome em duas marcas são dois produtos, cada um com seu preço vigente.
- **Ativo/inativo = interruptor comercial**: produto fora de linha continua no cadastro (preço, histórico, documentos) mas sai da vista padrão, é recusado em cotação nova com explicação, e é ligado/desligado pelos imports de substituição completa ou pelo switch manual.
- **Import de portfólio** com a mesma semântica (preview/aplicar, detecção automática do layout — a tabela do mês subida na página errada é delegada ao interpretador certo).
- **Fornecedores com identidade fabricante × procedência** (dois SASOL, EUA e Europa, são dois cadastros), repovoados a partir do modelo oficial do cliente.

## 5. Clientes e Carteira

- Cadastro de primeira classe com **CNPJ como identidade** (unique), múltiplas UFs de destino e múltiplos contatos (a coleta do bot pergunta em vez de assumir quando há mais de um).
- **Carteira representante × cliente**: um dono por cliente; toda consulta e escrita do bot respeita a fronteira. Auto-cadastro pelo WhatsApp herda o rep da conversa e nasce marcado "incompleto" para o admin revisar.
- **Import diário do relatório de clientes do ERP** (espelho: código, cidade, datas, vendedor, bloqueio, **limite de crédito**), adotando cadastros criados pelo bot em vez de duplicar e sem sobrescrever o que o admin ajustou.
- **Sonda de prospecção** no bot: "esse CNPJ é atendido?" responde livre / já é seu / já atendido — **sem revelar por quem** (só o gestor vê o dono); CNPJ novo de nome conhecido sugere que é filial.

## 6. Pedidos, Faturamento e Crédito

- **Imports dos relatórios reais do ERP no grão de item** (pedidos: uma linha por item; vendas: uma linha por item de NF com devolução abatendo), idempotentes e com prévia explicando toda linha ignorada.
- **Consultas agrupadas no bot**: pedido com N itens sai como um bloco só, com status humanizado ("Reservado, esperando aprovação financeira") e total.
- **Posição de crédito com uma aritmética só**: limite (do ERP) − boletos em aberto = disponível; rep e gestor veem os mesmos números.
- **"Me manda o a receber em Excel"**: o bot monta e envia o xlsx dos títulos em aberto como documento na conversa.
- **Consultas de vendas** para o rep (histórico do cliente, quem compra o produto, ranking da carteira, faturamento do mês com projeção, últimos preços praticados em NET-USD) — sempre dentro da carteira.

## 7. Estoque por lote

- Import do relatório de estoque como **snapshot** (o arquivo é o estoque inteiro do instante — lote consumido some).
- Consulta no bot lote a lote: ordenado por vencimento, marca `⚠️ VENCIDO`, separa avaria ("fora de venda") e distingue "sem saldo" de "não encontrei". Única consulta sem fronteira de carteira — estoque é físico, não dado de cliente.

## 8. Gestão de Documentos e Laudos (COA)

- Catálogo de **tipos de documento com obrigatoriedade e regra de validade**, importado da lista oficial do cliente (preview/aplicar/modelo com round-trip).
- **Matriz de pendências calculada**: (produtos ativos × tipos obrigatórios) + (fornecedores × tipos de fabricante) — a ausência vira status `faltante` e o Excel exportado é a lista de cobrança.
- **IA na ingestão**: documento que chega do drive é classificado automaticamente (tipo, produto/fornecedor, datas — só campos vazios; na dúvida fica pendente para humano).
- **Validade lida por IA + carimbo no drive**: job diário extrai a validade (PDF digital ou escaneado) e **renomeia o arquivo no SharePoint** com sufixo `— VAL DD.MM.AAAA`.
- **Exemplo por tipo**: sobe-se um documento-modelo para orientar a classificação da IA.
- Radar diário de vencimentos com notificações (ok / a vencer / vencido).

## 9. Integração SharePoint / OneDrive (espelho)

- **Vincular pasta = espelho do drive para o dashboard**: criar/editar/excluir no drive reflete no sistema (delta a cada 2 min), com **importação do acervo existente** no vínculo (backfill automático).
- **Várias pastas por módulo**, cada vínculo com telemetria e switch próprios; import manual respeita o escopo da pasta vinculada.
- **Somente leitura no drive** por decisão (única exceção: o carimbo de validade) — excluir no dash nunca apaga o arquivo de ninguém.
- **"Compartilhados comigo"**: pastas que terceiros compartilham com a conta conectada podem ser **importadas** (fotografia recursiva) ou **vinculadas como espelho** (delta escopado próprio, com aviso quando o compartilhamento é revogado).
- Navegador de drive integrado (browse ao vivo, FolderPicker — impossível vincular pasta inexistente).

## 10. E-mail e automações (MS Graph)

- Envio e recepção por **caixas compartilhadas** do Microsoft 365, com OAuth de conexão restrito a admin.
- É o canal da esteira de RFQ (disparo com anexo, casamento da resposta por token) e dos disparos de atualização de preço.

## 11. Home ao vivo e notificações

- A home é um **quadro vivo dos representantes**: uma linha por rep com a última mensagem, direção, badges (gestor, IA pendente, falha de envio) e tempo relativo — clique abre a conversa. *"Você vê na hora se o cara tá fazendo uma cagada."*
- **Notificações em tempo real por WebSocket** atualizam as páginas abertas (conversas, cotações, documentos) sem refresh manual.

## 12. Plataforma e operação

- **Login social** (Google/Microsoft) via Keycloak com tema próprio; RBAC por grupos (admin/gestor/rep) na borda (Caddy forward-auth), com `/api/health` público para monitoramento.
- **Monitor de créditos do OpenRouter** em Sistema (saldo, uso da chave, free tier) com **alerta diário** abaixo de US$ 5.
- Erros de integridade viram **409 com mensagem em pt-BR** (nunca 500 cru); auditoria, tarefas agendadas (APScheduler) e reprocessamento de arquivos em Sistema → Arquivos.
- Imports em todo o produto seguem o mesmo padrão: **preview → aplicar**, com modelo re-importável, drag-and-drop e prévia dizendo exatamente o que muda.
