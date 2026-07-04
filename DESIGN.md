---
name: Rotina & Saúde
description: Painel pessoal de saúde, quase inteiramente grayscale, com um único acento raro
colors:
  primary: "oklch(0.65 0.19 45)"
  primary-foreground: "oklch(1 0 0)"
  bg: "oklch(0.97 0.008 70)"
  surface: "oklch(1 0 0)"
  hairline: "oklch(0.9 0.006 70)"
  ink: "oklch(0.16 0 0)"
  muted: "oklch(0.52 0.005 70)"
  destructive: "oklch(0.58 0.19 25)"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
  2xl: "1.125rem"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.2xl}"
    padding: "16px"
---

# Design System: Rotina & Saúde

## 1. Overview

**Creative North Star: "Sinal Vital" (recalibrado — quieter pass)**

Rotina & Saúde é um painel pessoal, não um formulário burocrático. A base é neutra, densa, sem ruído: ~80% branco e cinza, ~15% tinta preta (texto, botões, ícones, estados ativos), e uma única exceção de cor — o laranja — reservada a um único ponto por tela, no máximo. Uma tentativa anterior deste sistema espalhava o laranja por botões, badges, gráficos e navegação; isso lia como ruído repetido, não como sinal, e foi corrigido: **o preto agora carrega o peso que antes era do laranja.**

O sistema ainda rejeita o clichê de "app de dieta" raso (paleta pastel aleatória, cards idênticos, gamificação vazia) e o clichê oposto de "SaaS cinza sem alma" — a superfície ganha elevação real (sombra suave e ambiente em todos os cards, não só em overlays), tiras de navegação horizontais, controles segmentados em pílula, e uma navegação inferior flutuante com ação rápida (FAB, agora em tinta preta). Emoji seguem como ícone de categoria (sono, treino, alimentação, medicação), nunca como decoração de frase solta.

Densidade continua alta (`text-sm`/`text-xs` predominam). Light e dark mode continuam recebendo o mesmo cuidado.

**Key Characteristics:**
- Tinta preta (`foreground`) é a cor de ação: todo botão primário, badge de conclusão, indicador de nav ativo, FAB, e todo "último ponto" de gráfico (barra, linha, gauge) usam ink — não laranja.
- Laranja (`primary`) é uma exceção deliberada e rara: hoje, é usado só no indicador de "hoje" na tira de dias da Home. Antes de adicionar um segundo uso, pergunte se um ponto de tinta preta já resolveria — geralmente resolve.
- Canvas off-white morno (não branco puro), cartões brancos com sombra suave — nunca flat-por-padrão.
- Dialogs são bottom sheets no mobile (ancorados embaixo, cantos superiores arredondados), viram modal centralizado só a partir de `sm:`.
- Emoji como ícone de categoria (sono, treino, alimentação, medicação), nunca como decoração de frase.
- Navegação inferior flutuante em pílula com um FAB de ação rápida em tinta preta.
- Geist Mono reservado para leituras numéricas.
- Telas vazias usam o componente `EmptyState` (ícone/emoji + título + descrição) — nunca uma única linha cinza solta no meio de uma tela em branco.

## 2. Colors

Um canvas neutro e morno carrega a base; tinta preta faz o trabalho pesado; o laranja é a exceção rara, não a regra.

### Ink (a cor de ação)
- **Ink** (`oklch(0.16 0 0)`): texto primário, botão/badge default, indicador ativo de navegação, FAB, checkmark de conclusão, arco do gauge de energia, última barra/ponto de qualquer gráfico de tendência. Sempre acromático — é o "preto" dos 15% pedidos, e é ele que carrega quase toda a hierarquia de ação da interface.

### Primary (a exceção rara)
- **Laranja Vital** (`oklch(0.65 0.19 45)`): reservado hoje a um único uso — o indicador de "hoje" na tira de dias da Home (`components/home/day-strip.tsx`). Não é mais o botão primário, nem o FAB, nem badges, nem gráficos. Antes de introduzir um segundo uso, confirme que tinta preta não resolveria; na dúvida, use ink.

### Neutral
- **Fog Morno** (`oklch(0.97 0.008 70)`): fundo de canvas. Off-white com leve calor, nunca branco puro.
- **Paper** (`oklch(1 0 0)`): superfície de cards, dialogs, popovers, sempre com sombra suave por cima do Fog.
- **Hairline** (`oklch(0.9 0.006 70)`): bordas onde a sombra sozinha não basta (divisores de lista, inputs).
- **Muted** (`oklch(0.52 0.005 70)`): texto secundário, labels, ícones inativos.

### Named Rules
**A Regra do Pulso Único.** O laranja aparece no máximo em UM elemento da UI inteira (não por tela — no app inteiro), e só quando tinta preta genuinamente não comunicaria o mesmo. Fora disso, hierarquia vem de peso, espaçamento e tinta preta.

**A Regra dos Dois Planos.** Canvas (Fog Morno) e superfície (Paper) continuam sendo dois degraus distintos; a separação é reforçada por sombra suave, não só por contraste de cinza.

## 3. Typography

**Display/Body Font:** Geist (com fallback `system-ui, sans-serif`)
**Data Font:** Geist Mono (com fallback `ui-monospace, monospace`)

**Character:** Uma família sem serifa carrega toda a hierarquia. Geist Mono é reservado para leituras numéricas isoladas (peso, horas de sono, dose, score).

### Hierarchy
- **Display** (600, 1.75rem/28px, 1.2, -0.02em): saudação/título de tela.
- **Title** (600, 1rem/16px, 1.3): título de card ou seção.
- **Body** (400, 0.875rem/14px, 1.5): texto corrido.
- **Label** (500, 0.75rem/12px, 1.4, 0.01em): rótulos, tabs, badges.
- **Data** (500, 0.875rem/14px, mono, -0.01em): valores numéricos isolados.

## 4. Elevation

Sombra suave e ambiente é o padrão em todo card, não exceção. Cards flutuam sobre o Fog Morno com uma sombra difusa e baixa; overlays (dialog, popover) recebem uma sombra um degrau mais forte, para reforçar a camada extra.

### Shadow Vocabulary
- **card** (`box-shadow: 0 1px 2px oklch(0 0 0 / 4%), 0 8px 24px -12px oklch(0 0 0 / 10%)`): todo card em repouso.
- **overlay** (`box-shadow: 0 16px 40px -12px oklch(0 0 0 / 20%)`): dialogs, popovers, dropdowns, o FAB expandido.

### Named Rules
**A Regra da Sombra Viva.** Toda superfície elevada tem sombra suave; hairline vira reforço pontual (divisores de lista, inputs), não a única linguagem de separação.

## 5. Components

### Buttons
- **Shape:** `rounded-md` (0.5rem).
- **Primary (default variant):** fundo Ink, texto Paper. É a ação principal de cada tela, o FAB, e virtualmente todo `<Button>` sem `variant`.
- **Outline/Ghost:** fundo Paper ou transparente, texto Ink.
- **Laranja:** nenhum botão usa laranja. Se um botão parece precisar de destaque extra além do default, o problema é hierarquia da tela, não a cor do botão.

### Chips / Badges
- **Style:** fundo `muted`, texto Ink, `rounded-full`. O variant `default` (badge de destaque/conclusão) usa Ink, não laranja.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (1.125rem) nos cards principais.
- **Background:** sempre Paper.
- **Shadow Strategy:** sombra suave por padrão (ver Elevation).
- **Internal Padding:** 16-20px.
- Nunca aninhar Card dentro de Card. Prefira um único container `rounded-2xl bg-card shadow-card` com linhas internas separadas por `divide-y divide-border` (ver `PendingChecklist`, `FoodCatalogList`, `MealLogList`) a empilhar cards menores dentro de um maior.

### Empty States
- Toda tela ou seção sem dados usa o componente `components/ui/empty-state.tsx`: emoji/ícone num círculo `bg-muted`, título, descrição curta, ação opcional. Nunca um parágrafo cinza solto — isso é o que lia como "tela em branco quebrada".

### Day Strip
- Tira horizontal com os dias da semana, dia atual destacado com o laranja — **o único lugar do sistema onde o laranja aparece hoje.** Contexto visual, não decoração — reforça "hoje" como o pulso da Home.

### Segmented Control
- Pílula com fundo `muted`, opção ativa em Paper com sombra sutil. Usado para filtrar estado (a fazer / concluído).

### Dialogs (bottom sheet no mobile)
- No mobile, `DialogContent` é ancorado embaixo (`fixed inset-x-0 bottom-0`), com cantos superiores arredondados (`rounded-t-3xl`), um indicador de arraste (`h-1 w-9 bg-muted-foreground/25`) e entra com `slide-in-from-bottom`. A partir de `sm:`, vira modal centralizado tradicional com `zoom-in-95`.
- Overlay usa `bg-foreground/40` (não preto fixo) para se adaptar a light/dark automaticamente, com leve `backdrop-blur`.
- `DialogFooter` nunca tem fundo `muted`/borda separada — isso lia como barra de botões de diálogo do Windows. Botões seguem no fluxo normal do conteúdo.

### Navigation
- Barra inferior flutuante em pílula (não fixa borda-a-borda), com os itens principais em Ink quando ativos (fundo `muted`, não laranja) e um FAB circular de ação rápida em Ink, levemente elevado acima da pílula.

## 6. Do's and Don'ts

### Do:
- **Do** usar tinta preta (Ink) como a cor de ação padrão: botões, badges, indicador de nav ativo, FAB, checkmarks, último ponto de gráficos.
- **Do** tratar o laranja como uma exceção rara e deliberada — hoje, só o indicador de "hoje" na Day Strip.
- **Do** dar sombra suave a todo card em repouso; hairline só reforça divisores pontuais.
- **Do** usar emoji como ícone de categoria (sono, treino, alimentação, medicação), sempre no mesmo tamanho e posição.
- **Do** usar `EmptyState` para qualquer lista, tela ou card sem dados.
- **Do** manter Geist Mono para números isolados.
- **Do** tratar dark mode como tema de primeira classe.

### Don't:
- **Don't** adicionar um segundo uso do laranja sem antes tentar tinta preta — se preto resolve, use preto.
- **Don't** usar emoji como decoração de frase corrida — só como ícone de categoria.
- **Don't** usar paleta pastel aleatória, ilustrações fofas ou badges de conquista brilhantes tipo app de dieta genérico.
- **Don't** usar `border-left`/`border-right` coloridos como acento decorativo.
- **Don't** usar hero-metric com gradiente, grades de cards idênticos, ou eyebrows numerados (01/02/03).
- **Don't** colocar branco puro atrás de branco puro sem sombra os separando.
- **Don't** aninhar Card dentro de Card — use um container com `divide-y` para listas de itens relacionados.
- **Don't** deixar uma tela ou lista vazia mostrar só uma linha de texto cinza — use `EmptyState`.
