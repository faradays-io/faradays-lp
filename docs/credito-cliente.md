# Inteligência de Crédito Faradays

**Visão executiva — documento para o cliente**

_Este documento descreve a plataforma de inteligência de crédito da Faradays
na perspectiva de quem a opera: o que muda na sua carteira, como funciona em
linguagem de negócio e o que você recebe. A base técnica é o projeto de PD&I
conduzido em cooperação com a Unicamp._

---

## 1. O problema, na sua operação

O seu modelo de crédito de hoje responde a uma única pergunta: _qual a chance
de este cliente não pagar a próxima parcela?_ Ele foi treinado numa fotografia
do passado e decide como se o mercado não mudasse. Na prática:

- **Você aprova menos do que poderia.** Bons pagadores que não se parecem com
  o histórico são recusados — e, recusados, nunca geram os dados que provariam
  o contrário. O prejuízo é invisível: ele não aparece em nenhum relatório.
- **Você perde mais do que precisaria.** O modelo enxerga o cliente uma vez,
  na concessão. A deterioração que começa seis meses depois só vira sinal
  quando já virou atraso.
- **Você decide com uma fração da informação.** Variáveis de birô contam uma
  parte pequena da história de cada cliente; o resto fica na mesa.
- **Cada crise pega o modelo desatualizado.** Entre a mudança do mercado e o
  próximo retreino, a régua antiga segue decidindo com o cenário antigo.

## 2. O que muda com a plataforma

### 2.1 Aprove mais, sem subir o risco

A plataforma explora ativamente a região que o seu score rejeita e identifica
os bons pagadores invisíveis — clientes que o modelo atual recusa por falta de
dados, não por risco real. A carteira cresce em segmentos que os concorrentes
não enxergam.

### 2.2 Perca menos, agindo a tempo

Em vez de um veredito único na concessão, cada cliente é acompanhado como uma
relação: o sistema recomenda a ação certa no momento certo — ajustar limite,
ofertar produto, renegociar antes do atraso. A perda evitada vem de antecipar
a deterioração, não de reagir a ela.

### 2.3 O balanço líquido: retorno de carteira, não acurácia de modelo

O objetivo do sistema não é acertar previsões — é maximizar o retorno da sua
carteira no horizonte que importa. Mais aprovação boa, menos perda evitável:
o indicador final é o valor gerado por cliente ao longo da relação (LTV), não
a taxa de acerto de um classificador.

### 2.4 Teste a política antes de arriscar a carteira

Toda política de crédito passa por um **banco de provas**: um simulador da
sua carteira que reproduz cenários — mercado estável, aperto de crédito,
crise — e mostra como cada política se comporta antes de tocar um cliente
real. Só vai para produção a política que sobreviveu à simulação. Você
enxerga o downside no laboratório, não no balanço.

### 2.5 Sempre calibrado, mesmo quando o mercado vira

A política se adapta a mudanças de distribuição — inclusive às mudanças que
as próprias decisões provocam no comportamento dos clientes — sem esperar o
ciclo de retreino. Em cenário de estresse, a diferença entre a régua estática
e a política adaptativa é exatamente a perda que você não teve.

### 2.6 Conformidade demonstrável

Equidade entre grupos não é um filtro aplicado depois: é parte da função que
o sistema otimiza. Cada política sai acompanhada de métricas de paridade e
relatórios de auditoria — defensáveis perante regulador e alinhados a ESG.

## 3. Como funciona (sem jargão)

1. **Enriquecimento** — modelos de fundação treinados em milhões de tabelas
   extraem sinal de fontes heterogêneas e preenchem as lacunas dos dados
   tradicionais.
2. **Decisão** — um motor de política recomenda a ação por cliente, no tempo,
   otimizando o retorno de longo prazo da carteira.
3. **Simulação** — o banco de provas testa políticas em cenários antes da
   produção e mede robustez sob estresse.
4. **Monitoramento** — impacto financeiro (ROI) e equidade auditados de forma
   contínua, com relatórios periódicos.

## 4. O que você recebe

| Entrega                          | O que é, para você                                                    |
| -------------------------------- | --------------------------------------------------------------------- |
| Motor de decisão                 | Recomendações de ação por cliente, integradas ao seu fluxo de crédito |
| Banco de provas (simulador)      | Teste de políticas em cenários da sua carteira, antes da produção     |
| Relatórios de impacto            | ROI da política em produção e valor por cliente (LTV)                 |
| Protocolo de robustez e equidade | Métricas de estabilidade sob estresse e de paridade entre grupos      |

## 5. Indicadores que passamos a acompanhar juntos

- Taxa de aprovação e qualidade das safras aprovadas
- Inadimplência e perda evitada por ação antecipada
- Retorno líquido e valor por cliente no horizonte (LTV)
- Robustez da política sob cenários de estresse
- Métricas de paridade entre grupos (fairness)
