# drafts/

Componentes fora do ar, guardados para reuso. Não são importados por
nenhuma rota — mas o tsconfig inclui a pasta, então precisam continuar
compilando.

- `feature-figures.tsx` — manifesto "Uma nova espécie de software
  operacional." (grade técnica de 5 colunas + FIG 01/02/03). Saiu da
  `FeaturesSection` da `/distribuicao` em 2026-08-24. Para voltar:
  mover para `src/components/landing/` e renderizar antes do
  `<MoreFeatures />` (o import da arte já usa o alias `@/`).
  As ilustrações não moram mais aqui: FIG 01/02/03 foram promovidas para
  `src/components/landing/feature-figures-art.tsx` quando a `MoreFeatures`
  passou a usá-las, e este arquivo as importa de lá.
- `testimonials-progress-bar.tsx` — barra de carregamento + autoplay dos
  relatos (fio de 1px que enche em 8s e avança o leque). Saiu da
  `TestimonialsSection` em 2026-08-25, quando a seção virou só o leque de
  cards (drag-only, como o osmo.supply). Para voltar: mover para
  `src/components/landing/`, renderizar acima do deck e passar
  `cycle={index}`, `paused={hovered}` e `onComplete={() => go(1)}` — o
  deck precisa voltar a expor o índice do card da frente em estado React.
