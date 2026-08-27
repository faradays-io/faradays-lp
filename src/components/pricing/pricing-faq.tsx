'use client'

import { Plus } from '@phosphor-icons/react'

import { FibonacciSpiral } from '@/components/landing/fibonacci-spiral'
import { Reveal } from '@/components/landing/reveal'
import { SECTION_TITLE } from '@/components/landing/type'
import { useCopy } from '@/components/language-provider'
import type { Localized } from '@/lib/i18n'

type Faq = { q: string; a: string }

const COPY = {
	pt: {
		heading: 'Perguntas frequentes',
		items: [
			{
				q: 'Como conta o número de representantes?',
				a: 'Cada número de WhatsApp conectado ao assistente é um representante. Gestores e administradores que só usam o portal não entram na conta.'
			},
			{
				q: 'Posso mudar de plano depois?',
				a: 'Sim, a qualquer momento. Upgrade vale na hora, com a diferença proporcional ao ciclo; downgrade entra no ciclo seguinte. Nada se perde na troca — dados, histórico e configurações ficam.'
			},
			{
				q: 'O que muda no plano anual?',
				a: 'O valor por mês exibido já traz o desconto; a cobrança é feita de uma vez, no início do ciclo. Representantes adicionais dentro do ano seguem o mesmo valor proporcional.'
			},
			{
				q: 'Preciso trocar de ERP, e-mail ou drive?',
				a: 'Não. Os imports usam os relatórios que o seu ERP já gera; e-mail e SharePoint entram pela conta do Microsoft 365 que a empresa já tem. A implantação acontece em cima do que existe.'
			},
			{
				q: 'O que entra como "sob medida" no Enterprise?',
				a: 'Agentes de IA com prompt, ferramentas e conhecimento próprios, workflows desenhados com o seu time, modelo de IA à escolha e integrações diretas com sistemas legados — escopados junto no onboarding.'
			}
		] as Faq[]
	},
	en: {
		heading: 'Frequently asked questions',
		items: [
			{
				q: 'How are reps counted?',
				a: 'Every WhatsApp number connected to the assistant counts as one rep. Managers and admins who only use the portal do not count.'
			},
			{
				q: 'Can I change plans later?',
				a: 'Yes, at any time. Upgrades apply immediately, prorated to the cycle; downgrades take effect in the next cycle. Nothing is lost in the switch — data, history and settings stay.'
			},
			{
				q: 'What changes on the yearly plan?',
				a: 'The monthly price shown already includes the discount; billing happens once, at the start of the cycle. Extra reps added during the year follow the same prorated price.'
			},
			{
				q: 'Do I need to change ERP, e-mail or drive?',
				a: 'No. Imports use the reports your ERP already produces; e-mail and SharePoint come in through the Microsoft 365 account the company already has. Rollout happens on top of what exists.'
			},
			{
				q: 'What counts as "custom" in Enterprise?',
				a: 'AI agents with their own prompt, tools and knowledge, workflows designed with your team, your choice of AI model and direct integrations with legacy systems — scoped together during onboarding.'
			}
		] as Faq[]
	}
} satisfies Localized<{ heading: string; items: Faq[] }>

/**
 * FAQ da página de preços — `<details>` nativo (abre/fecha sem JS, acessível
 * de fábrica), título centrado e a lista numa coluna de leitura.
 *
 * Painel escuro de tela cheia como o dos testimonials: o escopo `.dark` dá
 * o mesmo #0f0f0e e já inverte texto e bordas, e a espiral de fundo é a
 * mesma, na mesma posição. O `min-h` é o que segura a altura da seção
 * quando uma resposta abre: com o conteúdo abaixo do mínimo, expandir só
 * redistribui o espaço em volta, sem empurrar o que vem depois. Os 68rem
 * cobrem as cinco respostas abertas de uma vez no desktop.
 */
export function PricingFaq() {
	const t = useCopy(COPY)

	return (
		<section
			id="faq"
			className="dark bg-background text-foreground relative flex min-h-[max(100svh,68rem)] flex-col justify-center overflow-hidden px-7 py-24 md:py-32"
		>
			{/* A espiral dos testimonials como textura, não desenho: 12 voltas
			   (duas a mais que lá, miolo menor), traço muito largo e quase na
			   cor do fundo. Entra inteira: a caixa ocupa 88% da largura (com
			   12 termos o bbox é 233×144, proporção áurea → ~78% da altura) e
			   é centrada por translate (-1/2, -1/2). O svg é
			   `overflow-visible` — senão o traço grosso é cortado reto nas
			   bordas do próprio viewBox, que é o bbox exato dos arcos. A
			   discrição vem de `opacity` no svg, não do alfa da cor: a
			   espiral e o disco do olho (`capEye`) se sobrepõem, e com alfa
			   na cor a sobreposição somaria e apareceria mais clara. */}
			<FibonacciSpiral
				terms={12}
				strokeWidth={120}
				capEye
				className="absolute top-1/2 left-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 -scale-x-100 -scale-y-100 overflow-visible text-white opacity-[0.025]"
			/>

			<div className="relative mx-auto w-full max-w-3xl">
				<Reveal className="text-center">
					<h2 className={SECTION_TITLE}>{t.heading}</h2>
				</Reveal>
				<Reveal y={24} className="mt-12 md:mt-16">
					<div className="border-border border-t">
						{t.items.map((item) => (
							<details
								key={item.q}
								className="group border-border border-b"
							>
								<summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
									<span className="text-body-lg font-medium">
										{item.q}
									</span>
									<Plus
										aria-hidden
										className="text-foreground/60 size-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
									/>
								</summary>
								<p className="text-body text-foreground/70 pb-6 text-pretty">
									{item.a}
								</p>
							</details>
						))}
					</div>
				</Reveal>
			</div>
		</section>
	)
}
