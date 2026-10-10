# Referência: getenter.ai → home institucional da Faradays

Levantamento feito em 2026-10-09 direto no site (DOM, estilos computados e
scroll frame a frame). Capturas em `docs/assets/getenter/01…24.jpg`, na ordem
de rolagem.

Objetivo: chegar a uma home **com a mesma postura, ritmo e componentes** da
Enter, mas com a marca (tokens, fontes, palco) e o conteúdo da Faradays.

---

## 1. DNA do site (o que faz ele parecer "assim")

| Dimensão   | Enter                                                                                                                                                       | Faradays (equivalente no repo)                                                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stack      | Webflow + GSAP 3.15 (ScrollTrigger, SplitText) + Swiper 10 + dotLottie + Finsweet. Sem Lenis.                                                               | Next 16 + GSAP (mesmos plugins) + Lenis global + motion. Já temos tudo.                                                                                                              |
| Canvas     | `container-large` 1920px, goteira 40px em 1440.                                                                                                             | `max-w-page` 1920px + `px-7`. Idêntico.                                                                                                                                              |
| Título     | **Noto Serif Light 300**, 57.6px / lh 1.2 / tracking -0.2px no hero; H2 39–45px. Sempre serif, sempre light.                                                | `font-serif` = Merriweather (TYPE.serif). O hero da `/distribuicao` já usa PT Serif. Trocar `TYPE.serif` por **Noto Serif** (Google, variável) e usar `font-light`.                  |
| Corpo / UI | Geist variável, 14–16px. Botões 14px, eyebrows 12px uppercase tracking 0.2px a 64% preto.                                                                   | Aspekta (body) + Geist (heading). Manter Aspekta no corpo; eyebrows em `font-mono text-xs uppercase` como já fazemos.                                                                |
| Mono       | Geist Mono só no destaque do anúncio.                                                                                                                       | JetBrains Mono.                                                                                                                                                                      |
| Cores      | Fundo #fff; texto #000 e #333; mudo rgba(0,0,0,.5); superfícies **#f3f3f3**; acento **#FFAE35** (âmbar) só em CTA e links do anúncio; footer cinza #d9d9d9. | Fundo `.light-home` #f8f8f8; `--muted` 92%; acento = `--brand` #0065e0. O âmbar vira o azul da marca. **Uma cor de acento só, em pouquíssimos lugares** — é isso que dá o ar sóbrio. |
| Raios      | Botão 8px; cards de accordion 12px; **fotos e vídeos sem raio** (0px) nos blocos grandes, 8–12px nos cards do carrossel.                                    | `--radius` 0.45rem (≈7px) → `rounded-lg` nos botões, `rounded-xl` nos cards. Fotos quadradas.                                                                                        |
| Linhas     | Fios de 1px rgba(0,0,0,.1) separando nav, grades de logos, notícias e stats.                                                                                | `border-border`. A `PartnersSection` já tem a grade de fios.                                                                                                                         |
| Movimento  | Fade-up por seção; dois pins com scrub (hero e depoimentos); carrosséis com autoplay. Nada de 3D, nada de glow.                                             | `Reveal` cobre o fade-up. Pins com `ScrollTrigger.pin` + Lenis já rodam no `FeatureIndex`.                                                                                           |
| Fotos      | Retratos reais, luz natural, meio-corpo, fundo de escritório. Vídeos `.webm` mudos em loop no hero.                                                         | Precisamos produzir (ver §5). Sem foto real o site não "fica igual" — é o ativo mais importante.                                                                                     |

---

## 2. Inventário, de cima para baixo

Alturas em 1440×900. "Mecânica" descreve o que o scroll faz.

### 2.1 Barra de anúncio (22px, preta)

Uma linha: frase + link âmbar uppercase "SAIBA MAIS". Faz parte do nav fixo
(nav total = 145px: barra + 1px fio + logo 64px + fio).
**Faradays:** `NavBar` ganha uma `AnnouncementBar` opcional, texto do
`links.ts`. Fundo `bg-foreground`, link em `text-brand`.

### 2.2 Nav (fixo, branco, fio inferior)

Só o wordmark à esquerda; menu enxuto à direita (Produtos ▾ com cards
descritivos, Cases, Carreiras, CTA). Globo flutuante no canto inferior
direito troca PT/EN.
**Faradays:** `NavBar` já tem dropdown Soluções e toggle de idioma. Mover o
toggle para um botão flutuante circular (`fixed bottom-6 right-6`).

### 2.3 Hero pinado (3150px de scroll) — capturas 01, 07–10

Layout em repouso: coluna esquerda headline serif em 4 linhas + CTA âmbar
com seta; coluna direita retrato em vídeo 685×732 com **duas lâminas cinza
deslocadas atrás** (profundidade de "pilha de cards").
Mecânica (`pin-spacer` do GSAP, scrub):

1. 0–900px: o retrato desliza para a direita e some pela borda; as lâminas
   acompanham.
2. 900–1900px: a headline sobe e sai; entra pela esquerda um **Swiper de 3
   cards de vídeo** (560×640, foto em loop, gradiente escuro embaixo, aspas +
   nome/empresa, botão play, logo do cliente no topo).
3. 1900–3150px: os cards sobem até o pin soltar.
   **Faradays:** novo `PinnedHero`. Copy: `HERO_COPY` já existe. Os 3 cards
   viram depoimentos em vídeo dos clientes da distribuição; enquanto não houver
   vídeo, foto estática com o mesmo overlay.

### 2.4 Grade de logos — capturas 11–13

H2 serif centralizado ("Empresas com parcerias de longo prazo") + grade de 3
colunas com fios, 1 logo por célula em cinza, ~6 linhas.
**Faradays:** `PartnersSection` é exatamente isso (grade técnica com fios e
logo monocromático). Só trocar o título e passar para 3 colunas.

### 2.5 Billboard de case (653px) — captura 15

Foto full-bleed com gradiente escuro à direita; headline serif branca;
**duas linhas de stat** (rótulo pequeno à esquerda, valor serif à direita,
fio entre elas); CTA âmbar.
**Faradays:** novo `CaseBillboard`. Dados: `StatsBand` tem o
`AnimatedCounter`; reaproveitar o contador nos valores.

### 2.6 Como funciona (1088px) — capturas 16–17

H2 serif centralizado. Três colunas: lista de passos à esquerda (quadrado
preto como bullet, passo ativo em preto, os outros a 50%), **Lottie no
centro** sobre card #f3f3f3 arredondado (ícones de integrações orbitando o
logo), texto do passo à direita. Dois Swipers sincronizados com autoplay.
**Faradays:** `FeatureIndex` já faz lista sticky + troca de cena por scroll
com `HOME_FEATURES`. Mudar só a composição: passos à esquerda, cena no
centro (o `FeatureGraphic`/`MonfizaAppDemo` no lugar do Lottie), descrição
à direita. Autoplay em vez de scroll é opcional — scroll é melhor com Lenis.

### 2.7 Depoimentos pinados (3600px) — capturas 18–20

`depoimentos-sticky` de 853px. Esquerda: H2 serif "Eles contam melhor do
que a gente" + CTA ghost. Direita: 4 cards (foto quadrada 180px + aspas +
nome + cargo) em **duas fileiras que andam na horizontal com o scroll**,
fileira de cima para um lado, a de baixo para o outro.
**Faradays:** novo `TestimonialsScroll`. A `TestimonialsSection` atual
(leque de 7 cards com drag, estilo Osmo) é outra ideia — guardar e não usar
aqui.

### 2.8 Segurança / accordion (1179px) — capturas 21–22

Esquerda: H3 serif + CTA ghost. Direita: 4 cards #f3f3f3 raio 12 com título
e "+"; abre com fade. Sem fio entre eles, só gap.
**Faradays:** adicionar `accordion` do shadcn
(`pnpm dlx shadcn@latest add accordion`) e um `FaqCards` com os quatro
pontos de LGPD/segurança já escritos em `/privacidade` e `/subprocessadores`.

### 2.9 Produtos / duas frentes (1803px) — capturas 22–24

H2 serif sticky à esquerda; à direita dois blocos escalonados (foto 2:3 +
título serif + parágrafo), o segundo deslocado para a direita e para baixo.
**Faradays:** `SolutionsIndex` tem os dados (`SOLUTIONS`). Novo layout
`SolutionsStaggered`: uma foto por solução.

### 2.10 Notícias (1006px) — capturas 24–25

"Notícias" em serif gigante (57.6px) à esquerda e CTA âmbar à direita; três
cards em grade com fios: eyebrow de data (mono/uppercase), título, foto
quadrada embaixo. Swiper no mobile.
**Faradays:** já existe `/blog`. Novo `NewsGrid` lendo os 3 posts mais
recentes.

### 2.11 Billboard final (614px) — captura 26

Foto full-bleed, "Just press Enter" serif branco, CTA âmbar na mesma linha.
**Faradays:** `CtaSection` vira `CtaBillboard` (foto + frase + botão). A
frase-assinatura é o equivalente ao "Just press Enter": precisa de uma.

### 2.12 Footer — captura 27

Cinza claro; 4 colunas de links (Produtos / Recursos / Contato / Legal);
linha com sociais, PT/EN, copyright e crédito; **wordmark gigante cortado
na base**.
**Faradays:** `HomeFooter` já tem o wordmark gigante em arco e
`FOOTER_LEGAL_LINKS`. Falta só a fileira de 4 colunas.

---

## 3. Mapa: o que existe, o que adapta, o que cria

| Seção Enter                  | Estado          | Componente Faradays                          |
| ---------------------------- | --------------- | -------------------------------------------- |
| Anúncio                      | criar (pequeno) | `AnnouncementBar` dentro de `NavBar`         |
| Nav                          | adaptar         | `NavBar` + globo flutuante de idioma         |
| Hero pinado + cards de vídeo | **criar**       | `PinnedHero` (`HERO_COPY`, `ArrowCtaButton`) |
| Logos                        | existe          | `PartnersSection` (3 colunas)                |
| Billboard de case            | **criar**       | `CaseBillboard` (`AnimatedCounter`)          |
| Como funciona                | adaptar         | `FeatureIndex` em 3 colunas                  |
| Depoimentos horizontais      | **criar**       | `TestimonialsScroll`                         |
| Accordion                    | criar (shadcn)  | `FaqCards`                                   |
| Duas frentes                 | adaptar         | `SolutionsStaggered` sobre `SOLUTIONS`       |
| Notícias                     | criar           | `NewsGrid` sobre `/blog`                     |
| Billboard final              | adaptar         | `CtaBillboard`                               |
| Footer                       | adaptar         | `HomeFooter` + 4 colunas                     |

Quatro componentes novos de verdade; o resto é recomposição.

---

## 4. Plano de execução

1. **Tema "institucional"** — um escopo `.institucional` no `globals.css`
   com fundo #fff, superfície #f3f3f3, texto #000/#333, acento `--brand`.
   Trocar `TYPE.serif` para Noto Serif e conferir no `/fonts`.
2. **Rota de staging** — montar em `src/app/_new/page.tsx` (já é a staging
   da próxima home, `noindex`). Ordem de seções = §2. Quando aprovada, vira a
   raiz, e a home atual estilo Berkshire vai para `_old/`.
3. **Casca primeiro** — nav + anúncio + footer + billboard final, todas as
   seções com `Reveal`. Em um dia dá para ver a página inteira com
   placeholders.
4. **Pins** — `PinnedHero` e `TestimonialsScroll`, os dois com
   `ScrollTrigger.pin` + `scrub: true`, dentro do Lenis global (ver
   `FeatureIndex` como modelo). Desligar o pin abaixo de `lg`.
5. **Conteúdo** — copy nova por seção (§5), fotos e vídeos.
6. **Polimento** — `prefers-reduced-motion`, mobile (a Enter empilha tudo e
   troca pins por Swipers), Lighthouse.

Nada disso exige dependência nova além do `accordion` do shadcn.

---

## 5. O que a Faradays precisa produzir (não é código)

- **Fotos reais**: 1 retrato em vídeo para o hero (loop mudo, 10 s), 3
  retratos para os cards de depoimento, 2 fotos de operação para "duas
  frentes", 2 panorâmicas para os billboards. É o que mais separa a Enter de
  um template.
- **Logos de clientes** em PNG com alpha (a `PartnersSection` já mascara).
- **Dois números de case** para o billboard (ex.: tempo de cotação, cotações
  por mês).
- **Quatro depoimentos** curtos com nome e cargo.
- **Frase-assinatura** para o fecho (o "Just press Enter" da Faradays).
- **Copy do anúncio** (um lançamento, um estudo, uma vaga).

---

## 6. Detalhes de medida para quem for implementar

- Hero: headline `text-[3.6rem] leading-[1.2] tracking-[-0.2px] font-light`,
  largura máx. ~6 col; retrato 685×732 com duas lâminas `bg-[#f3f3f3]`
  deslocadas (-24px, -48px) atrás; CTA `h-14 px-6 text-sm tracking-[0.2px]
rounded-lg` com seta.
- Cards de vídeo: 560×640, `rounded-xl`, overlay
  `bg-gradient-to-t from-black/70`, logo do cliente no canto superior
  esquerdo, play 40px, aspas 16px/1.4 brancas, autor 12px.
- Espaçamento entre seções: 124px (`spacing-section-medium`) — `py-31`.
- Stats do billboard: rótulo 12px a 64% branco, valor serif 24px, fio
  `border-white/20`.
- Eyebrow de data: 12px uppercase tracking 0.2px, `text-black/64`.
- Accordion: card `bg-[#f3f3f3] rounded-xl px-8 py-7`, título 18px, "+" 16px.
