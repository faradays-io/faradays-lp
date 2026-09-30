# Glow e fundo preto do showcase de 1 min — especificação para replicar no PowerPoint

Tudo o que forma o "palco" escuro do vídeo de 1 min do showcase Faradays: fundo, manchas de luz azul, horizontes (de baixo e de cima), brilho do texto e a coreografia do glow no Problema. Os valores foram tirados do CSS e da timeline GSAP do vídeo (estado de 2026-09-30).

**Este arquivo é autossuficiente.** O script Python do §8 gera os glows como **PNG transparentes**, reproduzindo o CSS: gradiente radial, recorte da forma e blur. É o caminho recomendado, porque o PowerPoint não tem blur de verdade nem gradiente radial elíptico com alfa. Os PNGs gerados por ele foram conferidos lado a lado com a captura do vídeo e saem idênticos.

Para gerar: copie o script do §8 para um arquivo `gerar_glow.py` e rode `pip install pillow numpy && python3 gerar_glow.py png`. Os nomes de arquivo citados abaixo (`glow-baixo.png`, `quadro-*.png`…) são os que ele gera na pasta `png/`.

## 1. Conversões (vídeo 1920×1080 → slide 16:9)

| | Vídeo | PowerPoint |
|---|---|---|
| Tamanho do slide | 1920 × 1080 px | 13,333 × 7,5 in (12 192 000 × 6 858 000 EMU) |
| 1 px | — | 1/144 in = **6 350 EMU** = **0,5 pt** |
| Fonte 104 px | — | 52 pt |

Para converter uma posição, divida por 144 para ter polegadas, ou multiplique por 6 350 para ter EMU (a unidade do python-pptx).

## 2. Fundo

| Item | Valor |
|---|---|
| Fundo do slide | **#000000**, sólido |
| Grão (opcional) | Ruído fractal a **12%** de opacidade por cima de tudo, saltando de posição a cada 1/12 s. No vídeo é um SVG `feTurbulence` (baseFrequency 0,25, 2 oitavas, tile de 120 px). No PPT dá para usar um PNG de ruído a 12% ou deixar de fora; no preto quase não aparece. |
| Moldura / palco arredondado | **Não usar.** Foi testada e removida a pedido. |

**Texto sobre o preto:**

| Uso | Cor | Detalhes |
|---|---|---|
| Texto principal | #FAFAFA | Geist SemiBold (600) · entrelinha 1,05 · tracking −3% |
| Texto secundário / chaves `{ }` | #A1A1A1 | chaves em Geist Light (300), 1,3× o corpo do texto |
| Destaque "custo" (ex.: *margem*) | #FF6467 | |
| Gradiente de IA (bolhas, "IA") | #1D6AE5 → #38BDF8 → #7C8CF8 → #38BDF8 → #1D6AE5 | varre da esquerda para a direita |

**Brilho do texto:** no vídeo é `text-shadow: 0 0 42px rgba(90,150,255,.35)` em toda frase grande. No PowerPoint, use o efeito **Brilho**:
- cor **#5A96FF**
- transparência **65%** (alfa 35%)
- tamanho **14–18 pt**

Em DrawingML (dentro do `a:rPr` do texto):

```xml
<a:effectLst><a:glow rad="203200"><a:srgbClr val="5A96FF"><a:alpha val="35000"/></a:srgbClr></a:glow></a:effectLst>
```

## 3. As quatro camadas de luz

Todas ficam em modo **screen** por cima da cena, no vídeo. No PowerPoint não existe screen. Sobre o preto, um PNG com alfa dá exatamente o mesmo resultado, então coloque os glows **atrás do texto** (logo acima do fundo). Sobre prints escuros do sistema, o PNG por cima com alfa fica muito próximo.

| Camada | Arquivo solto (com margem para o blur) | Elemento (px) | Gradiente radial | Blur |
|---|---|---|---|---|
| **Horizonte de baixo** (`.gh`) | `glow-baixo.png` (2104 × 724) | 1900 × 520, canto em **(10, 620)** | elipse 55% × 70%, centro no **meio da base**: #286EFF a 100% → #1D6AE5 a 45% (em 50%) → transparente (em 80%) | 34 px |
| **Horizonte de cima** (`.gt`) | `glow-topo.png` (2104 × 724) | 1900 × 520, canto em **(10, −60)** | o mesmo, espelhado (centro no meio do topo) | 34 px |
| **Mancha A** (`.ga`) | `mancha-a.png` (1260 × 900) | elipse 960 × 600 | #286EFF a 90% → #1D6AE5 a 35% (em 55%) → transparente | 50 px |
| **Mancha B** (`.gbb`) | `mancha-b.png` (1120 × 1120) | círculo 820 × 820 | #38BDF8 a 55% → #1D6AE5 a 20% (em 55%) → transparente | 50 px |

Os horizontes são **meias-elipses**: a de baixo tem a base reta na borda inferior do elemento, e a de cima tem o topo reto. O recorte é feito antes do blur.

**Posicionar um PNG solto:** o PNG tem a margem do blur em volta (3× o blur: 102 px nos horizontes e 150 px nas manchas). Então `esquerda = x_do_elemento − margem` e `topo = y_do_elemento − margem`.

**Exemplo:** o horizonte de baixo entra em (10 − 102, 620 − 102) = (−92, 518) px, ou seja (−0,639 in, 3,597 in), com tamanho 14,611 × 5,028 in.

**Atalho:** os `quadro-*.png` já vêm em 1920×1080, com a luz na posição do vídeo. Basta colocar em tela cheia (0, 0, 13,333 × 7,5 in).

## 4. Onde as manchas ficam em cada sessão

As manchas A e B mudam de canto a cada sessão. No vídeo, a troca desliza em **2 s** (curva `cubic-bezier(.625,.05,0,1)`, um ease-in-out forte). Posição = canto do elemento, em px.

| Estado | Quando | Mancha A | Mancha B | PNG pronto |
|---|---|---|---|---|
| g0 | Problema (as 6 frases) | **apagada** | **apagada** | — (só os horizontes, ver §5) |
| g1 | Solução (FS1) e legendas "Ordem de compra…", "Vendas no WhatsApp" | (−280, −300): topo-esquerda | (1380, 520): baixo-direita | `quadro-manchas-g1-solucao.png` |
| g2 | Legendas "Um clique…", "Documentos…", "Todo o time…" | (1240, −340): topo-direita | (−380, 480): baixo-esquerda | `quadro-manchas-g2-demo.png` |
| g3 | Legendas "A IA compara…", "Vencendo?…" | (−320, 620): baixo-esquerda | (1460, −360): topo-direita | `quadro-manchas-g3-demo-alt.png` |
| g4 | CTA | (480, −330): topo-centro | (−300, 560): baixo-esquerda | `quadro-manchas-g4-cta.png` |

A sequência completa do vídeo é g0 → g1 (Solução) → g2 → g3 → g1 → g2 → g3 → g1 → g2 → g4 (CTA). A sessão muda a cada legenda da demo.

**Deriva contínua,** em loop de vai e volta, sempre ligada:

| Camada | Movimento | Duração |
|---|---|---|
| Mancha A | desloca (0,0) → (+90, +40) px e escala 1 → 1,12 | 9 s |
| Mancha B | desloca (0,0) → (−80, −50) px e escala 1,05 → 0,92 | 11 s |
| Horizontes | opacidade 75% → 100% e largura 92% → 104% | 6 s |

Todas usam ease-in-out e alternam ida e volta.

No PowerPoint:
- **Com Morph entre slides:** a deriva pode ficar de fora.
- **Num slide só:** use a animação "Caminho" com *Reversão automática* + "Aumentar/Diminuir" com *Reversão automática* e *Repetir até o fim do slide*.

## 5. Coreografia do glow no Problema (a parte principal)

Os tempos são em segundos desde o início do Problema; no vídeo, some 2 s da cabeça em branco. Os horizontes escalam **a partir da borda**: o de baixo cresce para cima com a origem no meio da base, e o de cima cresce para baixo com a origem no meio do topo. "Escala" é o quanto do tamanho do §3 está aplicado.

| t (s) | Frase na tela | Horizonte de baixo | Horizonte de cima |
|---|---|---|---|
| 0,0 – 1,4 | **Cotação de compra** | **nasce**: altura 10% → 100%, opacidade 0 → 100% em 1,4 s (ease-out forte) | apagado |
| 1,2 – 1,7 | (saída da frase) | **apaga**: opacidade → 0 e altura → 30% em 0,5 s (ease-in) | apagado |
| 1,4 – 3,6 | por e-mail · e planilha (colagem) | apagado | apagado |
| 3,6 – 4,7 | **Certificado vencido** | apagado | **nasce BEM GRANDE**: altura 10% → **190%**, largura 100% → **135%**, opacidade 0 → 100% em 1,1 s (ease-out forte) |
| 4,9 | { sem ninguém ver } | apagado | **diminui** para 120% × 145% (largura × altura) em 0,9 s (ease-out) |
| 6,2 | Cada cotação lenta | apagado | **diminui** para 105% × 105% em 0,9 s |
| 7,3 | é margem indo embora. ("é" em 7,35 · "margem" em 7,8 · "indo" em 8,25) | apagado | **diminui** para 95% × 75% em 0,9 s |
| 8,4 – 8,85 | entre "indo" e "embora." | — | **apaga**: opacidade → 0, altura → 30% em 0,45 s |
| 8,45 – 9,05 | entre "indo" e "embora." | **nasce**: altura 10% → 75%, opacidade 0 → 80% em 0,6 s (ease-out forte) | apagado |
| 8,7 | "embora." entra | aceso | apagado |
| 9,1 – 9,9 | **pausa dramática** (a frase recua para 86% em 0,8 s, ease-out) | **cresce**: altura 75% → **130%**, opacidade → 100% em 0,8 s (ease-out) | apagado |
| 9,75 – 10,35 | (saída; a Solução entra em 9,9) | **apaga** em 0,6 s | apagado |

**Curvas usadas:**
- "ease-out forte" = `power3.out`, no PowerPoint *Suavizar fim* no máximo.
- "ease-out" = `power2.out`.
- "ease-in" = `power2.in`.

**Blink no texto (sem luz de fundo):** a cada palavra de "é margem indo embora.", a linha inteira dá um flash de 0,45 s:
- brilho **2,6×** + halo #96BEFF de 22 px, voltando ao normal
- no pico, o vermelho de "margem" fica quase branco

No PowerPoint:
- aplique "Pulsar" ou "Cor de fonte → branco" com *Reversão automática*, 0,45 s, junto com a entrada de cada palavra
- ou duplique a caixa de texto com o efeito Brilho forte (#96BEFF, 11 pt) e faça ela aparecer e sumir por cima

## 6. Como montar no PowerPoint (python-pptx)

1. `prs.slide_width, prs.slide_height = Emu(12192000), Emu(6858000)`. Fundo de cada slide: preenchimento sólido #000000.
2. **Ordem das camadas,** de trás para frente:
   1. fundo preto
   2. manchas (`quadro-manchas-*.png` ou os PNG soltos)
   3. horizontes
   4. prints do sistema
   5. texto
3. **Um slide por frase + transição Morph** é o jeito mais fiel de fazer os horizontes crescerem e diminuírem a partir da borda:
   - Dê o mesmo nome aos objetos que se correspondem nos dois slides, por exemplo `!!glow-baixo` e `!!glow-topo` (o prefixo `!!` força o Morph a casar).
   - Para crescer "de baixo para cima", mantenha a base do PNG colada na borda inferior do slide e mude só a altura e o topo. A largura muda em torno do centro.
   - Glow apagado = mesmo objeto com 100% de transparência, ou altura mínima e colado na borda.
4. **Duração da transição Morph = duração da tabela** do §5 (0,5 a 1,4 s). A transição não tem controle fino de ease, mas o Morph já suaviza bem.
5. **Alternativa sem PNG** (menos fiel): elipse com preenchimento gradiente *Caminho → Circular*, paradas com transparência (0% → 10%, 55% → 65%, 100% → 100%) e efeito **Bordas suaves** grande. XML da Mancha A:

```xml
<p:spPr>
  <a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>
  <a:gradFill rotWithShape="1">
    <a:gsLst>
      <a:gs pos="0"><a:srgbClr val="286EFF"><a:alpha val="90000"/></a:srgbClr></a:gs>
      <a:gs pos="55000"><a:srgbClr val="1D6AE5"><a:alpha val="35000"/></a:srgbClr></a:gs>
      <a:gs pos="100000"><a:srgbClr val="1D6AE5"><a:alpha val="0"/></a:srgbClr></a:gs>
    </a:gsLst>
    <a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>
  </a:gradFill>
  <a:ln><a:noFill/></a:ln>
  <a:effectLst><a:softEdge rad="381000"/></a:effectLst>
</p:spPr>
```

Para os horizontes, use `prst="ellipse"` com o dobro da altura, deixando metade fora do slide (o slide corta). Mova o `fillToRect` para a borda (`t="100000" b="0"` para o de baixo).

## 7. Conferência

- `png/preview-fundo-com-glow-baixo.png` é o fundo preto com o horizonte de baixo aceso. Ele foi comparado com a captura do vídeo aos 3,1 s (paleta, formato e altura iguais). O do vídeo pulsa entre 75% e 100% de opacidade; o PNG está no estado cheio.
- O script repete os números das tabelas acima à mão. Se algum valor mudar, atualize a tabela e o script juntos.

## 8. Script `gerar_glow.py`

```python
"""Gera os glows do showcase de 1 min como PNG transparentes (1920×1080) para o PowerPoint.

Reproduz o CSS do vídeo: gradiente radial em alfa pré-multiplicado, recorte do elemento
(border-radius) e depois filter: blur(). Uso: python3 gerar_glow.py [pasta_de_saida]
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

W, H = 1920, 1080
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else "png")
OUT.mkdir(parents=True, exist_ok=True)


def radial(w, h, cx, cy, rx, ry, stops):
    """Gradiente radial elíptico. stops = [(pos 0..1, (r, g, b, a))]. Devolve RGBA float pré-multiplicado."""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2)
    pos = np.array([p for p, _ in stops], np.float32)
    cols = np.array([[c[0] * c[3], c[1] * c[3], c[2] * c[3], c[3] * 255] for _, c in stops], np.float32)
    out = np.empty((h, w, 4), np.float32)
    for ch in range(4):
        out[..., ch] = np.interp(d, pos, cols[:, ch])
    return out


def to_image(pm):
    """RGBA pré-multiplicado (float, 0..255) → imagem RGBA normal."""
    a = pm[..., 3:4]
    rgb = np.where(a > 0, pm[..., :3] / np.maximum(a, 1e-6) * 255, 0)
    return Image.fromarray(np.dstack([rgb, a]).clip(0, 255).round().astype(np.uint8), "RGBA")


def blur_pm(pm, px):
    """CSS blur(Npx) = gaussiana de desvio N, aplicada sobre o pré-multiplicado (o PIL usa o raio como desvio)."""
    img = Image.fromarray(pm.clip(0, 255).round().astype(np.uint8), "RGBA").filter(ImageFilter.GaussianBlur(px))
    return np.asarray(img, np.float32)


def place(layer, x, y, pad):
    """Cola a camada (já com margem `pad` para o blur) no quadro 1920×1080, com o canto do elemento em (x, y)."""
    frame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    big = Image.new("RGBA", (W + 4000, H + 4000), (0, 0, 0, 0))  # margem para camadas que saem do quadro
    big.alpha_composite(layer, (int(x - pad) + 2000, int(y - pad) + 2000))
    frame.alpha_composite(big.crop((2000, 2000, 2000 + W, 2000 + H)))
    return frame


def element(w, h, grad_fn, clip, blur_px):
    """Desenha o elemento w×h com margem para o blur, recorta pela forma e aplica o blur."""
    pad = int(blur_px * 3)
    pm = np.zeros((h + 2 * pad, w + 2 * pad, 4), np.float32)
    pm[pad:pad + h, pad:pad + w] = grad_fn(w, h)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    mask = clip(x + 0.5, y + 0.5, w, h).astype(np.float32)
    pm[pad:pad + h, pad:pad + w] *= mask[..., None]
    return to_image(blur_pm(pm, blur_px)), pad


ellipse = lambda x, y, w, h: ((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2 <= 1
# border-radius:50% 50% 0 0/100% 100% 0 0 → meia-elipse com a base reta embaixo (gh); o espelho em cima (gt)
half_bottom = lambda x, y, w, h: ((x - w / 2) / (w / 2)) ** 2 + ((y - h) / h) ** 2 <= 1
half_top = lambda x, y, w, h: ((x - w / 2) / (w / 2)) ** 2 + (y / h) ** 2 <= 1

AZUL, AZUL2, CIANO = (40, 110, 255), (29, 106, 229), (56, 189, 248)
T = lambda c, a: (*c, a)

# Horizonte de baixo (.gh): 1900×520 em (10, 620); radial 55%×70% ancorado no meio da base; blur 34
gh, pad_h = element(1900, 520, lambda w, h: radial(w, h, w / 2, h, 0.55 * w, 0.70 * h,
                    [(0, T(AZUL, 1)), (0.5, T(AZUL2, 0.45)), (0.8, T(AZUL2, 0)), (1, T(AZUL2, 0))]), half_bottom, 34)
# Horizonte de cima (.gt): o mesmo, espelhado, em (10, -60)
gt, pad_t = element(1900, 520, lambda w, h: radial(w, h, w / 2, 0, 0.55 * w, 0.70 * h,
                    [(0, T(AZUL, 1)), (0.5, T(AZUL2, 0.45)), (0.8, T(AZUL2, 0)), (1, T(AZUL2, 0))]), half_top, 34)
# Mancha A (.ga): elipse 960×600, radial closest-side; blur 50
ga, pad_a = element(960, 600, lambda w, h: radial(w, h, w / 2, h / 2, w / 2, h / 2,
                    [(0, T(AZUL, 0.9)), (0.55, T(AZUL2, 0.35)), (1, T(AZUL2, 0))]), ellipse, 50)
# Mancha B (.gbb): círculo 820, radial closest-side ciano; blur 50
gb, pad_b = element(820, 820, lambda w, h: radial(w, h, w / 2, h / 2, w / 2, h / 2,
                    [(0, T(CIANO, 0.55)), (0.55, T(AZUL2, 0.2)), (1, T(AZUL2, 0))]), ellipse, 50)

# Camadas soltas (elemento + margem do blur): para posicionar/animar no PowerPoint
gh.save(OUT / "glow-baixo.png"); gt.save(OUT / "glow-topo.png"); ga.save(OUT / "mancha-a.png"); gb.save(OUT / "mancha-b.png")
# Quadros inteiros 1920×1080 (transparentes), já na posição do vídeo
place(gh, 10, 620, pad_h).save(OUT / "quadro-glow-baixo.png")
place(gt, 10, -60, pad_t).save(OUT / "quadro-glow-topo.png")
SECOES = {  # posição (canto do elemento) de cada mancha por sessão; None = apagada
    "g1-solucao": ((-280, -300), (1380, 520)),
    "g2-demo": ((1240, -340), (-380, 480)),
    "g3-demo-alt": ((-320, 620), (1460, -360)),
    "g4-cta": ((480, -330), (-300, 560)),
}
for nome, ((ax, ay), (bx, by)) in SECOES.items():
    fr = place(ga, ax, ay, pad_a)
    fr.alpha_composite(place(gb, bx, by, pad_b))
    fr.save(OUT / f"quadro-manchas-{nome}.png")
# Fundo preto de referência, com o horizonte de baixo aceso (para conferir o visual)
bg = Image.new("RGBA", (W, H), (0, 0, 0, 255))
bg.alpha_composite(place(gh, 10, 620, pad_h))
bg.convert("RGB").save(OUT / "preview-fundo-com-glow-baixo.png")
print("ok", sorted(p.name for p in OUT.iterdir()))
```
