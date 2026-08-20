# Ideia: header do /blog reagindo ao scroll

Proposta, não implementação. Registra o que fazer, o que já existe no
projeto para apoiar e onde estão as armadilhas — para quem pegar isso depois
não redescobrir tudo.

## O problema

A capa do `/blog` abre com uma faixa alta: rótulo, `Ideias em produção`,
subtítulo e, ao lado, o card de destaque. É uma boa primeira tela e um peso
morto na segunda — quem rolou já decidiu que veio pela lista, e a faixa
continua ocupando altura enquanto a grade sobe.

Some-se a isso o painel de filtros, que a partir de `lg` é sticky em
`top-20`. Hoje ele gruda logo abaixo da NavBar e convive com a faixa ainda
inteira acima dele.

## Duas direções

### A. Header que sai de cena

O bloco esmaece e sobe um pouco conforme os primeiros ~60svh de rolagem,
liberando a tela para a lista. Ganho direto de densidade; risco de a página
parecer "pular" se a saída for rápida demais.

### B. Parallax

O bloco de texto e o card de destaque sobem em velocidades diferentes (o
destaque um pouco mais devagar), criando profundidade sem nada sumir. Mais
discreto e mais fácil de errar: parallax em bloco de texto grande cansa a
leitura, e o efeito precisa ser pequeno o bastante para não competir com a
grade.

**Recomendação:** começar por A com um toque de B — a faixa esmaece e sobe,
e dentro dela o destaque sobe um pouco menos que o texto. Um gesto só, com
profundidade, sem transformar a capa num carrossel de efeitos.

## Como implementar aqui

O projeto já tem tudo o que isso precisa; não há biblioteca nova a entrar.

- **GSAP + ScrollTrigger com `scrub`.** Lenis é global
  (`src/components/lenis-provider.tsx`) e roda no ticker do GSAP
  (`autoRaf: false`), então ScrollTrigger e smooth scroll já compartilham um
  RAF — animação com `scrub` acompanha o Lenis sem trabalho extra.
- **Gate no `usePageReady`** (`src/lib/page-ready.ts`). ScrollTrigger mede
  posições na criação; criar antes de o loader sair mede debaixo do overlay.
  É o que `Reveal` e o índice do post já fazem — seguir o mesmo padrão.
- **`prefers-reduced-motion`.** O padrão do projeto é zerar durações (ver
  `post-toc.tsx` e `split-swap-text.tsx`), não remover o comportamento.
  Aqui, com reduced-motion, o header simplesmente fica parado.

Esqueleto:

```tsx
// Dentro de um client component que embrulhe a faixa do cabeçalho.
const ready = usePageReady()

useEffect(() => {
	if (!ready) return
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
	if (reduce) return

	const ctx = gsap.context(() => {
		gsap.to('[data-blog-header]', {
			autoAlpha: 0,
			y: -40,
			ease: 'none',
			scrollTrigger: {
				trigger: '[data-blog-header]',
				start: 'top top+=92', // a NavBar tem 92px (p-7 + h-9)
				end: '+=60%',
				scrub: true
			}
		})
		// Toque de parallax: o destaque sobe menos que o texto.
		gsap.to('[data-blog-featured]', {
			y: -16,
			ease: 'none',
			scrollTrigger: {
				/* mesmo trigger, mesmo scrub */
			}
		})
	}, containerRef)

	return () => ctx.revert()
}, [ready])
```

## Armadilhas conhecidas

1. **`autoAlpha` chega a `visibility: hidden`.** Quando o header some, os
   links dentro dele não podem continuar focáveis. `autoAlpha` já resolve
   (`opacity: 0` vira `visibility: hidden`), mas o card de destaque é um
   `<a>` — vale conferir na navegação por teclado que ele sai mesmo da
   ordem de foco, e usar `inert` se não sair.

2. **O sticky dos filtros é medido, não declarado.** `top-20` foi escolhido
   contra a altura real da NavBar (92px: `p-7` + linha de `h-9`), com folga.
   Se o header passar a encolher/sumir, reconferir se o painel ainda encosta
   onde deve — o cálculo do sticky não muda, mas a leitura visual sim.

3. **Layout shift.** Animar `y`/`opacity` não tira o bloco do fluxo, então a
   grade **não** sobe — a faixa vira espaço vazio. Se a intenção for
   recuperar a altura, é `height`/`margin` (custa layout a cada frame) ou
   uma faixa `position: sticky` que a lista cobre. A segunda é mais barata e
   costuma ficar melhor; a primeira só com `will-change` e medindo.

4. **Duas fontes de entrada no mesmo elemento.** O cabeçalho já entra pelo
   `Reveal`, que também é ScrollTrigger. Duas animações no mesmo alvo
   brigam por `autoAlpha`/`y` — a de scroll precisa começar depois de o
   `Reveal` terminar (ele é `once: true`), ou o `Reveal` sai do cabeçalho e
   a entrada passa a ser parte da mesma timeline. A segunda é mais limpa.
   O índice do post tem um caso análogo já resolvido: o thumb ficava preso
   invisível porque outro tween no mesmo alvo o matava (ver o comentário
   sobre `overwrite: 'auto'` em `post-toc.tsx`).

## Como avaliar se valeu

O ganho é altura recuperada na segunda tela — dá para medir contando quantos
cards ficam visíveis depois de rolar uma tela, antes e depois. Se o número
não mudar (caso da armadilha 3, sem recuperar a altura), o efeito é só
enfeite e provavelmente não se paga.
