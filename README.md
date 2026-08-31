# Showcase Faradays

Vídeo de apresentação da plataforma em HTML animado (~80 s em loop, 1920×1080), com o mesmo ground da LP (`#f8f8f8` + film grain dinâmico do `GrainOverlay`), sem arquivo de vídeo — abre em qualquer navegador e roda sozinho. Pensado também para celular: na horizontal ocupa a tela toda; na vertical mostra a instrução de girar (o vídeo espera e retoma ao girar; dá para pular com "Assistir assim mesmo").

- `index.html` — o showcase. Capítulos: Documentos direto do SharePoint (zoom no painel do drive enquanto os 3 arquivos novos sincronizam sozinhos, corte seco para a vista inteira) · Cotação em um clique (com a caixa de e-mail do exportador) · Conversas com IA (só o celular do representante, a IA respondendo sozinha; no fim o sistema entra com a conversa inteira). Abertura: dica animada de girar o celular, cartela-pergunta ("Ainda gerenciando manualmente / documentos, cotações e conversas?", com digitação, zoom out sobre mocks animados e saída em dolly 3D), "Conheça" e o logo; fechamento com a barra de busca digitando `www.faradays.io`, e o vídeo recomeça sozinho.
- `mascote.html` — o mascote pixelado (estrela), com direções de cor, expressões e escala.
- `legendas.md` — todo texto do vídeo, com colunas para manter/remover/trocar e sugestões de legendas narradas; edite e devolva para regenerar.

## Controles (index.html)

| Tecla | Ação |
|---|---|
| Espaço · clique/toque · `K` | pausa / retoma |
| `→` · `←` | próximo / anterior capítulo |
| `R` | reinicia |
| `1` `2` `3` | pula para Documentos · BID · Conversas |
| `F` | tela cheia (no celular tenta travar na horizontal) |

Ao passar o mouse (ou pausar) aparecem os controles: play/pause no centro, a linha do tempo dividida por capítulo embaixo (clique num trecho para pular até ele), o relógio e o botão de tela cheia. Somem 2 s depois enquanto o vídeo roda.

Parâmetros de URL: `?t=30` começa no segundo 30 · `?pause` abre pausado · `?inicio=BID` começa num capítulo (`SharePoint`, `BID`, `Conversas`) · `?noloop` para no fechamento (por padrão repete).

## Regenerar

Os arquivos são gerados por `tools/build.mjs` (vídeo) e `tools/mascote.mjs` (mascote). Node 18+.

```sh
cd tools
node build.mjs && node mascote.mjs   # escreve index.html e mascote.html em tools/
cp index.html mascote.html ..
```

`icons.json` traz os paths dos ícones Phosphor usados; `aspekta.b64` é a fonte Aspekta embutida; `snap.mjs` captura quadros com Chrome headless (`node snap.mjs "$PWD/index.html" 5000 30000`).

Dados (preços, datas, representantes, exportadores) são fictícios, para demonstração.
