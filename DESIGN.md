---
name: Rotina & Saúde
description: Painel pessoal de saúde, neutro e caloroso, com um pulso de cor
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
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
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

**Creative North Star: "Sinal Vital"**

Rotina & Saúde é um painel pessoal, não um formulário burocrático. A base continua sendo a mesma disciplina de antes — neutro, denso, sem ruído — mas agora com um pulso: um único laranja quente que marca o que está vivo agora (a ação de hoje, o progresso, a conclusão), sobre um canvas off-white macio e cartões brancos com sombra suave, no espírito de apps como o de leitura por hábito ou o Iconly: cordial sem infantilizar, denso sem parecer burocrático.

O sistema ainda rejeita o clichê de "app de dieta" raso (paleta pastel aleatória, cards idênticos, gamificação vazia), mas não rejeita mais cor ou emoji por princípio — eles voltam como sinal, não decoração: o laranja marca o que é acionável e vivo; o emoji, quando usado, substitui um ícone de linha para dar identidade a uma categoria (sono, treino, alimentação, medicação), nunca decora frases soltas.

Densidade continua alta (`text-sm`/`text-xs` predominam), mas a superfície ganha elevação real: sombra suave e ambiente em todos os cards (não só em overlays), tiras de navegação horizontais, controles segmentados em pílula, e uma navegação inferior flutuante com ação rápida (FAB). Light e dark mode continuam recebendo o mesmo cuidado.

**Key Characteristics:**
- Um único acento: laranja quente (`primary`), usado com moderação — ação primária, indicador ativo, progresso, "hoje".
- Canvas off-white morno (não branco puro), cartões brancos com sombra suave — nunca mais flat-por-padrão.
- Emoji como ícone de categoria (sono, treino, alimentação, medicação), nunca como decoração de frase.
- Navegação inferior flutuante em pílula com um FAB de ação rápida.
- Geist Mono reservado para leituras numéricas.

## 2. Colors

Um canvas neutro e morno carrega a base; o laranja é usado com intenção, nunca como preenchimento generalizado.

### Primary
- **Laranja Vital** (`oklch(0.65 0.19 45)`): a única cor de destaque do sistema. Botão primário, dia ativo na tira de datas, FAB, indicador de progresso/streak, checkbox concluído. Texto sempre branco sobre ele (contraste e leitura perceptual).

### Neutral
- **Fog Morno** (`oklch(0.97 0.008 70)`): fundo de canvas. Off-white com leve calor, nunca branco puro.
- **Paper** (`oklch(1 0 0)`): superfície de cards, dialogs, popovers, sempre com sombra suave por cima do Fog.
- **Hairline** (`oklch(0.9 0.006 70)`): bordas onde a sombra sozinha não basta (divisores de lista, inputs).
- **Ink** (`oklch(0.16 0 0)`): texto primário, sempre acromático — o calor mora no fundo e no acento, não no texto.
- **Muted** (`oklch(0.52 0.005 70)`): texto secundário, labels, ícones inativos.

### Named Rules
**A Regra do Pulso Único.** Uma cor, usada com intenção: o laranja aparece em no máximo ~15% de qualquer tela — ação primária, "hoje", progresso. Fora disso, hierarquia continua vindo de peso e espaçamento.

**A Regra dos Dois Planos.** Canvas (Fog Morno) e superfície (Paper) continuam sendo dois degraus distintos; agora a separação é reforçada por sombra suave, não só por contraste de cinza.

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
- **Primary:** fundo Laranja Vital, texto branco. Reservado pra a ação principal de cada tela e pro FAB.
- **Outline/Ghost:** fundo Paper ou transparente, texto Ink.

### Chips / Badges
- **Style:** fundo `muted`, texto Ink, `rounded-full`. Badges de progresso/streak usam o laranja.

### Cards / Containers
- **Corner Style:** `rounded-2xl` (1.125rem) nos cards principais.
- **Background:** sempre Paper.
- **Shadow Strategy:** sombra suave por padrão (ver Elevation).
- **Internal Padding:** 16-20px.

### Day Strip
- Tira horizontal com os dias da semana, dia atual destacado com o laranja. Contexto visual, não decoração — reforça "hoje" como o pulso da tela.

### Segmented Control
- Pílula com fundo `muted`, opção ativa em Paper com sombra sutil ou preenchida em Ink/Laranja conforme o contexto. Usado para filtrar estado (a fazer / concluído).

### Navigation
- Barra inferior flutuante em pílula (não fixa borda-a-borda), com os itens principais e um FAB circular de ação rápida em Laranja Vital, levemente elevado acima da pílula.

## 6. Do's and Don'ts

### Do:
- **Do** usar o laranja com intenção: ação primária, "hoje", progresso — nunca como preenchimento de fundo.
- **Do** dar sombra suave a todo card em repouso; hairline só reforça divisores pontuais.
- **Do** usar emoji como ícone de categoria (sono, treino, alimentação, medicação), sempre no mesmo tamanho e posição.
- **Do** manter Geist Mono para números isolados.
- **Do** tratar dark mode como tema de primeira classe.

### Don't:
- **Don't** espalhar o laranja por mais de ~15% de uma tela.
- **Don't** usar emoji como decoração de frase corrida — só como ícone de categoria.
- **Don't** usar paleta pastel aleatória, ilustrações fofas ou badges de conquista brilhantes tipo app de dieta genérico.
- **Don't** usar `border-left`/`border-right` coloridos como acento decorativo.
- **Don't** usar hero-metric com gradiente, grades de cards idênticos, ou eyebrows numerados (01/02/03).
- **Don't** colocar branco puro atrás de branco puro sem sombra os separando.
