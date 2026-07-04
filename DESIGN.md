---
name: Rotina & Saúde
description: Painel pessoal de saúde em escala de cinza, silencioso por design
colors:
  primary: "oklch(0.145 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  bg: "oklch(0.97 0 0)"
  surface: "oklch(1 0 0)"
  hairline: "oklch(0.90 0 0)"
  muted: "oklch(0.50 0 0)"
typography:
  display:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
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
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: Rotina & Saúde

## 1. Overview

**Creative North Star: "O Instrumento Silencioso"**

Rotina & Saúde não decora dados, ele os apresenta. A referência é o app do Oura Ring: uma escala de cinza pura do branco ao preto, sem cor de marca, onde a única hierarquia visível vem de peso tipográfico, espaçamento e contornos finos. Isso não é indecisão de paleta — é a decisão. Um único usuário revisa os próprios números várias vezes ao dia; qualquer cor que não seja funcional é ruído competindo com o dado.

O sistema rejeita explicitamente o clichê de "app de dieta": nada de paleta pastel, ilustrações fofas, emojis decorativos, cards coloridos por categoria ou badges de conquista brilhantes. Rejeita também o clichê SaaS: sem hero-metric com gradiente, sem cards idênticos em grade, sem eyebrows numerados. Onde antes o tema shadcn "neutral" era um ponto de partida genérico, aqui a neutralidade é o produto final, tratada com a mesma curadoria que outro sistema daria à cor.

Densidade é alta mas nunca apertada: `text-sm` e `text-xs` dominam porque o usuário já sabe o que está olhando — não precisa de títulos gigantes explicando o óbvio. Light e dark mode recebem o mesmo nível de cuidado, já que o app é usado tanto de manhã quanto à noite (academia, cozinha, cama).

**Key Characteristics:**
- Zero cor de marca. Toda hierarquia vem de peso, tamanho, espaçamento e opacidade de preto/branco.
- Bordas finas (hairline, 1px) substituem sombra como principal sinal de separação entre superfícies.
- Dois planos de fundo por tema (canvas + superfície) — nunca um único branco chapado atrás de cards brancos.
- Tipografia Geist Sans para tudo, Geist Mono reservado para leituras numéricas (peso, séries, horas de sono).

## 2. Colors

Uma escala de cinza pura (chroma 0) do fog ao grafite. Não existe "primário" no sentido de marca — o papel de destaque é ocupado pelo próprio preto/branco em contraste máximo.

### Primary
- **Grafite** (`oklch(0.145 0 0)`): o único "acento" do sistema. Usado em botões primários, estado ativo de abas, foco de input, texto de maior ênfase. Em modo claro é quase preto; em modo escuro inverte para quase branco (ver Dark Mode Equivalents).

### Neutral
- **Fog** (`oklch(0.97 0 0)`): fundo de canvas (`body`, área por trás dos cards). Off-white, nunca branco puro — é o que separa o canvas da superfície sem precisar de sombra.
- **Paper** (`oklch(1 0 0)`): superfície de cards, dialogs, popovers. Branco puro, sempre um degrau acima do Fog.
- **Hairline** (`oklch(0.90 0 0)`): bordas e divisores. Fino (1px), nunca mais espesso — é a linha, não o preenchimento, que separa blocos de conteúdo.
- **Cinza-médio** (`oklch(0.50 0 0)`): texto secundário, labels, ícones inativos. Contraste ≥4.5:1 contra Fog e Paper.

### Named Rules
**A Regra do Zero Acento.** Nenhuma cor de marca em nenhum lugar da interface — nem em estados de erro, sucesso ou alerta. Diferenças de estado se comunicam por peso tipográfico, ícone, sublinhado ou variação de opacidade do grafite, nunca por matiz. Se uma tela parece precisar de vermelho para "funcionar", o problema é de hierarquia ou copy, não de paleta.

**A Regra dos Dois Planos.** Nunca um branco puro atrás de um branco puro. Canvas (Fog) e superfície (Paper) são sempre dois degraus de cinza distintos, mesmo que sutis — é isso que substitui a sombra como sinal de profundidade.

### Dark Mode Equivalents

Dark mode não é um inverso automático — é curado com o mesmo peso do claro:
- **Canvas** (`oklch(0.09 0 0)`): substitui Fog. Quase preto, chroma 0.
- **Superfície** (`oklch(0.16 0 0)`): substitui Paper. Um degrau acima do canvas.
- **Hairline** (`oklch(1 0 0 / 10%)`): borda translúcida em vez de cinza sólido — em fundo escuro, opacidade lê melhor que um novo tom de cinza.
- **Grafite invertido** (`oklch(0.96 0 0)`): substitui o "primary" — pílulas e botões primários ficam quase brancos com texto quase preto (`oklch(0.09 0 0)`).
- **Cinza-médio** (`oklch(0.65 0 0)`): texto secundário, mesma função do claro.

## 3. Typography

**Display/Body Font:** Geist (com fallback `system-ui, sans-serif`)
**Data Font:** Geist Mono (com fallback `ui-monospace, monospace`)

**Character:** Uma única família sem serifa carrega toda a hierarquia — o contraste vem de peso e tamanho, não de troca de tipo. Geist Mono é reservado para leituras numéricas isoladas (peso de uma série, horas de sono, dose de medicação): o monoespaçado sinaliza "isto é um dado medido", diferenciando-o de rótulo ou prosa sem precisar de cor.

### Hierarchy
- **Display** (600, 1.5rem/24px, 1.2, -0.01em): título de tela (ex: "Hoje", nome do plano de treino). Usado uma vez por tela, no topo.
- **Title** (600, 1rem/16px, 1.3): título de card ou seção (ex: nome do exercício, nome da refeição).
- **Body** (400, 0.875rem/14px, 1.5): texto corrido, descrições, itens de lista — a maior parte da interface vive aqui.
- **Label** (500, 0.75rem/12px, 1.4, 0.01em): rótulos de campo, tabs, badges. Sentence case, nunca uppercase decorativo.
- **Data** (500, 0.875rem/14px, mono, -0.01em): valores numéricos isolados (kg, min, mg, horas) que o usuário escaneia rapidamente.

### Named Rules
**A Regra do Peso, Não da Cor.** Ênfase se constrói subindo de 400 para 600 e de `text-xs` para `text-sm`/`text-base` — nunca introduzindo uma cor nova para "destacar" algo.

## 4. Elevation

Sistema flat por padrão. Cards não têm sombra — a separação vem do contraste Fog/Paper (Regra dos Dois Planos) e de uma borda hairline de 1px (`ring-1 ring-foreground/10` hoje; migrar para `border border-hairline` explícito). Overlays (dialog, popover, select) são a única exceção: recebem uma sombra difusa e leve para reforçar que estão flutuando sobre o conteúdo, já que ali não há um segundo plano de fundo para criar contraste.

### Shadow Vocabulary
- **overlay** (`box-shadow: 0 8px 24px -8px oklch(0 0 0 / 12%)`): dialogs, popovers, dropdowns. A única sombra do sistema.

### Named Rules
**A Regra do Flat-Por-Padrão.** Sombra é exceção, não hábito. Ela só aparece quando um elemento literalmente se sobrepõe a outro conteúdo (overlay); cards, listas e seções no fluxo normal usam apenas hairline + Fog/Paper.

## 5. Components

### Buttons
- **Shape:** cantos suaves (`rounded-md`, 0.5rem).
- **Primary:** fundo Grafite, texto Fog (`primary` → `primary-foreground`), padding 6px 14px. É o único elemento "cheio" da interface — reservado para a ação principal de cada tela.
- **Outline/Ghost:** fundo Paper ou transparente, borda hairline, texto Grafite. É o padrão para a maioria das ações (secundárias, cancelar, ações de linha).
- **Hover / Focus:** hover escurece levemente (`/80` de opacidade); foco usa ring de 3px em `hairline` — nunca cor.

### Chips / Badges
- **Style:** fundo `muted` (cinza claro) com texto Grafite, cantos totalmente arredondados (`rounded-full`). Sem variantes coloridas por categoria — status se lê pelo texto, não pela cor do chip.

### Cards / Containers
- **Corner Style:** `rounded-xl` (0.875rem).
- **Background:** sempre Paper, nunca Fog (Regra dos Dois Planos).
- **Shadow Strategy:** nenhuma; ver Elevation. Separação vem da borda hairline.
- **Border:** 1px hairline, sempre visível (não só no hover).
- **Internal Padding:** 16px (`spacing.md`); cards compactos usam 12px.

### Inputs / Fields
- **Style:** borda hairline, fundo transparente sobre Paper, `rounded-md`.
- **Focus:** borda muda para Grafite + ring de 3px em `hairline` — sem cor de destaque.
- **Error / Disabled:** erro se comunica por texto abaixo do campo e peso 600, não por borda vermelha (Regra do Zero Acento); disabled reduz opacidade para 50%.

### Navigation (Tabs)
- **Style:** lista de tabs com fundo `muted`, tab ativa ganha fundo Paper + texto Grafite; inativas ficam em texto `muted-foreground`. Sem sublinhado colorido, sem indicador animado com cor de marca.

## 6. Do's and Don'ts

### Do:
- **Do** usar peso tipográfico (400→600) e tamanho para criar hierarquia, nunca cor.
- **Do** manter dois planos de cinza distintos entre canvas e superfície (Fog/Paper claro, Canvas/Superfície escuro).
- **Do** usar Geist Mono só para valores numéricos isolados (peso, horas, dose) — não para rótulos ou prosa.
- **Do** tratar dark mode como tema de primeira classe, com seus próprios valores curados (não um filtro invertido).
- **Do** usar bordas hairline de 1px como principal sinal de separação entre blocos.

### Don't:
- **Don't** introduzir cor de marca em nenhum estado, incluindo erro, sucesso ou alerta (Regra do Zero Acento).
- **Don't** usar paleta pastel, ilustrações fofas, emojis decorativos ou badges de conquista brilhantes — isso é clichê de "app de dieta" que o produto rejeita explicitamente.
- **Don't** aplicar sombra em cards ou listas no fluxo normal — sombra é reservada a overlays (Regra do Flat-Por-Padrão).
- **Don't** usar `border-left`/`border-right` coloridos como acento decorativo em cards ou listas.
- **Don't** usar hero-metric com gradiente, grades de cards idênticos, ou eyebrows numerados (01/02/03) — clichês de dashboard SaaS.
- **Don't** colocar branco puro atrás de branco puro; sempre diferenciar canvas de superfície.
