import type { Localized } from '@/lib/i18n'

/* Features de destaque do produto (fonte: docs/features.md + respostas do
   briefing em docs/importacoes-copy-briefing.md). Compartilhadas entre a
   lista com scroll e o showcase do "How it works".

   `tech` é a linha técnica em mono (decisão 3.3-b do briefing): prova de
   domínio para quem é do ramo, sem contaminar a copy de negócio.
   `graphic` aponta a cena do FeatureGraphic (índice em SCENES).
   Copy localizada campo a campo; `id` é a chave estável entre idiomas. */
export const HOME_FEATURES = [
	{
		id: 'whatsapp',
		eyebrow: { pt: 'WhatsApp', en: 'WhatsApp' },
		title: {
			pt: 'Seu representante opera tudo por conversa',
			en: 'Your rep runs everything through chat'
		},
		description: {
			pt: 'Texto, áudio ou foto: o rep pede, a IA junta o que falta numa pergunta só e devolve a cotação formalizada em PDF no próprio chat — além de preço, estoque, pedidos e boletos. Na dúvida, ela pergunta; número não sai de palpite.',
			en: 'Text, voice or photo: the rep asks, the AI gathers what is missing in a single question and returns the formalized quote as a PDF right in the chat — plus prices, stock, orders and invoices. When in doubt, it asks; numbers never come from guesswork.'
		},
		tech: {
			pt: 'preço só sai de ferramenta · 2+ marcas viram pergunta · mídia vira texto antes de decidir',
			en: 'prices only come from tools · 2+ brands become a question · media becomes text before any decision'
		},
		graphic: 2
	},
	{
		id: 'venda',
		eyebrow: { pt: 'Cotação de venda', en: 'Sales quote' },
		title: {
			pt: 'A cotação sai no seu modelo, com o imposto certo',
			en: 'Quotes go out in your template, with the right tax'
		},
		description: {
			pt: 'Multi-item, vinculada ao cliente, com ICMS por estado e câmbio do dia calculados pelo sistema. O PDF preenche o modelo Excel que o seu cliente já conhece — e reemitir nunca muda o valor.',
			en: "Multi-item, tied to the client, with per-state ICMS and the day's exchange rate computed by the system. The PDF fills the Excel template your client already knows — and reissuing never changes the total."
		},
		tech: {
			pt: 'ICMS por UF × regime · PTAX congelada na 1ª emissão · COT-V-NNNN',
			en: 'ICMS by state × tax regime · PTAX frozen at 1st issue · COT-V-NNNN'
		},
		graphic: 0
	},
	{
		id: 'rfq',
		eyebrow: { pt: 'RFQ de compra', en: 'Purchase RFQ' },
		title: {
			pt: 'A concorrência de compra roda sozinha',
			en: 'The purchasing contest runs on its own'
		},
		description: {
			pt: 'O disparo resolve quem cota o quê, envia por e-mail e WhatsApp e interpreta as respostas automaticamente. Você escolhe a vencedora item a item — e os perdedores recebem contra-oferta sem nunca ver o preço campeão.',
			en: 'The dispatch works out who quotes what, sends it by e-mail and WhatsApp and interprets the replies automatically. You pick the winner item by item — and the losers get a counter-offer without ever seeing the winning price.'
		},
		tech: {
			pt: 'parser determinístico → IA de fallback → revisão humana · casamento por token [RFQ-XXXXXX]',
			en: 'deterministic parser → AI fallback → human review · matching by token [RFQ-XXXXXX]'
		},
		graphic: 3
	},
	{
		id: 'docs',
		eyebrow: { pt: 'Documentos', en: 'Documents' },
		title: {
			pt: 'Nenhum laudo vence sem aviso',
			en: 'No certificate expires without warning'
		},
		description: {
			pt: 'Halal, Kosher, alérgenos e COA controlados por produto e fornecedor. A validade é lida por IA direto do PDF, o arquivo é carimbado no drive e um radar diário cobra o que está a vencer — antes de o documento errado chegar ao cliente.',
			en: 'Halal, Kosher, allergens and COA tracked per product and supplier. Expiry dates are read by AI straight from the PDF, the file is stamped in the drive and a daily radar chases what is about to expire — before the wrong document reaches your client.'
		},
		tech: {
			pt: 'matriz produtos ativos × tipos obrigatórios · carimbo "— VAL DD.MM.AAAA" no SharePoint',
			en: 'active products × required types matrix · "— VAL DD.MM.YYYY" stamp in SharePoint'
		},
		graphic: 1
	}
] as const satisfies readonly {
	id: string
	eyebrow: Localized<string>
	title: Localized<string>
	description: Localized<string>
	tech: Localized<string>
	graphic: number
}[]

/* Grade "e mais" — as demais frentes do produto, em uma linha cada
   (decisão 3.1: nada fica de fora; o que não é destaque vira resumo). */
export const MORE_FEATURES = [
	{
		title: {
			pt: 'Pedidos, faturamento e crédito',
			en: 'Orders, invoicing and credit'
		},
		description: {
			pt: 'Relatórios do ERP viram consultas no bot: status humanizado, posição de crédito (limite − boletos em aberto) e o "a receber" em Excel na conversa.',
			en: 'ERP reports become bot queries: humanized status, credit position (limit − open invoices) and receivables as an Excel file right in the chat.'
		}
	},
	{
		title: {
			pt: 'Catálogo e tabela mensal',
			en: 'Catalog and monthly price list'
		},
		description: {
			pt: 'A tabela NET-USD do mês entra por preview → aplicar: atualiza preço, NCM e tributação, ativa e inativa produtos — com histórico de preço por item.',
			en: "The month's NET-USD price list comes in via preview → apply: it updates prices, NCM and taxation, activates and deactivates products — with a price history per item."
		}
	},
	{
		title: {
			pt: 'Clientes e carteira',
			en: 'Clients and portfolio'
		},
		description: {
			pt: 'CNPJ como identidade e um dono por cliente: cada rep só vê e escreve na própria carteira; o gestor vê tudo.',
			en: 'CNPJ as identity and one owner per client: each rep only sees and writes to their own portfolio; managers see everything.'
		}
	},
	{
		title: {
			pt: 'Estoque por lote',
			en: 'Stock by batch'
		},
		description: {
			pt: 'Consulta lote a lote ordenada por vencimento, com avaria fora de venda e "sem saldo" separado de "não encontrei".',
			en: 'Batch-by-batch lookup ordered by expiry, with damaged goods kept out of sale and "no stock" separated from "not found".'
		}
	},
	{
		title: {
			pt: 'Espelho do SharePoint',
			en: 'SharePoint mirror'
		},
		description: {
			pt: 'Pasta vinculada vira espelho no dashboard, com backfill do acervo e somente leitura no drive — excluir aqui nunca apaga o arquivo de ninguém.',
			en: "A linked folder becomes a mirror on the dashboard, with a backfill of the archive and read-only access to the drive — deleting here never erases anyone's file."
		}
	},
	{
		title: {
			pt: 'E-mail Microsoft 365',
			en: 'Microsoft 365 e-mail'
		},
		description: {
			pt: 'Caixas compartilhadas via MS Graph são o canal da esteira de RFQ: disparo com planilha anexa e resposta casada automaticamente.',
			en: 'Shared mailboxes via MS Graph are the channel of the RFQ pipeline: dispatch with an attached spreadsheet and replies matched automatically.'
		}
	},
	{
		title: {
			pt: 'Portal ao vivo',
			en: 'Live portal'
		},
		description: {
			pt: 'A home é o quadro dos representantes — última mensagem, pendências e falhas por rep — atualizada por WebSocket, sem refresh.',
			en: "The home is the reps' board — last message, pending items and failures per rep — updated over WebSocket, no refresh."
		}
	},
	{
		title: {
			pt: 'Operação e auditoria',
			en: 'Operations and audit'
		},
		description: {
			pt: 'Login social com papéis (admin, gestor, rep), trilha de auditoria e todo import no mesmo padrão: prévia dizendo exatamente o que muda.',
			en: 'Social login with roles (admin, manager, rep), an audit trail and every import following the same pattern: a preview saying exactly what changes.'
		}
	}
] as const satisfies readonly {
	title: Localized<string>
	description: Localized<string>
}[]
