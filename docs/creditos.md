# PLANO DE TRABALHO

**Anexo ao Acordo de Cooperação em Pesquisa e Desenvolvimento**

_Cooperação PD&I — 17 de julho de 2026_

> **Nota desta versão:** documento idêntico ao original, com os **números dos valores financeiros** substituídos por `[removido]`. Nenhum outro conteúdo foi alterado ou suprimido.

## Identificação das Partes

- **Empresa:** Faradays Consulting LTDA (CNPJ 65.590.441/0001-36)
- **ICT:** Universidade Estadual de Campinas (UNICAMP)
- **Interveniente:** Fundação de Desenvolvimento da Unicamp (FUNCAMP)
- **Título do Projeto:** Otimização Dinâmica de Crédito: Superando a Previsão Estática com Aprendizagem por Reforço

---

## 1. Descrição do Projeto

O mercado de crédito atual opera predominantemente com modelos de _machine learning_ estáticos [1], treinados em conjuntos de dados históricos fixos que perdem eficácia rapidamente diante da volatilidade do cenário econômico e de mudanças estruturais no comportamento dos agentes [5]. Esta abordagem convencional, centrada na visão reativa de previsão de _default_, gera gargalos críticos que comprometem a rentabilidade e a gestão de riscos:

1. **Inferência de Rejeitados:** Ao negar crédito, as instituições perdem a oportunidade de aprender sobre um vasto segmento de potenciais clientes, criando um "ponto cego" que perpetua vieses e impede a descoberta de novos nichos de mercado lucrativos [4, 12].

2. **Ciclos de Retroalimentação:** Decisões baseadas em dados incompletos se reforçam. Grupos que recebem menos crédito passam a ser vistos como mais arriscados, o que consolida as perdas de oportunidade e aumenta a exposição a riscos regulatórios e de imagem [2, 13].

3. **Dependência de Dados Restritos:** Os modelos atuais restringem-se a variáveis transacionais e cadastrais de birôs de crédito, negligenciando a riqueza informacional presente em dados heterogêneos e a capacidade de generalização dos modelos de fundação. Esta limitação informacional agrava as lacunas de representação e o viés de seleção, impedindo a síntese de sistemas híbridos que integrem conhecimentos prévios (_priors_) e dados de múltiplas fontes, o que reduz a robustez das políticas de crédito.

Este projeto propõe a transição do paradigma de classificação estática para uma arquitetura de tomada de decisão dinâmica, auxiliada pelo enriquecimento informacional por meio de modelos fundacionais tabulares e do processamento de dados heterogêneos. A abordagem visa converter a análise de crédito de uma inferência passiva em um sistema de indução de políticas de decisão otimizadas (que visam melhorar o crédito no futuro, não apenas agora), capaz de mitigar tanto a esparsidade de atributos quanto o viés de seleção decorrente da exclusão de pessoas inerente aos modelos tradicionais avessos ao risco focado no curto prazo.

---

## 2. Justificativa

A solução proposta fundamenta-se na criação de um ecossistema de crédito resiliente e dinâmico, cuja inovação reside no desenvolvimento de mecanismos capazes de explorar ativamente a distribuição de dados e de potencializar o enriquecimento informacional, apoiados por modelos fundacionais. Diferentemente dos estimadores estatísticos convencionais, que assumem distribuições estacionárias [?], este projeto foca na mitigação da incerteza epistêmica sobre perfis de clientes sub-representados, utilizando um arcabouço metodológico que abrange desde o tratamento de _Distribution Shift_ [11] e de Aprendizagem por Reforço _Offline_ [8] até os paradigmas de Predição Performativa [9] e de Aprendizado Ativo [10].

Diferentemente de soluções de mercado baseadas em _scores_ puramente preditivos, nossa abordagem reconhece a decisão de crédito como uma intervenção que altera o estado e o comportamento dos agentes ao longo do tempo. Ao modelar essa dinâmica, o sistema torna-se capaz de identificar novos nichos de mercado e corrigir o viés de seleção intrínseco aos dados históricos. Isso não apenas amplia a rentabilidade e reduz a exposição ao risco, mas promove a inclusão financeira ao transformar o "ponto cego" das instituições em uma vantagem estratégica de aprendizado contínuo. A integração da justiça (_Fairness_) como um objetivo intrínseco à política de decisão, e não como uma restrição periférica, assegura o rigor científico na mitigação de riscos regulatórios e o alinhamento às diretrizes de governança social e ambiental (ESG) [6, 3].

---

## 3. Objetivos

O objetivo principal é desenvolver e validar uma plataforma de inteligência de crédito fundamentada em enriquecimento informacional apoiado por modelos fundacionais tabulares, visando à otimização de decisões dinâmicas para maximizar o retorno financeiro a longo prazo, mitigar riscos e garantir a conformidade regulatória.

**Objetivos Específicos:**

- **Indução de Políticas de Decisão Dinâmicas:** Transmitir o foco da simples previsão de risco para um sistema de indução de políticas que recomenda, temporalmente, intervenções otimizadas (aprovação, ajuste de limites, oferta de produtos), visando ao valor vitalício do cliente e suas informações.

- **Mitigar o Viés de Seleção e a Inferência de Rejeitados:** Utilizar técnicas de Aprendizado Ativo e Aprendizagem por Reforço _Offline_ para reduzir a incerteza epistêmica sobre perfis negligenciados, transformando o hiato informacional dos rejeitados em uma vantagem estratégica de aprendizado [4].

- **Desenvolver Camadas de Enriquecimento via Modelos Fundacionais:** Implementar arquiteturas baseadas em _Tabular Foundation Models_ (TFMs) para extrair representações latentes a partir de fontes de dados heterogêneas, permitindo a integração de conhecimentos prévios (_priors_) que compensem a esparsidade dos atributos tradicionais.

- **Garantir Robustez sob Mudanças de Distribuição:** Desenvolver algoritmos adaptativos fundamentados em Predição Performativa, capazes de ajustar a política de crédito dinamicamente diante de variações macroeconômicas e do efeito retroalimentador das próprias decisões do modelo (_distribution shift_) [14].

- **Integrar Equidade (_Fairness_) como Objetivo Intrínseco:** Incorporar a justiça como componente central da função objetivo do modelo, assegurando que a expansão da carteira ocorra de forma ética e em conformidade com métricas de governança social (ESG) [?].

---

## 4. Metodologia

A metodologia fundamenta-se na integração de modelos de representação profunda com sistemas de decisão sob incerteza. O trabalho estruturar-se-á em três pilares principais.

### 4.1 Enriquecimento Informacional via Modelos Fundacionais

A metodologia foca no uso inteligente de **Modelos Fundacionais Tabulares (TFMs)**. A proposta é utilizar o conhecimento estrutural previamente adquirido por essas arquiteturas para tratar a heterogeneidade e a incerteza dos dados adicionais.

- **Base de Referência:** Utilizaremos a base de dados do _Lending Club_, extraindo variáveis temporais críticas (datas de concessão, pagamentos e status) para modelar a trajetória financeira do devedor e servir como âncora de validação para os modelos desenvolvidos.

- **Extração de Características via TFMs:** O núcleo técnico reside no emprego de TFMs como extratores de informações robustas. Em vez de depender de engenharia de atributos manual, os modelos fundacionais serão utilizados para mapear dados heterogêneos em representações que capturem invariantes estruturais de crédito, compensando a esparsidade de atributos tradicionais e mitigando o ruído de fontes externas.

- **Exploração de Fontes Adicionais:** O projeto mantém flexibilidade para a prospecção e integração de outras fontes de dados (ex: registros públicos, dados de consumo ou indicadores macroeconômicos setoriais), avaliando-se continuamente o ganho informacional frente ao risco de introdução de vieses ou instabilidades nos modelos.

### 4.2 Indução de Políticas e Modelagem do Ambiente

A construção do ambiente de simulação estratégica [7] incorporará a dinâmica de Predição Performativa, reconhecendo que as decisões de crédito alteram a distribuição futura dos perfis.

- **Algoritmos de Decisão:** A otimização das políticas de crédito explorará o equilíbrio entre o aproveitamento de perfis conhecidos e a exploração de novos nichos (_exploration-exploitation trade-off_). Para isso, utilizaremos um arcabouço que combina conceitos de **Aprendizagem por Reforço _Offline_**, **Aprendizado Ativo** e **Predição Performativa**, visando reduzir a incerteza epistêmica sobre o segmento de clientes rejeitados.

- **Adaptabilidade:** Serão exploradas modelagens sequenciais que considerem o crédito como uma intervenção temporal, permitindo que a política se ajuste dinamicamente a mudanças na distribuição dos dados (_distribution shift_).

### 4.3 Validação e Análise de Impacto

A validação consistirá na comparação rigorosa entre as políticas dinâmicas induzidas e os _baselines_ de _machine learning_ estáticos utilizados na indústria. A avaliação não se limitará à acurácia preditiva, mas focará na robustez da política diante de cenários de estresse e na capacidade do sistema de manter a equidade (_fairness_) e a rentabilidade a longo prazo no ambiente de simulação desenvolvido.

---

## 5. Definição das Equipes Técnicas e Bolsas de Estímulo à Inovação

Em atendimento ao Art. 5º, §1º da Resolução GR-075/2020, de 15/07/2020, apresentam-se a seguir a identificação dos beneficiários e dos perfis necessários, os critérios de seleção, as categorias, os valores mensais, a carga horária, a duração do pagamento e a descrição das atividades de cada bolsista vinculado ao projeto.

### 5.1 Identificação dos Beneficiários e Processo de Seleção

A equipe combina beneficiários já vinculados às linhas de pesquisa do grupo proponente e perfis a serem selecionados durante a execução do projeto, conforme detalhado abaixo:

- **Coordenador e Coordenador Adjunto:** docentes já identificados, indicados diretamente em razão de sua atuação prévia na concepção científica e técnica da proposta e de sua responsabilidade pela liderança e gestão do projeto.

- **Bolsistas de Doutorado e Mestrado:** perfis vinculados à continuidade das linhas de pesquisa do grupo em Modelos Fundacionais Tabulares e Aprendizagem por Reforço; a indicação é feita diretamente pelo Coordenador, dada a necessidade de conhecimento prévio já consolidado nessas linhas de pesquisa, podendo contemplar tanto alunos já vinculados ao grupo quanto novos ingressantes indicados pelo Coordenador.

- **Bolsistas de Iniciação Científica:** perfis ainda não definidos. A seleção será realizada por meio de processo seletivo interno ao grupo de pesquisa, conduzido pelo Coordenador e pelo Coordenador Adjunto, com divulgação de chamada pública contendo os critérios de avaliação (histórico escolar, conhecimentos em programação e estatística, e entrevista técnica).

### 5.2 Categorias dos Beneficiários e Vinculação Acadêmica

| Categoria                        | Vínculo                | Situação                      | Curso/Programa                                        |
| -------------------------------- | ---------------------- | ----------------------------- | ----------------------------------------------------- |
| Coordenador                      | Servidor docente       | Bolsa de Inovação Docente     | —                                                     |
| Coordenador Adjunto              | Servidor docente       | Bolsa de Inovação Docente     | —                                                     |
| Bolsista de Doutorado            | Aluno de pós-graduação | Bolsa de pesquisa             | Pós-Graduação em Ciência da Computação                |
| Bolsista de Mestrado             | Aluno de pós-graduação | Bolsa de pesquisa             | Pós-Graduação em Ciência da Computação                |
| Bolsista de Iniciação Científica | Aluno de graduação     | Bolsa de Iniciação Científica | Ciência e Engenharia de Computação e áreas correlatas |

### 5.3 Valor Mensal, Carga Horária e Duração do Pagamento

Fica vedada a atribuição de valor por hora de dedicação, sendo os valores abaixo fixos e mensais por bolsista.

| Categoria                        | Valor Mensal (R$) | Carga Hor. Semanal | Carga Hor. Mensal | Duração  |
| -------------------------------- | ----------------- | ------------------ | ----------------- | -------- |
| Coordenador                      | `[removido]`      | 8 horas            | 36 horas          | 36 meses |
| Coordenador Adjunto              | `[removido]`      | 4 horas            | 18 horas          | 36 meses |
| Bolsista de Doutorado (40h)      | `[removido]`      | 40 horas           | 180 horas         | 36 meses |
| Bolsista de Mestrado (40h)       | `[removido]`      | 40 horas           | 180 horas         | 36 meses |
| Bolsista de Doutorado (20h)      | `[removido]`      | 20 horas           | 90 horas          | 36 meses |
| Bolsista de Mestrado (20h)       | `[removido]`      | 20 horas           | 90 horas          | 36 meses |
| Bolsista de Iniciação Científica | `[removido]`      | 20 horas           | 90 horas          | 36 meses |

Haverá bolsistas de Doutorado e Mestrado que atuarão em regime de dedicação integral (40 horas semanais, um bolsista em cada nível) e parcial (20 horas semanais, um bolsista em cada nível); Iniciação Científica atuarão em regime de dedicação parcial (20 horas semanais, dois bolsistas), compatível com a Aporte regular de suas atividades acadêmicas. O pagamento das bolsas terá duração de 36 (trinta e seis) meses para todas as categorias, correspondente ao período integral de execução do projeto, podendo ser interrompido antecipadamente em caso de desligamento do bolsista, conclusão do curso ou encerramento do projeto.

### 5.4 Descrição das Atividades

**Coordenador:** liderança científica do projeto, definição e priorização das linhas de pesquisa, supervisão direta dos bolsistas de Doutorado e Mestrado, interlocução institucional com a Empresa e a FUNCAMP, e validação técnica dos entregáveis ao final de cada fase do projeto.

**Coordenador Adjunto:** gestão técnica e operacional do projeto, articulação com a equipe da Empresa para alinhamento de requisitos e prazos, acompanhamento do cronograma físico-financeiro, e apoio à supervisão dos bolsistas de Iniciação Científica.

**Bolsistas de Doutorado:** condução da investigação em Modelos Fundacionais Tabulares (TFMs), desenvolvimento de estratégias de adaptação de contexto, e indução de políticas de decisão dinâmicas por meio de Aprendizagem por Reforço _Offline_ e Aprendizado Ativo (Fases 1 e 2), com elaboração dos relatórios técnicos de _benchmarking_ e de robustez.

**Bolsistas de Mestrado:** implementação da arquitetura da Plataforma Temporal, integração de _pipelines_ de dados heterogêneos, e desenvolvimento do ambiente de simulação estratégica (_World Model_) (Fases 2 e 3), incluindo os testes de integração do protótipo funcional.

**Bolsistas de Iniciação Científica:** execução do _benchmarking_ de modelos tradicionais de mercado (ex.: XGBoost, LightGBM), saneamento das bases de dados temporais (ex.: _Lending Club_), execução dos protocolos de teste de robustez, e apoio à análise das métricas de _Fairness_ (Fases 1 e 4).

---

## 6. Escopo do Projeto e Entregáveis

O projeto será executado em quatro fases principais, partindo da investigação fundamental de modelos fundacionais até a validação de robustez da plataforma:

**Fase 1: Experimentação e Adaptação de TFMs.** Testes rigorosos de modelos fundacionais tabulares em cenários de crédito, com foco na investigação de resiliência a _distribution shifts_ e no desenvolvimento de estratégias de adaptação de contexto (estudo de quais amostras de treino devem compor o suporte para a inferência em tempo de execução).

**Fase 2: Modelagem de Ambientes de Simulação (World Models).** Construção de simuladores para validação de políticas, explorando a alteração de premissas dos TFMs e a adaptação de bases de dados com alta granularidade temporal (ex: _Lending Club_). O foco reside em capturar a natureza performativa e a evolução dos perfis ao longo do tempo.

**Fase 3: Desenvolvimento da Plataforma Temporal (PoC).** Implementação e validação do protótipo funcional do motor de decisão, consolidando os módulos de enriquecimento e as políticas de decisão induzidas em um ambiente que suporte a dimensão temporal e sequencial do crédito.

**Fase 4: Framework de Análise de Impacto e Robustez.** Desenvolvimento de métricas e protocolos de teste para quantificar a estabilidade da plataforma frente a mudanças estruturais no mercado, além da auditoria de impacto financeiro (ROI) e de equidade (_fairness_).

### Entregáveis (Deliverables)

Ao final do projeto, serão entregues à Empresa:

1. **Relatório de Benchmarking e Adaptação de TFMs:** Documentação técnica detalhando os experimentos de _context adaptation_ e a sensibilidade dos modelos a deslocamentos de distribuição.

2. **Simulador de Crédito Temporal (World Model):** Ambiente de software capaz de emular cenários dinâmicos de crédito com premissas parametrizáveis baseadas em modelos fundacionais.

3. **Plataforma de Decisão Temporal (Prova de Conceito):** Protótipo funcional validado do motor de decisão orientado a eventos sequenciais e enriquecimento informacional.

4. **Protocolo de Robustez e Impacto:** Conjunto de métricas e relatórios técnicos que validam a segurança operacional e o valor gerado pela abordagem dinâmica.

Além disso serão entregues relatórios semestrais para acompanhamento.

---

## 7. Recursos Financeiros e Cronograma de Desembolso

O orçamento total do projeto é de R$ `[removido]`.

### 7.1 Orçamento Consolidado

| Item de Despesa                          | Valor Total (R$) |
| ---------------------------------------- | ---------------- |
| **Pessoal (Bolsas e Equipe)**            |                  |
| Valor Mensal                             | `[removido]`     |
| Cobertura para 36 meses de execução      | `[removido]`     |
| Equipamentos (Hardware de Processamento) | `[removido]`     |
| Reserva Técnica                          | `[removido]`     |
| **Subtotal (Custos Diretos)**            | `[removido]`     |
| Custos Indiretos (Overhead - 22,5%)      | `[removido]`     |
| **VALOR TOTAL DO PROJETO**               | `[removido]`     |

### 7.2 Cronograma de Desembolso (Integral)

| Mês             | Descrição                      | Valor (R$)   |
| --------------- | ------------------------------ | ------------ |
| 01              | Aporte Inicial                 | `[removido]` |
| 07              | Aporte Trimestral              | `[removido]` |
| 09              | Equipamentos + Reserva Técnica | `[removido]` |
| 10              | Aporte Trimestral              | `[removido]` |
| 13              | Aporte Trimestral              | `[removido]` |
| 16              | Aporte Trimestral              | `[removido]` |
| 19              | Aporte Trimestral              | `[removido]` |
| 22              | Aporte Trimestral              | `[removido]` |
| 25              | Aporte Trimestral              | `[removido]` |
| 28              | Aporte Trimestral              | `[removido]` |
| 31              | Aporte Trimestral              | `[removido]` |
| **Total Geral** |                                | `[removido]` |

---

## Referências Bibliográficas

[1] Andrés Alonso and Jose Manuel Carbo. _Machine learning in credit risk: measuring the dilemma between prediction and supervisory cost._ 2020.

[2] Solon Barocas, Moritz Hardt, and Arvind Narayanan. _Fairness and machine learning: Limitations and opportunities._ MIT press, 2023.

[3] Alexander D'Amour, Hansa Srinivasan, James Atwood, Pallavi Baljekar, and Yoni Halpern. _Fairness is not static: deeper understanding of long term fairness via simulation studies._ In Proceedings of the 2020 Conference on Fairness, Accountability, and Transparency, pages 525–534, 2020.

[4] Adrien Ehrhardt, Christophe Biernacki, Vincent Vandewalle, Philippe Heinrich, and Sébastien Beben. _Reject inference methods in credit scoring._ Journal of Applied Statistics, 48(13-15):2734–2754, 2021.

[5] David J Hand. _Mining the past to determine the future: Problems and possibilities._ International journal of Forecasting, 25(3):441–451, 2009.

[6] Matthew Joseph, Michael Kearns, Jamie H Morgenstern, and Aaron Roth. _Fairness in learning: Classic and contextual bandits._ Advances in neural information processing systems, 29, 2016.

[7] Rahul Kidambi, Aravind Rajeswaran, Praneeth Netrapalli, and Thorsten Joachims. _Morel: Model-based offline reinforcement learning._ Advances in neural information processing systems, 33:21810–21823, 2020.

[8] Sergey Levine, Aviral Kumar, George Tucker, and Justin Fu. _Offline reinforcement learning: Tutorial, review, and perspectives on open problems._ arXiv preprint arXiv:2005.01643, 2020.

[9] Juan Perdomo, Tijana Zrnic, Celestine Mendler-Dünner, and Moritz Hardt. _Performative prediction._ In International Conference on Machine Learning, pages 7599–7609. PMLR, 2020.

[10] Burr Settles. _Active learning literature survey._ 2009.

[11] Hidetoshi Shimodaira. _Improving predictive inference under covariate shift by weighting the log-likelihood function._ Journal of statistical planning and inference, 90(2):227–244, 2000.

[12] Naeem Siddiqi. _Intelligent credit scoring: Building and implementing better credit risk scorecards._ John Wiley & Sons, 2017.

[13] Victoria Stace and Jeremy Finn. _Working towards a fairer consumer credit market._ 2019.

[14] Yu Sun, Xiaolong Wang, Zhuang Liu, John Miller, Alexei Efros, and Moritz Hardt. _Test-time training with self-supervision for generalization under distribution shifts._ In International conference on machine learning, pages 9229–9248. PMLR, 2020.
