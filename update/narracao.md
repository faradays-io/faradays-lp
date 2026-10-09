# Narração do showcase Faradays — versão editada

Editado sobre o roteiro do Vitto, medido contra o vídeo `f321fcc` (61,3 s).
Ritmo de 2,5 palavras/s, o mesmo que ele assumiu. "Tem" é o tempo real até a fala
seguinte começar; "fala" é o que a linha precisa nesse ritmo.

## O que mudou, e por quê

**Medi o teu roteiro antes de mexer.** No ritmo de 2,5 pal/s que você mesmo assumiu,
**9 das 16 falas não cabiam** — e não era "se a leitura sair mais lenta": já estourava
a 2,5. Somando tudo, o texto pedia 63,9 s de fala num vídeo de 61,3 s.

O que veio depois foi consequência disso:

- **A abertura ficou muda.** As duas falas liam em voz alta o que estava escrito na
  tela. O espectador lê a cartela mais rápido do que o narrador fala, então as duas
  coisas competiam. Sozinho, isso já devolveu 6,8 s.
- **O slogan mudou** e a fala de 0:03,2 caiu junto — ela citava "compradores de alto
  volume" palavra por palavra e teria contradito a tela (ver abaixo).
- **Duas das três cartelas-pergunta ficaram mudas** (0:26,5) ou ganharam texto que
  avança em vez de repetir (0:07,6 e 0:40,7).
- **"na hora" aparecia duas vezes em 4,5 s.** A de 0:43 virou "em segundos".

**Resultado medido:** 103 palavras (eram 153), 41,2 s de fala em 61,3 s de vídeo —
ou seja, **20,1 s de silêncio**, onde antes era de parede a parede. Só duas linhas
estouram, as duas por 0,1 s, dentro da margem que você mesmo admitiu.

Uma coisa que ficou meio solta e vale teu ouvido: **"Com as pastas do drive
espelhadas."** foi escrita para emendar na frase anterior, mas a anterior encurtou.
Como frases separadas soa um pouco truncada. Se incomodar na locução, junta as duas.

## O slogan mudou — precisa entrar no vídeo

De **"para compradores de alto volume"** para:

> **para indústrias que compram e vendem muito bem**

Cobre os dois lados do produto; o anterior só falava de compra. E **"muito bem"
acende**: entra cinza e troca para o gradiente da IA — o mesmo `.ai-shimmer` com
`aiSweep` que já pinta o "lendo e-mail…" e os badges, não um efeito novo.

Testei aqui. No `openCard`, duas camadas empilhadas em cross-fade (não dá para animar
o gradiente direto: `background-clip:text` não interpola entre cor sólida e
gradiente). Acende 1,15 s depois da cartela entrar, logo após as palavras subirem:

```
0,0 → 4,8s   cinza        5,4s  acendendo        6,0s  nas cores        7,2s  cartela sai
```

Duas ressalvas: **o texto colorido fica só ~1,9 s no ar** antes da cartela sair — se
achar pouco, dá para antecipar. E o slogan ficou **1155 px** contra 1126 px da fileira
de badges, ou seja, marginalmente mais largo que ela.

---

## Abertura  (0:00,0 – 0:07,2)

| Tempo | Tem | Fala | Deixa visual | Narração |
|---|---|---|---|---|
| 0:00,5 | 2.7s | — | Cartela-pergunta: "Ainda" entra grande, digitação, zoom out revela a pergunta inteira | *(silêncio)* |
| 0:03,2 | 4.4s | — | Match cut para "Conheça" → logo, slogan e os três badges acendendo | *(silêncio)* |

## 1 · BID / Outlook  (0:07,2 – 0:26,3)

| Tempo | Tem | Fala | Deixa visual | Narração |
|---|---|---|---|---|
| 0:07,6 | 1.9s | 1.6s | Cartela "Cotação por e-mail, comparação na planilha?" sobre mocks de e-mails e planilhas | Feche compras em minutos. |
| 0:09,5 | 4.2s | 2.8s | Lista de cotações → modal → clique em "Disparar BID (4)" | Um disparo alcança todos os exportadores mapeados. |
| 0:13,7 | 4.8s | 4.0s | Vista dividida: o e-mail chega no Outlook do fornecedor, que responde com preço | O exportador recebe no e-mail dele e responde ali mesmo. |
| 0:18,5 | 3.7s | 3.6s | E-mail voa de volta → comparativo em zoom, a linha da ANHUI preenche | A IA lê o e-mail e preenche o comparativo. |
| 0:22,2 | 4.3s | 4.0s | Ponto piscante "sugerida pela IA" → clique na linha → Fechar cotação | A IA padroniza, destaca a melhor oferta — e você aprova. |

## 2 · Documentos / SharePoint  (0:26,3 – 0:40,5)

| Tempo | Tem | Fala | Deixa visual | Narração |
|---|---|---|---|---|
| 0:26,5 | 3.8s | — | Cartela "E os documentos dos seus fornecedores, em dia?" | *(silêncio)* |
| 0:30,3 | 4.5s | 3.2s | Painel do SharePoint entra, três arquivos sincronizando sozinhos | Conecte o SharePoint. Cada arquivo novo entra sozinho. |
| 0:34,8 | 3.4s | 2.8s | Zoom nos status, "lendo…" no gradiente da IA, validade preenche | A IA lê tipo, produto e validade. |
| 0:38,2 | 2.5s | 2.4s | Clique em Pastas, a árvore do drive aparece espelhada | Com as pastas do drive espelhadas. |

## 3 · Conversas / WhatsApp  (0:40,5 – 0:58,7)

| Tempo | Tem | Fala | Deixa visual | Narração |
|---|---|---|---|---|
| 0:40,7 | 2.3s | 2.4s | Cartela "Seu representante ainda depende do administrativo?" | Seu time leva quanto para cotar? |
| 0:43,0 | 4.5s | 4.0s | Celular: o rep pede o COA (09:41) → "digitando…" → a IA envia o PDF | Ele pede o documento no WhatsApp e recebe em segundos. |
| 0:47,5 | 5.0s | 4.8s | A IA confirma a marca → "Creapure" → cotação COT-V-0188 emitida | Pediu preço? Ela confirma a marca e emite a cotação na hora. |
| 0:52,5 | 3.5s | 3.2s | O celular vai para a direita, o sistema entra com a conversa inteira | E toda a conversa fica registrada no sistema. |
| 0:56,0 | 3.0s | — | Zoom na conversa → zoom out | *(silêncio)* |

## Fechamento  (0:58,7 – 1:01,3)

| Tempo | Tem | Fala | Deixa visual | Narração |
|---|---|---|---|---|
| 0:59,0 | 2.3s | 2.4s | Logo + barra de busca digitando www.faradays.io | Faradays — conheça em faradays ponto io. |

---

## Texto corrido (para o narrador)

> Feche compras em minutos. Um disparo alcança todos os exportadores mapeados. O exportador recebe no e-mail dele e responde ali mesmo. A IA lê o e-mail e preenche o comparativo. A IA padroniza, destaca a melhor oferta — e você aprova.
>
> Conecte o SharePoint. Cada arquivo novo entra sozinho. A IA lê tipo, produto e validade. Com as pastas do drive espelhadas.
>
> Seu time leva quanto para cotar? Ele pede o documento no WhatsApp e recebe em segundos. Pediu preço? Ela confirma a marca e emite a cotação na hora. E toda a conversa fica registrada no sistema.
>
> Faradays — conheça em faradays ponto io.
