import type { Metadata } from 'next'

import type { LegalContent } from '@/components/landing/legal-page'
import { LegalPage } from '@/components/landing/legal-page'
import type { Localized } from '@/lib/i18n'

export const metadata: Metadata = {
	title: 'Aviso de Privacidade — Faradays',
	description:
		'Quais dados pessoais a Faradays trata no site e na plataforma, com que finalidade e base legal, com quem compartilha, por quanto tempo guarda e como exercer seus direitos pela LGPD.'
}

/* Redação a partir do que o produto de fato faz (docs/politicas-pendencias.md
   lista o que ainda depende de decisão ou de engenharia). A versão EN é
   tradução de trabalho do PT — em conflito, vale o PT. Ambas precisam de
   revisão jurídica antes de valer como texto oficial. */
const CONTENT: Localized<LegalContent> = {
	pt: {
		title: 'Aviso de Privacidade',
		originalAt: '27 de julho de 2026',
		updatedAt: '9 de setembro de 2026',
		numbered: true,
		intro: [
			'A Faradays Consulting LTDA, CNPJ 65.590.441/0001-36, com sede em São Paulo/SP ("Faradays"), publica este Aviso de Privacidade (o "Aviso") para explicar como trata dados pessoais. Ele vale quando você visita o nosso site, fala com o nosso time ou usa a plataforma que fornecemos aos nossos clientes.',
			'A plataforma da Faradays é um software operado como serviço (SaaS): a Faradays hospeda e mantém o sistema, e cada cliente conecta a ele os próprios canais e dados — WhatsApp, Microsoft 365, relatórios do ERP. Esse desenho define quem responde pelo quê, e por isso tem um capítulo próprio adiante.',
			'Este Aviso integra os [Termos e Condições de Uso](/termos) e é complementado pela [lista de subprocessadores](/subprocessadores) e pela [Política de Cookies](/cookies). Em caso de dúvida ou para exercer seus direitos, fale conosco pelos canais indicados ao final.'
		],
		sections: [
			{
				heading: 'Definições',
				body: [
					'Para facilitar a leitura, alguns termos usados ao longo deste Aviso:',
					{
						type: 'list',
						items: [
							'**Site.** Os domínios e subdomínios operados pela Faradays para apresentar a empresa e os seus produtos, começando por faradays.io.',
							'**Plataforma.** O software que a Faradays fornece aos Clientes como serviço: o portal web, o assistente no WhatsApp, as integrações e a interface de programação (API) associada.',
							'**Cliente.** A pessoa jurídica que contrata a Plataforma e a configura para a própria operação.',
							'**Usuário.** Pessoa indicada pelo Cliente para usar a Plataforma — administradores e gestores no portal, e Representantes que operam pelo WhatsApp.',
							'**Representante.** Usuário cujo número de WhatsApp está cadastrado no assistente e que opera a Plataforma por conversa.',
							'**Dados do Cliente.** Tudo o que o Cliente e seus Usuários inserem ou conectam à Plataforma: cadastros de clientes finais e fornecedores, cotações, pedidos, notas, documentos, e-mails, arquivos do drive e conversas do assistente.',
							'**Titular.** Pessoa natural a quem os dados pessoais se referem.',
							'**Controlador / Operador.** Conceitos da LGPD. O Controlador decide sobre o tratamento; o Operador trata os dados em nome e segundo as instruções do Controlador.',
							'**Subprocessador.** Fornecedor contratado pela Faradays que trata dados pessoais para que a Plataforma ou o Site funcionem. A lista nominal está em [/subprocessadores](/subprocessadores).',
							'**LGPD.** Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais. **ANPD** é a Autoridade Nacional de Proteção de Dados.',
							'**Tratamento.** Qualquer operação com dados pessoais — coleta, armazenamento, uso, transmissão, eliminação — nos termos do art. 5º, X, da LGPD.'
						]
					}
				]
			},
			{
				heading: 'A quem se aplica este Aviso',
				body: [
					'Este Aviso se aplica a você se for:',
					{
						type: 'list',
						items: [
							'**Visitante do Site**, inclusive quem lê o blog ou agenda uma conversa com o time;',
							'**Pessoa de uma empresa interessada** que fala conosco por e-mail, formulário, agendamento ou demonstração;',
							'**Usuário da Plataforma** — administrador, gestor ou representante indicado por um Cliente;',
							'**Terceiro cujos dados constam nos Dados do Cliente** — por exemplo, uma pessoa de contato em um cliente final ou fornecedor do Cliente. Nesse caso, o Cliente é o Controlador dos seus dados e a Faradays atua como Operadora (ver o capítulo Papéis no modelo SaaS). Pedidos sobre esses dados devem ser dirigidos ao Cliente; se chegarem a nós, encaminhamos a ele.'
						]
					}
				]
			},
			{
				heading: 'Quais dados coletamos e como',
				body: [
					'Coletamos dados pessoais em quatro contextos distintos, cada um com fonte e finalidade próprias.',
					{
						type: 'sub',
						heading:
							'Dados que você nos fornece no Site ou no contato comercial',
						body: [
							{
								type: 'list',
								items: [
									'**Identificação e contato.** Nome, e-mail, telefone, empresa e cargo, quando você nos escreve, agenda uma conversa ou pede uma demonstração.',
									'**Conteúdo das mensagens.** O que você nos envia por e-mail ou pelas ferramentas de agendamento, guardado para resposta e histórico do atendimento.',
									'**Dados de demonstração.** Se você trouxer um fluxo real da sua operação para uma demo, tratamos esses dados apenas durante a demonstração e os eliminamos ao final, salvo acordo diferente por escrito.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Dados de conta e de uso da Plataforma',
						body: [
							{
								type: 'list',
								items: [
									'**Identidade de acesso.** Nome, e-mail, nome de usuário e grupos de permissão (administrador, gestor, representante), recebidos do provedor de identidade do login — inclusive login social Google ou Microsoft, quando habilitado. Não armazenamos senhas: a autenticação é delegada ao provedor de identidade.',
									'**Cadastro de Representante.** Nome, nome como aparece no ERP do Cliente, número de WhatsApp e e-mail, cadastrados pelo administrador do Cliente para que o assistente reconheça quem escreve.',
									'**Registros de atividade.** Ações realizadas na Plataforma (módulo, ação, entidade afetada, data e hora), guardados na trilha de auditoria; endereço IP, data, hora e identificador do dispositivo nos registros de acesso, conforme o art. 15 do Marco Civil da Internet (Lei nº 12.965/2014).'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Dados do Cliente (tratados como Operadora)',
						body: [
							'São os dados que o Cliente e seus Usuários inserem ou conectam à Plataforma para operar. Não os coletamos por iniciativa própria: chegam por instrução do Cliente, por upload, por integração autorizada pelo administrador ou por mensagem enviada por um Usuário ao assistente.',
							{
								type: 'list',
								items: [
									'**Conversas com o assistente no WhatsApp.** Número de telefone do Representante, texto das mensagens nas duas direções, transcrição de áudios e texto extraído de fotos, identificadores técnicos da mensagem e o conteúdo bruto do evento recebido da Meta. Os arquivos de áudio e imagem não são guardados pela Plataforma — ficam nos servidores da Meta pelo prazo dela; o que persiste é o texto resultante. O assistente conversa apenas com Representantes cadastrados pelo Cliente; mensagens de números desconhecidos não recebem resposta automática.',
									'**Cadastros comerciais.** Clientes finais do Cliente (razão social, CNPJ, cidade e UF, nomes e contatos de pessoas, e-mail, telefone, condições comerciais, limite de crédito e situação de bloqueio importados do ERP) e fornecedores (nome, e-mail, WhatsApp, país de origem).',
									'**Documentos comerciais e regulatórios.** Cotações de venda e compra, pedidos, notas fiscais, boletos, laudos, certificados e demais arquivos que o Cliente sobe ou vincula.',
									'**E-mail.** Quando o administrador conecta uma caixa do Microsoft 365, a Plataforma recebe assunto, remetente, destinatários, corpo e anexos das mensagens da caixa conectada, para automatizar cotações de compra e a cobrança de documentos.',
									'**Arquivos do SharePoint e OneDrive.** Quando o administrador vincula uma pasta, a Plataforma espelha nomes, caminhos e metadados dos arquivos, e importa o conteúdo dos documentos dentro do escopo vinculado.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Dados coletados automaticamente no Site',
						body: [
							'O Site registra dados técnicos mínimos da navegação — endereço IP, data e hora, páginas acessadas, tipo de navegador e dispositivo — nos registros do servidor de hospedagem, para segurança e para cumprir o art. 15 do Marco Civil da Internet. O único cookie que o Site grava hoje guarda a sua preferência de idioma. Detalhes na [Política de Cookies](/cookies).'
						]
					}
				]
			},
			{
				heading: 'Finalidades do tratamento',
				body: [
					'Tratamos os dados descritos acima exclusivamente para as finalidades abaixo. Tratamento para finalidade não prevista aqui dependerá de nova base legal ou de novo consentimento.',
					{
						type: 'list',
						items: [
							'**Atender e conversar com você.** Responder ao contato, agendar e conduzir demonstrações, enviar propostas.',
							'**Prestar o serviço contratado.** Autenticar Usuários, aplicar permissões, operar o assistente, gerar cotações e documentos, sincronizar as integrações que o Cliente autorizou, manter a trilha de auditoria e prestar suporte.',
							'**Executar a inteligência artificial da Plataforma.** Enviar mensagens, áudios, imagens e o contexto necessário aos modelos de linguagem, para interpretar pedidos, transcrever, ler documentos e redigir respostas. Sempre dentro da instrução do Cliente, e com o resultado validado por regras do sistema.',
							'**Segurança e prevenção a abuso.** Registrar acessos, detectar uso indevido, proteger a infraestrutura e as contas.',
							'**Cumprir obrigações legais** e atender ordens de autoridades, inclusive a ANPD e o Marco Civil da Internet.',
							'**Exercer direitos regularmente,** inclusive em processos judiciais, administrativos ou arbitrais.',
							'**Melhorar o produto,** com base em métricas agregadas de uso e em incidentes de suporte — nunca com a leitura de Dados do Cliente para fins próprios.',
							'**Comunicação institucional,** como novidades do produto e conteúdo do blog, sempre com opção de descadastro.'
						]
					},
					'A Faradays **não vende dados pessoais**, **não os usa para publicidade de terceiros** e **não usa os Dados do Cliente dos Clientes para treinar modelos próprios de inteligência artificial**.'
				]
			},
			{
				heading: 'Bases legais aplicáveis',
				body: [
					'Cada finalidade encontra base legal na LGPD, conforme a tabela abaixo:',
					{
						type: 'table',
						head: ['Dados', 'Finalidade', 'Base legal (LGPD)'],
						rows: [
							[
								'Contato comercial e agendamentos',
								'Responder, agendar demonstrações, enviar propostas',
								'Procedimentos preliminares ao contrato (art. 7º, V) e legítimo interesse (art. 7º, IX)'
							],
							[
								'Identidade de acesso e cadastro de Usuários',
								'Autenticação, permissões e operação do serviço contratado pelo Cliente',
								'Execução de contrato (art. 7º, V)'
							],
							[
								'Dados do Cliente do Cliente',
								'Prestação do serviço, sob instrução do Cliente',
								'A base legal é definida pelo Cliente, Controlador desses dados; a Faradays trata como Operadora (art. 39)'
							],
							[
								'Registros de acesso e trilha de auditoria',
								'Segurança, responsabilização e cumprimento do Marco Civil',
								'Obrigação legal (art. 7º, II) e legítimo interesse (art. 7º, IX)'
							],
							[
								'Dados de faturamento e contrato',
								'Cobrança, emissão de notas e guarda fiscal',
								'Execução de contrato (art. 7º, V) e obrigação legal (art. 7º, II)'
							],
							[
								'Comunicação institucional e novidades',
								'Enviar conteúdo e novidades do produto',
								'Legítimo interesse (art. 7º, IX), com descadastro a qualquer tempo'
							],
							[
								'Cookie de preferência de idioma',
								'Manter o Site no idioma escolhido',
								'Legítimo interesse (art. 7º, IX) — estritamente necessário'
							]
						]
					},
					'Consentimentos, quando forem a base utilizada, podem ser revogados a qualquer tempo pelos canais informados ao final deste Aviso.'
				]
			},
			{
				heading: 'Com quem compartilhamos seus dados',
				body: [
					'Compartilhamos dados pessoais apenas com quem é indispensável para operar o Site e a Plataforma, em quatro grupos.',
					{
						type: 'sub',
						heading: 'Subprocessadores',
						body: [
							'Fornecedores que tratam dados sob nossa instrução para que o serviço exista: hospedagem e rede, provedor de identidade, plataforma de mensagens do WhatsApp, provedores de modelos de inteligência artificial, repositório de código e automação de implantação. Mantemos com eles contratos ou termos que exigem confidencialidade e padrões de segurança compatíveis com a LGPD.',
							'A lista nominal, com a função de cada um, os dados que recebe e o país onde opera, está publicada em [/subprocessadores](/subprocessadores). Podemos adicionar ou substituir subprocessadores de mesma natureza; Clientes ativos são avisados com antecedência mínima de 30 dias e podem se opor por motivo razoável.'
						]
					},
					{
						type: 'sub',
						heading: 'Plataformas conectadas pelo Cliente',
						body: [
							'A Plataforma se integra a serviços que o próprio Cliente já contrata e conecta: a conta do WhatsApp Business na Meta, o tenant do Microsoft 365 (e-mail, SharePoint, OneDrive, Entra ID) e o ERP de onde saem os relatórios importados. Esses provedores tratam dados segundo os próprios termos, como Controladores independentes ou como Operadores do Cliente — não da Faradays. Cabe ao Cliente revisar esses termos antes de habilitar cada integração.'
						]
					},
					{
						type: 'sub',
						heading:
							'Provedores de modelos de inteligência artificial',
						body: [
							'As funções de IA da Plataforma são executadas por modelos de terceiros, acessados por meio de um roteador de modelos. O conteúdo enviado — texto das mensagens, áudios para transcrição, imagens para leitura e o contexto da resposta — é tratado por esses provedores apenas para gerar a saída. Os termos com eles vedam o uso desse conteúdo para treinar os seus modelos. Quais provedores estão em uso, e em que país, consta em [/subprocessadores](/subprocessadores). Clientes do Plano Enterprise podem escolher e restringir os modelos utilizados.'
						]
					},
					{
						type: 'sub',
						heading: 'Autoridades e terceiros por exigência legal',
						body: [
							'Compartilhamos dados quando houver obrigação legal, ordem judicial ou requisição de autoridade competente, limitando-nos ao estritamente exigido e, sempre que a lei permitir, comunicando o Cliente afetado.'
						]
					},
					{
						type: 'sub',
						heading: 'Links e recursos de terceiros',
						body: [
							'O Site pode conter links para serviços de terceiros — por exemplo, a ferramenta de agendamento de conversas ou redes sociais. Esses serviços têm avisos de privacidade próprios, pelos quais a Faradays não responde.'
						]
					}
				]
			},
			{
				heading: 'Papéis no modelo SaaS',
				body: [
					'A Plataforma é operada como serviço: a Faradays hospeda e mantém o sistema, e o Cliente decide o que conecta e para quê. Essa divisão define os papéis da LGPD.',
					{
						type: 'sub',
						heading: 'Faradays como Controladora',
						body: [
							'A Faradays é Controladora dos seguintes dados:',
							{
								type: 'list',
								items: [
									'De quem visita o Site e de quem fala conosco comercialmente;',
									'De conta e de identidade dos Usuários;',
									'Registros de acesso e trilha de auditoria;',
									'De faturamento e contrato do Cliente.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading:
							'Cliente como Controlador; Faradays como Operadora',
						body: [
							'O Cliente é o Controlador de todos os Dados do Cliente — cadastros dos seus clientes finais e fornecedores, conversas dos seus Representantes com o assistente, e-mails, documentos, arquivos do drive e relatórios do ERP. A Faradays os trata como Operadora: apenas para prestar o serviço, dentro das instruções do Cliente registradas no contrato, nos Termos e na configuração feita por seus administradores.',
							'Como Operadora, a Faradays: trata os Dados do Cliente apenas para as finalidades do serviço; não os acessa para fins próprios, exceto quando necessário para suporte solicitado pelo Cliente, para segurança ou por obrigação legal; mantém as medidas de segurança do capítulo Como protegemos seus dados; auxilia o Cliente no atendimento a Titulares; comunica incidentes de segurança; e, no encerramento do contrato, devolve ou elimina os dados conforme o capítulo Por quanto tempo guardamos.'
						]
					},
					{
						type: 'sub',
						heading: 'Responsabilidades do Cliente',
						body: [
							{
								type: 'list',
								items: [
									'Ter base legal para os Dados do Cliente que insere ou conecta, e informar os seus Representantes de que as conversas com o assistente são registradas e processadas por inteligência artificial;',
									'Informar seus clientes finais e fornecedores sobre o tratamento, quando a LGPD exigir, e atender aos pedidos desses Titulares;',
									'Cadastrar apenas Usuários autorizados e manter as permissões atualizadas — a fronteira de carteira que o assistente aplica depende do cadastro correto dos Representantes;',
									'Não inserir na Plataforma dados pessoais sensíveis ou dados de crianças e adolescentes, que não são necessários à finalidade do serviço;',
									'Revisar os termos das plataformas que conecta (Meta, Microsoft, ERP) antes de habilitar cada integração.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Limites',
						body: [
							'A Faradays não responde pelo tratamento realizado pela Meta, pela Microsoft, pelo fornecedor do ERP ou por qualquer outro serviço conectado pelo Cliente, nem pelo conteúdo que os Usuários decidem enviar ao assistente. Um contrato de tratamento de dados com o detalhamento dessas obrigações pode ser firmado com cada Cliente e prevalece sobre este capítulo no que for mais específico.'
						]
					}
				]
			},
			{
				heading: 'Por quanto tempo guardamos seus dados',
				body: [
					{
						type: 'list',
						items: [
							'**Contato comercial.** Enquanto durar a conversa e por até 24 meses após o último contato, salvo se você pedir a eliminação antes.',
							'**Dados de conta e Usuários.** Enquanto o Cliente mantiver o contrato ativo. Usuário removido pelo Cliente tem os dados de identidade eliminados, restando apenas as referências na trilha de auditoria.',
							'**Dados do Cliente.** Enquanto durar o contrato. Ao término, o Cliente tem 30 dias para exportar os dados; depois disso, eliminamos os Dados do Cliente dos sistemas ativos em até 90 dias, e das cópias de segurança no ciclo normal de rotação.',
							'**Cópias de segurança.** O banco de dados é copiado diariamente e cada cópia é mantida por 14 dias.',
							'**Registros de acesso e aplicação.** Por no mínimo 6 meses, em cumprimento ao art. 15 do Marco Civil da Internet.',
							'**Trilha de auditoria.** Pela duração do contrato e por até 5 anos após o término, para responsabilização e defesa em processos.',
							'**Dados fiscais e contratuais.** Pelos prazos exigidos pela legislação fiscal e civil — em geral 5 anos após o fim da relação.'
						]
					},
					'Você pode pedir a eliminação dos dados dos quais a Faradays é Controladora a qualquer tempo, pelos canais ao final. Atendido o pedido, os dados são eliminados ou anonimizados, ressalvadas as hipóteses de conservação acima (art. 16 da LGPD).'
				]
			},
			{
				heading: 'Como protegemos seus dados',
				body: [
					'Adotamos medidas técnicas e administrativas proporcionais ao risco, entre elas:',
					{
						type: 'list',
						items: [
							'Criptografia em trânsito (TLS) em todo acesso ao Site e à Plataforma, com a Plataforma exposta apenas por túnel e sem portas abertas à internet além do acesso administrativo;',
							'Autenticação delegada a provedor de identidade, controle de acesso por papéis (administrador, gestor, representante) e, no assistente, fronteira de carteira — cada Representante consulta e escreve apenas sobre a própria carteira; o gestor vê tudo;',
							'Credenciais de integração (tokens do Microsoft 365) armazenadas cifradas e nunca expostas pela API; segredos fora do código e do repositório;',
							'Cópias de segurança diárias do banco de dados, com retenção de 14 dias;',
							'Trilha de auditoria imutável das ações relevantes;',
							'Separação de ambientes e implantação automatizada a partir de código revisado; dependências obtidas de registros oficiais com verificação de integridade;',
							'Acesso interno aos ambientes de produção restrito a pessoas nomeadas e apenas para operação e suporte.'
						]
					},
					'Nenhum sistema é infalível. Se identificarmos incidente de segurança com risco ou dano relevante aos Titulares, comunicaremos a ANPD e os Titulares nos prazos da LGPD e da regulamentação da ANPD. No caso dos Dados do Cliente, o comunicado vai ao Cliente, que é o Controlador. O aviso descreve o ocorrido, os dados envolvidos e as medidas adotadas. Se você identificar vulnerabilidade ou suspeita de incidente, escreva para contato@faradays.io.'
				]
			},
			{
				heading: 'Direitos do Titular',
				body: [
					'A LGPD garante a você, como Titular, os direitos abaixo, exercíveis pelos canais informados ao final:',
					{
						type: 'list',
						items: [
							'Confirmação da existência de tratamento e acesso aos dados;',
							'Correção de dados incompletos, inexatos ou desatualizados;',
							'Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;',
							'Portabilidade a outro fornecedor, observados o segredo comercial e industrial;',
							'Eliminação dos dados tratados com base em consentimento, ressalvadas as hipóteses legais de conservação;',
							'Informação sobre com quem compartilhamos os seus dados;',
							'Informação sobre a possibilidade de não consentir e as consequências da negativa;',
							'Revogação do consentimento, a qualquer tempo e sem custo;',
							'Oposição ao tratamento baseado em legítimo interesse;',
							'Revisão de decisões tomadas unicamente com base em tratamento automatizado;',
							'Petição à ANPD.'
						]
					},
					'Podemos pedir comprovação de identidade antes de atender, para proteger os seus próprios dados. Respondemos aos pedidos nos prazos da LGPD; em casos complexos, informamos o andamento. Quando a Faradays atuar como Operadora, encaminharemos o pedido ao Cliente Controlador e o apoiaremos no atendimento.',
					'Sobre decisões automatizadas: a inteligência artificial da Plataforma interpreta pedidos e redige respostas, mas preços, quantidades, tributos e permissões são decididos por regras determinísticas do sistema e os documentos emitidos são revisáveis por pessoas do Cliente. Nenhuma decisão com efeito jurídico sobre um Titular é tomada pela Plataforma sem intervenção humana do Cliente.'
				]
			},
			{
				heading: 'Cookies',
				body: [
					'O Site usa um único cookie, estritamente necessário, para guardar a preferência de idioma. Não há cookies de análise ou de publicidade em uso. Se isso mudar, os cookies opcionais só serão ativados após o seu consentimento e este Aviso e a [Política de Cookies](/cookies) serão atualizados antes.',
					'A Plataforma usa cookies de sessão para manter você autenticado — também estritamente necessários.'
				]
			},
			{
				heading: 'Transferência internacional de dados',
				body: [
					'Parte dos subprocessadores da Faradays opera fora do Brasil, e algumas plataformas conectadas pelo Cliente têm infraestrutura global. Isso significa que dados pessoais podem ser transferidos, em especial, para:',
					{
						type: 'list',
						items: [
							'**Estados Unidos** — Meta (WhatsApp Cloud API), provedores de modelos de inteligência artificial e o roteador que os acessa, repositório de código e automação de implantação, rede de distribuição e proteção de tráfego;',
							'**Região do tenant Microsoft 365 do Cliente** — os dados de e-mail e drive permanecem onde o Cliente já os mantém; a Plataforma os acessa de onde está hospedada;',
							'**Local de hospedagem da Plataforma** — indicado, por fornecedor, em [/subprocessadores](/subprocessadores).'
						]
					},
					'Essas transferências observam o art. 33 da LGPD e a regulamentação da ANPD sobre transferências internacionais: fundamentam-se em cláusulas contratuais padrão, em decisões de adequação ou nas demais salvaguardas previstas em lei, e são limitadas ao necessário à prestação do serviço.'
				]
			},
			{
				heading: 'Encarregado e canais de contato',
				body: [
					'Em cumprimento ao art. 41 da LGPD, a Faradays mantém Encarregado pelo tratamento de dados pessoais, que pode ser contatado por:',
					{
						type: 'list',
						items: [
							'**E-mail (privacidade, LGPD e exercício de direitos):** contato@faradays.io, com o assunto "Privacidade";',
							'**Endereço:** Faradays Consulting LTDA, CNPJ 65.590.441/0001-36, São Paulo/SP.'
						]
					},
					'Clientes podem tratar de assuntos de proteção de dados também pelo canal de suporte do seu Plano, descrito na [Política de Suporte](/suporte).'
				]
			},
			{
				heading: 'Alterações deste Aviso',
				body: [
					'Este Aviso pode ser atualizado para refletir mudanças na operação, na legislação ou nas nossas práticas. Alterações relevantes são comunicadas aos Clientes ativos pelo e-mail cadastrado com antecedência mínima de 30 dias, e a todos por aviso nesta página. A versão vigente é sempre a publicada em faradays.io/privacidade, com a data de revisão no topo. O uso continuado do Site ou da Plataforma após a vigência de uma nova versão indica ciência do seu conteúdo.'
				]
			}
		]
	},
	en: {
		title: 'Privacy Notice',
		originalAt: 'July 27, 2026',
		updatedAt: 'September 9, 2026',
		numbered: true,
		intro: [
			'Faradays Consulting LTDA, CNPJ 65.590.441/0001-36, headquartered in São Paulo, Brazil ("Faradays"), publishes this Privacy Notice (the "Notice") to explain how it processes personal data. It applies when you visit our website, talk to our team or use the platform we provide to our customers.',
			'The Faradays platform is software operated as a service (SaaS): Faradays hosts and maintains the system, and each customer connects their own channels and data to it — WhatsApp, Microsoft 365, ERP reports. This design determines who is responsible for what, which is why it gets its own chapter below.',
			'This Notice is part of the [Terms and Conditions of Use](/termos) and is complemented by the [list of subprocessors](/subprocessadores) and the [Cookie Policy](/cookies). For questions or to exercise your rights, contact us through the channels listed at the end.'
		],
		sections: [
			{
				heading: 'Definitions',
				body: [
					'To make reading easier, some terms used throughout this Notice:',
					{
						type: 'list',
						items: [
							'**Website.** The domains and subdomains operated by Faradays to present the company and its products, starting with faradays.io.',
							'**Platform.** The software Faradays provides to Customers as a service: the web portal, the WhatsApp assistant, the integrations and the associated programming interface (API).',
							'**Customer.** The legal entity that contracts the Platform and configures it for its own operation.',
							'**User.** A person designated by the Customer to use the Platform — administrators and managers on the portal, and Representatives who operate through WhatsApp.',
							'**Representative.** A User whose WhatsApp number is registered with the assistant and who operates the Platform through conversation.',
							'**Customer Data.** Everything the Customer and its Users enter into or connect to the Platform: end-client and supplier records, quotes, orders, invoices, documents, e-mails, drive files and assistant conversations.',
							'**Data Subject.** The natural person to whom personal data refers.',
							'**Controller / Processor.** LGPD concepts. The Controller decides on the processing; the Processor processes data on behalf of and under the instructions of the Controller.',
							'**Subprocessor.** A vendor engaged by Faradays that processes personal data so that the Platform or the Website can work. The named list is at [/subprocessadores](/subprocessadores).',
							'**LGPD.** Law No. 13.709/2018 — the Brazilian General Data Protection Law. **ANPD** is the Brazilian National Data Protection Authority.',
							'**Processing.** Any operation with personal data — collection, storage, use, transmission, deletion — under art. 5, X, of the LGPD.'
						]
					}
				]
			},
			{
				heading: 'Who this Notice applies to',
				body: [
					'This Notice applies to you if you are:',
					{
						type: 'list',
						items: [
							'**A Website visitor**, including readers of the blog or anyone who books a conversation with the team;',
							'**A person from an interested company** who talks to us by e-mail, form, booking or demo;',
							'**A Platform User** — an administrator, manager or representative designated by a Customer;',
							"**A third party whose data appears in Customer Data** — for example, a contact person at one of the Customer's end clients or suppliers. In that case the Customer is the Controller of your data and Faradays acts as Processor (see the chapter Roles in the SaaS model). Requests about that data should be addressed to the Customer; if they reach us, we forward them."
						]
					}
				]
			},
			{
				heading: 'What data we collect and how',
				body: [
					'We collect personal data in four distinct contexts, each with its own source and purpose.',
					{
						type: 'sub',
						heading:
							'Data you provide on the Website or in sales contact',
						body: [
							{
								type: 'list',
								items: [
									'**Identification and contact.** Name, e-mail, phone, company and role, when you write to us, book a conversation or request a demo.',
									'**Message content.** What you send us by e-mail or through the booking tools, kept for reply and support history.',
									'**Demo data.** If you bring a real workflow from your operation to a demo, we process that data only during the demonstration and delete it afterwards, unless otherwise agreed in writing.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Account and Platform usage data',
						body: [
							{
								type: 'list',
								items: [
									'**Login identity.** Name, e-mail, username and permission groups (administrator, manager, representative), received from the identity provider used for login — including Google or Microsoft social login, when enabled. We do not store passwords: authentication is delegated to the identity provider.',
									"**Representative record.** Name, name as it appears in the Customer's ERP, WhatsApp number and e-mail, registered by the Customer's administrator so the assistant recognizes who is writing.",
									'**Activity records.** Actions performed on the Platform (module, action, affected entity, date and time), kept in the audit trail; IP address, date, time and device identifier in access logs, as required by art. 15 of the Brazilian Internet Act (Law No. 12.965/2014).'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Customer Data (processed as Processor)',
						body: [
							'This is the data the Customer and its Users enter into or connect to the Platform in order to operate. We do not collect it on our own initiative: it arrives by instruction of the Customer, by upload, by an integration authorized by the administrator or by a message a User sends to the assistant.',
							{
								type: 'list',
								items: [
									"**Conversations with the WhatsApp assistant.** The representative's phone number, message text in both directions, transcripts of voice notes and text extracted from photos, technical message identifiers and the raw event content received from Meta. Audio and image files are not stored by the Platform — they remain on Meta's servers for Meta's retention period; what persists is the resulting text. The assistant only talks to representatives registered by the Customer; messages from unknown numbers receive no automatic reply.",
									"**Business records.** The Customer's end clients (company name, CNPJ, city and state, names and contact details of people, e-mail, phone, commercial terms, credit limit and block status imported from the ERP) and suppliers (name, e-mail, WhatsApp, country of origin).",
									'**Commercial and regulatory documents.** Sales and purchase quotes, orders, invoices, payment slips, certificates of analysis and other files the Customer uploads or links.',
									'**E-mail.** When the administrator connects a Microsoft 365 mailbox, the Platform receives the subject, sender, recipients, body and attachments of messages in the connected mailbox, to automate purchase quotes and document follow-ups.',
									'**SharePoint and OneDrive files.** When the administrator links a folder, the Platform mirrors file names, paths and metadata, and imports the content of documents within the linked scope.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Data collected automatically on the Website',
						body: [
							'The Website records minimal technical browsing data — IP address, date and time, pages visited, browser and device type — in the hosting server logs, for security and to comply with art. 15 of the Brazilian Internet Act. The only cookie the Website sets today stores your language preference. Details in the [Cookie Policy](/cookies).'
						]
					}
				]
			},
			{
				heading: 'Purposes of processing',
				body: [
					'We process the data described above exclusively for the purposes below. Processing for a purpose not listed here will require a new legal basis or new consent.',
					{
						type: 'list',
						items: [
							'**Serving and talking to you.** Replying to contact, scheduling and running demos, sending proposals.',
							'**Providing the contracted service.** Authenticating Users, applying permissions, running the assistant, generating quotes and documents, syncing the integrations the Customer authorized, keeping the audit trail and providing support.',
							"**Running the Platform's artificial intelligence.** Sending messages, audio, images and the necessary context to language models, to interpret requests, transcribe, read documents and draft replies. Always within the Customer's instruction, and with the result validated by system rules.",
							'**Security and abuse prevention.** Logging access, detecting misuse, protecting infrastructure and accounts.',
							'**Complying with legal obligations** and responding to orders from authorities, including the ANPD and the Brazilian Internet Act.',
							'**Exercising rights,** including in judicial, administrative or arbitration proceedings.',
							'**Improving the product,** based on aggregated usage metrics and support incidents — never by reading Customer Data for our own purposes.',
							'**Institutional communication,** such as product news and blog content, always with an unsubscribe option.'
						]
					},
					"Faradays **does not sell personal data**, **does not use it for third-party advertising** and **does not use Customers' Customer Data to train its own artificial intelligence models**."
				]
			},
			{
				heading: 'Applicable legal bases',
				body: [
					'Each purpose rests on a legal basis under the LGPD, as in the table below:',
					{
						type: 'table',
						head: ['Data', 'Purpose', 'Legal basis (LGPD)'],
						rows: [
							[
								'Sales contact and bookings',
								'Replying, scheduling demos, sending proposals',
								'Pre-contractual procedures (art. 7, V) and legitimate interest (art. 7, IX)'
							],
							[
								'Login identity and User records',
								'Authentication, permissions and operation of the service contracted by the Customer',
								'Performance of a contract (art. 7, V)'
							],
							[
								"Customer's Customer Data",
								"Providing the service, under the Customer's instruction",
								'The legal basis is defined by the Customer, Controller of that data; Faradays processes it as Processor (art. 39)'
							],
							[
								'Access logs and audit trail',
								'Security, accountability and compliance with the Internet Act',
								'Legal obligation (art. 7, II) and legitimate interest (art. 7, IX)'
							],
							[
								'Billing and contract data',
								'Invoicing, tax documents and statutory retention',
								'Performance of a contract (art. 7, V) and legal obligation (art. 7, II)'
							],
							[
								'Institutional communication and news',
								'Sending product content and news',
								'Legitimate interest (art. 7, IX), with unsubscribe at any time'
							],
							[
								'Language preference cookie',
								'Keeping the Website in the chosen language',
								'Legitimate interest (art. 7, IX) — strictly necessary'
							]
						]
					},
					'Where consent is the basis used, it can be withdrawn at any time through the channels listed at the end of this Notice.'
				]
			},
			{
				heading: 'Who we share your data with',
				body: [
					'We share personal data only with those indispensable to running the Website and the Platform, in four groups.',
					{
						type: 'sub',
						heading: 'Subprocessors',
						body: [
							'Vendors that process data under our instruction so the service can exist: hosting and network, identity provider, the WhatsApp messaging platform, artificial intelligence model providers, code repository and deployment automation. We keep contracts or terms with them that require confidentiality and security standards compatible with the LGPD.',
							'The named list, with the role of each, the data it receives and the country it operates in, is published at [/subprocessadores](/subprocessadores). We may add or replace subprocessors of the same nature; active Customers are notified at least 30 days in advance and may object on reasonable grounds.'
						]
					},
					{
						type: 'sub',
						heading: 'Platforms connected by the Customer',
						body: [
							"The Platform integrates with services the Customer already contracts and connects: the WhatsApp Business account at Meta, the Microsoft 365 tenant (e-mail, SharePoint, OneDrive, Entra ID) and the ERP that produces the imported reports. Those providers process data under their own terms, as independent Controllers or as the Customer's Processors — not Faradays'. It is up to the Customer to review those terms before enabling each integration."
						]
					},
					{
						type: 'sub',
						heading: 'Artificial intelligence model providers',
						body: [
							"The Platform's AI features run on third-party models accessed through a model router. The content sent — message text, audio for transcription, images for reading and the context of the reply — is processed by those providers only to generate the output. Our terms with them prohibit using that content to train their models. Which providers are in use, and in which country, is listed at [/subprocessadores](/subprocessadores). Enterprise customers can choose and restrict the models used."
						]
					},
					{
						type: 'sub',
						heading:
							'Authorities and third parties by legal requirement',
						body: [
							'We share data when there is a legal obligation, court order or request from a competent authority, limited to what is strictly required and, whenever the law allows, informing the affected Customer.'
						]
					},
					{
						type: 'sub',
						heading: 'Third-party links and resources',
						body: [
							'The Website may link to third-party services — for example, the conversation booking tool or social networks. Those services have their own privacy notices, for which Faradays is not responsible.'
						]
					}
				]
			},
			{
				heading: 'Roles in the SaaS model',
				body: [
					'The Platform is operated as a service: Faradays hosts and maintains the system, and the Customer decides what to connect and for what. That division defines the LGPD roles.',
					{
						type: 'sub',
						heading: 'Faradays as Controller',
						body: [
							'Faradays is the Controller of the following data:',
							{
								type: 'list',
								items: [
									'About Website visitors and people who talk to us commercially;',
									"Users' account and identity data;",
									'Access logs and the audit trail;',
									"The Customer's billing and contract data."
								]
							}
						]
					},
					{
						type: 'sub',
						heading:
							'Customer as Controller; Faradays as Processor',
						body: [
							"The Customer is the Controller of all Customer Data — its end clients' and suppliers' records, its Representatives' conversations with the assistant, e-mails, documents, drive files and ERP reports. Faradays processes them as Processor: only to provide the service, within the Customer's instructions recorded in the contract, in the Terms and in the configuration made by its administrators.",
							'As Processor, Faradays: processes Customer Data only for the purposes of the service; does not access it for its own purposes, except when necessary for support requested by the Customer, for security or by legal obligation; maintains the security measures in the chapter How we protect your data; assists the Customer in responding to Data Subjects; notifies security incidents; and, at the end of the contract, returns or deletes the data as described in the chapter How long we keep your data.'
						]
					},
					{
						type: 'sub',
						heading: "Customer's responsibilities",
						body: [
							{
								type: 'list',
								items: [
									'Having a legal basis for the Customer Data it enters or connects, and informing its Representatives that conversations with the assistant are recorded and processed by artificial intelligence;',
									'Informing its end clients and suppliers about the processing, where the LGPD requires it, and responding to those Data Subjects;',
									'Registering only authorized Users and keeping permissions up to date — the portfolio boundary the assistant applies depends on Representatives being correctly registered;',
									"Not entering sensitive personal data or children's and adolescents' data into the Platform, which are not necessary for the purpose of the service;",
									'Reviewing the terms of the platforms it connects (Meta, Microsoft, ERP) before enabling each integration.'
								]
							}
						]
					},
					{
						type: 'sub',
						heading: 'Limits',
						body: [
							'Faradays is not responsible for processing carried out by Meta, Microsoft, the ERP vendor or any other service connected by the Customer, nor for the content Users choose to send to the assistant. A data processing agreement detailing these obligations may be signed with each Customer and prevails over this chapter where it is more specific.'
						]
					}
				]
			},
			{
				heading: 'How long we keep your data',
				body: [
					{
						type: 'list',
						items: [
							'**Sales contact.** For the duration of the conversation and up to 24 months after the last contact, unless you request deletion earlier.',
							'**Account and User data.** For as long as the Customer keeps the contract active. A User removed by the Customer has their identity data deleted, leaving only references in the audit trail.',
							'**Customer Data.** For the duration of the contract. At termination, the Customer has 30 days to export the data; after that, we delete Customer Data from active systems within 90 days, and from backups in the normal rotation cycle.',
							'**Backups.** The database is backed up daily and each copy is kept for 14 days.',
							'**Access and application logs.** For at least 6 months, in compliance with art. 15 of the Brazilian Internet Act.',
							'**Audit trail.** For the duration of the contract and up to 5 years after termination, for accountability and defense in proceedings.',
							'**Tax and contract data.** For the periods required by tax and civil law — generally 5 years after the end of the relationship.'
						]
					},
					'You may request deletion of the data for which Faradays is Controller at any time, through the channels at the end. Once the request is fulfilled, the data is deleted or anonymized, subject to the retention cases above (art. 16 of the LGPD).'
				]
			},
			{
				heading: 'How we protect your data',
				body: [
					'We adopt technical and administrative measures proportional to the risk, including:',
					{
						type: 'list',
						items: [
							'Encryption in transit (TLS) on all access to the Website and the Platform, with the Platform exposed only through a tunnel and no ports open to the internet other than administrative access;',
							'Authentication delegated to an identity provider, role-based access control (administrator, manager, representative) and, in the assistant, a portfolio boundary — each Representative queries and writes only about their own portfolio; managers see everything;',
							'Integration credentials (Microsoft 365 tokens) stored encrypted and never exposed through the API; secrets kept out of code and repository;',
							'Daily database backups, retained for 14 days;',
							'An immutable audit trail of relevant actions;',
							'Environment separation and automated deployment from reviewed code; dependencies obtained from official registries with integrity verification;',
							'Internal access to production environments restricted to named people and only for operation and support.'
						]
					},
					'No system is infallible. If we identify a security incident with relevant risk or harm to Data Subjects, we will notify the ANPD and the Data Subjects within the deadlines of the LGPD and ANPD regulations. For Customer Data, the notice goes to the Customer, as Controller. It describes what happened, the data involved and the measures taken. If you identify a vulnerability or suspect an incident, write to contato@faradays.io.'
				]
			},
			{
				heading: 'Data Subject rights',
				body: [
					'The LGPD guarantees you, as a Data Subject, the rights below, exercisable through the channels listed at the end:',
					{
						type: 'list',
						items: [
							'Confirmation that processing exists and access to the data;',
							'Correction of incomplete, inaccurate or outdated data;',
							'Anonymization, blocking or deletion of unnecessary or excessive data, or data processed in violation of the law;',
							'Portability to another provider, subject to trade and industrial secrecy;',
							'Deletion of data processed on the basis of consent, subject to the legal retention cases;',
							'Information about who we share your data with;',
							'Information about the possibility of not consenting and the consequences of refusal;',
							'Withdrawal of consent, at any time and free of charge;',
							'Objection to processing based on legitimate interest;',
							'Review of decisions made solely on the basis of automated processing;',
							'Petition to the ANPD.'
						]
					},
					'We may ask for proof of identity before responding, to protect your own data. We respond within the LGPD deadlines; in complex cases, we keep you informed of progress. Where Faradays acts as Processor, we will forward the request to the Customer as Controller and support them in responding.',
					"On automated decisions: the Platform's artificial intelligence interprets requests and drafts replies, but prices, quantities, taxes and permissions are decided by deterministic system rules, and issued documents can be reviewed by people at the Customer. No decision with legal effect on a Data Subject is made by the Platform without human intervention by the Customer."
				]
			},
			{
				heading: 'Cookies',
				body: [
					'The Website uses a single, strictly necessary cookie to store the language preference. No analytics or advertising cookies are in use. If that changes, optional cookies will only be activated after your consent, and this Notice and the [Cookie Policy](/cookies) will be updated beforehand.',
					'The Platform uses session cookies to keep you signed in — also strictly necessary.'
				]
			},
			{
				heading: 'International data transfers',
				body: [
					"Some of Faradays' subprocessors operate outside Brazil, and some platforms connected by the Customer have global infrastructure. This means personal data may be transferred, in particular, to:",
					{
						type: 'list',
						items: [
							'**United States** — Meta (WhatsApp Cloud API), artificial intelligence model providers and the router that accesses them, code repository and deployment automation, content delivery and traffic protection network;',
							"**The region of the Customer's Microsoft 365 tenant** — e-mail and drive data remain where the Customer already keeps them; the Platform accesses them from where it is hosted;",
							'**The hosting location of the Platform** — listed, per vendor, at [/subprocessadores](/subprocessadores).'
						]
					},
					'These transfers comply with art. 33 of the LGPD and ANPD regulations on international transfers: they rely on standard contractual clauses, adequacy decisions or the other safeguards provided by law, and are limited to what is necessary to provide the service.'
				]
			},
			{
				heading: 'Data Protection Officer and contact channels',
				body: [
					'In compliance with art. 41 of the LGPD, Faradays maintains a Data Protection Officer, who can be contacted through:',
					{
						type: 'list',
						items: [
							'**E-mail (privacy, LGPD and exercise of rights):** contato@faradays.io, with the subject "Privacidade";',
							'**Address:** Faradays Consulting LTDA, CNPJ 65.590.441/0001-36, São Paulo, Brazil.'
						]
					},
					"Customers may also raise data protection matters through their Plan's support channel, described in the [Support Policy](/suporte)."
				]
			},
			{
				heading: 'Changes to this Notice',
				body: [
					'This Notice may be updated to reflect changes in our operation, in legislation or in our practices. Relevant changes are communicated to active Customers by the registered e-mail at least 30 days in advance, and to everyone by notice on this page. The version in force is always the one published at faradays.io/privacidade, with the revision date at the top. Continued use of the Website or the Platform after a new version takes effect indicates awareness of its content.'
				]
			}
		]
	}
}

export default function PrivacidadePage() {
	return <LegalPage slug="/privacidade" content={CONTENT} />
}
