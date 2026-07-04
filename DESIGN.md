---
name: Rotina & Saúde
description: Painel pessoal de saúde — superfície neutra e calma, dado colorido (cor-como-dado, no espírito de Oura e Apple Health)
colors:
  ink: "oklch(0.16 0 0)"
  bg: "oklch(0.97 0.008 70)"
  surface: "oklch(1 0 0)"
  hairline: "oklch(0.9 0.006 70)"
  muted: "oklch(0.52 0.005 70)"
  primary: "oklch(0.65 0.19 45)"
  primary-foreground: "oklch(1 0 0)"
  energia: "oklch(0.58 0.17 300)"
  sono: "oklch(0.55 0.14 262)"
  treino: "oklch(0.62 0.14 152)"
  comida: "oklch(0.68 0.15 58)"
  remedio: "oklch(0.62 0.1 205)"
  protein: "oklch(0.62 0.17 20)"
  carb: "oklch(0.72 0.14 75)"
  fat: "oklch(0.66 0.12 250)"
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

**Creative North Star: "Sinal Vital" — superfície calma, dado vivo**

Rotina & Saúde é um painel pessoal, não um formulário burocrático. A referência agora é explícita: Oura, Apple Health, apps de caloria premium. A doutrina que reconcilia "calmo" com "cheio de vida" é **cor-como-dado**: a superfície permanece neutra (canvas off-white, cartões brancos, texto em tinta preta, botões em tinta preta), e a cor entra **só nos elementos de dado** — anéis de score, arcos de progresso, chips de categoria, barras de macro. Cada área de saúde tem UMA cor própria (energia, sono, treino, alimentação, medicação), como os anéis do Apple Health. Nunca cor em botão, nunca cor preenchendo um card inteiro, nunca cor decorativa.

Isso substitui a fase anterior "quase tudo grayscale, laranja raríssimo": não havia vida suficiente para uma referência Oura/Apple. Agora há vida, mas ela é disciplinada — vem do dado, não da decoração. O sistema segue rejeitando o clichê de "app de dieta" raso (pastel aleatório, cards idênticos, gamificação vazia) e o de "SaaS cinza sem alma".

Cada tela principal abre com um **anel-herói** (o score/valor daquela área) na cor do domínio, seguido de detalhamento. Densidade continua alta; light e dark mode recebem o mesmo cuidado.

**Key Characteristics:**
- **Cor-como-dado**: cor aparece só em anéis, arcos, chips e barras de dado. Botões, texto e navegação ativa continuam em tinta preta.
- **Uma cor por domínio**: energia (violeta), sono (azul), treino (verde), alimentação (laranja), medicação (turquesa); macros: proteína (vermelho), carbo (âmbar), gordura (azul). Fonte única em `lib/domains.ts`.
- **Anel-herói por tela**: cada área abre com um `Ring` grande na cor do domínio (energia → /energia, sono → score de sono, alimentação → calorias, treino → séries, medicação → doses).
- Canvas off-white morno (não branco puro), cartões brancos com sombra suave — nunca flat-por-padrão.
- Botões sempre em tinta preta (`bg-foreground`); nunca coloridos.
- Dialogs são bottom sheets no mobile (ancorados embaixo, cantos superiores arredondados), viram modal centralizado só a partir de `sm:`.
- Navegação inferior flutuante em pílula, item ativo rotulado em tinta preta + FAB em tinta preta.
- Componentes padronizados: `Section` (cabeçalho de seção), `StatTile` (métrica compacta), `MetricBar` (barra rotulada colorida), `Ring` (anel de progresso), `EmptyState` (tela/lista vazia).
- Geist Mono reservado para leituras numéricas.

## 2. Colors

Superfície neutra carrega a base; a cor pertence exclusivamente aos elementos de dado. Cada domínio tem uma cor; nenhuma delas toca botão, texto ou preenchimento de card.

### Ink & Neutros (a superfície)
- **Ink** (`oklch(0.16 0 0)`): texto primário, todo botão/badge/nav-ativo/FAB. Sempre acromático.
- **Fog Morno** (`oklch(0.97 0.008 70)`): canvas. Off-white com leve calor, nunca branco puro.
- **Paper** (`oklch(1 0 0)`): superfície de cards, dialogs, popovers, sempre com sombra suave.
- **Hairline** (`oklch(0.9 0.006 70)`): divisores de lista, inputs.
- **Muted** (`oklch(0.52 0.005 70)`): texto secundário, labels, ícones inativos.

### Domínios (a cor-como-dado)
Usados apenas em `stroke-*` (anéis), `bg-*` (barras/arcos) e `bg-*/12` (chips de ícone). Definidos em `app/globals.css` e mapeados em `lib/domains.ts`.
- **Energia** (`oklch(0.58 0.17 300)`, violeta): anel de readiness na Home e em `/energia`; barra de tendência de energia.
- **Sono** (`oklch(0.55 0.14 262)`, azul): anel de score de sono, gráfico de horas.
- **Treino** (`oklch(0.62 0.14 152)`, verde): anel de progresso de séries, índice de exercício concluído.
- **Alimentação** (`oklch(0.68 0.15 58)`, laranja): anel de calorias.
- **Medicação** (`oklch(0.62 0.1 205)`, turquesa): anel de doses.
- **Macros** — proteína (`oklch(0.62 0.17 20)`), carboidrato (`oklch(0.72 0.14 75)`), gordura (`oklch(0.66 0.12 250)`): barras de composição no card de nutrição.

### Named Rules
**A Regra Cor-como-Dado.** Cor só existe onde há dado: anel, arco, chip, barra. Se você está prestes a colorir um botão, um fundo de card ou um texto, pare — use tinta preta. A vida do sistema vem dos dados coloridos sobre uma superfície calma, exatamente como Oura e Apple Health.

**A Regra de Um Domínio, Uma Cor.** Cada área de saúde tem exatamente uma cor, sempre a mesma, vinda de `lib/domains.ts`. Nunca improvise um tom novo nem reaproveite a cor de outro domínio.

**A Regra dos Dois Planos.** Canvas (Fog Morno) e superfície (Paper) são dois degraus distintos, reforçados por sombra suave, não só por contraste de cinza.

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

### Rings (anel-herói e mini-anéis)
- `components/ui/ring.tsx`: anel de progresso circular. `progressClassName` recebe a cor do domínio (`stroke-energia`, `stroke-sono`, …); trilha em `stroke-muted`.
- **Anel-herói** (120–170px): abre cada tela de área com o score/valor central em Geist Mono. Home/`/energia` → energia; Sono → score de sono; Alimentação → calorias; Treino → séries; Medicação → doses.
- **Mini-anel** (56–96px): dentro de cards de resumo e tiles.

### Stat Tiles & Metric Bars
- `StatTile` (`components/ui/stat-tile.tsx`): métrica compacta com chip de emoji tingido (`bg-<domain>/12`), valor grande em mono, label discreta, chevron quando é link. Usado no grid 2×2 da Home.
- `MetricBar` (`components/ui/metric-bar.tsx`): barra rotulada com preenchimento na cor do domínio/macro. Usada em breakdowns (contribuintes de energia, split de macros).
- `Section` (`components/ui/section.tsx`): cabeçalho de seção padrão (título + ação opcional). Toda seção de tela usa este componente.

### Chips / Badges
- **Style:** fundo `muted`, texto Ink, `rounded-full`. O variant `default` usa Ink, não cor de domínio.
- **Chip de categoria:** círculo com fundo `bg-<domain>/12` e emoji do domínio — a única forma de cor de domínio fora de anéis/barras.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (1.125rem) em cards de lista; `rounded-3xl` nos cards-herói com anel.
- **Background:** sempre Paper.
- **Shadow Strategy:** sombra suave por padrão (ver Elevation).
- **Internal Padding:** 16px em tiles/listas, 24px (`p-6`) nos cards-herói.
- Nunca aninhar Card dentro de Card. Prefira um único container `rounded-2xl bg-card shadow-card` com linhas internas separadas por `divide-y divide-border`.

### Empty States
- Toda tela ou seção sem dados usa `components/ui/empty-state.tsx`: emoji/ícone num círculo `bg-muted`, título, descrição curta, ação opcional. Nunca um parágrafo cinza solto.

### Day Strip
- Tira horizontal com os dias da semana; o dia de hoje é um círculo cheio em **tinta preta** (não em cor de domínio — a Day Strip é navegação, não dado).

### Segmented Control
- Pílula com fundo `muted`, opção ativa em Paper com sombra sutil. Usado para filtrar estado (a fazer / concluído).

### Dialogs (bottom sheet no mobile)
- No mobile, `DialogContent` é ancorado embaixo (`fixed inset-x-0 bottom-0`), com cantos superiores arredondados (`rounded-t-3xl`), um indicador de arraste (`h-1 w-9 bg-muted-foreground/25`) e entra com `slide-in-from-bottom`. A partir de `sm:`, vira modal centralizado tradicional com `zoom-in-95`.
- Overlay usa `bg-foreground/40` (não preto fixo) para se adaptar a light/dark automaticamente, com leve `backdrop-blur`.
- `DialogFooter` nunca tem fundo `muted`/borda separada — isso lia como barra de botões de diálogo do Windows. Botões seguem no fluxo normal do conteúdo.

### Navigation
- Barra inferior flutuante em pílula, item ativo expandido com rótulo em tinta preta (`bg-foreground text-background`), inativos como ícone só; FAB circular de ação rápida em Ink, elevado acima da pílula.

## 6. Do's and Don'ts

### Do:
- **Do** manter cor **só nos elementos de dado**: anéis, arcos, chips de categoria, barras de macro.
- **Do** abrir cada tela de área com um anel-herói na cor do domínio.
- **Do** puxar cor e emoji de domínio sempre de `lib/domains.ts` — fonte única.
- **Do** usar tinta preta em todo botão, texto, nav ativo e FAB.
- **Do** usar os componentes padrão: `Section`, `StatTile`, `MetricBar`, `Ring`, `EmptyState`.
- **Do** dar sombra suave a todo card; `rounded-3xl` + `p-6` nos cards-herói, `rounded-2xl` nas listas.
- **Do** manter Geist Mono para números isolados.
- **Do** tratar dark mode como tema de primeira classe (as cores de domínio têm variante clareada no `.dark`).

### Don't:
- **Don't** colorir botão, texto ou preenchimento de card — cor é dado, não decoração nem ênfase.
- **Don't** improvisar um tom novo ou reusar a cor de um domínio em outro — uma cor por domínio.
- **Don't** usar emoji como decoração de frase corrida — só como ícone de categoria/chip.
- **Don't** usar `border-left`/`border-right` coloridos como acento decorativo.
- **Don't** usar hero-metric com gradiente, grades de cards idênticos, ou eyebrows numerados (01/02/03).
- **Don't** aninhar Card dentro de Card — use um container com `divide-y`.
- **Don't** deixar uma tela ou lista vazia mostrar só uma linha de texto cinza — use `EmptyState`.
