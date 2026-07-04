export type Unidade = "g" | "ml" | "unidade" | "lata" | "colher";

export type Food = {
  id: string;
  nome: string;
  unidade: Unidade;
  base_qtd: number;
  kcal: number;
  proteina_g: number;
  carbo_g: number;
  gordura_g: number;
  ativo: boolean;
};

export type Refeicao = "cafe" | "almoco" | "jantar" | "lanche";

export type MealLog = {
  id: string;
  data: string;
  refeicao: Refeicao;
  criado_em: string;
};

export type MealItem = {
  id: string;
  meal_log_id: string;
  food_id: string;
  quantidade: number;
  kcal_calc: number;
  prot_calc: number;
  carbo_calc: number;
  gord_calc: number;
};

export type MealItemWithFood = MealItem & { food: Food };
export type MealLogWithItems = MealLog & { items: MealItemWithFood[] };

export type Recipe = {
  id: string;
  nome: string;
  ativo: boolean;
};

export type RecipeItem = {
  id: string;
  recipe_id: string;
  food_id: string;
  quantidade: number;
};

export type RecipeItemWithFood = RecipeItem & { food: Food };
export type RecipeWithItems = Recipe & { items: RecipeItemWithFood[] };

export type WorkoutPlan = {
  id: string;
  nome: string;
  ativo: boolean;
};

export const DIAS_SEMANA = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
] as const;
export type DiaSemana = (typeof DIAS_SEMANA)[number];

export type PlanDay = {
  id: string;
  plan_id: string;
  dia: string;
  nome: string | null;
};

export type PlanExercise = {
  id: string;
  plan_day_id: string;
  nome: string;
  series_alvo: number | null;
  reps_alvo: string | null;
  carga_alvo: number | null;
  ordem: number | null;
  obs: string | null;
};

export type PlanDayWithExercises = PlanDay & { exercises: PlanExercise[] };
export type PlanWithDays = WorkoutPlan & { days: PlanDayWithExercises[] };

export type WorkoutSession = {
  id: string;
  data: string;
  plan_day_id: string;
  concluido: boolean;
  notas: string | null;
};

export type SessionSet = {
  id: string;
  session_id: string;
  plan_exercise_id: string | null;
  nome_exercicio: string | null;
  serie_num: number | null;
  carga: number | null;
  reps: number | null;
  concluido: boolean;
};

export type SleepLog = {
  id: string;
  data: string;
  hora_dormir: string | null;
  hora_acordar: string | null;
  vezes_acordou: number;
  dormiu_bem: boolean | null;
  tipo_sono: "leve" | "pesado" | null;
  disposicao: number | null;
  notas: string | null;
  criado_em: string;
};

export type Medication = {
  id: string;
  nome: string;
  dose: string | null;
  horarios: string[];
  ativo: boolean;
};

export type MedLog = {
  id: string;
  medication_id: string;
  data: string;
  horario_previsto: string;
  datahora_marcado: string;
  tomado_no_horario: boolean | null;
  observacao: string | null;
};

export type MedicationSlot = {
  medication: Medication;
  horario_previsto: string;
  log: MedLog | null;
};

export type DailyGoal = {
  id: string;
  kcal_meta: number;
  proteina_meta: number;
  atualizado_em: string;
};

export type BodyWeightLog = {
  id: string;
  data: string;
  peso_kg: number;
  criado_em: string;
};

export type DailyInsight = {
  id: string;
  data: string;
  score: number;
  frase: string;
  criado_em: string;
};
