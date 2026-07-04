import { createClient } from "@/lib/supabase/server";
import { todayISO, todayDiaSemana } from "@/lib/date";
import {
  listFoods,
  getOrCreateMealLog,
  addFoodToMealLog,
  bulkCreateFoods,
} from "@/lib/food";
import { upsertSleepLogDirect } from "@/lib/sleep";
import { registerMedicationTakenByName } from "@/lib/medication";
import {
  findActivePlanDayForToday,
  getSessionByDate,
  startSession,
  logSessionSetByExerciseName,
} from "@/lib/workout";
import type { Food, Unidade } from "@/lib/types";

export const AGENT_TOOLS = [
  {
    name: "registrar_sono",
    description:
      "Registra (ou atualiza, se já existir) o sono de uma data. Use quando o usuário descrever como dormiu.",
    input_schema: {
      type: "object",
      properties: {
        data: { type: "string", description: "Data YYYY-MM-DD, padrão hoje" },
        hora_dormir: { type: "string", description: "HH:MM" },
        hora_acordar: { type: "string", description: "HH:MM" },
        vezes_acordou: { type: "integer" },
        dormiu_bem: { type: "boolean" },
        tipo_sono: { type: "string", enum: ["leve", "pesado"] },
        disposicao: { type: "integer", description: "1 a 5" },
      },
      required: ["hora_dormir", "hora_acordar", "dormiu_bem", "tipo_sono", "disposicao"],
    },
  },
  {
    name: "registrar_refeicao",
    description:
      "Registra uma refeição com um ou mais itens. Para cada item, se ele existir no catálogo (veja a lista no contexto), informe food_id exato. Se não existir, deixe food_id vazio e informe nome + estimativa de kcal/macros (o item será cadastrado automaticamente no catálogo como estimativa).",
    input_schema: {
      type: "object",
      properties: {
        data: { type: "string", description: "Data YYYY-MM-DD, padrão hoje" },
        refeicao: { type: "string", enum: ["cafe", "almoco", "jantar", "lanche"] },
        itens: {
          type: "array",
          items: {
            type: "object",
            properties: {
              food_id: { type: "string", description: "ID do catálogo, se existir" },
              nome: { type: "string" },
              quantidade: { type: "number" },
              unidade: { type: "string", enum: ["g", "ml", "unidade", "lata", "colher"] },
              kcal_estimado: { type: "number" },
              proteina_estimada: { type: "number" },
              carbo_estimado: { type: "number" },
              gordura_estimada: { type: "number" },
            },
            required: ["nome", "quantidade"],
          },
        },
      },
      required: ["refeicao", "itens"],
    },
  },
  {
    name: "cadastrar_alimento",
    description: "Cadastra um alimento novo diretamente no catálogo.",
    input_schema: {
      type: "object",
      properties: {
        nome: { type: "string" },
        unidade: { type: "string", enum: ["g", "ml", "unidade", "lata", "colher"] },
        base_qtd: { type: "number" },
        kcal: { type: "number" },
        proteina_g: { type: "number" },
        carbo_g: { type: "number" },
        gordura_g: { type: "number" },
      },
      required: ["nome", "unidade", "base_qtd", "kcal"],
    },
  },
  {
    name: "registrar_medicacao_tomada",
    description:
      "Marca uma dose de medicamento como tomada. Aplica automaticamente a janela de ±90min (no horário vs atrasado).",
    input_schema: {
      type: "object",
      properties: {
        medicamento: { type: "string", description: "Nome do medicamento" },
        data: { type: "string", description: "Data YYYY-MM-DD, padrão hoje" },
        horario: {
          type: "string",
          description: "HH:MM do horário previsto mais próximo, se souber",
        },
      },
      required: ["medicamento"],
    },
  },
  {
    name: "iniciar_treino_hoje",
    description:
      "Inicia a sessão de treino do plano programado para hoje (se houver e ainda não tiver sido iniciada).",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "registrar_serie_treino",
    description:
      "Registra uma série concluída de um exercício (carga e reps reais). Cria a sessão do dia automaticamente se ainda não existir.",
    input_schema: {
      type: "object",
      properties: {
        exercicio: { type: "string" },
        carga: { type: "number" },
        reps: { type: "integer" },
        data: { type: "string", description: "Data YYYY-MM-DD, padrão hoje" },
      },
      required: ["exercicio", "carga", "reps"],
    },
  },
];

type ToolInput = Record<string, unknown>;

export async function executeTool(name: string, input: ToolInput): Promise<string> {
  switch (name) {
    case "registrar_sono":
      return handleRegistrarSono(input);
    case "registrar_refeicao":
      return handleRegistrarRefeicao(input);
    case "cadastrar_alimento":
      return handleCadastrarAlimento(input);
    case "registrar_medicacao_tomada":
      return handleRegistrarMedicacao(input);
    case "iniciar_treino_hoje":
      return handleIniciarTreino();
    case "registrar_serie_treino":
      return handleRegistrarSerie(input);
    default:
      return `Ferramenta desconhecida: ${name}`;
  }
}

async function handleRegistrarSono(input: ToolInput): Promise<string> {
  const data = (input.data as string) || todayISO();
  const log = await upsertSleepLogDirect({
    data,
    hora_dormir: input.hora_dormir as string,
    hora_acordar: input.hora_acordar as string,
    vezes_acordou: (input.vezes_acordou as number) ?? 0,
    dormiu_bem: input.dormiu_bem as boolean,
    tipo_sono: input.tipo_sono as "leve" | "pesado",
    disposicao: input.disposicao as number,
  });
  return `Sono de ${data} registrado: dormiu ${log.hora_dormir?.slice(0, 5)}, acordou ${log.hora_acordar?.slice(0, 5)}, disposição ${log.disposicao}/5.`;
}

type RefeicaoItemInput = {
  food_id?: string;
  nome: string;
  quantidade: number;
  unidade?: Unidade;
  kcal_estimado?: number;
  proteina_estimada?: number;
  carbo_estimado?: number;
  gordura_estimada?: number;
};

async function handleRegistrarRefeicao(input: ToolInput): Promise<string> {
  const data = (input.data as string) || todayISO();
  const refeicao = input.refeicao as "cafe" | "almoco" | "jantar" | "lanche";
  const itens = input.itens as RefeicaoItemInput[];

  const catalog = await listFoods();
  const catalogById = new Map(catalog.map((f) => [f.id, f]));
  const catalogByName = new Map(catalog.map((f) => [f.nome.toLowerCase(), f]));

  const mealLogId = await getOrCreateMealLog(data, refeicao);
  const linhas: string[] = [];
  let totalKcal = 0;
  let totalProt = 0;

  for (const item of itens) {
    let food: Food | undefined = item.food_id ? catalogById.get(item.food_id) : undefined;
    if (!food) food = catalogByName.get(item.nome.toLowerCase());

    let novo = false;
    if (!food) {
      const [created] = await bulkCreateFoods([
        {
          nome: item.nome,
          unidade: item.unidade ?? "g",
          base_qtd: item.quantidade,
          kcal: item.kcal_estimado ?? 0,
          proteina_g: item.proteina_estimada ?? 0,
          carbo_g: item.carbo_estimado ?? 0,
          gordura_g: item.gordura_estimada ?? 0,
        },
      ]);
      food = created;
      novo = true;
    }

    await addFoodToMealLog(mealLogId, food.id, item.quantidade);
    const fator = item.quantidade / food.base_qtd;
    totalKcal += fator * food.kcal;
    totalProt += fator * food.proteina_g;
    linhas.push(
      `${food.nome} ${item.quantidade}${food.unidade} (${Math.round(fator * food.kcal)} kcal)` +
        (novo ? " — novo no catálogo, valores estimados pela IA, confira em Alimentação > Catálogo" : ""),
    );
  }

  return `Refeição "${refeicao}" de ${data} registrada:\n${linhas.join("\n")}\nTotal: ${Math.round(totalKcal)} kcal, ${Math.round(totalProt)}g proteína.`;
}

async function handleCadastrarAlimento(input: ToolInput): Promise<string> {
  const [created] = await bulkCreateFoods([
    {
      nome: input.nome as string,
      unidade: input.unidade as Unidade,
      base_qtd: input.base_qtd as number,
      kcal: input.kcal as number,
      proteina_g: (input.proteina_g as number) ?? 0,
      carbo_g: (input.carbo_g as number) ?? 0,
      gordura_g: (input.gordura_g as number) ?? 0,
    },
  ]);
  return `Alimento "${created.nome}" cadastrado no catálogo (${created.base_qtd}${created.unidade} = ${created.kcal}kcal, ${created.proteina_g}g proteína).`;
}

async function handleRegistrarMedicacao(input: ToolInput): Promise<string> {
  const data = (input.data as string) || todayISO();
  return registerMedicationTakenByName(
    input.medicamento as string,
    data,
    input.horario as string | undefined,
  );
}

async function handleIniciarTreino(): Promise<string> {
  const data = todayISO();
  const existing = await getSessionByDate(data);
  if (existing) return "O treino de hoje já foi iniciado.";

  const planDay = await findActivePlanDayForToday(todayDiaSemana());
  if (!planDay) return "Não há treino programado para hoje.";

  await startSession(data, planDay.id, planDay.exercises);
  const nomes = planDay.exercises.map((e) => e.nome).join(", ");
  return `Treino "${planDay.nome ?? "de hoje"}" iniciado com os exercícios: ${nomes}.`;
}

async function handleRegistrarSerie(input: ToolInput): Promise<string> {
  const data = (input.data as string) || todayISO();
  return logSessionSetByExerciseName(
    input.exercicio as string,
    input.carga as number,
    input.reps as number,
    data,
  );
}

export async function buildAgentCatalogContext(): Promise<string> {
  const supabase = await createClient();
  const [{ data: foods }, { data: meds }] = await Promise.all([
    supabase.from("foods").select("id, nome, base_qtd, unidade").eq("ativo", true).order("nome"),
    supabase.from("medications").select("nome, horarios").eq("ativo", true),
  ]);

  const foodsList = (foods ?? [])
    .map((f) => `- id=${f.id} | ${f.nome} (base: ${f.base_qtd}${f.unidade})`)
    .join("\n");
  const medsList = (meds ?? [])
    .map((m) => `- ${m.nome} (horários: ${(m.horarios as string[]).join(", ")})`)
    .join("\n");

  return (
    `## Catálogo de alimentos disponível\n${foodsList || "Nenhum alimento cadastrado."}\n\n` +
    `## Medicamentos ativos\n${medsList || "Nenhum medicamento cadastrado."}`
  );
}
