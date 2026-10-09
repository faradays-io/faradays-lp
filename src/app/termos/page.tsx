import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Termos e Condições de Uso — Faradays',
	description:
		'As regras para usar o site e a plataforma da Faradays: licença, planos, pagamento, responsabilidades, uso da IA e do WhatsApp, suporte e encerramento.'
}

/* Redação a partir do que o produto de fato faz e do que a página de preços
   promete (docs/politicas-pendencias.md lista as decisões comerciais que
   ainda faltam confirmar). A versão EN é tradução de trabalho do PT — em
   conflito, vale o PT. Ambas precisam de revisão jurídica antes de valer
   como texto oficial. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Termos e Condições de Uso',
		originalAt: '27 de julho de 2026',
		updatedAt: '9 de setembro de 2026',
		numbered: true,
		intro: [
			'Estes Termos e Condições de Uso (os "Termos") regem o uso do site da Faradays e a contratação e o uso da plataforma que ela fornece como serviço. "Faradays" é a Faradays Consulting LTDA, CNPJ 65.590.441/0001-36, com sede em São Paulo/SP.',
			'Leia com atenção. Ao navegar no site, ao contratar um Plano ou ao usar a plataforma como usuário indicado por um cliente, você declara que leu e concorda com estes Termos e com o [Aviso de Privacidade](/privacidade), que os integra. Se você contrata em nome de uma empresa, declara ter poderes para vinculá-la.',
			'Clientes do Plano Enterprise, e demais Clientes que assinem contrato próprio, seguem o que estiver escrito nesse contrato; estes Termos valem no que o contrato não regular.'
		],
		sections: [
			{
				heading: 'Definições',
				body: [
					{
						type: 'list',
						items: [
							'**Site.** Os domínios e subdomínios operados pela Faradays para apresentar a empresa e os seus produtos, começando por faradays.io.',
							'**Plataforma.** O software fornecido pela Faradays como serviço: o portal web, o assistente no WhatsApp, as integrações com Microsoft 365, WhatsApp e ERP, a interface de programação (API) e a documentação associada.',
							'**Cliente.** A pessoa jurídica que contrata um Plano e configura a Plataforma para a própria operação.',
							'**Usuário.** Pessoa indicada pelo Cliente para usar a Plataforma — administradores e gestores no portal, e Representantes que operam pelo WhatsApp.',
							'**Representante.** Usuário cujo número de WhatsApp está cadastrado no assistente. É a unidade de contagem dos Planos: cada número conectado é um Representante; gestores e administradores que só usam o portal não contam.',
							'**Plano.** Cada uma das modalidades de contratação da Plataforma (Basic, Pro e Enterprise), com os limites, funcionalidades e níveis de suporte descritos na [página de preços](/distribuicao/precos) na data da contratação.',
							'**Dados do Cliente.** Tudo o que o Cliente e seus Usuários inserem ou conectam à Plataforma: cadastros de clientes finais e fornecedores, cotações, pedidos, notas, documentos, e-mails, arquivos do drive e conversas do assistente. É o mesmo termo do Aviso de Privacidade.',
							'**Serviços de Terceiros.** Plataformas externas que o Cliente conecta à Plataforma por conta própria: a Meta (WhatsApp Business Platform), a Microsoft (365, SharePoint, OneDrive, Entra ID), o fornecedor do ERP e outras que venham a ser suportadas.'
						]
					}
				]
			},
			{
				heading: 'Aceitação e vigência',
				body: [
					'Estes Termos entram em vigor para o Cliente na data em que ele contrata um Plano, e para cada Usuário na data do primeiro acesso à Plataforma. Para visitantes do Site, valem a partir do acesso.',
					'O Cliente responde por seus Usuários: deve dar a eles ciência destes Termos, cadastrar apenas pessoas autorizadas e comunicar à Faradays qualquer uso indevido de que tome conhecimento.',
					'Podemos atualizar estes Termos. O capítulo Alterações destes Termos descreve como e com que antecedência.'
				]
			},
			{
				heading: 'Uso do Site',
				body: [
					'O conteúdo do Site é informativo. Você pode navegar, ler e compartilhar os links livremente. Não pode raspar o Site em escala, sobrecarregá-lo, tentar burlar controles de acesso, usar o conteúdo para treinar modelos ou reproduzi-lo comercialmente sem autorização por escrito.',
					'Números, demonstrações e exemplos apresentados no Site são ilustrativos e não constituem garantia de desempenho. Compromissos de resultado, quando existirem, vivem no contrato.',
					'Podemos alterar, suspender ou descontinuar partes do Site a qualquer momento, sem aviso.'
				]
			},
			{
				heading: 'Objeto e licença de uso da Plataforma',
				body: [
					'Contratado um Plano, a Faradays concede ao Cliente uma licença **não exclusiva, intransferível, revogável e limitada ao prazo do Plano**. Ela autoriza o Cliente e seus Usuários a acessar e usar a Plataforma na própria operação comercial, nos limites do Plano contratado.',
					'A Plataforma é fornecida como serviço hospedado pela Faradays. O Cliente não recebe cópia do software, do código-fonte ou da infraestrutura, e não pode:',
					{
						type: 'list',
						items: [
							'Copiar, modificar, traduzir, descompilar ou fazer engenharia reversa da Plataforma, exceto onde a lei expressamente permita;',
							'Revender, sublicenciar, alugar ou disponibilizar a Plataforma a terceiros, ou usá-la para prestar serviço a terceiros como um bureau;',
							'Compartilhar credenciais de acesso ou cadastrar como Representante pessoa que não seja da própria operação;',
							'Contornar limites do Plano, controles de acesso ou as guardas do assistente;',
							'Usar a Plataforma para fim ilícito, para enviar mensagens não solicitadas ou em violação às políticas dos Serviços de Terceiros.'
						]
					},
					'A Faradays pode evoluir a Plataforma continuamente — adicionar, alterar ou retirar funcionalidades — desde que não reduza de forma substancial o que o Plano contratado oferece durante o ciclo em curso. Funcionalidades marcadas como beta ou em desenvolvimento podem mudar ou ser retiradas sem aviso.'
				]
			},
			{
				heading: 'Contas, papéis e Representantes',
				body: [
					'O acesso ao portal se dá por conta individual, autenticada por provedor de identidade — inclusive login com Google ou Microsoft, quando habilitado. Cada Usuário recebe um papel: **administrador** (configura integrações, cadastros e permissões), **gestor** (vê toda a operação) ou **representante** (opera a própria carteira). O Cliente é responsável por atribuir e revisar esses papéis.',
					'O assistente no WhatsApp só responde a Representantes cadastrados pelo administrador. Ele aplica a **fronteira de carteira**: cada Representante consulta e escreve apenas sobre os clientes da própria carteira; o gestor vê tudo. O cadastro correto dos Representantes e da carteira é responsabilidade do Cliente — a fronteira depende dele.',
					'O Cliente deve remover ou desativar Usuários que deixem a operação e comunicar à Faradays imediatamente qualquer suspeita de acesso não autorizado.'
				]
			},
			{
				heading: 'Planos, pagamento, renovação e cancelamento',
				body: [
					{
						type: 'sub',
						heading: 'Planos e limites',
						body: [
							'Os Planos Basic e Pro têm preço por mês, com limite de Representantes incluídos; o Plano Enterprise é contratado sob proposta e contrato próprio. Os valores, limites e funcionalidades vigentes são os publicados na [página de preços](/distribuicao/precos) na data da contratação ou renovação.',
							'Representantes acima do limite do Plano são cobrados proporcionalmente ao valor por Representante do Plano, ou exigem migração para o Plano seguinte, a critério do Cliente.'
						]
					},
					{
						type: 'sub',
						heading: 'Periodicidade e pagamento',
						body: [
							'A cobrança pode ser **mensal**, com pagamento no início de cada mês, ou **anual**, com pagamento de uma vez no início do ciclo e o desconto indicado na página de preços. Os valores não incluem tributos que venham a incidir sobre o Cliente.',
							'Em caso de atraso, a Faradays notifica o Cliente. Persistindo o atraso por mais de 15 dias, pode suspender o acesso à Plataforma até a regularização; após 60 dias, pode encerrar o contrato, aplicando-se o capítulo Suspensão e encerramento. Dados do Cliente são preservados durante a suspensão.'
						]
					},
					{
						type: 'sub',
						heading: 'Mudança de Plano',
						body: [
							'Upgrade vale na hora, com cobrança da diferença proporcional ao tempo restante do ciclo. Downgrade entra no ciclo seguinte. Nada se perde na troca — dados, histórico e configurações ficam; funcionalidades exclusivas do Plano anterior deixam de estar disponíveis.'
						]
					},
					{
						type: 'sub',
						heading: 'Renovação e cancelamento',
						body: [
							'Os Planos renovam automaticamente ao fim de cada ciclo, pelo mesmo período, salvo cancelamento. O Cliente pode cancelar a qualquer momento pelo canal de suporte; o cancelamento tem efeito no fim do ciclo em curso, sem multa, e o acesso continua até lá.',
							'Valores pagos não são reembolsados proporcionalmente por cancelamento antes do fim do ciclo, exceto: (a) nos 7 dias seguintes à primeira contratação, quando o Cliente pode desistir e receber de volta o que pagou; (b) quando o encerramento decorrer de descumprimento pela Faradays.'
						]
					},
					{
						type: 'sub',
						heading: 'Reajuste',
						body: [
							'Os preços podem ser reajustados na renovação, com aviso ao Cliente com antecedência mínima de 30 dias. Durante um ciclo já pago, o preço não muda.'
						]
					}
				]
			},
			{
				heading: 'Canal WhatsApp e políticas da Meta',
				body: [
					'O assistente opera sobre a WhatsApp Business Platform, da Meta. O número de WhatsApp e a conta WhatsApp Business usados pela Plataforma são do Cliente ou disponibilizados conforme o contrato; em qualquer caso, o Cliente é o responsável perante a Meta pelo uso do canal.',
					'O Cliente se compromete a observar os termos e políticas da Meta aplicáveis à WhatsApp Business Platform, em especial as políticas de negócios e de mensagens, e a não usar o canal para mensagens não solicitadas. O assistente conversa apenas com Representantes cadastrados — não com os clientes finais do Cliente — e os disparos em massa da Plataforma são dirigidos apenas a Representantes ativos.',
					'A Meta pode alterar, limitar ou suspender a API, números e contas por decisão própria. A Faradays não responde por indisponibilidade, atraso, bloqueio ou mudança de regras impostos pela Meta, e pode adaptar a Plataforma para manter a conformidade com essas regras.'
				]
			},
			{
				heading:
					'Integrações com Microsoft 365, ERP e outros Serviços de Terceiros',
				body: [
					'As integrações são habilitadas pelo administrador do Cliente por meio de autorização (OAuth) na conta do Cliente. Ao autorizar, o Cliente declara ter poderes para conectar as caixas de e-mail, pastas e sistemas escolhidos, e assume a responsabilidade pelo que esses recursos contêm.',
					'Na conexão com Microsoft 365, a Plataforma lê e envia e-mails pelas caixas conectadas e espelha as pastas do SharePoint ou OneDrive vinculadas. No drive, a Plataforma atua em **modo somente leitura**, com exceção das operações que o Cliente habilite expressamente — como o carimbo de validade no nome dos laudos e a organização de pastas dentro do escopo vinculado. Excluir um item no portal nunca apaga o arquivo no drive do Cliente.',
					'Os relatórios do ERP importados pelo Cliente são tratados como recebidos. A Faradays não valida a exatidão dos dados do ERP nem responde por decisões tomadas com base em relatório incorreto ou desatualizado enviado pelo Cliente.',
					'Os Serviços de Terceiros são regidos pelos próprios termos e podem mudar ou ser descontinuados sem interferência da Faradays. Se um Serviço de Terceiro deixar de estar disponível ou alterar sua API, a Faradays fará esforços razoáveis para adaptar a integração, sem garantia de prazo.'
				]
			},
			{
				heading: 'Inteligência artificial',
				body: [
					'A Plataforma usa modelos de linguagem de terceiros para interpretar mensagens, transcrever áudios, ler imagens e documentos e redigir respostas. O princípio de projeto é: **entender é da IA; decidir e validar é do código**. Preços em moeda estrangeira só saem de fonte de dados, nunca são inventados; a IA não escolhe marca ou variante sozinha quando há mais de um candidato; quantidades são convertidas pelo sistema; e recusas explicam o motivo.',
					'Ainda assim, modelos de linguagem são probabilísticos e podem interpretar mal um pedido, transcrever um áudio incorretamente ou ler um documento de forma imprecisa. O Cliente reconhece isso e se compromete a:',
					{
						type: 'list',
						items: [
							'Revisar cotações, documentos e comunicações gerados pela Plataforma antes de enviá-los a terceiros ou de tomar decisões com base neles;',
							'Não tratar as saídas da Plataforma como aconselhamento jurídico, tributário, contábil ou regulatório — o motor tributário aplica as regras que o Cliente configura e mantém atualizadas;',
							'Não enviar ao assistente dados pessoais sensíveis ou informações desnecessárias à operação.'
						]
					},
					'A Faradays pode trocar os modelos utilizados para manter qualidade, custo e conformidade; os provedores em uso constam em [/subprocessadores](/subprocessadores). Clientes Enterprise podem escolher e restringir os modelos, com orçamento dedicado. Os Dados do Cliente **não são usados pela Faradays para treinar modelos próprios**, e os provedores são contratados sob termos que vedam o uso dos dados para treinamento dos seus modelos.'
				]
			},
			{
				heading: 'Dados do Cliente',
				body: [
					'Os Dados do Cliente pertencem ao Cliente. O Cliente concede à Faradays uma licença limitada para hospedá-los, processá-los e transmiti-los exclusivamente para prestar a Plataforma, prestar suporte, cumprir a lei e garantir segurança. A Faradays não acessa os Dados do Cliente para fins próprios e não os vende nem compartilha além do descrito no [Aviso de Privacidade](/privacidade).',
					'Quanto a dados pessoais contidos nos Dados do Cliente, o Cliente é o Controlador e a Faradays a Operadora, nos termos da LGPD. O capítulo Papéis no modelo SaaS do Aviso de Privacidade descreve as obrigações de cada parte, inclusive a de o Cliente informar seus Representantes de que as conversas com o assistente são registradas e processadas por inteligência artificial. Um contrato de tratamento de dados pode ser firmado a pedido do Cliente.',
					'O Cliente pode exportar os Dados do Cliente a qualquer tempo pelas funções de exportação da Plataforma (Excel e PDF) e, ao encerrar, conforme o capítulo Suspensão e encerramento.',
					'A Faradays pode usar **dados agregados e anonimizados** sobre o uso da Plataforma — volumes, tempos de resposta, funcionalidades usadas — para operar, medir e melhorar o produto. Esses dados nunca identificam o Cliente, seus Usuários ou seus clientes finais.'
				]
			},
			{
				heading: 'Uso aceitável',
				body: [
					'É vedado ao Cliente e aos Usuários:',
					{
						type: 'list',
						items: [
							'Usar a Plataforma em violação à lei, a direitos de terceiros ou às políticas dos Serviços de Terceiros;',
							'Enviar, armazenar ou processar conteúdo ilícito, malicioso ou que infrinja propriedade intelectual;',
							'Tentar acessar dados de outro Cliente, de outra carteira ou de contas de outros Usuários;',
							'Sondar, testar ou explorar vulnerabilidades, exceto em teste de segurança acordado por escrito com a Faradays;',
							'Automatizar o acesso à Plataforma por meios não previstos (a API documentada é o caminho suportado) ou impor carga que degrade o serviço para outros;',
							'Usar a Plataforma para construir produto concorrente ou para extrair o seu funcionamento interno.'
						]
					},
					'A Faradays pode suspender o acesso de um Usuário ou do Cliente, com aviso sempre que possível, para fazer cessar violação a este capítulo ou risco à segurança da Plataforma e dos demais Clientes.'
				]
			},
			{
				heading: 'Suporte, disponibilidade e manutenção',
				body: [
					'Cada Plano inclui o nível de suporte indicado na página de preços — por e-mail em horário comercial no Basic, prioritário com onboarding assistido no Pro, e gerente de conta com SLA contratual no Enterprise. Canais, horários, prazos de resposta, janelas de manutenção e comunicação de incidentes estão detalhados na [Política de Suporte e Disponibilidade](/suporte), que integra estes Termos.',
					'Para os Planos Basic e Pro, a Faradays trabalha com meta de disponibilidade mensal de 99,5% da Plataforma, excluídas as manutenções programadas e as indisponibilidades causadas por Serviços de Terceiros, pelo Cliente ou por força maior. Essa meta é um compromisso de esforço, não uma garantia com crédito. Garantias de nível de serviço com penalidade só existem em contrato Enterprise.'
				]
			},
			{
				heading: 'Propriedade intelectual',
				body: [
					'A Plataforma — código, arquitetura, modelos de dados, prompts, interfaces, documentação, marca e identidade visual — é de propriedade exclusiva da Faradays ou de seus licenciantes. Está protegida pela Lei nº 9.609/1998 (Lei do Software), pela Lei nº 9.279/1996 (Propriedade Industrial) e pela Lei nº 9.610/1998 (Direitos Autorais). Estes Termos não transferem nenhum direito de propriedade intelectual ao Cliente, apenas a licença de uso descrita acima.',
					'Modelos de documento, regras tributárias, logotipos e demais materiais que o Cliente fornece para configurar a Plataforma continuam sendo do Cliente. Personalizações desenvolvidas pela Faradays sob encomenda seguem o que o contrato específico dispuser; na ausência de disposição, pertencem à Faradays, com licença de uso ao Cliente pelo prazo do contrato.',
					'Sugestões e feedback sobre a Plataforma podem ser usados livremente pela Faradays, sem obrigação de compensação ou atribuição.',
					'Nomes e logotipos de terceiros eventualmente citados no Site pertencem aos seus titulares. A Faradays só cita clientes como referência com autorização prévia.'
				]
			},
			{
				heading: 'Confidencialidade',
				body: [
					'Cada parte manterá em sigilo as informações confidenciais da outra a que tiver acesso em razão destes Termos. Do lado do Cliente, isso inclui os Dados do Cliente; do lado da Faradays, os aspectos não públicos da Plataforma e as condições comerciais. Essas informações só podem ser usadas para os fins destes Termos, e devem ser protegidas com o mesmo cuidado que cada parte dedica às próprias — nunca inferior ao razoável.',
					'Não são confidenciais as informações que já eram públicas, que a parte receptora já conhecia legitimamente ou que foram desenvolvidas de forma independente. Revelação exigida por lei ou ordem de autoridade é permitida, com aviso prévio à outra parte sempre que possível. A obrigação sobrevive ao fim destes Termos por 5 anos; para dados pessoais, enquanto a lei exigir.'
				]
			},
			{
				heading: 'Garantias e limitação de responsabilidade',
				body: [
					'A Faradays garante que prestará a Plataforma com diligência e de acordo com estes Termos, com a Política de Suporte e com a descrição do Plano. Fora isso, a Plataforma é fornecida **no estado em que se encontra**. Não garantimos que ela atenda a toda finalidade específica do Cliente, que funcione sem interrupções ou erros, nem que as saídas da inteligência artificial estejam sempre corretas.',
					'A Faradays não responde por:',
					{
						type: 'list',
						items: [
							'Indisponibilidade, mudança ou bloqueio impostos por Serviços de Terceiros — Meta, Microsoft, provedor de modelos de IA, fornecedor do ERP, provedores de hospedagem e rede;',
							'Dados incorretos, incompletos ou desatualizados inseridos ou importados pelo Cliente, e decisões tomadas a partir deles;',
							'Cotações, documentos e comunicações enviados pelo Cliente a terceiros sem a revisão descrita no capítulo Inteligência artificial;',
							'Uso indevido de credenciais, cadastro incorreto de Representantes ou falha do Cliente em manter permissões atualizadas;',
							'Caso fortuito ou força maior, inclusive falhas gerais de internet e energia, ataques em larga escala e atos de autoridade.'
						]
					},
					'Na máxima extensão permitida pela lei, a responsabilidade total da Faradays perante o Cliente, por todos os eventos ocorridos em um período de 12 meses, fica limitada ao **valor efetivamente pago pelo Cliente pelo Plano nesses 12 meses**. A Faradays não responde por lucros cessantes, perda de negócios, danos indiretos ou dano à imagem, ainda que avisada da possibilidade.',
					'Essas limitações não se aplicam a dolo, a violação de confidencialidade ou de dados pessoais causada por culpa grave da Faradays, nem ao que a lei não permita limitar.'
				]
			},
			{
				heading: 'Suspensão e encerramento',
				body: [
					'Qualquer parte pode encerrar estes Termos: o Cliente, cancelando o Plano conforme o capítulo Planos; a Faradays, com aviso de 60 dias, ou de imediato em caso de violação grave não corrigida em 15 dias após notificação, inadimplência prolongada, ordem de autoridade ou risco à segurança da Plataforma.',
					'Encerrado o contrato, o acesso à Plataforma cessa. O Cliente tem **30 dias** para exportar os Dados do Cliente pelas funções da Plataforma ou por solicitação ao suporte, que entrega os dados em formato estruturado de uso comum (CSV, XLSX e os PDFs emitidos). Passado o prazo, a Faradays elimina os Dados do Cliente dos sistemas ativos em até 90 dias, e das cópias de segurança no ciclo normal de rotação, ressalvado o que a lei exija guardar.',
					'Sobrevivem ao encerramento os capítulos sobre propriedade intelectual, confidencialidade, limitação de responsabilidade, lei aplicável e o que, por natureza, deva sobreviver.'
				]
			},
			{
				heading: 'Alterações destes Termos',
				body: [
					'Podemos atualizar estes Termos para refletir mudanças na Plataforma, nos Planos, na legislação ou nas nossas práticas. Alterações relevantes são comunicadas aos Clientes ativos pelo e-mail cadastrado com antecedência mínima de 30 dias. Se o Cliente não concordar, pode cancelar o Plano antes da vigência da nova versão, com reembolso proporcional do período pago e não usufruído.',
					'A versão vigente é sempre a publicada em faradays.io/termos, com a data de revisão no topo. O uso continuado da Plataforma após a vigência de uma nova versão significa aceitação.'
				]
			},
			{
				heading: 'Disposições gerais',
				body: [
					{
						type: 'list',
						items: [
							'**Comunicações.** Avisos ao Cliente são válidos quando enviados ao e-mail do administrador cadastrado. Avisos à Faradays devem ser enviados a contato@faradays.io.',
							'**Cessão.** O Cliente não pode ceder estes Termos sem consentimento por escrito da Faradays. A Faradays pode cedê-los a sucessor em reorganização societária, com aviso ao Cliente.',
							'**Independência.** As partes são independentes; estes Termos não criam sociedade, mandato ou relação de trabalho.',
							'**Tolerância.** Deixar de exigir o cumprimento de uma cláusula não significa renúncia a ela.',
							'**Nulidade parcial.** Se uma cláusula for considerada inválida, as demais permanecem em vigor, e a cláusula inválida é substituída por outra válida de efeito mais próximo.',
							'**Acordo integral.** Estes Termos, o Aviso de Privacidade, a Política de Suporte, a lista de subprocessadores e a descrição do Plano na página de preços formam o acordo integral entre as partes, salvo contrato específico que prevaleça no que dispuser.'
						]
					}
				]
			},
			{
				heading: 'Lei aplicável e foro',
				body: [
					'Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial o Código Civil, o Marco Civil da Internet, a Lei do Software e a LGPD. Fica eleito o foro da Comarca de São Paulo, Estado de São Paulo, para dirimir controvérsias, com renúncia a qualquer outro, salvo disposição diversa em contrato específico ou competência legal inafastável.'
				]
			}
		]
	},
	en: {
		title: 'Terms and Conditions of Use',
		originalAt: 'July 27, 2026',
		updatedAt: 'September 9, 2026',
		numbered: true,
		intro: [
			'These Terms and Conditions of Use (the "Terms") govern the use of the Faradays website and the contracting and use of the platform it provides as a service. "Faradays" is Faradays Consulting LTDA, CNPJ 65.590.441/0001-36, headquartered in São Paulo, Brazil.',
			'Please read carefully. By browsing the website, contracting a Plan or using the platform as a user designated by a customer, you declare that you have read and agree to these Terms and to the [Privacy Notice](/privacidade), which is part of them. If you contract on behalf of a company, you declare that you have authority to bind it.',
			'Enterprise Customers, and any other Customers who sign a specific agreement, follow what is written in that agreement; these Terms apply to whatever the agreement does not regulate.'
		],
		sections: [
			{
				heading: 'Definitions',
				body: [
					{
						type: 'list',
						items: [
							'**Website.** The domains and subdomains operated by Faradays to present the company and its products, starting with faradays.io.',
							'**Platform.** The software provided by Faradays as a service: the web portal, the WhatsApp assistant, the integrations with Microsoft 365, WhatsApp and ERP, the programming interface (API) and the associated documentation.',
							'**Customer.** The legal entity that contracts a Plan and configures the Platform for its own operation.',
							'**User.** A person designated by the Customer to use the Platform — administrators and managers on the portal, and Representatives who operate through WhatsApp.',
							'**Representative.** A User whose WhatsApp number is registered with the assistant. It is the unit of measure of the Plans: each connected number is one Representative; managers and administrators who only use the portal do not count.',
							'**Plan.** Each of the ways of contracting the Platform (Basic, Pro and Enterprise), with the limits, features and support levels described on the [pricing page](/distribuicao/precos) on the date of contracting.',
							'**Customer Data.** Everything the Customer and its Users enter into or connect to the Platform: end-client and supplier records, quotes, orders, invoices, documents, e-mails, drive files and assistant conversations. It is the same term used in the Privacy Notice.',
							'**Third-Party Services.** External platforms the Customer connects to the Platform on its own: Meta (WhatsApp Business Platform), Microsoft (365, SharePoint, OneDrive, Entra ID), the ERP vendor and others that may come to be supported.'
						]
					}
				]
			},
			{
				heading: 'Acceptance and term',
				body: [
					'These Terms take effect for the Customer on the date it contracts a Plan, and for each User on the date of first access to the Platform. For Website visitors, they apply from the moment of access.',
					'The Customer is responsible for its Users: it must make them aware of these Terms, register only authorized people and inform Faradays of any misuse it becomes aware of.',
					'We may update these Terms. The chapter Changes to these Terms describes how and with what notice.'
				]
			},
			{
				heading: 'Use of the Website',
				body: [
					'The Website content is informational. You may browse, read and share the links freely. You may not scrape the Website at scale, overload it, attempt to bypass access controls, use the content to train models or reproduce it commercially without written authorization.',
					'Figures, demonstrations and examples presented on the Website are illustrative and do not constitute a performance guarantee. Commitments to results, where they exist, live in the contract.',
					'We may change, suspend or discontinue parts of the Website at any time, without notice.'
				]
			},
			{
				heading: 'Object and license to use the Platform',
				body: [
					"Once a Plan is contracted, Faradays grants the Customer a **non-exclusive, non-transferable, revocable license limited to the term of the Plan**. It authorizes the Customer and its Users to access and use the Platform in the Customer's own commercial operation, within the limits of the contracted Plan.",
					'The Platform is provided as a service hosted by Faradays. The Customer does not receive a copy of the software, the source code or the infrastructure, and may not:',
					{
						type: 'list',
						items: [
							'Copy, modify, translate, decompile or reverse-engineer the Platform, except where expressly permitted by law;',
							'Resell, sublicense, rent or make the Platform available to third parties, or use it to provide a service to third parties as a bureau;',
							'Share access credentials or register as a Representative anyone who is not part of its own operation;',
							"Circumvent Plan limits, access controls or the assistant's guards;",
							'Use the Platform for unlawful purposes, to send unsolicited messages or in violation of Third-Party Services policies.'
						]
					},
					'Faradays may evolve the Platform continuously — adding, changing or removing features — provided it does not substantially reduce what the contracted Plan offers during the current cycle. Features marked as beta or under development may change or be removed without notice.'
				]
			},
			{
				heading: 'Accounts, roles and Representatives',
				body: [
					'Access to the portal is through an individual account, authenticated by an identity provider — including Google or Microsoft login, when enabled. Each User receives a role: **administrator** (configures integrations, records and permissions), **manager** (sees the whole operation) or **representative** (operates their own portfolio). The Customer is responsible for assigning and reviewing these roles.',
					"The WhatsApp assistant only replies to Representatives registered by the administrator. It applies the **portfolio boundary**: each Representative queries and writes only about the clients in their own portfolio; managers see everything. Correct registration of Representatives and portfolios is the Customer's responsibility — the boundary depends on it.",
					'The Customer must remove or deactivate Users who leave the operation and inform Faradays immediately of any suspected unauthorized access.'
				]
			},
			{
				heading: 'Plans, payment, renewal and cancellation',
				body: [
					{
						type: 'sub',
						heading: 'Plans and limits',
						body: [
							'The Basic and Pro Plans are priced per month, with a limit of included Representatives; the Enterprise Plan is contracted under a proposal and a specific agreement. The prices, limits and features in force are those published on the [pricing page](/distribuicao/precos) on the date of contracting or renewal.',
							"Representatives above the Plan limit are charged pro rata at the Plan's per-Representative price, or require migration to the next Plan, at the Customer's discretion."
						]
					},
					{
						type: 'sub',
						heading: 'Billing period and payment',
						body: [
							'Billing may be **monthly**, paid at the start of each month, or **yearly**, paid once at the start of the cycle with the discount shown on the pricing page. Prices do not include taxes that may apply to the Customer.',
							'In case of late payment, Faradays notifies the Customer. If the delay persists for more than 15 days, it may suspend access to the Platform until regularization; after 60 days, it may terminate the contract, and the chapter Suspension and termination applies. Customer Data is preserved during suspension.'
						]
					},
					{
						type: 'sub',
						heading: 'Changing Plans',
						body: [
							'Upgrades apply immediately, with the difference charged pro rata for the time remaining in the cycle. Downgrades take effect in the next cycle. Nothing is lost in the switch — data, history and settings stay; features exclusive to the previous Plan become unavailable.'
						]
					},
					{
						type: 'sub',
						heading: 'Renewal and cancellation',
						body: [
							'Plans renew automatically at the end of each cycle, for the same period, unless cancelled. The Customer may cancel at any time through the support channel; cancellation takes effect at the end of the current cycle, without penalty, and access continues until then.',
							"Amounts paid are not refunded pro rata for cancellation before the end of the cycle, except: (a) within 7 days of the first contracting, when the Customer may withdraw and receive back what it paid; (b) when termination results from Faradays' breach."
						]
					},
					{
						type: 'sub',
						heading: 'Price adjustments',
						body: [
							'Prices may be adjusted at renewal, with at least 30 days notice to the Customer. During an already paid cycle, the price does not change.'
						]
					}
				]
			},
			{
				heading: 'WhatsApp channel and Meta policies',
				body: [
					"The assistant runs on Meta's WhatsApp Business Platform. The WhatsApp number and the WhatsApp Business account used by the Platform belong to the Customer or are provided as set out in the contract; in either case, the Customer is responsible to Meta for the use of the channel.",
					"The Customer undertakes to comply with Meta's terms and policies applicable to the WhatsApp Business Platform, in particular the business and messaging policies, and not to use the channel for unsolicited messages. The assistant only talks to registered Representatives — not to the Customer's end clients — and the Platform's bulk sends are addressed only to active Representatives.",
					'Meta may change, limit or suspend the API, numbers and accounts at its own discretion. Faradays is not responsible for unavailability, delay, blocking or rule changes imposed by Meta, and may adapt the Platform to remain compliant with those rules.'
				]
			},
			{
				heading:
					'Integrations with Microsoft 365, ERP and other Third-Party Services',
				body: [
					"Integrations are enabled by the Customer's administrator through authorization (OAuth) on the Customer's account. By authorizing, the Customer declares that it has authority to connect the chosen mailboxes, folders and systems, and takes responsibility for what those resources contain.",
					"In the Microsoft 365 connection, the Platform reads and sends e-mail through the connected mailboxes and mirrors the linked SharePoint or OneDrive folders. On the drive, the Platform operates in **read-only mode**, except for operations the Customer expressly enables — such as stamping the expiry date on certificate file names and organizing folders within the linked scope. Deleting an item on the portal never deletes the file on the Customer's drive.",
					'ERP reports imported by the Customer are processed as received. Faradays does not validate the accuracy of ERP data and is not responsible for decisions made on the basis of an incorrect or outdated report sent by the Customer.',
					'Third-Party Services are governed by their own terms and may change or be discontinued without Faradays having any say. If a Third-Party Service becomes unavailable or changes its API, Faradays will make reasonable efforts to adapt the integration, with no guaranteed timeline.'
				]
			},
			{
				heading: 'Artificial intelligence',
				body: [
					"The Platform uses third-party language models to interpret messages, transcribe audio, read images and documents and draft replies. The design principle is: **understanding is the AI's job; deciding and validating is the code's**. Foreign-currency prices only come from a data source, never invented; the AI does not pick a brand or variant on its own when there is more than one candidate; quantities are converted by the system; and refusals explain why.",
					'Even so, language models are probabilistic and may misinterpret a request, transcribe audio incorrectly or read a document inaccurately. The Customer acknowledges this and undertakes to:',
					{
						type: 'list',
						items: [
							'Review quotes, documents and communications generated by the Platform before sending them to third parties or making decisions based on them;',
							"Not treat the Platform's outputs as legal, tax, accounting or regulatory advice — the tax engine applies the rules the Customer configures and keeps up to date;",
							'Not send the assistant sensitive personal data or information unnecessary to the operation.'
						]
					},
					'Faradays may switch the models used to maintain quality, cost and compliance; the providers in use are listed at [/subprocessadores](/subprocessadores). Enterprise customers may choose and restrict the models, with a dedicated budget. Customer Data **is not used by Faradays to train its own models**, and providers are engaged under terms that prohibit using the data to train theirs.'
				]
			},
			{
				heading: 'Customer Data',
				body: [
					'Customer Data belongs to the Customer. The Customer grants Faradays a limited license to host, process and transmit it exclusively to provide the Platform, provide support, comply with the law and ensure security. Faradays does not access Customer Data for its own purposes and does not sell or share it beyond what is described in the [Privacy Notice](/privacidade).',
					"As regards personal data contained in Customer Data, the Customer is the Controller and Faradays the Processor under the LGPD. The chapter Roles in the SaaS model of the Privacy Notice describes the obligations of each party, including the Customer's duty to inform its Representatives that conversations with the assistant are recorded and processed by artificial intelligence. A data processing agreement may be signed at the Customer's request.",
					"The Customer may export Customer Data at any time through the Platform's export features (Excel and PDF) and, on termination, as described in the chapter Suspension and termination.",
					'Faradays may use **aggregated and anonymized data** about Platform usage — volumes, response times, features used — to operate, measure and improve the product. That data never identifies the Customer, its Users or its end clients.'
				]
			},
			{
				heading: 'Acceptable use',
				body: [
					'The Customer and Users may not:',
					{
						type: 'list',
						items: [
							'Use the Platform in violation of the law, of third-party rights or of Third-Party Services policies;',
							'Send, store or process unlawful or malicious content, or content that infringes intellectual property;',
							"Attempt to access another Customer's data, another portfolio or other Users' accounts;",
							'Probe, test or exploit vulnerabilities, except in security testing agreed in writing with Faradays;',
							'Automate access to the Platform by means not provided for (the documented API is the supported path) or impose load that degrades the service for others;',
							'Use the Platform to build a competing product or to extract its inner workings.'
						]
					},
					"Faradays may suspend a User's or the Customer's access, with notice whenever possible, to stop a violation of this chapter or a risk to the security of the Platform and other Customers."
				]
			},
			{
				heading: 'Support, availability and maintenance',
				body: [
					'Each Plan includes the support level shown on the pricing page — e-mail during business hours on Basic, priority with assisted onboarding on Pro, and an account manager with a contractual SLA on Enterprise. Channels, hours, response times, maintenance windows and incident communication are detailed in the [Support and Availability Policy](/suporte), which is part of these Terms.',
					'For the Basic and Pro Plans, Faradays works to a monthly availability target of 99.5% for the Platform, excluding scheduled maintenance and unavailability caused by Third-Party Services, by the Customer or by force majeure. This target is a best-effort commitment, not a guarantee with credits. Service level guarantees with penalties exist only in Enterprise agreements.'
				]
			},
			{
				heading: 'Intellectual property',
				body: [
					'The Platform — code, architecture, data models, prompts, interfaces, documentation, brand and visual identity — is the exclusive property of Faradays or its licensors. It is protected by Brazilian Law No. 9.609/1998 (Software Law), Law No. 9.279/1996 (Industrial Property) and Law No. 9.610/1998 (Copyright). These Terms do not transfer any intellectual property rights to the Customer, only the license to use described above.',
					"Document templates, tax rules, logos and other materials the Customer provides to configure the Platform remain the Customer's. Customizations developed by Faradays on request follow what the specific agreement provides; absent a provision, they belong to Faradays, with a license to use granted to the Customer for the term of the contract.",
					'Suggestions and feedback about the Platform may be used freely by Faradays, with no obligation of compensation or attribution.',
					'Third-party names and logos mentioned on the Website belong to their owners. Faradays only names customers as references with prior authorization.'
				]
			},
			{
				heading: 'Confidentiality',
				body: [
					"Each party will keep confidential the other party's confidential information to which it has access under these Terms. On the Customer's side, that includes Customer Data; on Faradays' side, the non-public aspects of the Platform and the commercial terms. That information may only be used for the purposes of these Terms, and must be protected with the same care each party devotes to its own — never less than reasonable.",
					'Information that was already public, that the receiving party already legitimately knew or that was independently developed is not confidential. Disclosure required by law or by order of an authority is permitted, with prior notice to the other party whenever possible. The obligation survives the end of these Terms for 5 years; for personal data, for as long as the law requires.'
				]
			},
			{
				heading: 'Warranties and limitation of liability',
				body: [
					'Faradays warrants that it will provide the Platform diligently and in accordance with these Terms, the Support Policy and the Plan description. Beyond that, the Platform is provided **as is**. We do not warrant that it will meet every specific purpose of the Customer, that it will operate without interruption or error, or that the artificial intelligence outputs will always be correct.',
					'Faradays is not liable for:',
					{
						type: 'list',
						items: [
							'Unavailability, changes or blocking imposed by Third-Party Services — Meta, Microsoft, AI model providers, the ERP vendor, hosting and network providers;',
							'Incorrect, incomplete or outdated data entered or imported by the Customer, and decisions made from it;',
							'Quotes, documents and communications sent by the Customer to third parties without the review described in the chapter Artificial intelligence;',
							"Misuse of credentials, incorrect registration of Representatives or the Customer's failure to keep permissions up to date;",
							'Acts of God or force majeure, including general internet and power failures, large-scale attacks and acts of authority.'
						]
					},
					"To the maximum extent permitted by law, Faradays' total liability to the Customer, for all events occurring in a 12-month period, is limited to the **amount actually paid by the Customer for the Plan in those 12 months**. Faradays is not liable for loss of profits, loss of business, indirect damages or damage to image, even if advised of the possibility.",
					"These limitations do not apply to willful misconduct, to breaches of confidentiality or of personal data caused by Faradays' gross negligence, or to anything the law does not allow to be limited."
				]
			},
			{
				heading: 'Suspension and termination',
				body: [
					'Either party may terminate these Terms: the Customer, by cancelling the Plan as described in the chapter Plans; Faradays, with 60 days notice, or immediately in case of a serious breach not remedied within 15 days of notification, prolonged non-payment, an order from an authority or a risk to the security of the Platform.',
					"Once the contract ends, access to the Platform ceases. The Customer has **30 days** to export Customer Data through the Platform's features or by request to support, which delivers the data in a commonly used structured format (CSV, XLSX and the issued PDFs). After that period, Faradays deletes Customer Data from active systems within 90 days, and from backups in the normal rotation cycle, subject to what the law requires to be kept.",
					'The chapters on intellectual property, confidentiality, limitation of liability, governing law and whatever by its nature should survive, survive termination.'
				]
			},
			{
				heading: 'Changes to these Terms',
				body: [
					'We may update these Terms to reflect changes in the Platform, the Plans, legislation or our practices. Relevant changes are communicated to active Customers by the registered e-mail at least 30 days in advance. If the Customer does not agree, it may cancel the Plan before the new version takes effect, with a pro rata refund of the paid and unused period.',
					'The version in force is always the one published at faradays.io/termos, with the revision date at the top. Continued use of the Platform after a new version takes effect means acceptance.'
				]
			},
			{
				heading: 'General provisions',
				body: [
					{
						type: 'list',
						items: [
							"**Notices.** Notices to the Customer are valid when sent to the registered administrator's e-mail. Notices to Faradays must be sent to contato@faradays.io.",
							"**Assignment.** The Customer may not assign these Terms without Faradays' written consent. Faradays may assign them to a successor in a corporate reorganization, with notice to the Customer.",
							'**Independence.** The parties are independent; these Terms do not create a partnership, agency or employment relationship.',
							'**Waiver.** Failing to enforce a clause does not mean waiving it.',
							'**Severability.** If a clause is held invalid, the others remain in force, and the invalid clause is replaced by a valid one with the closest effect.',
							'**Entire agreement.** These Terms, the Privacy Notice, the Support Policy, the list of subprocessors and the Plan description on the pricing page form the entire agreement between the parties, except for a specific agreement that prevails where it provides otherwise.'
						]
					}
				]
			},
			{
				heading: 'Governing law and jurisdiction',
				body: [
					'These Terms are governed by the laws of the Federative Republic of Brazil, in particular the Civil Code, the Brazilian Internet Act, the Software Law and the LGPD. The courts of the Judicial District of São Paulo, State of São Paulo, are chosen to settle disputes, waiving any other, unless a specific agreement provides otherwise or the law establishes non-waivable jurisdiction.'
				]
			}
		]
	}
}

export default function TermosPage() {
	return <LegalPage slug="/termos" content={CONTENT} />
}
