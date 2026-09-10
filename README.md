# Showcase Faradays

Vídeo de apresentação da plataforma em HTML animado (~63 s em loop, com 2 s de tela em branco na cabeça, 1920×1080), com o mesmo ground da LP (`#f8f8f8` + film grain dinâmico do `GrainOverlay`), sem arquivo de vídeo — abre em qualquer navegador e roda sozinho. Pensado também para celular: na horizontal ocupa a tela toda; na vertical mostra a instrução de girar (o vídeo espera e retoma ao girar; dá para pular com "Assistir assim mesmo").

- `index.html` — o showcase. Abertura direto no logo Faradays com o slogan "IA para indústrias que compram e vendem muito bem" ("IA" e "muito bem" acendem para o gradiente de IA) e a timeline das três bolhas de produto (Cotação de compra em um clique · Agente de documentos com IA · Cotação de venda direto no WhatsApp) acendendo uma a uma. Capítulos na ordem do pitch (produto principal primeiro), cada um aberto por uma cartela de 3,1 s com a mesma timeline embaixo, só a bolha do capítulo acesa — na saída da cartela essa bolha voa para o canto superior esquerdo e fica lá como selo durante a demo (some nos zooms que cobrem o canto): "Peça cotações em um clique. / Compare as respostas com IA." (mini-cena: "Peça cotações" grande, zoom out revela a frase) (BID: lista → disparo → caixa de e-mail do exportador → comparativo) · "Documentos dos seus produtos vencendo? / Ainda precisa cobrar os fornecedores?" (SharePoint: zoom no painel do drive enquanto os 3 arquivos novos sincronizam sozinhos, corte seco para a vista inteira) · "Seu time de vendas inteiro / no WhatsApp" (só o celular do representante, a IA respondendo sozinha; no fim o sistema entra com a conversa inteira). A dica de girar o celular está desligada nos cues. Fechamento: logo com a bandeira em gradiente de IA e a barra de busca digitando `www.faradays.io` centralizado; o vídeo recomeça sozinho.
- `mascote.html` — o mascote pixelado (estrela), com direções de cor, expressões e escala.
- `legendas.md` — todo texto do vídeo, com colunas para manter/remover/trocar e sugestões de legendas narradas; edite e devolva para regenerar.

## Controles (index.html)

| Tecla | Ação |
|---|---|
| Espaço · clique/toque · `K` | pausa / retoma |
| `→` · `←` | próximo / anterior capítulo |
| `R` | reinicia |
| `1` `2` `3` | pula para BID · Documentos · Conversas |
| `F` | tela cheia (no celular tenta travar na horizontal) |

Ao passar o mouse (ou pausar) aparecem os controles: play/pause no centro, a linha do tempo dividida por capítulo embaixo (clique num trecho para pular até ele), o relógio e o botão de tela cheia. Somem 2 s depois enquanto o vídeo roda.

Em **tela cheia** o vídeo entra em modo apresentação/gravação: ao entrar, pausa e **nenhum overlay aparece** — nem linha do tempo, nem play/pause, nem cursor, nem ao mexer o mouse ou pausar. O espaço (ou o clique) começa a take numa tela limpa, que abre com os 2 s em branco; para sair, `Esc` ou `F`. Fora da tela cheia os controles voltam ao normal (fixos enquanto pausado).

Parâmetros de URL: `?t=30` começa no segundo 30 · `?pause` abre pausado · `?inicio=BID` começa num capítulo (`BID`, `SharePoint`, `Conversas`) · `?noloop` para no fechamento (por padrão repete).

## Regenerar

Os arquivos são gerados por `tools/build.mjs` (vídeo) e `tools/mascote.mjs` (mascote). Node 18+.

```sh
cd tools
node build.mjs && node mascote.mjs   # escreve index.html e mascote.html em tools/
cp index.html mascote.html ..
```

`icons.json` traz os paths dos ícones Phosphor usados; `aspekta.b64` é a fonte Aspekta embutida; `snap.mjs` captura quadros com Chrome headless (`node snap.mjs "$PWD/index.html" 5000 30000`).

Dados (preços, datas, representantes, exportadores) são fictícios, para demonstração.
