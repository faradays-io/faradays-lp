# Legendas do Showcase Faradays

## Contexto

**O que é.** Um showcase de ~75 segundos da plataforma Faradays, em HTML animado (roda sozinho, sem arquivo de vídeo). A versão que vale é o `index.html` desta branch (`showcase-video` da LP); existe também uma prancha editável em <https://claude.ai/code/artifact/635fdcc2-1102-4e7a-99a4-075da06f4758>. Estilo dos vídeos de apresentação do Claude: cartelas de título grandes, cortes casados, zoom em componentes. Fundo igual ao da LP — `#f8f8f8` com o film grain dinâmico do `GrainOverlay` (feTurbulence 0.25, opacidade .12, `grain-jump`), títulos e legendas em tinta escura; pensado para celular na horizontal (na vertical aparece a instrução de girar). O app reproduzido pixel a pixel (tokens do `globals.css`, Geist/Aspekta/JetBrains Mono, ícones Phosphor).

**Roteiro atual.**

| Tempo | Capítulo | O que acontece |
|---|---|---|
| 0:00 | Abertura | dica animada sozinha (3 s): anel de setas finas e um celular indo para a horizontal; depois a cartela-pergunta: "Ainda" grande e centralizado → "gerenciando" digitada estourando a tela → zoom out revela "Ainda gerenciando manualmente" com mocks animados ao fundo (balões de WhatsApp, e-mail, documentos) → sobe "documentos, cotações e conversas?" → saída em dolly 3D para dentro do texto (mocks fogem para os cantos mais rápido) → "Conheça" → logo Faradays |
| 0:06 | 1 · Documentos | cartela com o ícone do SharePoint; a câmera fecha no painel do drive enquanto ele entra; **sem clique**: os três arquivos novos passam de "sincronizando…" a "sincronizado · agora" (linha em destaque, badge do painel acompanha); com a pilha já voando para a tabela, **corte seco para a vista inteira**; a IA lê a validade (zoom nos status); corte seco para a aba Pastas |
| 0:23 | 2 · BID | lista de BIDs → modal → Disparar BID (4) → envelopes → **vista dividida** com a legenda "Caixa de e-mail do fornecedor" em cima do Outlook (pill *fornecedor* na barra): o e-mail chega na lista, o painel de leitura abre um instante depois e a resposta é digitada com calma e responde com preço → o e-mail voa de volta → corte seco para o Comparativo já em zoom, com a linha da ANHUI chegando "lendo e-mail…" → ao preencher, a linha acende (azul, barra à esquerda) → a IA sugere (ponto piscante) → clique na linha → Fechar cotação |
| 0:50 | 3 · Conversas | **só o celular do representante**, centralizado e ampliado: ele pede o COA → "digitando…" → a IA responde sozinha com o arquivo (rótulo *Agente IA · resposta automática* no balão) → ele pergunta o preço → a IA pergunta a marca → emite a cotação. Legendas grandes à esquerda marcam cada beat. No fim o celular vai para a direita, o sistema entra ao lado com a conversa inteira ("E toda a conversa fica registrada no sistema") e a câmera fecha na conversa |
| 1:10 | Fechamento | logo + barra de busca onde `www.faradays.io` é digitado (sem botões — o vídeo recomeça sozinho) |

**Decisões já tomadas** (não precisa repetir, só desfazer se quiser): sem espiral de Fibonacci; cartelas só com o título, palavras subindo; cartela ↔ demo em fade; match cut seco (sem fade, corta no meio do movimento) só em tabela → Pastas e disparo → comparativo; sem toasts e sem cards-eco; balões do sistema em azul `#0065e0` com texto branco; IA sugere o fornecedor por badge + ponto piscante, o usuário clica; nada de Monfiza — tudo Faradays. No cap. 3 ninguém do time digita: o COA também sai da IA (saiu o diálogo de anexo/arraste do SharePoint) e o sistema só aparece no fim, com a conversa já registrada. Dados são mock (preços, datas, nomes de representantes). Mascote pixelado numa prancha ao lado, fora do vídeo.

**Como usar este arquivo.** Cada linha tem **Ação** (`manter` · `remover` · `trocar`), **Novo** (o texto que entra quando a ação for `trocar`) e, onde faz sentido, **Alternativas** que já deixei prontas — pode copiar uma para Novo ou escrever a sua. As seções "Adicionar" listam coisas que hoje **não existem** no vídeo: marque `[x]` no que quiser que eu inclua. Devolva o arquivo (commit nesta branch ou cole no chat) e eu aplico e regenero o `index.html`.

---

## Adicionar · legendas narradas (hoje o vídeo não tem nenhuma)

Uma linha curta na base da tela, aparecendo e sumindo com a cena. Marque as que entram; edite o texto à vontade.

| Entra | Tempo | Cena | Legenda sugerida | Alternativa |
|---|---|---|---|---|
| [ ] | 0:07 | painel do SharePoint entra | Arraste do SharePoint. O sistema lê tipo, produto e validade. | Seus certificados, direto do drive. |
| [ ] | 0:13 | zoom nos status | Validade lida pela IA — sem digitar nada. | Sem data? A IA acha no PDF. |
| [ ] | 0:17 | aba Pastas | As pastas do drive, espelhadas no sistema. | A mesma árvore do SharePoint, com status. |
| [ ] | 0:25 | modal de disparo | Um BID para todos os exportadores mapeados. | Só quem exporta o produto recebe. |
| [ ] | 0:28 | envelopes voando | E-mail e WhatsApp, num clique. | Quatro exportadores, um disparo. |
| [ ] | 0:30 | e-mail do exportador recebe o BID | O exportador recebe o BID na caixa dele — e responde ali mesmo. | Sem portal, sem formulário: ele responde o e-mail. |
| [ ] | 0:36 | resposta volta ao sistema | A resposta volta sozinha para o comparativo. | A IA lê o e-mail e preenche o comparativo. |
| [ ] | 0:39 | comparativo em zoom | Respostas lidas pela IA, comparadas na mesma base FOB. | /KG e /MT nunca se misturam. |
| [ ] | 0:41 | sugestão da IA | A IA aponta a melhor oferta. Você decide. | Sugestão da IA; a escolha é sua. |
| [ ] | 0:45 | fechar cotação | Fechou. As contra-ofertas saem sozinhas. | Cotação fechada, contra-ofertas enviadas. |
| [ ] | 0:52 | celular do representante ao lado | O que ele manda no WhatsApp chega no sistema na hora. | Uma conversa, dois lados. |
| [ ] | 0:57 | arquivo arrastado para o chat | O representante pede; você manda do SharePoint. | Documento no WhatsApp em um arraste. |
| [ ] | 1:02 | IA responde no chat | A IA responde no WhatsApp e emite a cotação. | O representante pergunta, a IA cota. |

## Adicionar · outros elementos possíveis

| Entra | Elemento | Como ficaria |
|---|---|---|
| [ ] | Linha de apoio sob o logo na abertura | ex.: "Documentos, BID e WhatsApp em um só lugar." (saiu numa rodada anterior — volta só se marcar) |
| [ ] | Numeração nas cartelas | overline pequeno acima do título, ex.: "01 · Qualidade" (também saiu antes) |
| [ ] | Mascote na abertura/fechamento | o pet pixelado ao lado do logo, em idle |
| [x] | Chamada final | barra de busca digitando `www.faradays.io` (já no vídeo) |
| [ ] | Contador de tempo/capítulo no canto | discreto, mono, para orientar quem assiste |

---

## Cartelas de capítulo

| id | Ação | Atual | Novo | Alternativas |
|---|---|---|---|---|
| cartela.1 | manter | Documentos direto do SharePoint | | Do SharePoint para o sistema, sem digitar · Seus documentos, lidos pela IA |
| cartela.2 | trocado | BID em um disparo | Cotação em um clique | Um BID, todos os exportadores · Cote com todos de uma vez |
| cartela.3 | manter | Conversas com IA | | O representante pergunta, a IA cota · WhatsApp com um agente do seu lado |

## Abertura e fechamento

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| geral.logo | manter | abertura e fechamento | logo Faradays (sem texto) | |
| geral.pergunta.l1 | manter | cartela-pergunta, linha 1 | Ainda gerenciando manualmente | |
| geral.pergunta.l2 | manter | cartela-pergunta, linha 2 | documentos, cotações e conversas? | |
| geral.conheca | manter | cartela após a pergunta | Conheça | |
| geral.mocks | manter | fundo da cartela-pergunta | balão "Consegue me mandar o COA do lote 2408?" · balão IA "Segue o COA do lote 2408:" · e-mail Faradays BID CC-2026-012 · página A4 do COA (Certificate of Analysis, tabela e carimbo QC APROVADO) · COA CREATINA 200 MESH.pdf (Vigente) · HALAL ÁCIDO ASCÓRBICO.pdf (A vencer) · KOSHER (Vencido) · FDA (Vigente) · MSDS (SEM DATA) · Cert. Origem (Vigente) · certificado Halal menor na borda esquerda · pasta Certificados · 46 arquivos · planilha Cotações — setembro.xlsx · pill "BID enviado a 4 exportadores" · balão digitando · mãozinha perdida vagando |
| geral.url | manter | barra de busca no fechamento | www.faradays.io | |

## Casca do app (aparece nos três capítulos)

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| nav.inicio | manter | menu | Início · Visão Geral | |
| nav.whatsapp | manter | menu | WhatsApp · Conversas · Workflows · Agentes de IA | |
| nav.compras | manter | menu | Compras · BID (Cotação de Compra) | |
| nav.vendas | manter | menu | Vendas · Cotação de Venda · Tabela de Preços | |
| nav.qualidade | manter | menu | Qualidade · Documentos · Tipos de Documento | |
| nav.cadastros | manter | menu | Cadastros · Produtos · Exportadores · Clientes · Fabricantes · Modelo de Cotação | |
| nav.sistema | manter | menu | Sistema | |
| header.usuario | manter | canto superior direito | Gestor | |
| crumb.1 | manter | breadcrumb cap. 1 | Qualidade / Documentos | |
| crumb.2 | manter | breadcrumb cap. 2 | Compras / BID (Cotação de Compra) | |
| crumb.3 | manter | breadcrumb cap. 3 | WhatsApp / Conversas | |

## 1 · Documentos

### Página

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| docs.botoes | manter | barra de ações | Tipos de Documento · Renomeação automática · Procurar no drive · Configurar drive · Cobrança · Novo Documento | |
| docs.pills | manter | abas | Documentos · Pendências · Por exportador · Pastas | |
| docs.busca | manter | placeholder | Buscar por produto, tipo ou marca… | |
| docs.filtro | manter | botão | Status: todos | |
| docs.colunas | manter | cabeçalho da tabela | Tipo de documento · Produto / Fornecedor · Marca · Mandatório · Validade · Status · Arquivo | |

### Linhas da tabela (Tipo · Produto · Marca · Mandatório · Validade · Status)

| id | Ação | Atual | Novo |
|---|---|---|---|
| docs.l1 | manter | COA · CREATINA 200 MESH · Creapure · Sim · 12/03/2027 · Vigente | |
| docs.l2 | manter | Halal · ÁCIDO ASCÓRBICO · LUWEI · Sim · 15/09/2026 · A vencer | |
| docs.l3 | manter | Kosher · CREATINA 200 MESH · Creapure · Sim · 30/06/2026 · Vencido | |
| docs.l4 | manter | ISO 9001 · SUCRALOSE · ANHUI JINHE · Não · 02/11/2027 · Vigente | |
| docs.l5 | manter | FDA · ACESSULFAME K · VITASWEET · Sim · 20/01/2027 · Vigente | |
| docs.l6 | manter | MSDS · STPP · CHENGXIN · Não · — · N/A | |
| docs.l7 | manter | Certificado de Origem · INOSITOL · TJCY · Sim · 08/05/2027 · Vigente | |
| docs.l8 (chega do SharePoint) | manter | GMP · SUCRALOSE · ANHUI JINHE · Sim · 14/02/2028 · Vigente | |
| docs.l9 (chega do SharePoint) | manter | Halal · ÁLCOOL CETOESTEARÍLICO 30/70 · P&G · Sim · 30/09/2027 · Vigente | |
| docs.l10 (chega do SharePoint) | manter | COA · ACESSULFAME K · VITASWEET · Sim · 05/08/2027 · Vigente | |
| docs.lendo | manter | lendo… · SEM DATA (estado enquanto a IA lê) | |

### Painel do SharePoint

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| sp.titulo | manter | cabeçalho | SharePoint | | |
| sp.subtitulo | manter | cabeçalho | Qualidade · Documentos | | Faradays Qualidade |
| sp.badge | manter | cabeçalho | sincronizando 3 → sincronizado | | conectado |
| sp.caminho | manter | trilha | Documentos › Novos · 6 arquivos | | Certificados › Recebidos · 6 arquivos |
| sp.a1 (sincroniza) | manter | | GMP SUCRALOSE — ANHUI JINHE.pdf · PDF · 1,2 MB · hoje | | |
| sp.a2 (sincroniza) | manter | | HALAL ÁLCOOL CETOESTEARÍLICO 30-70.pdf · PDF · 640 KB · hoje | | |
| sp.a3 (sincroniza) | manter | | COA ACESSULFAME K — lote 2408.pdf · PDF · 198 KB · ontem | | |
| sp.status | manter | linha de meta das três, durante a sincronização | sincronizando… → sincronizado · agora | | enviando ao sistema… → no sistema |
| sp.a4 | manter | | ISO 9001 VITASWEET — 2026.pdf · PDF · 880 KB · há 3 dias | | |
| sp.a5 | manter | | FDA REGISTRATION — ENSIGN.pdf · PDF · 310 KB · há 1 sem | | |
| sp.a6 | manter | | MSDS INOSITOL — TJCY.pdf · PDF · 452 KB · há 2 sem | | |
| sp.rodape | manter | rodapé | Sincronização automática — a IA lê tipo, produto e validade de cada arquivo novo. | | Novos arquivos entram sozinhos no sistema. · Sem upload: o drive já é o sistema. |

### Aba Pastas (árvore)

| id | Ação | Atual | Novo |
|---|---|---|---|
| pastas.botoes | manter | Expandir tudo · Recolher tudo | |
| pastas.raiz | manter | Faradays Qualidade · 124 documentos | |
| pastas.n1 | manter | Certificados · 46 | |
| pastas.n1a | manter | COA · 18 → COA CREATINA 200 MESH — lote 2408.pdf (Vigente) · COA ACESSULFAME K — lote 2407.pdf (Vigente) · COA SUCRALOSE — lote 2406.pdf (Vigente) | |
| pastas.n1b | manter | Halal · 9 → HALAL ÁCIDO ASCÓRBICO — LUWEI — VAL 15.09.2026.pdf (A vencer) · HALAL ÁLCOOL CETOESTEARÍLICO 30-70 — VAL 30.09.2027.pdf (Vigente) | |
| pastas.n1c | manter | Kosher · 7 · ISO · 12 | |
| pastas.n2 | manter | Regulatório · 31 → FDA · 11 · GMP · 8 · MSDS · 12 | |
| pastas.n3 | manter | Laudos · 47 | |

## 2 · BID

### Lista

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| bid.botoes | manter | barra de ações | Exportar Excel · Caixa de e-mail · Automação · Premissas · Nova cotação | |
| bid.busca | manter | placeholder | Buscar por nº ou produto… | |
| bid.pills | manter | filtros | Todas · Abertas · Fechadas | |
| bid.colunas | manter | cabeçalho | Data · Nº · Produtos cotados · Respostas | |
| bid.l1 (a que abre) | manter | | 28/08/2026 · CC-2026-012 · aberta · CREATINA 200 MESH +2 · nenhum envio | |
| bid.l2 | manter | | 21/08/2026 · CC-2026-011 · respondida · SUCRALOSE +1 · 3 de 5 envios | |
| bid.l3 | manter | | 14/08/2026 · CC-2026-010 · fechada · ÁCIDO ASCÓRBICO · 4 de 4 envios | |
| bid.l4 | manter | | 05/08/2026 · CC-2026-009 · fechada · INOSITOL +3 · 5 de 6 envios | |
| bid.l5 | manter | | 29/07/2026 · CC-2026-008 · fechada · ACESSULFAME K +1 · 3 de 3 envios | |
| bid.l6 | manter | | 22/07/2026 · CC-2026-007 · cancelada · STPP · 2 de 4 envios | |

### Modal — cabeçalho e aba Disparar BID

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| modal.titulo | manter | título | CC-2026-012 · aberta | | |
| modal.subtitulo | manter | linha abaixo | 3 itens · aberta em 28/08/2026 · 4 exportadores no mapeamento | | |
| modal.abas | manter | pills | Comparativo · Disparar BID | | |
| disp.destinatarios | manter | rótulo | Destinatários | | |
| disp.switch | manter | switch | Disparar para todos | | |
| disp.filtro | manter | pills | Todos 10 · No mapeamento 4 · Fora do mapeamento 6 | | |
| disp.e1 | manter | | ANHUI JINHE FOOD (sales@… · +86 …) · todos os itens | | |
| disp.e2 | manter | | VITASWEET CO. (export@… · +86 …) · 2 de 3 itens | | |
| disp.e3 | manter | | ENSIGN INDUSTRY (bid@…) · todos os itens | | |
| disp.e4 | manter | | CHENGXIN CHEMICAL (trade@… · +86 …) · 1 de 3 itens | | |
| disp.acoes | manter | | Selecionar todos · Limpar · 4 selecionados · e-mail e WhatsApp | | |
| disp.mensagem | manter | rótulo · idioma | Mensagem · EN (ativo) · PT | | |
| disp.assunto | manter | e-mail | Assunto: BID CC-2026-012 — Faradays — 3 items | | |
| disp.corpo1 | manter | e-mail (EN, o exportador lê) | Dear supplier, please find below our BID for FOB/CFR quotation. | | Dear supplier, we kindly request your FOB/CFR quotation for the items below. |
| disp.itens | manter | e-mail | CREATINE 200 MESH · 15000 KG (Container 1) / SUCRALOSE · 5000 KG (Container 1) / ACESULFAME K · 3000 KG (Container 2) | | |
| disp.corpo2 | manter | e-mail | Please reply in this thread with price, incoterm and payment terms. | | Kindly reply in this thread with price, incoterm and payment terms. |
| disp.aviso | manter | rodapé do e-mail | Automated message, read by AI — reply with price and commercial terms only. | | This message is read by AI: please reply with price and commercial terms only. |
| disp.botoes | manter | rodapé | Cancelar · Disparar BID (4) | | |

### Caixa de e-mail do exportador (vista dividida, à direita do sistema)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| mail.header | manter | barra | Outlook · ANHUI JINHE FOOD · *fornecedor* · Inbox | | |
| mail.leg.fornecedor | manter | legenda acima do e-mail (vista dividida) | Caixa de e-mail do fornecedor — O exportador recebe o BID na caixa dele e responde ali mesmo. | | O fornecedor responde no e-mail dele, sem portal. |
| mail.lista | manter | rótulo da lista | Today | | |
| mail.novo (chega) | manter | 1ª linha da lista | Faradays · BID CC-2026-012 — 3 items · 09:12 · Dear supplier, please find below our BID for FOB/CFR quotation… | | |
| mail.l2 | manter | lista | COSCO Shipping · Booking confirmation — Qingdao/Santos · 08:40 | | |
| mail.l3 | manter | lista | Customs broker · Documents for B/L draft · Yesterday | | |
| mail.l4 | manter | lista | Faradays · BID CC-2026-009 — closed · Yesterday | | |
| mail.assunto | manter | painel de leitura | BID CC-2026-012 — Faradays — 3 items | | |
| mail.de | manter | painel de leitura | Faradays · to: sales@… · today 09:12 | | |
| mail.corpo | manter | painel de leitura | (o mesmo texto de disp.corpo1 / disp.itens / disp.corpo2 / disp.aviso) | | |
| mail.resposta | manter | rótulo da resposta | Reply · Faradays | | |
| mail.r1 | manter | resposta (digitada) | Dear Faradays team, | | Hello Faradays team, |
| mail.r2 | manter | resposta | CREATINE 200 MESH — USD 4.85/KG FOB Qingdao | | |
| mail.r3 | manter | resposta | SUCRALOSE — USD 38.40/KG FOB Qingdao | | |
| mail.r4 | manter | resposta | Payment T/T 90 days · price validity 15 days | | Payment terms T/T 90 days; prices valid for 15 days. |
| mail.enviar | manter | botão | Send | | |

### Modal — aba Comparativo

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| cmp.colunas | manter | cabeçalho | Exportador · Preço cotado · Base FOB · Prazo pagto · Origem · Vencedora | | |
| cmp.box1 | manter | título do bloco | CREATINA 200 MESH - CREAPURE · CAS 57-00-1 · 15.000 KG | | |
| cmp.b1l1 (sugerida/vencedora) | manter | | ANHUI JINHE FOOD · 4,85/KG FOB · 4,85/KG · T/T 90 days · E-mail · IA (chega como "lendo e-mail…" · resposta recebida, depois preenche) | | |
| cmp.b1l2 | manter | | VITASWEET CO. (marca cotada: HANSONG) · 5,02/KG CFR · 4,88/KG · T/T 30 days · Planilha · IA | | |
| cmp.b1l3 | manter | | ENSIGN INDUSTRY · 5,11/KG FOB · 5,11/KG · L/C at sight · E-mail · IA | | |
| cmp.b1l4 | manter | | CHENGXIN CHEMICAL · 5,20/KG FOB · 5,20/KG · 30% adiantado · E-mail · IA (sem rótulo de rascunho) | | |
| cmp.sugerida | manter | rótulo da IA | sugerida pela IA | | melhor oferta · recomendada |
| cmp.box2 | manter | título do bloco | SUCRALOSE - ANHUI JINHE · CAS 56038-13-2 · 5.000 KG | | |
| cmp.b2l1 | manter | | ANHUI JINHE FOOD · 38,40/KG FOB · 38,40/KG · T/T 90 days · E-mail · IA | | |
| cmp.b2l2 | manter | | VITASWEET CO. · 39,10/KG CFR · 38,62/KG · T/T 30 days · Planilha · IA | | |
| cmp.nota | manter | rodapé | Base FOB normalizada a 90 dias · unidade é base de comparação (/KG × /MT nunca se misturam) | | Base FOB normalizada a 90 dias |
| cmp.botoes | manter | rodapé | Contra-ofertas · Fechar cotação | | |

## 3 · Conversas

### Lista de representantes

| id | Ação | Atual | Novo |
|---|---|---|---|
| wa.busca | manter | Buscar por nome ou número... · Novo | |
| wa.r1 (aberta) | manter | Carlos Mendes · Agente IA: Cotação COT-V-0188 emitida — PDF anexo · 09:45 | |
| wa.r2 | manter | Ana Souza · Você: Tabela de setembro sai dia 01 · há 2 h | |
| wa.r3 | manter | João Pereira (Gestor) · Pedido PD-0453 faturado, obrigado! · há 5 h | |
| wa.r4 | manter | Marcos Lima · Você: Cotação COT-V-0186 emitida — PDF anexo · ontem | |
| wa.r5 | manter | Renata Alves · Consegue cotar inositol pra Ambev? · ontem · 2 não lidas | |

### Conversa

| id | Ação | Quem | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| wa.header | manter | cabeçalho | Carlos Mendes · +5511987654321 · Rep. Sudeste · botão Cotações | | |
| wa.dia | manter | separador | Hoje | | |
| wa.m1 | manter | representante · 09:41 | Bom dia! A Nestlé pediu o COA da creatina 200 mesh, lote 2408. Consegue me mandar? | | Bom dia! Me manda o COA da creatina 200 mesh, lote 2408? A Nestlé pediu. |
| wa.m2 | manter | IA · 09:42 | Segue o COA da creatina 200 mesh, lote 2408: + (arquivo) COA CREATINA 200 MESH — lote 2408.pdf · PDF · 212 KB · SharePoint | | |
| wa.m3 | manter | representante · 09:44 | Valeu! E quanto tá a creatina hoje pra 2 ton, entrega SP? | | Obrigado! Quanto fica 2 ton de creatina, entrega em SP? |
| wa.ia | manter | rótulo nos balões da IA | Agente IA | | Faradays · IA |
| wa.m4 | manter | IA · 09:44 | Encontrei **2 marcas** de creatina na tabela vigente: Creapure® e Hansong. Qual delas? | | Tenho creatina de 2 marcas na tabela vigente — Creapure® e Hansong. Qual você quer? |
| wa.m5 | manter | representante · 09:45 | Creapure | | |
| wa.m6 | manter | IA · 09:45 | Cotação COT-V-0188 emitida — ICMS SP e câmbio do dia já calculados. + (arquivo) COT-V-0188 · Nestlé SP.pdf · 2.000 kg · Creapure® · 1 pág. | | Pronto: cotação COT-V-0188 emitida, com ICMS SP e câmbio do dia. |
| wa.compositor | manter | placeholder | Mensagem para o representante... | | |

### Celular do representante (sozinho em cena; no fim, à direita do sistema)

As mensagens são as mesmas da conversa (wa.m1 … wa.m6) — mudar lá muda aqui. Só estes textos são próprios do celular:

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| cel.contato | manter | cabeçalho | Faradays | | |
| cel.status | manter | cabeçalho, sob o nome | ✦ Agente IA · responde na hora | | Agente IA · online · Faradays IA · sempre disponível |
| cel.digitando | manter | cabeçalho, enquanto a IA "pensa" | digitando… | | |
| cel.rotulo | manter | topo dos balões recebidos | ✦ Agente IA · resposta automática | | Agente IA · automático · Respondido pela IA |
| cel.dia | manter | separador | Hoje | | |
| cel.m2 | manter | balão recebido · 09:42 | Segue o COA do lote 2408: + (arquivo) COA CREATINA 200 MESH — lote 2408.pdf · PDF · 212 KB | | |
| cel.arquivo2 | manter | balão recebido | COT-V-0188 · Nestlé SP.pdf · 2.000 kg · Creapure® · 1 pág. | | |
| cel.compositor | manter | placeholder | Mensagem | | |

### Legendas laterais (texto grande à esquerda do celular)

| id | Ação | Tempo | Overline | Atual | Novo | Alternativas |
|---|---|---|---|---|---|---|
| leg.1 | manter | 0:52 (1ª mensagem) | WhatsApp do representante | O representante pergunta pelo WhatsApp, como sempre. | | Ele pergunta onde já pergunta: no WhatsApp. |
| leg.2 | manter | 0:54 (COA chega) | Agente IA · resposta automática | A IA responde na hora — ninguém do seu time precisou digitar. | | Resposta em segundos, sem ninguém do seu lado. |
| leg.3 | manter | 0:59 (pergunta da marca) | Agente IA · resposta automática | Tira a dúvida da marca… | | Confirma a marca… |
| leg.4 | manter | 1:03 (cotação) | Agente IA · cotação emitida | …e emite a cotação, com ICMS e câmbio do dia. | | …e cota na hora, com ICMS e câmbio do dia. |
| leg.5 | manter | 1:05 (sistema entra) | Sistema Faradays | E toda a conversa fica registrada no sistema. | | Tudo registrado no sistema, para a equipe acompanhar. |

### Diálogo de anexo

Saiu do roteiro (o COA agora é enviado pela IA). Os textos ficam aqui só como referência, caso queira voltar: título "Enviar arquivo para Carlos Mendes" · fontes Documentos · Laudos · SharePoint · trilha Faradays Qualidade › Certificados › COA · rodapé "Arraste o arquivo para a conversa ou use Enviar".
