# drafts/

Componentes fora do ar, guardados para reuso. Não são importados por
nenhuma rota — mas o tsconfig inclui a pasta, então precisam continuar
compilando.

- `feature-figures.tsx` — manifesto "Uma nova espécie de software
  operacional." (grade técnica de 5 colunas + FIG 01/02/03). Saiu da
  `FeaturesSection` da `/distribuicao` em 2026-08-24. Para voltar:
  mover para `src/components/landing/`, restaurar o import de
  `feature-figures-art` para o alias `@/` e renderizar antes do
  `<MoreFeatures />`.
- `feature-figures-art.tsx` — FIG 02 (nós) e FIG 03 (momentum) usados
  só pelo manifesto acima.
- `testimonials-progress-bar.tsx` — barra de carregamento + autoplay dos
  relatos (fio de 1px que enche em 8s e avança o leque). Saiu da
  `TestimonialsSection` em 2026-08-25, quando a seção virou só o leque de
  cards (drag-only, como o osmo.supply). Para voltar: mover para
  `src/components/landing/`, renderizar acima do deck e passar
  `cycle={index}`, `paused={hovered}` e `onComplete={() => go(1)}` — o
  deck precisa voltar a expor o índice do card da frente em estado React.
