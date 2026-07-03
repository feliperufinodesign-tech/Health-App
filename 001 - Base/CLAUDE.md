# CLAUDE.md — App de Rotina & Saúde (uso pessoal)

Este arquivo é a referência que você (Claude Code) deve ler em toda sessão. Ele define o que o app é, a stack, as regras que não mudam e a ordem de construção. Siga-o. Quando algo aqui conflitar com um pedido meu, aponte o conflito antes de agir.

## O que o app faz

App web de uso individual para gerir minha rotina e saúde, atualizado diariamente. Módulos: sono, alimentação (com contador de calorias), treino (com progressão), medicação, e um assistente de IA com contexto de todos os meus dados que gera orientações e relatórios periódicos.

Sem integração com APIs externas de wearables nesta versão.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Postgres, Auth, Storage)
- API Anthropic (Claude) para: interpretar registro rápido de refeição, chat com contexto, e gerar relatórios/insights
- Recharts para gráficos
- Deploy na Vercel

## Regras inegociáveis

1. **Calorias vêm de um catálogo, não de estimativa de IA.** Cada alimento é cadastrado uma vez com kcal/macros por unidade. O total do dia é calculado a partir do catálogo. A IA só interpreta a entrada rápida ("macarrão 100g, coca lata") e casa com itens do catálogo. Quando um item não existe no catálogo, ofereça cadastrar na hora; estimativa por IA é exceção, sempre marcada como estimativa e editável.

2. **Medicação usa janela de horário.** Ao marcar "tomei", compare a hora atual com o horário previsto do dia mais próximo ainda não registrado. Dentro de ±90 min: grava como no horário, sem perguntar. Fora da janela: oferece dois botões — "tomei no horário previsto (esqueci de marcar)" e "tomei agora". Guarde horário previsto e horário real separados.

3. **Sono é um formulário na primeira abertura do dia**, se ainda não preenchido: hora que dormiu, hora que acordou, quantas vezes acordou, dormiu bem, sono leve/pesado, disposição ao acordar (1–5).

4. **A IA nunca diagnostica.** Organiza, resume e sinaliza; não conclui doença nem prescreve. Dado bruto (foto original, texto de entrada) é sempre preservado.

5. **Segredos só no servidor.** A chave da API Anthropic é lida de variável de ambiente (`.env.local`, no `.gitignore`), usada apenas em route handlers do lado do servidor. Nunca embutir chave no código, nunca expor no cliente, nunca commitar `.env.local`.

6. **Notificação de remédio é "melhor esforço".** Não construa o app assumindo que o push é confiável. O foco é registrar aderência; o lembrete de verdade fica fora do app (alarme/calendário nativo).

## Método de trabalho

- Construir por fases (ver abaixo). Não adiantar fases futuras sem eu pedir.
- Antes de codar uma fase, mostrar um plano curto de arquivos/componentes e esperar meu OK.
- Ao terminar uma fase, dizer como testá-la.
- Preferir o MCP do Supabase para ler schema e rodar queries, em vez de adivinhar a estrutura do banco.
- Buscar documentação atual de Next.js 15, SDK Anthropic e Supabase quando houver dúvida de API; não confiar em memória para versões recentes.

## Convenções de código

- TypeScript estrito. Sem `any` desnecessário.
- Chamadas à Anthropic sempre em route handlers (`app/api/.../route.ts`), nunca no cliente.
- Componentes de UI em `components/`, lógica de dados em `lib/`.
- Datas e horários no timezone local do usuário; guardar `date`/`time`/`timestamptz` conforme o schema.
- Nomes de tabelas e colunas conforme o schema definido em `db/schema.sql`.

## Modelo de dados

O schema completo está em `db/schema.sql`. Núcleo: `foods` + `meal_logs` + `meal_items` (alimentação por catálogo); `workout_plans` + `plan_days` + `plan_exercises` + `workout_sessions` + `session_sets` (treino com plano e execução); `sleep_logs`; `medications` + `med_logs`; `ai_reports` + `ai_messages`.

## Fases

- **Fase 0 — Fundação:** projeto Next + Supabase conectado, Auth com login único, schema aplicado, navegação base, tela "Hoje" vazia.
- **Fase 1 — Registro manual + Hoje:** catálogo de alimentos e registro de refeição escolhendo do catálogo + quantidade (cálculo determinístico); sono (formulário na abertura); medicação com a lógica de janela; plano de treino e execução com check de séries (carga/reps reais). Dashboard "Hoje" agregando tudo.
- **Fase 2 — Registro rápido por IA:** interpretar texto/áudio de refeição e casar com o catálogo; foto da balança para capturar o peso.
- **Fase 3 — Assistente:** chat com contexto dos dados recentes (route handler no servidor).
- **Fase 4 — Relatórios/insights:** relatório semanal respondendo às perguntas fixas + gráficos de progressão do treino.

## Perguntas que os relatórios devem responder

- Progredi de carga/volume nos principais exercícios?
- Minha disposição ao acordar acompanhou as noites que dormi bem?
- Qual foi a aderência à medicação (no horário x atrasado)?
- Bati minha meta de calorias e de proteína, e em quantos dias?

## Comece pela Fase 0

Mostre o plano de arquivos, espere meu OK, então implemente. Peça o conteúdo de `db/schema.sql` quando for aplicá-lo.
