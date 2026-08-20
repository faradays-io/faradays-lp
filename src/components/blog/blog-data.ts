import type { MockImageTone } from '@/components/landing/mock-image'

export const BLOG_CATEGORIES = [
	'Engenharia',
	'Pesquisa',
	'Produto',
	'Empresa'
] as const

export const BLOG_PRODUCTS = ['Importações', 'Crédito'] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]
export type BlogProduct = (typeof BLOG_PRODUCTS)[number]

/** Rota da landing de cada produto — usada pela label de produto do post.
    `null` = produto sem landing publicada: a label vira texto, não link. */
export const PRODUCT_ROUTES: Record<BlogProduct, string | null> = {
	Importações: '/distribuicao',
	Crédito: null
}

export type PostBlock =
	| { type: 'heading'; level: 2 | 3; text: string }
	| { type: 'paragraph'; text: string }
	| { type: 'list'; ordered?: boolean; items: readonly string[] }
	| { type: 'quote'; text: string; cite?: string }

export type BlogPost = {
	slug: string
	title: string
	excerpt: string
	category: BlogCategory
	product: BlogProduct | null
	featured: boolean
	/** ISO 'YYYY-MM-DD' */
	publishedAt: string
	thumbTone: MockImageTone
	/** Semente do driver mock de views — some quando um storage real for plugado. */
	seedViews: number
	blocks: readonly PostBlock[]
}

export const BLOG_POSTS: readonly BlogPost[] = [
	{
		slug: 'modelos-fundacionais-tabulares-credito',
		title: 'Modelos fundacionais tabulares aplicados à decisão de crédito',
		excerpt:
			'Por que transferir aprendizado entre carteiras muda o jogo para políticas de crédito em mercados com pouco histórico.',
		category: 'Pesquisa',
		product: 'Crédito',
		featured: true,
		publishedAt: '2026-07-21',
		thumbTone: 'violet',
		seedViews: 1842,
		blocks: [
			{
				type: 'paragraph',
				text: 'A maior parte dos modelos de crédito em produção hoje é treinada do zero sobre a carteira de uma única instituição. Isso funciona quando há décadas de histórico — e falha silenciosamente quando não há. Modelos fundacionais tabulares propõem outro caminho: pré-treinar sobre uma grande diversidade de conjuntos tabulares e adaptar ao contexto local com poucos exemplos.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'O problema do histórico curto'
			},
			{
				type: 'paragraph',
				text: 'Carteiras novas, produtos recém-lançados e segmentos sub-bancarizados compartilham a mesma limitação: poucos ciclos completos de inadimplência observados. Um modelo supervisionado clássico aprende os padrões do passado recente e generaliza mal para regimes que ainda não viu.'
			},
			{
				type: 'list',
				items: [
					'Poucos defaults observados tornam a classe minoritária estatisticamente frágil',
					'Mudanças macroeconômicas invalidam janelas de treino curtas',
					'Vieses de aprovação histórica contaminam o rótulo (reject inference)'
				]
			},
			{ type: 'heading', level: 2, text: 'O que muda com pré-treino' },
			{
				type: 'paragraph',
				text: 'Um modelo fundacional tabular chega ao problema já sabendo o que é uma distribuição de renda, como variáveis categóricas de alta cardinalidade se comportam e que interações entre atraso e utilização de limite costumam importar. O fine-tuning deixa de ensinar estatística básica e passa a ensinar apenas o que é idiossincrático da carteira.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Transferência entre carteiras'
			},
			{
				type: 'paragraph',
				text: 'Nos nossos experimentos, a transferência entre segmentos distintos preserva a maior parte do poder discriminativo mesmo com uma fração pequena dos dados de destino. O ganho é mais pronunciado exatamente onde os métodos clássicos mais sofrem: nas primeiras safras de um produto novo.'
			},
			{
				type: 'quote',
				text: 'O valor de um modelo fundacional não está em acertar mais no regime estável — está em degradar menos no regime que ninguém viu.',
				cite: 'Equipe de Pesquisa, Faradays'
			},
			{ type: 'heading', level: 2, text: 'Arquitetura de pré-treino' },
			{
				type: 'paragraph',
				text: 'Ao contrário de texto, dados tabulares não têm um vocabulário compartilhado: cada carteira tem colunas, escalas e semânticas próprias. A arquitetura precisa resolver esse problema de alinhamento antes de qualquer transferência acontecer.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Representação de features'
			},
			{
				type: 'paragraph',
				text: 'Tratamos cada célula como um par (nome da coluna, valor): o nome é embutido por um encoder textual, o que permite que "renda_mensal" numa carteira e "salario_liquido" em outra caiam em regiões próximas do espaço de representação. Valores numéricos passam por normalização quantílica aprendida; categóricos de alta cardinalidade, por hashing com embeddings compartilhados.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Objetivos de treinamento'
			},
			{
				type: 'list',
				items: [
					'Reconstrução mascarada de células — o modelo aprende as dependências entre colunas',
					'Predição contrastiva entre linhas da mesma safra — captura estrutura de coorte',
					'Cabeças auxiliares de ordenação temporal para dados com histórico'
				]
			},
			{
				type: 'paragraph',
				text: 'Nenhum dos objetivos usa o rótulo de inadimplência: o pré-treino é inteiramente auto-supervisionado, o que permite aproveitar volumes grandes de dados não rotulados — inclusive de domínios fora de crédito.'
			},
			{
				type: 'heading',
				level: 2,
				text: 'Avaliação fora de distribuição'
			},
			{
				type: 'paragraph',
				text: 'A pergunta que importa não é "qual o AUC no holdout?", e sim "o que acontece quando o mundo muda?". Nosso protocolo de avaliação separa três eixos de deslocamento: temporal (safras futuras), populacional (segmentos não vistos) e macroeconômico (regimes de estresse).'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Backtesting por safra'
			},
			{
				type: 'paragraph',
				text: 'Cada modelo é treinado até a safra T e avaliado em T+1…T+k, nunca com embaralhamento aleatório — validação cruzada clássica vaza informação do futuro e infla os resultados de forma silenciosa. O relatório final mostra a curva de degradação, não um número único.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Métricas além do AUC'
			},
			{
				type: 'list',
				items: [
					'Calibração por decil de score sob cada regime simulado',
					'Estabilidade do ranking (Kendall τ) entre janelas adjacentes',
					'Custo esperado da política derivada, não só a qualidade do score',
					'Disparidade de aprovação entre grupos protegidos, por regime'
				]
			},
			{
				type: 'quote',
				text: 'Um score bem calibrado que degrada previsivelmente vale mais do que um score excelente que quebra sem avisar.'
			},
			{ type: 'heading', level: 2, text: 'Limitações e riscos' },
			{
				type: 'paragraph',
				text: 'Modelos fundacionais tabulares não são bala de prata. Três riscos guiam nossa agenda: contaminação entre pré-treino e avaliação (mitigada com particionamento por instituição), transferência negativa quando o domínio de origem é enganosamente parecido, e o custo de inferência em decisões de alto volume — que atacamos com destilação para modelos menores por carteira.'
			},
			{
				type: 'paragraph',
				text: 'Há também um risco institucional: a tentação de tratar o modelo pré-treinado como caixa-preta aprovada de antemão. Cada adaptação passa pelo mesmo crivo de validação de um modelo novo — o pré-treino acelera o desenvolvimento, não o processo de governança.'
			},
			{ type: 'heading', level: 2, text: 'Próximos passos' },
			{
				type: 'paragraph',
				text: 'O projeto de PD&I em cooperação com a Unicamp segue investigando arquiteturas de pré-treino e protocolos de avaliação fora de distribuição. Os resultados alimentam diretamente a plataforma de otimização dinâmica de crédito.'
			},
			{
				type: 'list',
				ordered: true,
				items: [
					'Escalar o corpus de pré-treino com novos domínios tabulares públicos',
					'Comparar fine-tuning completo, adapters e prompting in-context em poucos exemplos',
					'Publicar o protocolo de avaliação fora de distribuição como benchmark aberto'
				]
			}
		]
	},
	{
		slug: 'classificacao-fiscal-com-llms',
		title: 'Classificação fiscal automática: LLMs encontram a NCM',
		excerpt:
			'Como estruturamos um pipeline de classificação de mercadorias que combina recuperação, raciocínio e trilha de auditoria.',
		category: 'Engenharia',
		product: 'Importações',
		featured: true,
		publishedAt: '2026-06-30',
		thumbTone: 'ember',
		seedViews: 2517,
		blocks: [
			{
				type: 'paragraph',
				text: 'Classificar uma mercadoria na NCM correta é uma das tarefas mais sensíveis de uma operação de importação: um dígito errado muda alíquota, exigências e risco de autuação. Automatizar isso com LLMs exige mais do que um bom prompt — exige um pipeline auditável.'
			},
			{ type: 'heading', level: 2, text: 'Anatomia do pipeline' },
			{
				type: 'paragraph',
				text: 'O sistema decompõe a classificação em etapas independentes: normalização da descrição do produto, recuperação de capítulos e posições candidatas, raciocínio comparativo entre candidatas e, por fim, verificação contra as Regras Gerais de Interpretação.'
			},
			{
				type: 'list',
				ordered: true,
				items: [
					'Normalização — descrição livre vira ficha técnica estruturada',
					'Recuperação — candidatas vêm de busca híbrida sobre a nomenclatura e precedentes',
					'Raciocínio — o modelo compara candidatas e justifica a escolha',
					'Verificação — regras determinísticas barram inconsistências óbvias'
				]
			},
			{ type: 'heading', level: 2, text: 'Onde os modelos erram' },
			{
				type: 'paragraph',
				text: 'Os erros mais comuns não são de conhecimento, e sim de ambiguidade na entrada: descrições comerciais omitem material, função ou composição. Por isso o pipeline devolve perguntas quando a confiança cai abaixo do limiar, em vez de forçar uma resposta.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Trilha de auditoria'
			},
			{
				type: 'paragraph',
				text: 'Cada classificação carrega as candidatas consideradas, a justificativa e as regras aplicadas. Quando a fiscalização pergunta "por quê?", a resposta já existe — escrita no momento da decisão, não reconstruída depois.'
			},
			{ type: 'heading', level: 2, text: 'Resultados em produção' },
			{
				type: 'paragraph',
				text: 'Em operação assistida, o tempo médio de classificação caiu de horas para minutos, com o especialista humano revisando apenas os casos sinalizados. A automação não substituiu o despachante — devolveu a ele o tempo que a burocracia consumia.'
			}
		]
	},
	{
		slug: 'fairness-na-funcao-objetivo',
		title: 'Fairness como restrição de otimização, não como auditoria',
		excerpt:
			'Colocar equidade dentro da função objetivo muda o comportamento da política de crédito desde o treino — não depois dele.',
		category: 'Pesquisa',
		product: 'Crédito',
		featured: false,
		publishedAt: '2026-06-09',
		thumbTone: 'moss',
		seedViews: 976,
		blocks: [
			{
				type: 'paragraph',
				text: 'A abordagem tradicional trata fairness como uma etapa de auditoria: treina-se o modelo para maximizar retorno e depois se verifica se algum grupo foi desproporcionalmente prejudicado. Quando o problema aparece, a correção é um remendo.'
			},
			{ type: 'heading', level: 2, text: 'Auditoria chega tarde' },
			{
				type: 'paragraph',
				text: 'Corrigir disparidades depois do treino significa escolher entre recalibrar thresholds por grupo — juridicamente delicado — ou retreinar às cegas esperando um resultado melhor. Nenhuma das opções dá garantias.'
			},
			{ type: 'heading', level: 2, text: 'Restrições no aprendizado' },
			{
				type: 'paragraph',
				text: 'Nossa abordagem incorpora métricas de equidade diretamente na função objetivo da política, tratando disparidade como custo. O otimizador aprende a navegar o trade-off entre retorno e equidade em vez de descobri-lo em produção.'
			},
			{
				type: 'list',
				items: [
					'Paridade demográfica e igualdade de oportunidade como penalidades diferenciáveis',
					'Pesos ajustáveis por política institucional, com trade-off explícito',
					'Relatórios de sensibilidade que mostram o custo marginal da equidade'
				]
			},
			{ type: 'heading', level: 3, text: 'O que medimos' },
			{
				type: 'paragraph',
				text: 'Nas simulações com dados públicos, políticas treinadas com restrição de equidade sacrificam pouco retorno esperado para eliminar a maior parte da disparidade de aprovação entre grupos — um trade-off que auditoria posterior nunca revelaria com precisão.'
			}
		]
	},
	{
		slug: 'bastidores-motor-de-simulacao',
		title: 'Bastidores: o motor de simulação de políticas de decisão',
		excerpt:
			'Antes de uma política tocar a carteira real, ela vive milhares de vidas simuladas. Assim construímos esse ambiente.',
		category: 'Engenharia',
		product: 'Crédito',
		featured: false,
		publishedAt: '2026-05-14',
		thumbTone: 'slate',
		seedViews: 1204,
		blocks: [
			{
				type: 'paragraph',
				text: 'Aprendizagem por reforço em crédito tem um problema fundamental: errar em produção custa dinheiro real. A resposta é um motor de simulação onde políticas candidatas são avaliadas contra cenários sintéticos antes de qualquer decisão real.'
			},
			{ type: 'heading', level: 2, text: 'Por que simular' },
			{
				type: 'paragraph',
				text: 'Uma política de crédito só revela suas consequências meses depois da decisão. O motor comprime esse ciclo: cada candidata enfrenta safras completas de originação, maturação e cobrança em minutos, sob regimes macroeconômicos variados.'
			},
			{ type: 'heading', level: 2, text: 'Arquitetura' },
			{
				type: 'heading',
				level: 3,
				text: 'Geradores de cenário'
			},
			{
				type: 'paragraph',
				text: 'Cenários combinam distribuições aprendidas dos dados históricos com choques sintéticos — alta de juros, desemprego, mudança de mix de demanda. O objetivo não é prever o futuro, é garantir que a política não quebre nele.'
			},
			{
				type: 'heading',
				level: 3,
				text: 'Avaliação contrafactual'
			},
			{
				type: 'paragraph',
				text: 'Para cada proponente simulado, o motor responde: o que teria acontecido sob a política A versus a política B? Essa comparação pareada reduz drasticamente a variância da avaliação e permite detectar diferenças finas entre candidatas.'
			},
			{ type: 'heading', level: 2, text: 'Lições aprendidas' },
			{
				type: 'list',
				items: [
					'Determinismo importa: cada simulação é reprodutível por seed',
					'Métricas agregadas escondem caudas — sempre inspecione percentis extremos',
					'O simulador também é um produto: analistas o usam para perguntas de negócio'
				]
			}
		]
	},
	{
		slug: 'automacao-do-despacho-aduaneiro',
		title: 'Do e-mail ao desembaraço: automação de ponta a ponta na importação',
		excerpt:
			'Um mapa do fluxo de importação e de onde a automação com IA elimina espera, retrabalho e erro manual.',
		category: 'Produto',
		product: 'Importações',
		featured: false,
		publishedAt: '2026-04-22',
		thumbTone: 'ember',
		seedViews: 1631,
		blocks: [
			{
				type: 'paragraph',
				text: 'Uma importação típica atravessa dezenas de documentos, sistemas e pessoas. A maior parte do tempo de ciclo não é trabalho — é espera entre etapas. Mapeamos esse fluxo de ponta a ponta para decidir onde a automação gera mais valor.'
			},
			{ type: 'heading', level: 2, text: 'O fluxo como ele é' },
			{
				type: 'paragraph',
				text: 'Proforma, invoice, packing list, conhecimento de embarque, LI, DI: cada documento chega por um canal diferente, num formato diferente, e alguém precisa conciliar tudo. O erro de digitação descoberto no canal vermelho nasceu semanas antes, num PDF mal lido.'
			},
			{ type: 'heading', level: 2, text: 'Onde a IA entra' },
			{
				type: 'list',
				items: [
					'Extração estruturada de documentos comerciais e de transporte',
					'Conciliação automática entre documentos com divergências sinalizadas',
					'Classificação fiscal assistida com trilha de auditoria',
					'Monitoramento de status e antecipação de exigências'
				]
			},
			{ type: 'heading', level: 3, text: 'O humano no circuito' },
			{
				type: 'paragraph',
				text: 'Automação não significa remover o especialista — significa que ele só é acionado quando há divergência real. O sistema resolve o rotineiro e escala o ambíguo, com contexto completo anexado.'
			},
			{ type: 'heading', level: 2, text: 'Impacto medido' },
			{
				type: 'paragraph',
				text: 'Nos pilotos, o tempo entre chegada de documentos e registro caiu por um fator relevante, e o retrabalho por divergência documental praticamente desapareceu das etapas automatizadas.'
			}
		]
	},
	{
		slug: 'faradays-unicamp-pdi',
		title: 'Faradays e Unicamp: como estruturamos um projeto de PD&I',
		excerpt:
			'O que aprendemos ao desenhar uma cooperação de pesquisa entre uma empresa de IA aplicada e a universidade.',
		category: 'Empresa',
		product: null,
		featured: false,
		publishedAt: '2026-03-18',
		thumbTone: 'light',
		seedViews: 743,
		blocks: [
			{
				type: 'paragraph',
				text: 'Cooperação empresa–universidade costuma tropeçar nos mesmos lugares: expectativas de prazo incompatíveis, propriedade intelectual mal resolvida e pesquisa que não encontra caminho para o produto. Desenhamos o projeto com a Unicamp para atacar esses três pontos desde o contrato.'
			},
			{ type: 'heading', level: 2, text: 'Por que uma universidade' },
			{
				type: 'paragraph',
				text: 'Os problemas que nos interessam — modelos fundacionais tabulares, aprendizagem por reforço com restrições — têm perguntas abertas de pesquisa. A universidade traz profundidade metodológica e revisão por pares; a empresa traz o problema real e os dados do domínio.'
			},
			{ type: 'heading', level: 2, text: 'Estrutura do projeto' },
			{
				type: 'list',
				items: [
					'Fases com entregáveis verificáveis, não apenas relatórios',
					'Pesquisadores com acesso a problemas e avaliações realistas',
					'Publicação incentivada, com janela de revisão para PI',
					'Comitê técnico conjunto com cadência mensal'
				]
			},
			{ type: 'heading', level: 3, text: 'Da pesquisa ao produto' },
			{
				type: 'paragraph',
				text: 'Cada linha de investigação tem um "caminho de adoção" declarado: qual componente da plataforma consome o resultado se a hipótese se confirmar. Pesquisa sem caminho de adoção vira artigo; com caminho, vira vantagem.'
			},
			{ type: 'heading', level: 2, text: 'O que faremos diferente' },
			{
				type: 'paragraph',
				text: 'Subestimamos o custo de alinhar vocabulário entre as equipes nos primeiros meses. Hoje, todo novo integrante passa por uma imersão conjunta — e o glossário compartilhado é um artefato de primeira classe do projeto.'
			}
		]
	}
]

export function getPostBySlug(slug: string): BlogPost | undefined {
	return BLOG_POSTS.find((post) => post.slug === slug)
}

/**
 * Posts para o rodapé de um artigo. Mesmo produto pesa mais que mesma
 * categoria; sem afinidade nenhuma, vale o mais recente — então sempre saem
 * `limit` sugestões, mesmo em post órfão de produto e categoria.
 */
export function getRelatedPosts(post: BlogPost, limit = 2): BlogPost[] {
	return BLOG_POSTS.filter((other) => other.slug !== post.slug)
		.map((other) => ({
			post: other,
			score:
				(other.product && other.product === post.product ? 2 : 0) +
				(other.category === post.category ? 1 : 0)
		}))
		.sort(
			(a, b) =>
				b.score - a.score ||
				b.post.publishedAt.localeCompare(a.post.publishedAt)
		)
		.slice(0, limit)
		.map((entry) => entry.post)
}

/** O destaque da capa do blog: o post marcado mais recente. */
export function getFeaturedPost(): BlogPost | undefined {
	return BLOG_POSTS.filter((post) => post.featured).toSorted((a, b) =>
		b.publishedAt.localeCompare(a.publishedAt)
	)[0]
}
