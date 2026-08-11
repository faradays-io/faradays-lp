# Briefing de copy & conteúdo — página `/importacoes`

Perguntas para fechar posicionamento, estrutura e texto da landing do produto de
importação da **Faradays** (site: faradays-lp, Next.js).

Este arquivo cobre os blocos **0 a 4** (posicionamento, público, hero, features
e prova social). Os blocos de voz/CTA/objeções e as pendências técnicas vivem em
`docs/importacoes-copy-briefing-parte2.md` e são decididos em sessão separada
com o autor — **não** os conduza a partir deste arquivo.

## Instruções para o agente (Claude Code)

Este documento é uma **entrevista guiada**. Se um usuário linkou este arquivo e
pediu para responder o briefing, conduza assim:

1. Leia antes, para ter o mesmo contexto de quem escreveu as perguntas:
    - `docs/features.md` — as 12 frentes de funcionalidades do produto real;
    - `src/app/importacoes/page.tsx` e os componentes que ela monta
      (`src/components/landing/`: `home-hero.tsx`, `home-features-data.ts`,
      `how-it-works.tsx`, `partners-section.tsx`, `testimonials-section.tsx`,
      `home-cta.tsx`, `home-footer.tsx`) — o estado atual da página;
    - `src/components/landing/solutions-data.ts` — como a rota aparece no
      índice da home ao lado de `/credito`, `/cobranca` e `/agentes`.
2. Faça as perguntas **na ordem dos blocos, um bloco por vez**, usando a
   ferramenta `AskUserQuestion` com as alternativas de cada pergunta como
   opções. Quando houver recomendação marcada, apresente essa opção primeiro
   com o sufixo "(Recomendado)". Até 4 perguntas do mesmo bloco podem ir numa
   única chamada.
3. `AskUserQuestion` aceita **no máximo 4 opções por pergunta**. Perguntas com
   mais alternativas (ex.: 0.1, 1.2) devem trazer as 3–4 mais fortes como
   opções (a recomendada incluída) e citar as demais na descrição — o usuário
   escolhe qualquer uma via "Other". A pergunta 3.1 (as 12 features) é
   especial: conduza em 2–3 rodadas `multiSelect` (ex.: "quais viram
   destaque?", "das restantes, quais entram na grade resumida?").
4. O usuário sempre pode responder por **texto livre** (opção "Other") — trate
   texto livre como resposta válida e siga em frente.
5. Registre cada resposta **neste arquivo**, na seção `## Respostas` ao final,
   no formato `- 0.1: b — comentário do usuário (se houver)`.
6. Perguntas dependentes (ex.: 0.2 só existe se 0.1 mudar a rota) podem ser
   puladas — registre como `n/a`.
7. Ao terminar todos os blocos, resuma as decisões e pergunte se o usuário quer
   que a reescrita da copy comece imediatamente.

### Contexto essencial (para quem não leu os arquivos ainda)

- **O produto**: dashboard de operações para distribuidoras/importadoras de
  insumos (cliente-âncora: Monfiza). Cobre cotação de venda com motor
  tributário, RFQ de compra automatizada, catálogo, carteira de clientes,
  pedidos/faturamento/crédito, estoque por lote, gestão de laudos (COA) e um
  assistente de IA no WhatsApp pelo qual os representantes operam o sistema.
  Princípio central: _entender é da IA; decidir e validar é do código_ — preço
  nunca é inventado, recusas explicam o motivo.
- **A página hoje** (ordem das seções): Hero (pill + headline + 2 CTAs + demo
  interativa de RFQ→PDF) → FeatureFigures (manifesto + 3 figuras isométricas)
  → HowItWorks (grafo de sistemas + showcase) → 4 features com scroll e
  gráfico sticky → Parceiros (logos) → Depoimentos (3 stats + 3 quotes com
  "Nome Sobrenome" placeholder) → CTA final → Footer.
- **Problemas conhecidos**: a headline atual é institucional (não diz o que o
  produto faz); o pill do hero e a sub ainda citam "IA de crédito" (rota
  desativada); os depoimentos são placeholders; os stats não têm fonte; a
  página conta só 4 das 12 frentes do produto.

Formato dos blocos abaixo: **o que já está na página**, a pergunta, as opções
e a recomendação de quem escreveu o briefing. O que não for respondido, assuma
a recomendação.

---

## 0. Bloco decisivo — o nome da rota

**Hoje:** `/importacoes`, título "Operação de importação", descrição
"Cotações, documentos e atendimento em um fluxo só — do ERP à decisão."
No índice da home ela aparece ao lado de `/credito`, `/cobranca`, `/agentes` —
ou seja, o nome da rota é lido em série com os outros e precisa responder à
mesma pergunta que eles: _"esse produto resolve o quê?"_.

**A tensão:** o produto descrito em `docs/features.md` não é sobre importar. É
um sistema de operação comercial completo — cotação de venda, RFQ de compra,
catálogo, carteira de clientes, pedidos, faturamento, crédito, estoque por
lote, laudos, WhatsApp com IA. "Importações" é o _setor do cliente-âncora_
(Monfiza, distribuição e importação de insumos), não a _função do software_.
Vender pelo setor dá relevância imediata com distribuidoras/importadoras e
fecha qualquer outro vertical; vender pela função abre o mercado e perde a
precisão do "isso é pra mim".

**Pergunta 0.1 — o eixo do nome.** A rota nomeia o _setor_, o _fluxo de
trabalho_ ou o _tipo de sistema_?

| #   | Rota                                  | Nome no índice                 | Lê como                                                           |
| --- | ------------------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| a   | `/importacoes` (manter)               | Operação de importação         | vertical: "somos o software de quem importa"                      |
| b   | `/distribuicao`                       | Operação de distribuição       | vertical mais largo (importador + distribuidor + trading)         |
| c   | `/comercial` ou `/operacao-comercial` | Operação comercial             | função: cotar, vender, cobrar, entregar                           |
| d   | `/cotacoes`                           | Cotações e propostas           | fluxo específico — o mais concreto e o mais estreito              |
| e   | `/erp` / `/operacao`                  | Camada de operação sobre o ERP | posicionamento por arquitetura ("a camada de IA sobre o seu ERP") |

**Recomendação: (b) `/distribuicao`**, se — e só se — a intenção é vender para
além da Monfiza no curto prazo. O produto inteiro (RFQ, tabela mensal, laudos,
carteira, estoque por lote) é o dia a dia de qualquer distribuidora de
insumos, importe ela ou não; e "importações" faz o visitante que distribui sem
importar se auto-excluir na primeira linha da home. Se a estratégia é ganhar
mais importadores parecidos com o cliente-âncora, **manter `/importacoes`** —
nome estreito converte melhor em nicho estreito. Descartar (c) e (e):
"operação comercial" e "camada sobre o ERP" são categorias que ninguém busca,
e ao lado de `/credito` e `/cobranca` ficam genéricas demais.

**Pergunta 0.2 — se mudar, o que fazer com a URL antiga?** _(pular se 0.1 = a)_

- (a) Redirect 301 `/importacoes → /nova-rota` — preserva links compartilhados _(recomendado)_
- (b) Troca seca — a URL antiga vira 404

**Pergunta 0.3 — a descrição de uma linha no índice da home.** Qual descreve
melhor o produto para quem nunca ouviu falar da Faradays?

- (a) atual: "Cotações, documentos e atendimento em um fluxo só — do ERP à decisão."
- (b) "Do pedido de cotação ao boleto pago — sua operação inteira num sistema com IA."
- (c) "O sistema que substitui as planilhas entre o seu ERP e o seu cliente." _(recomendado — nomeia o inimigo e o lugar do produto na arquitetura)_
- (d) outra (texto livre)

---

## 1. Público e momento da compra

**1.1 — Quem é o leitor número 1 da página?** A copy hoje oscila: o hero fala
com diretoria, as features com quem opera, e os depoimentos trazem três cargos
diferentes. Escolher um dono muda tudo.

- (a) Dono / diretor comercial da distribuidora — assina o contrato, sofre com margem e preço errado no WhatsApp _(recomendado como principal, com (b) secundário)_
- (b) Gerente de operações / supply — sofre com laudo vencido, retrabalho, ERP
- (c) Head de TI / inovação — avalia integração, segurança, MS 365, ERP
- (d) O representante em campo — usuário final do bot

**1.2 — Qual é o gatilho que faz essa empresa procurar solução hoje?**
_(múltipla escolha, até dois — a headline deveria falar exatamente disso)_

- (a) Errou preço/tributo numa cotação e perdeu margem
- (b) Documento vencido chegou ao cliente / travou um embarque
- (c) O time cresceu e as planilhas pararam de escalar
- (d) Representante demora horas para responder um cliente
- (e) A diretoria não enxerga a operação (dados espalhados em relatórios)

**1.3 — Porte-alvo?** Define se a página fala em "implantação em semanas" ou
"projeto com squad dedicado".

- (a) 5–20 representantes
- (b) 20–100 representantes
- (c) Enterprise
- (d) Não sei ainda / todos

**1.4 — Contra o que a Faradays compete de verdade na cabeça do cliente?**

- (a) Planilha + WhatsApp + e-mail (o status quo)
- (b) Um módulo do ERP que ele já paga (TOTVS, Sankhya, Senior…)
- (c) Consultoria/dev interno fazendo um sisteminha sob medida
- (d) Outro SaaS vertical

_Se (b), a página precisa de um bloco explícito "não substituímos seu ERP —
lemos ele"._

---

## 2. Promessa central (headline do hero)

**Hoje:** pill "Conheça a IA de crédito" (órfã — `/credito` foi desativada),
H1 "Inteligência artificial aplicada à sua operação", sub "Motores de decisão
e portais operacionais que transformam dados dispersos em ação — de crédito a
atendimento.", CTAs "Agende uma demo" + "Conhecer o produto".

**Diagnóstico:** essa headline é a headline da _empresa_, não a do _produto_ —
intercambiável com a de qualquer empresa de IA. A sub ainda cita crédito.

**2.1 — Qual promessa vai no H1?**

- (a) **Pelo fluxo:** "Da cotação ao boleto, sem planilha no meio."
- (b) **Pelo erro que acaba:** "Nunca mais um preço errado, um laudo vencido ou um cliente esperando resposta."
- (c) **Pelo tempo:** "Cotação formalizada em minutos — não em uma tarde."
- (d) **Pelo canal:** "Seu representante fecha a cotação pelo WhatsApp. O sistema faz o resto." _(recomendado — o diferencial mais demonstrável; (a) é a alternativa segura e ampla)_
- (e) manter a atual, ajustando a sub

**2.2 — O que substitui o pill de anúncio no topo do hero?**

- (a) Prova de cliente real, ex.: "Em produção na Monfiza desde 2025" _(recomendado — a linha mais persuasiva que a página pode ter)_
- (b) Notícia de produto, ex.: "Novo: agentes especialistas de IA"
- (c) Remover o pill

**2.3 — A demo interativa do hero** (arraste a planilha → comparativo de RFQ
em PDF): ela é a cena certa?

- (a) Manter a demo de RFQ
- (b) Trocar pela conversa de WhatsApp gerando cotação em PDF _(recomendado se 2.1 = d — hero e demo contam a mesma história)_
- (c) Trocar pela tabela mensal entrando por preview/aplicar
- (d) Trocar pela matriz de pendências de laudos

**2.4 — Adicionar um terceiro caminho de baixa fricção além dos 2 CTAs?**

- (a) Não — dois CTAs bastam
- (b) "Ver a demo de 2 min" (vídeo)
- (c) "Baixar o mapa de funcionalidades" (PDF, captura e-mail)

---

## 3. As features (o miolo da página)

**Hoje** a página conta **4** features (Cotações · Documentos · Atendimento ·
Visão, em `home-features-data.ts`). O produto tem **12 frentes** em
`docs/features.md`. Abaixo, as 12 agrupadas — o usuário escolhe o que **entra
como feature de destaque**, o que vai para uma **grade resumida "e mais"**, e
o que **fica de fora** da página.

**3.1 — Para cada frente, escolha: destaque / grade resumida / fora.**
_(conduza em rodadas multiSelect; as cinco primeiras já têm presença na página
hoje)_

**Já na página (confirmar ou rebaixar):**

1. **Assistente de WhatsApp (IA-first)** — o rep opera o sistema por conversa; cotação em PDF direto no chat; IA nunca inventa preço. _(hoje: feature "Atendimento")_
2. **Cotação de venda** — multi-item, PDF no modelo Excel do próprio cliente, motor tributário ICMS×UF, PTAX congelada. _(hoje: feature "Cotações", junto com a 3)_
3. **Cotação de compra (RFQ automatizada)** — disparo automático a fornecedores, resposta interpretada por parser+IA, vencedora por item, contra-oferta automática.
4. **Gestão de documentos e laudos (COA)** — matriz de pendências, validade lida por IA, radar diário de vencimento. _(hoje: feature "Documentos")_
5. **Pedidos, faturamento e crédito** — imports do ERP, posição de crédito, consultas de vendas no bot. _(hoje: parte da feature "Visão")_

**Fora da página hoje (incluir?):**

6. **Catálogo de produtos e fornecedores** — catálogo-mestre como fonte da verdade, tabela de preços mensal por upload com preview/aplicar, histórico de preços.
7. **Clientes e carteira** — CNPJ como identidade, fronteira representante×cliente, sonda de prospecção ("esse CNPJ é atendido?").
8. **Estoque por lote** — snapshot do ERP, consulta por vencimento no bot, marca vencido/avaria.
9. **Integração SharePoint/OneDrive** — pasta vinculada vira espelho no dashboard, backfill automático, somente leitura no drive.
10. **E-mail e automações (MS Graph)** — caixas compartilhadas do 365, canal da esteira de RFQ.
11. **Home ao vivo e notificações** — quadro vivo dos representantes, WebSocket sem refresh.
12. **Plataforma e operação** — login social/RBAC, auditoria, imports padrão preview→aplicar, erros em pt-BR.

_Recomendação: destaque = 1, 2, 3, 4 (WhatsApp vira a feature de abertura;
RFQ ganha lugar próprio — hoje a página conta a venda e omite a compra, onde
está a margem); grade resumida = 5, 6, 7, 8, 11; fora (ou só numa futura
página técnica/FAQ) = 9, 10, 12, que são infraestrutura, não benefício._

**3.2 — Cada feature de destaque deve carregar um número?** ("−70% no tempo
por análise" existe hoje, mas solto na seção de depoimentos.)

- (a) Sim — e temos números reais e autorizados (informar quais: tempo de cotação, cotações/dia, docs vencidos evitados, tempo de resposta do rep)
- (b) Sim, mas só os defensáveis com fonte citada
- (c) Não — features sem números

**3.3 — Nível de detalhe técnico da copy das features?**

- (a) Copy de negócio, jargão zero
- (b) Copy de negócio + uma linha técnica em mono por feature (ex.: "ICMS por UF × regime · PTAX congelada na 1ª emissão") _(recomendado — o padrão visual do site já sugere isso e o comprador é do ramo)_
- (c) Técnico assumido

---

## 4. Prova social

**Hoje:** três depoimentos com **"Nome Sobrenome"** (placeholder) e três stats
(−70%, 3×, 100%) sem fonte. É o maior risco de credibilidade da página: um
visitante atento percebe o placeholder e passa a duvidar dos números também.

**4.1 — O que fazer com a seção de depoimentos?**

- (a) **Retirar** a seção e substituir por um bloco factual ("Em produção desde X, N representantes, N cotações emitidas") ou mini-case da Monfiza _(recomendado enquanto não houver depoimento real)_
- (b) **Adicionar depoimentos verdadeiros** — o usuário fornece nome, cargo, empresa e autorização (informar quantos e de quem)
- (c) **Manter mockados** — assumindo o risco, trocando "Nome Sobrenome" por identificação anônima plausível ("Gerente de operações, distribuidora de insumos — SP")

**4.2 — Os três números (−70%, 3×, 100%) vêm de medição real?**

- (a) Sim — citar a fonte na página ("medido na operação da Monfiza, jan–jun/26")
- (b) Sim, mas sem poder citar o cliente — manter genérico
- (c) Não / não sei — remover ou substituir por fatos verificáveis

**4.3 — Os logos de "parceiros"** hoje misturam ferramentas (Gmail, Microsoft,
Outlook, Excel) com clientes (Monfiza, Aventis) — duas provas diferentes na
mesma faixa.

- (a) Separar em "Integra com" e "Quem usa" _(recomendado; se a lista de clientes for curta, virar uma frase)_
- (b) Manter junto
- (c) Deixar só as integrações

**4.4 — Temos permissão de uso de marca dos clientes citados?**

- (a) Sim, de todos
- (b) Parcial (informar quais)
- (c) Ainda não — não expor logo/nome de cliente

---

## Respostas

_(o agente registra aqui, no formato `- 0.1: b — comentário`)_
