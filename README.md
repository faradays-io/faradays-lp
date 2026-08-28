# Showcase Faradays

Vídeo de apresentação da plataforma em HTML animado (~75 s, 1920×1080), sem arquivo de vídeo — abre em qualquer navegador e roda sozinho.

- `index.html` — o showcase. Capítulos: Documentos direto do SharePoint · BID em um disparo (com a caixa de e-mail do exportador) · Conversas com IA (com o celular do representante).
- `mascote.html` — o mascote pixelado (estrela), com direções de cor, expressões e escala.

## Controles (index.html)

| Tecla | Ação |
|---|---|
| Espaço · clique · `K` | pausa / retoma |
| `→` · `←` | próximo / anterior capítulo |
| `R` | reinicia |
| `1` `2` `3` | pula para Documentos · BID · Conversas |

Parâmetros de URL: `?t=30` começa no segundo 30 · `?inicio=BID` começa num capítulo (`SharePoint`, `BID`, `Conversas`) · `?loop` repete.

## Regenerar

Os arquivos são gerados por `tools/build.mjs` (vídeo) e `tools/mascote.mjs` (mascote). Node 18+.

```sh
cd tools
node build.mjs && node mascote.mjs   # escreve index.html e mascote.html em tools/
cp index.html mascote.html ..
```

`icons.json` traz os paths dos ícones Phosphor usados; `aspekta.b64` é a fonte Aspekta embutida; `snap.mjs` captura quadros com Chrome headless (`node snap.mjs "$PWD/index.html" 5000 30000`).

Dados (preços, datas, representantes, exportadores) são fictícios, para demonstração.
