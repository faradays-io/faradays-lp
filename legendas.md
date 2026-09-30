# Legendas do Showcase Faradays

## Contexto

**O que é.** Um showcase de 2:59 no relógio da plataforma Faradays (o conteúdo vai até ~2:56 e o fechamento segura 3 s; 2 s de tela em branco na cabeça, para gravação), em HTML animado (roda sozinho, sem arquivo de vídeo). A versão que vale é o `index.html` desta branch (`showcase-video` da LP); existe também uma prancha editável em <https://claude.ai/code/artifact/635fdcc2-1102-4e7a-99a4-075da06f4758>. Estilo dos vídeos de apresentação do Claude: cartelas de título grandes, cortes casados, zoom em componentes. Fundo igual ao da LP — `#f8f8f8` com o film grain dinâmico do `GrainOverlay` (feTurbulence 0.25, opacidade .12, `grain-jump`), títulos e legendas em tinta escura; pensado para celular na horizontal (na vertical aparece a instrução de girar). O app reproduzido pixel a pixel (tokens do `globals.css`, Geist/Aspekta/JetBrains Mono, ícones Phosphor).

**Revisão de 2026-09-11 (feedback externo).** Nomes de produto, marca, exportador e cliente ficaram **genéricos** (PRODUTO 1, MARCA A, EXPORTADOR 1, CLIENTE 1) — quem é da indústria entende sem conhecer o portfólio. A barra lateral do app virou um **trilho de ícones** e a câmera fecha em cada diálogo (1,6×) e no modal (1,32×) para o texto ficar legível também no celular. Cada capítulo mostra o fluxo inteiro: BID do zero até a OC e o feedback; documentos com nome "nada a ver" renomeados pela IA e a cobrança dos vencidos; venda por áudio com preço de tabela, último faturado, lead time e crédito, e o sistema espelhando a conversa em tempo real. **Atenção:** a resposta de fornecedor por WhatsApp (cap. 1) e a consulta de NF/boleto pelo bot (cap. 3) ainda não existem no produto — entraram porque o feedback pediu ("mesmo que ainda não tem"); decisão de mostrar é sua.

**Roteiro atual.**

| Tempo | Capítulo | O que acontece |
|---|---|---|
| 0:00 | — | 2 s de tela em branco (cabeça do vídeo, para gravação) — só o ground da LP com o film grain |
| 0:02 | Abertura | abertura em QUATRO TEMPOS (6,7 s; o FS1 colado ao wordmark foi testado e descartado em 2026-09-17): a marca vem primeiro e o produto depois: o wordmark Faradays sobe sozinho no centro da tela, sai por cima e, no mesmo lugar, entra FS1 grande com "por Faradays" embaixo (a empresa vira assinatura); então a coluna assenta e sobem o slogan "IA para indústrias que compram e vendem muito bem" ("IA" e "muito bem" acendem juntos), a timeline das três bolhas e, por último, a linha PARCEIROS com Microsoft e Meta com o slogan **"IA para indústrias que compram e vendem muito bem"** (em caixa alta, mono): "IA" e "muito bem" começam cinza e acendem juntos para o gradiente de IA; embaixo, a **timeline das três bolhas** (Cotação de compra em um clique · Agente de documentos com IA · Cotação de venda direto no WhatsApp) sobe uma a uma do cinza-escuro para o gradiente, sem conectores (abertura de 5,2 s) |
| 0:08 | 1 · BID | cartela **"Do pedido à ordem de compra em um clique." / "A IA interage. Você só aprova."** (4,8 s; "Do pedido" grande → zoom out revela as duas linhas, 80px como nas outras cartelas; timeline com a 1ª bolha acesa; na saída, a bolha acesa voa para o canto superior esquerdo e fica como selo do capítulo). A versão longa ("Dispare cotações nacionais e internacionais… / A IA negocia e envia a ordem por e-mail e WhatsApp. Você revisa e aprova.") foi testada e trocada por esta em 2026-09-14: palavras demais, e a demo já mostra o tipo, os canais e a OC. Demo: lista de BIDs com as abas **Todos · Internacional · Local** (a CL-2026-003 leva o selo Local — só a exceção é marcada, como no produto) → **Nova cotação** (diálogo em zoom, com o **toggle Internacional | Local** do produto no topo e o texto de ajuda de cada tipo: cesta PRODUTO 1 · 15.000 KG, PRODUTO 2 · 5.000 KG, PRODUTO 3 · 3.000 KG entra item a item → "Criar e abrir") → modal enxuto e **centrado na tela**: quem escolhe os destinatários é a **própria FS1** (2026-09-18) — a legenda do cabeçalho vira "FS1 cruzando o cadastro produto × exportador…", as três linhas que atendem acendem **juntas** no gradiente de IA e já se marcam sozinhas, e no fim a legenda vira "3 de 4 selecionados · só quem fornece estes itens" e o EXPORTADOR 4 (1 de 3 itens) apaga (copy de 2026-09-21, feedback "selecionar é ruim; deixar claro que já puxa do teu cadastro": tudo fala em **cadastro**, e a frase dos canais diz que ninguém de fora recebe); o cursor só entra para **Disparar BID** → envelopes → **vista dividida**: o Outlook do EXPORTADOR 1 recebe o BID e responde com preço; sai, e o **WhatsApp Business do EXPORTADOR 2** entra no mesmo lugar e responde por lá — a vista dividida é **rotulada**: "FS1 · Compras" acima da janela do sistema e, à direita, a **zona do fornecedor** (painel de fundo levemente mais escuro com o rótulo "Fornecedor · Exportador n"), com tempo para ler; as duas respostas voam para o sistema → CORTE para o **comparativo já em zoom**: EXPORTADOR 1 chega "lendo e-mail…", EXPORTADOR 2 "lendo WhatsApp…", os dois preenchem (a linha só pisca na chegada da resposta e volta ao branco — o fundo azul permanente saiu em 2026-09-18) → a câmera **recua** e mostra a tabela inteira → só então as quatro linhas escolhidas recebem a **mesma varredura azul do "lendo…"**, em cascata (uma a cada 0,3 s), e ficam varrendo; o selo de cada linha entra logo depois — a tabela mostra preço cotado · prazo · **custo fin.** do prazo e **comparável** (colunas de 2026-09-21), que é a régua por onde a IA decide → **véu no rodapé** (de volta, 2026-09-18): a ação para, a faixa escura sobe com "A IA compara na mesma base e aponta, em cada produto, o melhor FOB, o melhor CIF e o melhor preço considerando o custo financeiro." (copy de 2026-09-22: os três apontamentos, e o terceiro é a linha vencedora, verde, pela coluna Comparável), espera ~4,8 s e desce → a **IA marca as vencedoras sozinha** (sem cursor: EXPORTADOR 1 no PRODUTO 1 e EXPORTADOR 2 no PRODUTO 2 — a linha INTEIRA fica verde, reforçada em 2026-09-21, com o número comparável em verde, e as caixas marcam) → **Fechar cotação** (o cursor volta só aqui) → diálogo **"Cotação fechada"**: duas vencedoras (EXPORTADOR 1 no PRODUTO 1 e EXPORTADOR 2 no PRODUTO 2 — a CIF ganha depois de normalizada), **ordens de compra OC-2026-031 e OC-2026-032** emitidas e **feedback aos não escolhidos** (2) enviado → **cena nova (2026-09-18)**: o diálogo sai, a tela escurece e as **duas ordens de compra em PDF** entram lado a lado, refeitas pela OC de produção: marca Faradays, número, fornecedor com cc, **Faturar para** (filial e CNPJ), tabela em quilo (produto · qtd · preço/kg com incoterm e porto · total), pagamento/embarque/destino, COA anexo, "Observações do sistema" e total; o carimbo verde **ENVIADA** cai numa e depois na outra, sob o cabeçalho **"Disparo da ordem de compra · automático / Fechou a cotação? A OC já saiu, uma para cada fornecedor."** e com a linha do envio (para quem, cc, PDF anexo) entrando embaixo de cada página (2026-09-21, feedback "não to vendo disparo de OC") → **BID pelo WhatsApp** (novo em 2026-09-21, 13,5 s, sobre o mesmo véu escuro; feedback "não vi bot de cotação de compra"): o celular do **gestor de compras** entra com a timeline branca à esquerda — ordem invertida em 2026-09-22, a pedido: primeiro "Cria um BID de 10 t de PRODUTO 3 pros mesmos exportadores." → **prévia** (item, 3 do cadastro, canais, prazo) e "Disparo? Responda sim" → "Sim" → "BID CC-2026-013 disparado para EXPORTADOR 1, 2 e 3"; e só então "E o comparativo do CC-2026-012?" → as melhores por produto, as OCs enviadas e o feedback — o comparativo fecha a cena e emenda na tela Internacional × Local — cada mensagem entra com mais respiro desde 2026-09-21, a pedido (no produto é o menu "BID de compra" do gestor: toda ação externa é prévia + "sim") → **cena Internacional × Local** (fecho do capítulo, 10,5 s; copy de 2026-09-21, sem overline desde o 2º lote do mesmo dia): tela própria, sem gradiente: "Cotação local e internacional na mesma plataforma." / "A IA entende todo tipo de cotação e os custos/impostos envolvidos.", o **toggle Internacional | Local no topo** e **dois recibos lado a lado** com a mesma estrutura em três blocos — **O QUE ELE COTOU** (Preço FOB 4,85 USD/kg ┃ Preço cheio 31,90 R$/kg, com os impostos dentro) → **O QUE A FS1 AJUSTA** (+ frete da premissa 0,14, vira CIF · + prazo 90 dias = base, sem custo financeiro ┃ − ICMS 18% 5,74 · − PIS/COFINS 9,25% 2,42, o IPI fica fora) → **A RÉGUA**, em azul (CIF com custo financeiro **4,99 USD/kg** ┃ NET **23,74 R$/kg** — "é por este número que a IA compara"); um número grande por linha, as linhas acendem em pares (esquerda e direita juntas); quando o rodapé entra ("Você escolhe o tipo de cotação e **a IA entende a lógica**."), o toggle passa a alternar sozinho e o recibo do mercado escolhido ganha o anel azul enquanto o outro esmaece. |
| 1:28 | 2 · Documentos | cartela **"Documentos dos seus produtos vencendo?" / "Ainda precisa cobrar os fornecedores?"** (3,8 s; mesma coreografia da do BID: "Documentos" grande → zoom out revela a frase → linha 2 sobe; 2ª bolha acesa). Demo (a cena do diálogo "Conectar drive" foi removida em 2026-09-18, a pedido — o drive já entra conectado): a câmera fecha no painel do drive enquanto ele entra; três arquivos com **nome "nada a ver"** (`scan_0231.pdf`, `WhatsApp Image 2026-08-12.pdf`, `Certificado (2) final.pdf`) sincronizam sozinhos → a **IA lê e renomeia** no padrão do produto (ISO 9001 — PRODUTO 1 — MARCA A — VAL 02.11.2027 · LICENÇA FABRICAÇÃO — EXPORTADOR 2 — VAL 15.03.2028 · COA — PRODUTO 3 — MARCA B — lote 2408) → com a pilha voando para a tabela, CORTE para a vista inteira → linhas chegam "lendo…" e a validade preenche (zoom nos status) → em vez de recuar, a câmera **sobe até as duas linhas em atenção** (Halal a vencer, Kosher vencido), que recebem um **gradiente suave na cor do status** — âmbar (a vencer) e vermelho (vencido), bem transparente, sem barra na borda, com um brilho passando por cima → **cobrança automática** (refeita em 2026-09-18: ninguém clica; copy de 2026-09-21): "Ficha técnica, certificados, COA: o que venceu ou falta é cobrado sozinho, no prazo que você programar — e só do fornecedor cadastrado como dono da documentação de cada produto", com os chips da programação (todo dia às 08:00 · follow-up a cada 2 dias · para depois de 3 sem resposta — os parâmetros reais do produto) — o painel abre com "disparando…" e fecha em "2 e-mails enviados · automático, no prazo programado"; então a **pílula da cobrança voa** do rodapé do diálogo para a direita, rumo ao exportador (2026-09-21) → **resposta do exportador** (novo em 2026-09-21, ~9 s): o diálogo sai, a **pílula do anexo volta** da direita e pousa virando o diálogo **"Documento recebido"** (resposta do EXPORTADOR 1 · 2 dias depois): o anexo `Halal_cert_2027_final.pdf` é **lido** (Halal · PRODUTO 2 · MARCA A · válido até 15/09/2027) → **salvo no drive** em Qualidade › Documentos › PRODUTO 2 › MARCA A com o nome padrão → **pendência baixada**, com retorno ao exportador na mesma conversa; o diálogo sai, a câmera volta às linhas em atenção e a **Halal vira Vigente · 15/09/2027** com uma piscada verde. No produto é a esteira de e-mail (o anexo da resposta à cobrança é classificado e publicado na pasta do produto no drive), complementar à sincronização do drive mostrada antes |
| 2:01 | 3 · Conversas | cartela **"Seu time de vendas inteiro / no WhatsApp"** (3,3 s; mesma coreografia: "Seu time de vendas" grande → zoom out revela "inteiro" → "no WhatsApp" sobe; 3ª bolha acesa). **Fase A** — só o celular do representante, centralizado, com pausa para ler cada mensagem: o pedido chega **como o representante quiser mandar — áudio, texto ou foto** (aqui um áudio, com onda + transcrição pela IA) → "digitando…" (glow Siri) → a IA responde com os **números** (preço de tabela, **último cotado e último faturado com as datas** — 2026-09-21 —, lead time, data de entrega, crédito disponível) e com **dois alertas em vermelho**: a data de entrega **"fora do pedido mínimo"** e o crédito que não cobre — e oferece as duas saídas ("Mudo para FOB ou subo para 5 t?" · "Mude o pagamento para à vista ou peça mais crédito ao financeiro.") → "Muda pra FOB e sobe pra 5 t — o crédito eu resolvo com o financeiro." → **cotação COT-V-0188 emitida** (ICMS SP, câmbio do dia, PDF). A IA sugere a saída, mas **não pede o crédito** por ele (copy de 2026-09-22) → ele pede o COA e a NF, a IA manda o COA, a NF 12.345 e a 2ª via do boleto → pede a ficha técnica → **pergunta onde está a NF 12.340** (2026-09-21) e a IA responde com faturamento, transportadora, status e previsão de entrega. À esquerda, a **timeline de legendas** acumula os cinco beats (a 1ª agora diz "A IA entende a solicitação por áudio, texto ou foto."). a conversa dá lugar a uma **conversa limpa** (2026-09-18): no horário que o cliente configurar, a FS1 manda o **resumo do dia com projeção** (faturado hoje, mês até agora, projeção × meta — o gestor recebe o consolidado do time) e, quando ele pede, o **relatório de faturamento** com volume (t) e faturamento (R$ mi) de junho a setembro em barras, mais o PDF; a timeline de legendas reseta e ganha dois passos novos. **Fase B** — o celular some e a **Visão Geral aparece direto** (a tela do sistema na rota de conversa saiu em 2026-09-18, a pedido); **fade com deslocamento** para a **Visão Geral**: à esquerda o **ranking dos representantes nos últimos 7 dias** (2026-09-20: #, nome, valor cotado, volume, cotações, itens e a linha de total do time — Carlos Mendes em 1º, linhas entrando em cascata; a barra sob o nome foi removida a pedido) e, à direita, o mural com seis representantes e semáforo (verde ao vivo · lima cotou hoje · âmbar parado) — João Pereira recebe mensagens novas e vira verde (o rótulo de tempo vira "agora"), aos 3,5 s a **faixa escura** sobe pelo rodapé com "Todas as conversas dos representantes, em tempo real." — nada chega enquanto ela está em cena —, desce, e Renata Alves recebe as dela |
| 2:56 | Fechamento | logo com a **bandeira em gradiente de IA animado** (letras escuras) + barra de busca onde `www.faradays.io` é digitado, URL e cursor centralizados no meio da barra (lupa fixa à esquerda); embaixo, o botão **Get in touch** (pílula escura com seta) — segura 3 s e o vídeo recomeça sozinho |

**Decisões já tomadas** (não precisa repetir, só desfazer se quiser): sem espiral de Fibonacci; cartelas só com o título, palavras subindo; cartela ↔ demo em fade; match cut seco (sem fade, corta no meio do movimento) em disparo → comparativo e drive → tabela; sem toasts e sem cards-eco; balões do sistema em azul `#0065e0` com texto branco; IA sugere o fornecedor por badge + ponto piscante; barra lateral colapsada (trilho de ícones) nos três capítulos; bolhas da timeline soltas (sem conectores); nome da ferramenta (FS1) apresentado no 2º tempo da abertura, no lugar do wordmark e com "por Faradays" de assinatura, em tudo que rotula o SISTEMA ("FS1 · Compras" na vista dividida, "FS1 · Conversas" na legenda da conversa salva) e junto de TODA citação do agente ("Agente IA · FS1", adicionado sem tirar o "Agente IA" — no celular saiu o "resposta automática"); o remetente do e-mail que o exportador recebe e o contato do WhatsApp do representante seguem com "Faradays", porque quem está do outro lado conhece a empresa, não a ferramenta (2026-09-16); marcador de capítulo = a bolha acesa da cartela, que voa para o canto superior esquerdo e fica como selo durante a demo (o anel com numeral foi testado e substituído em 2026-09-14); o cursor só aparece do lado do sistema (o fornecedor responde sozinho, sem clique no Send); aba Disparar BID só com a lista dos 4 exportadores, centrada na tela, com a seleção feita pela própria FS1 — sem clique do cursor nas linhas (2026-09-18); vista dividida rotulada (FS1 × zona do fornecedor com painel de fundo — tema escuro testado e descartado); no comparativo a câmera recua antes do clique na linha sugerida; abertura 5,2 s, cartelas 4,8 s (BID), 3,8 s (Documentos) e 3,3 s (Conversas), as três com a coreografia de zoom da do BID; faixas de legenda em cinza #262626 com 4,8 s (comparativo) e 4,3 s (Visão Geral); pausas de leitura entre as mensagens do celular; nomes genéricos (produto, marca, exportador, cliente) — os representantes seguem com nome de pessoa.

**Como usar este arquivo.** Cada linha tem **Ação** (`manter` · `remover` · `trocar`), **Novo** (o texto que entra quando a ação for `trocar`) e, onde faz sentido, **Alternativas** que já deixei prontas — pode copiar uma para Novo ou escrever a sua. As seções "Adicionar" listam coisas que hoje **não existem** no vídeo: marque `[x]` no que quiser que eu inclua. Devolva o arquivo (commit ou mensagem) e eu regenero o vídeo.

---

## Adicionar · legendas narradas (hoje o vídeo não tem nenhuma)

Uma linha curta na base da tela, aparecendo e sumindo com a cena. Marque as que entram; edite o texto à vontade.

| Entra | Tempo | Cena | Legenda sugerida | Alternativa |
|---|---|---|---|---|
| [ ] | 0:16 | diálogo Nova cotação | Monte a cesta; o BID vai para quem exporta cada produto. | Três itens, um BID. |
| [ ] | 0:25 | envelopes voando | E-mail e WhatsApp, num clique. | Quatro exportadores, um disparo. |
| [ ] | 0:28 | e-mail do exportador recebe o BID | O exportador recebe o BID na caixa dele — e responde ali mesmo. | Sem portal, sem formulário: ele responde o e-mail. |
| [ ] | 0:34 | WhatsApp do exportador | Respondeu pelo WhatsApp? A IA lê também. | Qualquer canal, a mesma leitura. |
| [ ] | 0:42 | comparativo em zoom | Respostas lidas pela IA, comparadas na mesma base FOB. | /KG e /MT nunca se misturam. |
| [ ] | 0:46 | sugestão da IA | A IA aponta a melhor oferta. Você decide. | Sugestão da IA; a escolha é sua. |
| [ ] | 0:48 | véu do comparativo | A IA compara na mesma base e aponta a melhor de cada tipo. | Mesma base, decisão clara. |
| [ ] | 0:53 | IA marca as vencedoras | Vencedora marcada — você só confere e fecha. | A IA escolhe; você aprova. |
| [ ] | 0:58 | OC e feedback | Fechou: cada fornecedor recebe a ordem de compra com os itens dele. | Ordem de compra e feedback, sem digitar nada. |
| [ ] | 1:03 | BID pelo WhatsApp (gestor) | Gestor de compras? Pergunte, crie e dispare o BID pelo chat — ela só executa com o seu "sim". | Status, vencedoras e OC numa mensagem. |
| [ ] | 1:17 | recibos Internacional × Local | Local ou internacional, a IA entende a lógica de cada cotação. | Frete e prazo de um lado; ICMS e PIS/COFINS do outro — na mesma plataforma. |
| [ ] | 1:37 | arquivos com nome estranho | Chegou com nome qualquer? A IA lê e renomeia. | O drive fica organizado sozinho. |
| [ ] | 1:41 | zoom nos status | Validade lida pela IA — sem digitar nada. | Sem data? A IA acha no PDF. |
| [ ] | 1:44 | linhas em atenção | Vencido ou a vencer, a FS1 já viu. | Dois documentos em atenção — e ninguém precisou procurar. |
| [ ] | 1:46 | cobrança automática | Vencido ou faltando: a cobrança sai sozinha, no prazo que você programar, só para o fornecedor certo. | Ninguém precisa lembrar de cobrar. |
| [ ] | 1:52 | Documento recebido | O exportador respondeu? A FS1 lê, salva na pasta certa e baixa a pendência. | Ninguém baixa, renomeia nem arquiva: o drive se organiza sozinho. |
| [ ] | 2:04 | pedido do representante | Áudio, texto ou foto: manda como sempre mandou. | Sem formulário, sem portal. |
| [ ] | 2:07 | IA responde com os números e os alertas | Preço de tabela, último cotado, último faturado, lead time e crédito — e o que trava o pedido, em vermelho. | Ele não precisa lembrar do limite de crédito nem do pedido mínimo. |
| [ ] | 2:13 | cotação emitida | Confirmou? A cotação sai na hora, com ICMS e câmbio do dia. | PDF pronto, no WhatsApp. |
| [ ] | 2:21 | ficha técnica | Ficha técnica, COA, NF, boleto: tudo no mesmo chat. | Documento certo, na versão vigente. |
| [ ] | 2:27 | rastreio da NF | Onde está a NF? Transportadora, status e previsão de entrega, no mesmo chat. | Rastreio sem ligar para ninguém. |
| [ ] | 2:32 | resumo do dia | No horário que você escolher: o faturado, o mês e a projeção — sem ninguém pedir. | O gestor recebe o consolidado do time. |
| [ ] | 2:38 | relatório de faturamento | Volume e faturamento do trimestre, no chat, com o PDF. | Relatório pronto, sem planilha. |
| [ ] | 2:44 | Visão Geral | Todos os representantes, todas as conversas — e o ranking da semana — numa tela só. | O gestor vê o time inteiro vendendo, e quem está na frente. |

## Adicionar · outros elementos possíveis

| Entra | Elemento | Como ficaria |
|---|---|---|
| [x] | Slogan sob o logo na abertura | "IA para indústrias que compram e vendem muito bem" (já no vídeo: mono caixa alta com tracking largo; "IA" e "muito bem" acendem para o gradiente de IA) |
| [ ] | Numeração nas cartelas | overline pequeno acima do título, ex.: "01 · Qualidade" (também saiu antes) |
| [ ] | Mascote na abertura/fechamento | o pet pixelado ao lado do logo, em idle |
| [x] | Chamada final | barra de busca digitando `www.faradays.io` (já no vídeo) |
| [x] | Marcador de capítulo no canto | a bolha acesa da cartela voa para o canto e fica como selo (já no vídeo; o anel com numeral saiu em 2026-09-14) |
| [ ] | Mural "Visão Geral" ao vivo | a tela inicial do produto (grid de mini-conversas com semáforo verde/lima/amarelo) como abertura do cap. 3 |

---

## Cartelas de capítulo

| id | Ação | Atual | Novo | Alternativas |
|---|---|---|---|---|
| cartela.1 (BID, 1º cap.) | manter | Do pedido à ordem de compra em um clique. / A IA interage. Você só aprova. | | Ainda mandando cotação por e-mail e compilando na planilha? · Um BID, todos os exportadores |
| cartela.2 (Documentos) | manter | Documentos dos seus produtos vencendo? / Ainda precisa cobrar os fornecedores? | | Certificado vencido só aparece na auditoria? · Seus documentos, lidos pela IA |
| cartela.3 (Conversas) | manter | Seu time de vendas inteiro / no WhatsApp | | Quanto do seu time o representante consome? · O representante manda áudio, a IA cota |

## Abertura e fechamento

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| geral.logo | manter | abertura e fechamento | logo Faradays (na abertura, maior, com o nome FS1 ao lado e o slogan embaixo; no fechamento, sozinho sobre a barra de busca, com a bandeira em gradiente de IA e as letras escuras) | |
| geral.nome | manter | 2º tempo da abertura, no lugar do wordmark | FS1 (mono 170px peso 700) + "por" e o wordmark Faradays em cinza embaixo | |
| geral.parceiros | manter | rodapé da abertura, entra por último | PARCEIROS DA · ▣ Microsoft · ∞ Meta (marca + nome, grade simétrica com o filete no centro do quadro; as duas marcas são os arquivos oficiais. Um selo de parceiro entra aqui se houver) | | |
| geral.slogan | manter | sob o logo, na abertura | IA para indústrias que compram e vendem muito bem ("IA" e "muito bem" acendem juntos) | |
| geral.bolhas | manter | timeline sob o slogan (abertura, todas acesas) e sob o título de cada cartela (só a do capítulo acesa) | Cotação de compra em um clique · Agente de documentos com IA · Cotação de venda direto no WhatsApp | |
| geral.selo | manter | bolha estacionada no canto superior esquerdo, durante as demos | Cotação de compra em um clique · Agente de documentos com IA · Cotação de venda direto no WhatsApp | |
| geral.url | manter | barra de busca no fechamento (URL e cursor centralizados no meio da barra; lupa à esquerda) | www.faradays.io | |

## Casca do app (aparece nos três capítulos)

A barra lateral está **colapsada** (trilho de 64px): bandeira do logo em cima e um ícone por grupo — Início · WhatsApp · Compras · Vendas · Qualidade · Cadastros · Sistema; o grupo do capítulo acende. Os nomes aparecem só no breadcrumb.

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| header.usuario | manter | canto superior direito | Gestor | |
| crumb.1 | manter | breadcrumb cap. 1 | Compras / BID (Cotação de Compra) | |
| crumb.2 | manter | breadcrumb cap. 2 | Qualidade / Documentos | |
| crumb.3 | manter | breadcrumb cap. 3 | WhatsApp / Conversas | |
| crumb.4 | manter | breadcrumb da Visão Geral (fim do cap. 3) | Início / Visão Geral | |

## 1 · BID

### Lista

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| bid.botoes | manter | barra de ações | Exportar Excel · Caixa de e-mail · Automação · Premissas · Nova cotação | |
| bid.busca | manter | placeholder | Buscar por nº ou produto… | |
| bid.pills | reescrito (2026-09-18) | abas por mercado + filtros de status (as abas são as do produto) | Todos 6 · Internacional 5 · Local 1 ┃ Abertas · Fechadas | |
| bid.colunas | manter | cabeçalho | Data · Nº · Produtos cotados · Respostas | |
| bid.l1 | manter | | 21/08/2026 · CC-2026-011 · respondida · PRODUTO 2 +1 · 3 de 5 envios | |
| bid.l2 | manter | | 14/08/2026 · CC-2026-010 · fechada · PRODUTO 3 · 4 de 4 envios | |
| bid.l3 | reescrito (2026-09-18) | a cotação LOCAL da lista (numeração CL-, selo azul "Local") | 05/08/2026 · CL-2026-003 · fechada · Local · PRODUTO 4 +3 · 5 de 6 envios | |
| bid.l4 | manter | | 29/07/2026 · CC-2026-008 · fechada · PRODUTO 5 +1 · 3 de 3 envios | |
| bid.l5 | manter | | 22/07/2026 · CC-2026-007 · cancelada · PRODUTO 6 · 2 de 4 envios | |

### Diálogo "Nova cotação de compra" (a CC-2026-012 nasce aqui)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| nova.titulo | manter | título | Nova cotação de compra · CC-2026-012 | | |
| nova.subtitulo | removido (2026-09-11, para simplificar) | linha abaixo do título | Monte a cesta; o BID vai para os exportadores mapeados para cada produto. | | |
| nova.tipo | novo (2026-09-18) | toggle no topo, como no produto | Tipo da cotação: **Internacional** ┃ Local (Internacional ativo) | | |
| nova.ajuda | novo (2026-09-18) | texto sob o toggle (o do produto, encurtado) | Importação: FOB/CFR em dólar, frete e origem. Local pede preço cheio com ICMS, PIS/COFINS e IPI e compara pelo NET. Não muda depois de criada. | | |
| nova.campos | reescrito (2026-09-18) | 1 campo (a PTAX saiu: só existe no BID local) | Retorno até: 12/09/2026 | | |
| nova.busca | manter | placeholder · botão | Adicionar produto… · Adicionar | | |
| nova.i1 (entra) | manter | | PRODUTO 1 · MARCA A · 15.000 KG | | |
| nova.i2 (entra) | manter | | PRODUTO 2 · MARCA B · 5.000 KG | | |
| nova.i3 (entra) | manter | | PRODUTO 3 · qualquer marca · 3.000 KG | | |
| nova.rodape | reescrito (2026-09-21, junto com o disparo: tudo fala em CADASTRO) | | 3 itens · 4 exportadores do seu cadastro cotam estes produtos · Cancelar · Criar e abrir | | |

### Modal — cabeçalho e aba Disparar BID

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| modal.titulo | manter | título | CC-2026-012 · aberta | | |
| modal.subtitulo | reescrito (2026-09-21) | linha abaixo | 3 itens · aberta agora · 4 exportadores do cadastro | | |
| modal.abas | manter | pills | Comparativo · Disparar BID | | |
| disp.destinatarios | manter | rótulo | Destinatários | | |
| disp.legenda | reescrito (2026-09-21: "cadastro", não "mapeamento" — feedback "deixar claro que já puxa do teu cadastro pra quem cotar") | à direita de Destinatários, em três estados | 4 exportadores do seu cadastro para estes produtos → ✦ FS1 cruzando o cadastro produto × exportador… → ✦ 3 de 4 selecionados · só quem fornece estes itens | | |
| disp.selecao | reescrito (2026-09-18) | seleção automática, sem cursor | as 4 linhas começam desmarcadas; a FS1 varre a lista e acende as 3 que atendem ao mesmo tempo (1,1 s depois de "analisando…"), marcando sozinha; o EXPORTADOR 4 (1 de 3 itens) fica de fora e apaga | | |
| disp.switch | removido (2026-09-11) | switch | Disparar para todos | | |
| disp.filtro | removido (2026-09-11) | pills | No mapeamento 4 · Todos 12 · Fora do mapeamento 8 | | |
| disp.e1 | manter | nome + e-mail e WhatsApp completos | EXPORTADOR 1 · sales@exportador1.com · +86 532 8899 0101 · todos os itens | | |
| disp.e2 | manter | | EXPORTADOR 2 · export@exportador2.com · +86 21 6470 2202 · 2 de 3 itens | | |
| disp.e3 | manter | | EXPORTADOR 3 · bid@exportador3.com · +86 755 8301 3303 · todos os itens | | |
| disp.e4 | manter | | EXPORTADOR 4 · trade@exportador4.com · +91 22 4005 4404 · 1 de 3 itens | | |
| disp.acoes | reescrito (2026-09-21) | frase dos canais | Vai só a quem está no seu cadastro para estes produtos — por ✉ e-mail e ◎ WhatsApp. Ninguém de fora recebe. | | |
| disp.preview | removido (2026-09-11, para simplificar; o texto do e-mail continua visível no Outlook do exportador) | bloco Mensagem · EN/PT · Assunto · corpo · aviso | | | |
| disp.botoes | manter | rodapé (sem contador) | Cancelar · Disparar BID | | |

### Caixa de e-mail do exportador (vista dividida, dentro da zona do fornecedor)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| mail.header | manter | barra | Outlook · EXPORTADOR 1 · *fornecedor* · Inbox | | |
| mail.leg | manter | legenda acima (overline azul + texto) | Fornecedor · Exportador 1 — O exportador recebe o BID na caixa dele e responde ali mesmo. | | O fornecedor responde no e-mail dele, sem portal. |
| zona.sistema | manter | rótulo acima da janela do sistema | FS1 · Compras | | |
| zona.fornecedor | manter | painel de fundo atrás da legenda e da janela do fornecedor, à direita da janela do sistema (a janela fica a 0,58 e sobra 56px de respiro) | (sem texto — fundo levemente mais escuro, cantos arredondados) | | |
| mail.lista | manter | rótulo da lista | Today | | |
| mail.novo (chega) | manter | 1ª linha da lista | Faradays · BID CC-2026-012 — 3 items · 09:12 · Dear supplier, please find below our BID for FOB/CIF quotation… | | |
| mail.l2 | manter | lista | COSCO Shipping · Booking confirmation — Qingdao/Santos · 08:40 | | |
| mail.l3 | manter | lista | Customs broker · Documents for B/L draft · Yesterday | | |
| mail.l4 | manter | lista | Faradays · BID CC-2026-009 — closed · Yesterday | | |
| mail.assunto | manter | painel de leitura | BID CC-2026-012 — Faradays — 3 items | | |
| mail.de | manter | painel de leitura | Faradays · to: sales@exportador1.com · today 09:12 | | |
| mail.corpo | manter | painel de leitura (EN, o exportador lê) | Dear supplier, please find below our BID for FOB/CIF quotation. · PRODUTO 1 · 15000 KG (Container 1) / PRODUTO 2 · 5000 KG (Container 1) / PRODUTO 3 · 3000 KG (Container 2) · Please reply in this thread with price, incoterm and payment terms. · Automated message, read by AI — reply with price and commercial terms only. | | |
| mail.resposta | manter | rótulo da resposta | Reply · Faradays | | |
| mail.r1 | manter | resposta (digitada) | Dear Faradays team, | | Hello Faradays team, |
| mail.r2 | manter | resposta | PRODUTO 1 — USD 4.85/KG FOB Qingdao | | |
| mail.r3 | corrigido (2026-09-21: bate com o comparativo) | resposta | PRODUTO 2 — USD 38.90/KG FOB Qingdao | | |
| mail.r4 | manter | resposta | Payment T/T 90 days · price validity 15 days | | Payment terms T/T 90 days; prices valid for 15 days. |
| mail.enviar | manter | botão (sem cursor: a resposta sai sozinha) | Send | | |

### WhatsApp Business do exportador (entra no lugar do e-mail, na zona do fornecedor) — não existe no produto ainda

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| waexp.header | manter | cabeçalho | Faradays · Compras · +55 11 4002-8922 · BID CC-2026-012 · *exportador 2* · WhatsApp Business | | |
| waexp.leg | manter | legenda acima (overline azul + texto) | Fornecedor · Exportador 2 — Outro exportador responde pelo WhatsApp. A IA lê os dois. | | Respondeu pelo WhatsApp? A IA lê do mesmo jeito. |
| waexp.recebida | manter | balão recebido · 09:12 | BID CC-2026-012 — Faradays — 3 items + itens + Please reply here with price, incoterm and payment terms. Ref. BID-4F7A2C | | |
| waexp.resposta (entra) | manter | balão enviado · 09:31 | PRODUTO 1 — USD 5.02/KG CIF Santos / Payment T/T 30 days · validity 10 days | | |
| waexp.compositor | manter | placeholder | Type a message | | |

### Modal — aba Comparativo

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| cmp.colunas | manter | cabeçalho | Exportador · Preço cotado · Prazo pagto · Custo fin. · Comparável · Origem · Vencedora (colunas novas em 2026-09-21: o custo financeiro do prazo e a régua final) | | |
| cmp.box1 | manter | título do bloco | PRODUTO 1 - MARCA A · 15.000 KG | | |
| cmp.b1l1 (melhor FOB + vencedora) | manter | | EXPORTADOR 1 · 4,85/KG FOB · T/T 90 days · + 0,00 · 4,85/KG · E-mail · IA (chega "lendo e-mail…", depois preenche) · selo VERDE "melhor FOB · IA" | | |
| cmp.b1l2 (melhor CIF) | manter | | EXPORTADOR 2 · 5,02/KG CIF · T/T 30 days · + 0,02 · 4,90/KG · WhatsApp · IA (chega "lendo WhatsApp…", depois preenche) · selo AZUL "melhor CIF · IA" | | |
| cmp.b1l3 | manter | | EXPORTADOR 3 · 5,11/KG FOB · L/C at sight · + 0,04 · 5,15/KG · E-mail · IA | | |
| cmp.b1l4 | removido (2026-09-11: o EXPORTADOR 4 não recebeu o BID) | | EXPORTADOR 4 · 5,20/KG FOB · 5,20/KG · 30% adiantado · E-mail · IA | | |
| cmp.piscada | reescrito (2026-09-18, 4ª versão) | depois do zoom out, antes de cada selo | as 4 linhas recomendadas recebem a **mesma varredura azul do "lendo…"** (`.crow.ai`), em cascata — uma a cada 0,3 s — e ficam varrendo até a IA marcar as vencedoras; o selo de cada linha entra ~0,35 s depois; o EXPORTADOR 3 (não recomendado) fica parado. As linhas lidas do e-mail e do WhatsApp não ficam com fundo azul: só um flash na chegada | | |
| cmp.sugerida | reescrito (2026-09-18) | rótulo da IA, agora DOIS por produto | melhor CIF · IA (ponto e texto no gradiente azul) · melhor FOB · IA (ponto e texto verdes) — antes era um só, "sugerida pela IA", na linha vencedora | | melhor preço CIF · melhor preço FOB |
| cmp.veu | de volta (2026-09-18) | faixa cinza-escura que sobe pelo rodapé com a legenda centralizada, depois dos destaques (a ação para ~4,8 s) | A IA compara na mesma base e aponta, em cada produto, o melhor FOB, o melhor CIF e o melhor preço considerando o custo financeiro. | | |
| cmp.vencedoras | novo (2026-09-18) | sem cursor | a IA marca as vencedoras sozinha depois do véu: as linhas do EXPORTADOR 1 (PRODUTO 1) e do EXPORTADOR 2 (PRODUTO 2) ficam verdes e as caixas Vencedora marcam; o cursor só volta para Fechar cotação | | |
| cmp.mercados | reescrito (2026-09-21: título, descrição e rodapé novos, toggle no topo comandando os recibos; 2026-09-20, 4ª apresentação — DOIS RECIBOS espelhados, lado a lado; 10,5 s, ÚLTIMA cena do capítulo: a janela do app e o modal saem por baixo dela, e ela esmaece sobre o chão limpo) | depois do BID pelo WhatsApp | tela própria, sem gradiente (o overline "INTERNACIONAL × LOCAL" saiu a pedido em 2026-09-21): **"Cotação local e internacional na mesma plataforma."** · "A IA entende todo tipo de cotação e os custos/impostos envolvidos." · o toggle **Internacional ┃ Local** logo abaixo · **dois recibos lado a lado** com a mesma estrutura em três blocos — **O QUE ELE COTOU** (Preço FOB 4,85 USD/kg ┃ Preço cheio 31,90 R$/kg, com os impostos dentro) → **O QUE A FS1 AJUSTA** (+ frete da premissa 0,14, vira CIF · + prazo 90 dias = base, sem custo financeiro ┃ − ICMS 18% 5,74 · − PIS/COFINS 9,25% 2,42, o IPI fica fora) → **A RÉGUA**, em azul (CIF com custo financeiro **4,99 USD/kg** ┃ NET **23,74 R$/kg** — "é por este número que a IA compara"); um número grande por linha, as linhas acendem em pares (esquerda e direita juntas) — entrada acelerada em 2026-09-21 (transição 0,38 s e cues mais juntos); rodapé ✦ "Você escolhe o tipo de cotação e **a IA entende a lógica**." — quando ele entra, o toggle passa a alternar sozinho (ciclo de 5 s) e o recibo do mercado escolhido ganha o anel azul enquanto o outro esmaece a 50% | | |
| cmp.box2 | manter | título do bloco | PRODUTO 2 - MARCA B · 5.000 KG | | |
| cmp.b2l1 (melhor FOB) | manter | | EXPORTADOR 1 · 38,90/KG FOB · T/T 90 days · + 0,00 · 38,90/KG · E-mail · IA · selo VERDE "melhor FOB · IA" | | |
| cmp.b2l2 (melhor CIF + vencedora) | manter | | EXPORTADOR 2 · 39,10/KG CIF · T/T 30 days · + 0,19 · 38,81/KG · WhatsApp · IA · selo AZUL "melhor CIF · IA" — vence o PRODUTO 2 porque o comparável (38,81) fica abaixo do EXPORTADOR 1 (38,90) mesmo pagando o custo financeiro do prazo de 30 dias | | |
| cmp.nota | reescrito (2026-09-21) | rodapé | Comparável = mesma régua (frete da premissa) + custo financeiro do prazo · 90 dias é a base · /KG × /MT nunca se misturam | | |
| cmp.botoes | manter | rodapé | Contra-ofertas · Fechar cotação | | |

### Diálogo "Cotação fechada" (OC + feedback — os dois existem no produto)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| fch.titulo | manter | título | Cotação CC-2026-012 fechada | | |
| fch.subtitulo | manter | linha abaixo | Vencedora: EXPORTADOR 1 · PRODUTO 1 · 15.000 KG · USD 4,85/KG FOB · T/T 90 dias | | |
| fch.oc | manter | linha 1 | Ordem de compra OC-2026-031 — PDF gerado e enviado ao EXPORTADOR 1 · COA vigente do PRODUTO 1 anexo · faturar para a filial SP · emitindo… → enviada por e-mail | | |
| fch.feedback | manter | linha 2 | Feedback aos não escolhidos — EXPORTADOR 2 e 3 recebem o resultado do BID, item a item · enviando… → enviado (2) | | Contra-oferta aos não escolhidos |
| fch.botao | manter | rodapé | Concluir | | |

## 2 · Documentos

### Ordens de compra em PDF (cena depois de "Cotação fechada" — uma por fornecedor, como no produto)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| oc.cabecalho | manter | topo | logo Faradays · BID CC-2026-012 · emitida em 18/09/2026 · 1 de 2 ┃ ORDEM DE COMPRA · OC-2026-031 | | |
| oc.fornecedor | manter | bloco esquerdo | Fornecedor · EXPORTADOR 1 · sales@exportador1.com · cc: compras@faradays.io | | |
| oc.faturar | manter | caixa tracejada (o bill-to do produto) | Faturar para · Faradays Ingredientes Ltda. · Filial SP · CNPJ 12.345.678/0001-90 | | |
| oc.tabela | manter | em quilo, como a OC do produto | PRODUTO · QTD (KG) · PREÇO /KG · TOTAL → PRODUTO 1 · MARCA A · 15.000 · USD 4,85 (FOB Qingdao) · USD 72.750 | | |
| oc.condicoes | manter | 3 colunas | Pagamento T/T 90 dias · Embarque até 30 dias · Destino Santos · BR | | |
| oc.anexo | manter | chip | COA — PRODUTO 1 — MARCA A — lote 2408.pdf · anexo | | |
| oc.obs | manter | bloco "Observações do sistema" (existe no PDF do produto) | Quantidade e preço por KG conforme a resposta ao BID. A ordem substitui qualquer condição anterior. Documentos do produto (COA, ficha técnica) devem acompanhar o embarque. | | |
| oc.rodape | manter | | Enviada por e-mail a sales@exportador1.com · PDF gravado na emissão · reenviável ┃ TOTAL USD 72.750 · carimbo verde ENVIADA | | |
| oc.2 | manter | segunda página, mesmo desenho | OC-2026-032 · EXPORTADOR 2 · export@exportador2.com · PRODUTO 2 · MARCA B · 5.000 KG · USD 39,10 (CIF Santos) · T/T 30 dias · COA lote 2411 · USD 195.500 | | |
| oc.cena | novo (2026-09-21 — feedback "não to vendo disparo de OC": a cena agora diz o que é) | cabeçalho branco sobre o véu escuro, acima das duas páginas | DISPARO DA ORDEM DE COMPRA · AUTOMÁTICO / **Fechou a cotação? A OC já saiu, uma para cada fornecedor.** | | |
| oc.envio | novo (2026-09-21) | linha sob cada página, entra junto com o carimbo | ➤ E-mail enviado a **sales@exportador1.com** / cc compras@faradays.io · PDF da OC anexo (na 2ª: export@exportador2.com) | | |

### BID pelo WhatsApp (gestor de compras — novo em 2026-09-21, entre a OC e a Internacional × Local, sobre o véu escuro; feedback "não vi bot de cotação de compra". No produto é o menu "BID de compra" do gestor: status, criar, disparar, comparativo, fechar, OC — toda ação externa é prévia + "sim")

| id | Ação | Quem | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| bot.leg1 | reescrito (2026-09-22, com a inversão) | timeline branca à esquerda (entra com o celular) | Gestor de compras? Crie um BID por aqui — a FS1 mostra a prévia e só dispara com o seu "sim". | | |
| bot.leg2 | reescrito (2026-09-22) | timeline, 2º passo (quando ele pede o comparativo) | Depois peça o comparativo: ela responde com as melhores por produto e as ordens de compra. | | |
| bot.dia | novo | separador do chat | Hoje · gestor de compras | | |
| bot.m1 | reordenado (2026-09-22) | gestor · 10:12 | Cria um BID de 10 t de PRODUTO 3 pros mesmos exportadores. | | |
| bot.m2 | reordenado (2026-09-22) | IA · 10:12 | **Prévia · BID CC-2026-013** + cartão: Item PRODUTO 3 · MARCA B · 10.000 KG · Destinatários 3 do seu cadastro que cotam o PRODUTO 3 · EXPORTADOR 1, 2 e 3 · Canais e-mail e WhatsApp · resposta até 25/09 + "Disparo? Responda **sim** para confirmar." | | |
| bot.m3 | reordenado (2026-09-22) | gestor · 10:13 | Sim | | |
| bot.m4 | reordenado (2026-09-22) | IA · 10:13 | ✓ BID CC-2026-013 disparado para EXPORTADOR 1, 2 e 3. Te aviso aqui quando as respostas chegarem. (a frase "o comparativo você acompanha no sistema" saiu: agora ele pede o comparativo no próprio chat) | | |
| bot.m5 | reordenado (2026-09-22) | gestor · 10:14 | E o comparativo do CC-2026-012? | | |
| bot.m6 | reordenado (2026-09-22) | IA · 10:14 | **CC-2026-012 · comparativo** + cartão: Melhores por produto EXPORTADOR 1 · PRODUTO 1 · USD 4,85 FOB / EXPORTADOR 2 · PRODUTO 2 · USD 39,10 CIF · Ordens de compra OC-2026-031 e OC-2026-032 · enviadas por e-mail · Feedback aos não escolhidos enviado (2) | | |

### Página

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| docs.botoes | manter | barra de ações | Tipos de Documento · Classificar e organizar · Procurar no drive · Configurar drive · Cobrança · Novo Documento | |
| docs.pills | manter | abas | Documentos · Pendências 2 · Por exportador · Pastas | |
| docs.busca | manter | placeholder | Buscar por produto, tipo ou marca… | |
| docs.filtro | manter | botão | Status: todos | |
| docs.colunas | manter | cabeçalho da tabela | Tipo de documento · Produto / Fornecedor · Marca · Mandatório · Validade · Status · Arquivo | |

### Linhas da tabela (Tipo · Produto/Fornecedor · Marca · Mandatório · Validade · Status)

| id | Ação | Atual | Novo |
|---|---|---|---|
| docs.l1 | manter | ISO 9001 · PRODUTO 4 · MARCA C · Sim · 02/11/2027 · Vigente | |
| docs.l2 | manter (2026-09-21: vira **15/09/2027 · Vigente**, com uma piscada verde, quando o documento do exportador entra no drive) | Halal · PRODUTO 2 · MARCA A · Sim · 15/09/2026 · A vencer | |
| docs.l3 | manter | Kosher · PRODUTO 1 · MARCA A · Sim · 30/06/2026 · Vencido | |
| docs.l4 | manter | FDA · EXPORTADOR 3 · — · Sim · 20/01/2027 · Vigente | |
| docs.l5 | manter | MSDS · PRODUTO 5 · MARCA B · Não · — · N/A | |
| docs.l6 | manter | Free-sale · PRODUTO 3 · MARCA B · Sim · 08/05/2027 · Vigente | |
| docs.l7 | manter | GMP · EXPORTADOR 1 · — · Sim · 14/02/2028 · Vigente | |
| docs.l8 (chega do drive) | manter | ISO 9001 · PRODUTO 1 · MARCA A · Sim · 02/11/2027 · Vigente | |
| docs.l9 (chega do drive) | manter | Licença de fabricação · EXPORTADOR 2 · — · Sim · 15/03/2028 · Vigente | |
| docs.l10 (chega do drive) | manter | COA · PRODUTO 3 · MARCA B · Sim · 05/08/2027 · Vigente | |
| docs.lendo | manter | lendo… (shimmer de gradiente + sparkle pulsando) · SEM DATA | |

<!-- A tabela do diálogo "Conectar drive" saiu em 2026-09-18: o usuário mandou remover a cena inteira. Para voltar, `git show 882606bc` não tem (era posterior); o código do diálogo está no histórico desta branch. -->

### Painel do SharePoint

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| sp.titulo | manter | cabeçalho | SharePoint | | |
| sp.subtitulo | manter | cabeçalho | Qualidade · Documentos | | |
| sp.badge | manter | cabeçalho | sincronizando 3 → sincronizado | | |
| sp.caminho | manter | trilha | Documentos › Novos · 6 arquivos | | |
| sp.a1 (renomeia) | manter | nome original → nome dado pela IA | scan_0231.pdf → ISO 9001 — PRODUTO 1 — MARCA A — VAL 02.11.2027.pdf · PDF · 1,2 MB · hoje | | |
| sp.a2 (renomeia) | manter | | WhatsApp Image 2026-08-12.pdf → LICENÇA FABRICAÇÃO — EXPORTADOR 2 — VAL 15.03.2028.pdf · PDF · 640 KB · hoje | | |
| sp.a3 (renomeia) | manter | | Certificado (2) final.pdf → COA — PRODUTO 3 — MARCA B — lote 2408.pdf · PDF · 198 KB · ontem | | |
| sp.status | manter | linha de meta das três | sincronizando… → sincronizado · agora → ✦ lido e renomeado pela IA | | |
| sp.a4 | manter | | ISO 9001 — PRODUTO 4 — MARCA C — VAL 02.11.2027.pdf · PDF · 880 KB · há 3 dias | | |
| sp.a5 | manter | | FDA — EXPORTADOR 3 — VAL 20.01.2027.pdf · PDF · 310 KB · há 1 sem | | |
| sp.a6 | manter | | MSDS — PRODUTO 5 — MARCA B.pdf · PDF · 452 KB · há 2 sem | | |
| sp.rodape | manter | rodapé | Sincronização automática — a IA lê tipo, produto, marca e validade e renomeia o arquivo no padrão. | | Sem upload: o drive já é o sistema. |

### Cobrança automática (antes era um diálogo com botão; desde 2026-09-18 dispara sozinha)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| cob.titulo | reescrito (2026-09-18) | título | Cobrança automática ✦ FS1 | | |
| cob.subtitulo | reescrito (2026-09-21 — pedido: "sinalizar que é automático de acordo com o tempo que você programar", tipos de documento e só o dono cadastrado) | linha abaixo | Ficha técnica, certificados, COA: o que venceu ou falta é cobrado sozinho, no prazo que você programar — e só do fornecedor cadastrado como dono da documentação de cada produto. | | |
| cob.chips | novo (2026-09-21) | sob o subtítulo — a programação real do produto (cron 08:00, follow-up a cada 2 dias, para depois de 3 sem resposta) | SUA PROGRAMAÇÃO · ◷ todo dia às 08:00 · ⟳ follow-up a cada 2 dias · ⛨ para depois de 3 sem resposta | | |
| cob.l1 | manter | | Halal · PRODUTO 2 — EXPORTADOR 1 · vence em 15/09/2026 · A vencer · disparando… → e-mail enviado | | |
| cob.l2 | manter | | Kosher · PRODUTO 1 — EXPORTADOR 3 · venceu em 30/06/2026 · Vencido · disparando… → e-mail enviado | | |
| cob.nota | manter | | ✦ A resposta do fornecedor entra sozinha no drive, já com o nome padrão. | | |
| cob.rodape | reescrito (2026-09-21) | rodapé, sem botões | disparando a cobrança aos fornecedores… → ✓ 2 e-mails enviados · automático, no prazo programado | | |

### Documento recebido (resposta do exportador — novo em 2026-09-21, pedido: "fluxo de receber o doc do exportador e salvar na pasta do OneDrive de forma automática". No produto é a esteira de e-mail — o anexo da resposta à cobrança é lido, classificado e PUBLICADO na pasta do produto no drive com o nome padrão, a pendência baixa sozinha e o exportador recebe o retorno na mesma thread — complementar à sincronização do drive, por isso a cena só complementa a anterior)

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| rx.voo1 | novo (2026-09-21, a pedido: "adicionar uma animação de enviar a cobrança e receber o documento") | pílula que sai do rodapé do diálogo da cobrança para a direita, rumo ao exportador | ✉ cobrança · EXPORTADOR 1 | | |
| rx.voo2 | novo (2026-09-21) | pílula que volta da direita e pousa virando o diálogo | 📄 resposta · 2 dias depois | | |
| rx.titulo | novo | título | Documento recebido ✦ FS1 · resposta do EXPORTADOR 1 · 2 dias depois | | |
| rx.subtitulo | novo | linha abaixo | O exportador respondeu ao e-mail da cobrança com o certificado em anexo. Ninguém baixou, renomeou nem arquivou nada. | | |
| rx.anexo | novo | cartão do anexo | Halal_cert_2027_final.pdf · anexo · Re: EXPORTADOR 1 + FARADAYS │ SOLICITAÇÃO DE RENOVAÇÃO DE DOCUMENTOS - PRODUTO 2 - MARCA A · PDF · 1,1 MB | | |
| rx.p1 | novo | passo 1 (pendente → lendo → feito) | ler o anexo → ✦ lendo o anexo… → ✓ Halal · PRODUTO 2 · MARCA A · emitido em 16/09/2026 · válido até 15/09/2027 | | |
| rx.p2 | novo | passo 2 | salvar na pasta do produto, no drive → ✦ salvando no drive… → 📁 salvo em Qualidade › Documentos › PRODUTO 2 › MARCA A · Halal — PRODUTO 2 — MARCA A — VAL 15.09.2027.pdf | | |
| rx.p3 | novo | passo 3 | baixar a pendência e responder ao exportador → ✦ baixando a pendência… → ✓ Pendência baixada · retorno enviado na mesma conversa · "Halal RECEBIDO, válido até 15/09/2027 — não há mais pendências para o PRODUTO 2." | | |
| rx.nota | novo | rodapé | ✦ O que chega por e-mail e o que já está nas pastas do drive passam pela mesma IA: ela lê, nomeia e organiza. | | |

### Aba Pastas

Saiu do roteiro em 2026-09-11 (deu lugar à cobrança). A árvore continua descrita na versão anterior deste arquivo, no git.

## 3 · Conversas

### Lista de representantes

| id | Ação | Atual | Novo |
|---|---|---|---|
| wa.busca | manter | Buscar por nome ou número... · Novo | |
| wa.r1 (aberta) | manter | Carlos Mendes · Agente IA · FS1: Cotação COT-V-0188 emitida — PDF anexo · agora | |
| wa.r2 | manter | Ana Souza · Você: Tabela de setembro sai dia 01 · há 2 h | |
| wa.r3 | manter | João Pereira (Gestor) · Pedido PD-0453 faturado, obrigado! · há 5 h | |
| wa.r4 | manter | Marcos Lima · Agente IA · FS1: NF 12.340 e boleto enviados · ontem | |
| wa.r5 | manter | Renata Alves · Consegue cotar o Produto 4 pro Cliente 3? · ontem · 2 não lidas | |

### Conversa (os mesmos textos aparecem no celular e no painel do sistema — estão em `MSG` no `build.mjs`)

| id | Ação | Quem | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| wa.header | manter | cabeçalho | Carlos Mendes · +55 11 98765-4321 · Rep. Sudeste · ● ao vivo · botão Cotações | | |
| wa.dia | manter | separador | Hoje | | |
| wa.m1 | manter | representante · 09:41 · **áudio** (onda, 0:07) + transcrição da IA | Bom dia! Preciso cotar 2 toneladas do Produto 1 pro Cliente 1, em São Paulo, entrega CIF. | | Bom dia! Cota 2 toneladas do Produto 1 pro Cliente 1, entrega CIF em São Paulo? |
| wa.m2 | reescrito (2026-09-21 — feedback: "na data de entrega colocar fora do pedido mínimo"; "embaixo de mudo para FOB: solicitar pagamento à vista ou pedir mais crédito ao financeiro"; "colocar último preço cotado e a data do último faturado e último cotado") | IA · 09:41 | Entendi: **2 t de PRODUTO 1** · CLIENTE 1 · SP · CIF. + cartão de 6 linhas: Preço de tabela USD 4,85/kg · Último cotado USD 4,90/kg · 02/09 · Último faturado USD 4,80/kg · 12/08 · Lead time 15 dias · **⚠ Data de entrega 20/10 — fora do pedido mínimo** (nota vermelha sob o rótulo) · **⚠ Crédito disponível R$ 38 mil** + "Mudo para FOB ou subo para 5 t?" / "Mude o pagamento para à vista ou peça mais crédito ao financeiro." (2026-09-22) — no produto o bot mostra tabela vigente, último faturado (data, NF) e última cotação (número, data); pedido mínimo, crédito e as duas saídas NÃO existem (avisar) | | |
| wa.m3 | reescrito (2026-09-22) | representante · 09:42 | Muda pra FOB e sobe pra 5 t — o crédito eu resolvo com o financeiro. | | Então manda FOB, 5 t. |
| wa.m4 | reescrito (2026-09-22: saiu "Pedido de crédito enviado ao financeiro" — não é a IA que pede) | IA · 09:42 | Cotação COT-V-0188 emitida — 5 t FOB, ICMS SP e câmbio do dia já calculados. + (arquivo) COT-V-0188 · CLIENTE 1 SP.pdf · 5.000 kg · PRODUTO 1 · 1 pág. | | |
| wa.m5 | manter | representante · 09:44 (fase A, no celular; no sistema já aparece salva) | Me manda o COA do lote 2408 e a NF do último pedido? | | |
| wa.m6 | manter | IA · 09:44 (fase A, no celular) — **NF e boleto ainda não existem no bot** | Segue o COA e a NF 12.345, faturada em 05/09 (R$ 96.000). O boleto vence em 05/10 — 2ª via junto. + (arquivos) COA — PRODUTO 1 — lote 2408.pdf · PDF · 212 KB · SharePoint / NF 12.345 + boleto (2ª via).pdf · faturada 05/09 · vence 05/10 | | |
| wa.m7 | novo (2026-09-18) | representante · 09:46 | E a ficha técnica do PRODUTO 1, tem aí? | | |
| wa.m8 | novo (2026-09-18) | IA · 09:46 | Segue a ficha técnica vigente do PRODUTO 1 — MARCA A, revisão 4. + (arquivo) Ficha técnica — PRODUTO 1 — MARCA A.pdf · PDF · 164 KB · rev. 4 · SharePoint | | |
| wa.m9 | novo (2026-09-21, pedido do cliente: "consultar rastreio de uma NF") | representante · 09:48 | Onde está a NF 12.340 do Cliente 2? | | |
| wa.m10 | novo (2026-09-21 — MOCADO: no produto a opção "Notas fiscais — NF, boletos e rastreio" do menu está EM BREVE e a transportadora não é exposta ao bot; avisar) | IA · 09:48 | **NF 12.340 · CLIENTE 2 · Curitiba** + cartão: Faturada 16/09 · R$ 64.200 · PD-0451 · Transportadora Rápido Norte · CT-e 55.812 · Status Em trânsito desde 17/09 · SP · Previsão de entrega **22/09 · rastreio RN-88213** | | |
| wa.r1 | novo (2026-09-18) | conversa LIMPA · IA · 17:40 (horário configurável — a copy não cita hora) | **Resumo do dia · 18/09** + cartão: Faturado hoje R$ 186 mil · 3 pedidos / Mês até agora R$ 1,42 mi · 68% da meta / Projeção do mês R$ 2,08 mi · meta R$ 2,0 mi ✓ (verde) + "Enviado no horário que você definir. O gestor recebe o consolidado do time." | | |
| wa.r2 | novo (2026-09-18) | representante · 17:42 | Manda o relatório de faturamento do mês? | | |
| wa.r3 | novo (2026-09-18) | IA · 17:42 (mocado) | Segue: volume e faturamento de junho a setembro, com o PDF completo. + cartão Relatório de faturamento · jun–set/2026 · Carlos Mendes com duas colunas de barras — Volume (t): jun 31 · jul 35 · ago 38 · set 42; Faturamento (R$ mi): 1,02 · 1,18 · 1,31 · 1,42 — + (arquivo) Relatório de faturamento — set/2026.pdf · PDF · 3 pág. · volume, faturamento e projeção | | |
| wa.ia | manter | rótulo nos balões da IA (sistema e mini balões da Visão Geral) | Agente IA · FS1 | | Faradays · IA |
| wa.compositor | manter | placeholder | Mensagem para o representante... | | |

### Visão Geral (mural de conversas, fecha o cap. 3)

| id | Ação | Onde | Atual | Novo |
|---|---|---|---|---|
| vg.rank | novo (2026-09-20) | painel à esquerda das conversas (420px), linhas entrando em cascata (sem barra de progresso — removida a pedido) | Ranking dos representantes · últimos 7 dias · por valor cotado — # · Representante · Cotado · Volume · Cot. · Itens → 1 Carlos Mendes · R$ 486 mil · 14 t · 6 · 11 / 2 Renata Alves · R$ 412 mil · 12 t · 5 · 9 / 3 Marcos Lima · R$ 338 mil · 10 t · 4 · 7 / 4 Ana Souza · R$ 275 mil · 8 t · 4 · 6 / 5 João Pereira · R$ 231 mil · 7 t · 3 · 5 / 6 Paulo Reis · R$ 84 mil · 2,5 t · 1 · 2 · TIME · 7 DIAS R$ 1,83 mi · 53,5 t · 23 · 40 · rodapé ✦ "Cotações e itens contados pela FS1 direto das conversas." (valores mocados) | |
| vg.titulo | manter | cabeçalho | Visão Geral · Conversas dos representantes · atualizado agora · legenda do semáforo (ao vivo · cotou hoje · parado) · ● tempo real | |
| vg.c1 | manter | card | CM · Carlos Mendes · Rep. Sudeste · ao vivo · agora — pedido do COA e da NF + resposta da IA | |
| vg.c2 (ao vivo, depois da faixa) | manter | card (linha de cima) | RA · Renata Alves · Rep. Sul · cotou hoje → ao vivo · ontem → agora — Consegue cotar o Produto 4 pro Cliente 3? / Tabela USD 8,90/kg · último faturado USD 8,75/kg · lead time 12 dias. Quantos kg? / **chega:** Fechou 1 t. Manda a cotação! / **IA:** Cotação COT-V-0189 emitida — PDF anexo. | |
| vg.c3 (ao vivo, antes da faixa) | manter | card (linha de cima) | JP · João Pereira · Rep. Nordeste · parado → ao vivo · há 5 h → agora — Pedido PD-0453 faturado, obrigado! / De nada! NF 12.331 e boleto já estão com o cliente. / **chega:** Cliente 2 pediu 500 kg do Produto 3. Consegue cotar? / **IA:** Claro: PRODUTO 3 · 500 kg · CLIENTE 2 · SP. Tabela USD 12,40/kg · lead time 10 dias. Confirmo? | |
| vg.c4 | manter | card | ML · Marcos Lima · Rep. Centro-Oeste · ao vivo · há 4 min — Me manda a NF do último pedido do Cliente 4? / NF 12.340 e boleto (2ª via) enviados. | |
| vg.c5 | manter | card (linha de baixo, sob a faixa) | AS · Ana Souza · Rep. Sul · cotou hoje · há 2 h — A tabela de setembro já saiu? / Sai dia 01. Quer que eu te avise? / Pode ser! | |
| vg.c6 | manter | card | PR · Paulo Reis · Rep. Norte · parado · há 3 dias — Preciso do Halal do Produto 2. / Segue o HALAL — PRODUTO 2 — MARCA A, válido até 15/09/2026. | |

### Celular do representante

| id | Ação | Onde | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| cel.contato | manter | cabeçalho | Faradays | | |
| cel.status | manter | cabeçalho, sob o nome | ✦ Agente IA · FS1 · responde na hora | | Agente IA · FS1 · online |
| cel.digitando | manter | cabeçalho, enquanto a IA "pensa" | digitando… (shimmer; a tela ganha o glow de borda estilo Siri) | | |
| cel.rotulo | manter | topo dos balões recebidos | ✦ Agente IA · FS1 (o "resposta automática" saiu em 2026-09-17) | | Respondido pela IA |
| cel.transcricao | manter | dentro do balão de áudio | ✦ transcrição + o texto de wa.m1 | | |
| cel.compositor | manter | placeholder | Mensagem | | |

### Timeline de legendas (fase A, à esquerda do celular)

Cada passo entra (ponto + texto, 36px) e **fica**: o anterior esmaece quando o seguinte entra e um trilho fino liga os pontos; a pilha sai inteira quando o sistema entra. Textos em `CAP_STEPS` no `build.mjs`.

| id | Ação | Tempo | Atual | Novo | Alternativas |
|---|---|---|---|---|---|
| leg.1 | reescrito (2026-09-21, a pedido) | 2:04 (o pedido chega) | A IA entende a solicitação por áudio, texto ou foto. | | Manda como sempre mandou — a IA lê. |
| leg.2 | reescrito (2026-09-21) | 2:07 (IA responde) | Responde com preço de tabela, último cotado, último faturado, lead time e crédito — e marca em vermelho o que trava o pedido. | | Os números e os alertas, em segundos. |
| leg.3 | reescrito (2026-09-18) | 2:13 (cotação) | Ajustou? A cotação sai na hora, com ICMS e câmbio do dia. | | Confirmou, cotou: ICMS e câmbio do dia já dentro. |
| leg.4 | reescrito (2026-09-18) | 2:16 (COA, NF, boleto e ficha técnica) | Pediu COA, NF, boleto ou ficha técnica? A IA manda na hora. | | Documentos, NF, boleto e ficha técnica no mesmo chat. |
| leg.5 | novo (2026-09-21) | 2:28 (rastreio da NF) | Rastreio de uma NF? Ela consulta e responde no mesmo chat. | | Onde está a nota? Ela sabe. |
| leg.6 | novo (2026-09-18; era leg.5) | 2:32 (conversa do resumo — a timeline RESETA: os 4 passos anteriores saem e esta começa do zero; a copy NÃO cita hora, o horário é configurável) | Resumo do dia e projeção, no horário que você escolher — para o representante e, consolidado, para o gestor. | | Faturamento do dia e projeção, todo dia. |
| leg.7 | novo (2026-09-18; era leg.6) | 2:38 (relatório) | Relatório de volume e faturamento? No mesmo chat, com o PDF. | | Relatório quando quiser, sem planilha. |
| leg.save | REMOVIDO (2026-09-18, a pedido: saiu a cena inteira do zoom na conversa salva) | era a legenda à direita, com overline "FS1 · Conversas" | Toda conversa fica salva no sistema: cotação, documentos, NF e boleto. | | |
| leg.vg | manter | 2:46 (Visão Geral, faixa escura que sobe 3,5 s depois da página; as mensagens ao vivo param enquanto ela está em cena) | Todas as conversas dos representantes, em tempo real. | | O time inteiro vendendo, numa tela só. |
