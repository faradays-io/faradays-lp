# Home institucional — passagem de bastão

Estado em 2026-10-10. Referência completa do site da Enter (medidas,
mecânicas, capturas): [`referencia-getenter.md`](referencia-getenter.md).

## Onde está

- **Página**: `src/app/_new/page.tsx`. Pasta privada, então o Next não serve.
- **Preview**: `src/app/new/page.tsx` re-exporta a página só em dev. Em
  produção `/new` dá 404, como já estava decidido.
- **Componentes**: `src/components/institucional/`, um arquivo por seção.
- **Copy PT/EN**: `src/components/institucional/copy.ts`. Tudo marcado
  `PLACEHOLDER` é inventado e não pode ir ao ar.
- **Tema**: escopo `.institucional` no `globals.css` (branco, `#f3f3f3`, fios a
  10%, Noto Serif no `font-serif`). Tamanhos `text-serif-xl/lg/md/sm` no
  `@theme`, registrados no `cn()`.
- **Fonte nova**: `notoSerif` em `src/lib/fonts.ts` (fora do `TYPE`, aparece em
  `/fonts`).
- **Acordeão**: `src/components/ui/accordion.tsx`, via shadcn.

```bash
pnpm dev
```

Abrir `http://localhost:3000/new`.

## O que está pronto

A casca inteira, na ordem da referência, com `Reveal` em cada seção:
anúncio + nav fixa, hero, grade de logos, billboard de case, como funciona
(autoplay de 6 s + clique), depoimentos, segurança (acordeão), soluções em
zigue-zague, notícias (3 posts mais recentes do blog), billboard de fecho e
rodapé com wordmark. Conferida em 1440 e 375 sem scroll horizontal; lint e
tsc limpos.

## Próximos passos, em ordem

1. **Pin do hero** (`hero.tsx`, referência §2.3). Prender a dobra por ~3150px
   com `ScrollTrigger.pin` + `scrub`:
    - 0–30%: o retrato e as lâminas saem pela direita.
    - 30–60%: a headline sobe e sai; os três cards de vídeo entram de baixo.
    - 60–100%: os cards sobem até o pin soltar.
    - Só em `lg+`; abaixo disso fica o layout empilhado atual.
    - Modelo de pin que já convive com o Lenis: `feature-index.tsx`.
2. **Pin dos depoimentos** (`testimonials.tsx`, §2.7). Seção de ~3600px, bloco
   sticky de ~850px; as duas fileiras andam na horizontal em sentidos
   opostos com o scroll. Hoje a segunda fileira só tem um recuo.
3. **Como funciona** (`how-it-works.tsx`). Trocar o `MediaSlot` do centro pela
   cena real de cada passo (`FeatureGraphic`/`MonfizaAppDemo`), num fundo
   claro.
4. **Mobile**: a referência troca os pins por carrosséis. Os cards de vídeo
   já rolam com snap; falta o mesmo nos depoimentos.

## Depende do Ely (não é código)

- Retrato em vídeo do hero, 3 vídeos de depoimento, 4 fotos de depoimento,
  4 fotos de soluções, 2 fotos de billboard.
- Logos dos clientes em PNG com alpha (hoje: Monfiza, Aventis + 7 vazios).
- Case real: empresa e dois números.
- Quatro depoimentos com nome e cargo.
- Frase-assinatura do fecho (hoje "A operação, resolvida.").
- Texto do anúncio no topo.

## Pegadinhas

- **`_new` não roteia**: qualquer pasta com `_` fica fora. Usar o preview em
  `/new` até virar a raiz.
- **Troca de idioma vai para `/`**: o `LanguageProvider` recarrega a raiz.
  Para ver o EN de `/new`, trocar e voltar para `/new`.
- **shadcn CLI**: ao adicionar o acordeão ele instalou um pacote npm chamado
  `cn` e importou dele. Revertido; conferir o import de `@/lib/utils` em todo
  componente novo do shadcn.
- **Segurança é factual**: os 4 cards vêm do Aviso de Privacidade. Mudar
  texto ali exige mudar `/privacidade` antes.
