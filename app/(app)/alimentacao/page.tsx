import { getMealLogsWithItems, getDayTotals } from "@/lib/food";
import { listRecipesWithItems } from "@/lib/recipes";
import { todayISO } from "@/lib/date";
import type { MealLogWithItems, RecipeWithItems, Refeicao } from "@/lib/types";
import { CalendarStrip } from "@/components/figma-home/calendar-strip";
import { CaloriesCard } from "@/components/figma-home/calories-card";
import { MacroCard } from "@/components/figma-home/macro-card";
import { DietMeals, type DietMeal, type DietRecipe } from "@/components/figma-home/diet-meals";
import { BottomNav } from "@/components/figma-home/bottom-nav";
import type { RegisteredMeal } from "@/components/figma-home/registered-meal-sheet";

const REFEICOES: { key: Refeicao; label: string }[] = [
  { key: "cafe", label: "Café da Manhã" },
  { key: "almoco", label: "Almoço" },
  { key: "lanche", label: "Lanche" },
  { key: "jantar", label: "Jantar" },
];

const r = (n: number) => Math.round(n);

function foodIcon(name: string): string {
  const n = name.toLowerCase();
  if (/banana/.test(n)) return "/figma-home/food_banana.svg";
  if (/leite|milk|iogurte|whey/.test(n)) return "/figma-home/food_milk.svg";
  if (/aveia|granola|p[ãa]o|arroz|cereal/.test(n)) return "/figma-home/food_bag.svg";
  if (/pasta|amendoim|castanha|[óo]leo|manteiga|shake/.test(n)) return "/figma-home/food_glass.svg";
  return "/figma-home/food_bag.svg";
}

function short(name: string): string {
  return name.trim().split(/\s+/)[0].slice(0, 5).toUpperCase();
}

function timeOf(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h`;
}

function toDetail(name: string, time: string, log: MealLogWithItems): RegisteredMeal {
  let kcal = 0, p = 0, c = 0, g = 0;
  for (const it of log.items) {
    kcal += it.kcal_calc;
    p += it.prot_calc;
    c += it.carbo_calc;
    g += it.gord_calc;
  }
  return {
    name,
    time,
    kcal: r(kcal),
    macros: { protein: `${r(p)}g`, carb: `${r(c)}g`, fat: `${r(g)}g` },
    foods: log.items.map((it) => ({
      icon: foodIcon(it.food.nome),
      name: `${r(it.quantidade)}${it.food.unidade} ${it.food.nome}`,
      protein: `${r(it.prot_calc)}g`,
      carb: `${r(it.carbo_calc)}g`,
      fat: `${r(it.gord_calc)}g`,
      kcal: r(it.kcal_calc),
    })),
  };
}

function recipeDetail(recipe: RecipeWithItems): RegisteredMeal {
  let kcal = 0, p = 0, c = 0, g = 0;
  const foods = recipe.items.map((it) => {
    const factor = it.quantidade / (it.food.base_qtd || 1);
    const ik = it.food.kcal * factor;
    const ip = it.food.proteina_g * factor;
    const ic = it.food.carbo_g * factor;
    const ig = it.food.gordura_g * factor;
    kcal += ik; p += ip; c += ic; g += ig;
    return {
      icon: foodIcon(it.food.nome),
      name: `${r(it.quantidade)}${it.food.unidade} ${it.food.nome}`,
      protein: `${r(ip)}g`,
      carb: `${r(ic)}g`,
      fat: `${r(ig)}g`,
      kcal: r(ik),
    };
  });
  return {
    name: recipe.nome,
    time: "receita",
    kcal: r(kcal),
    macros: { protein: `${r(p)}g`, carb: `${r(c)}g`, fat: `${r(g)}g` },
    foods,
  };
}

export default async function DietaPage() {
  const data = todayISO();
  const [totals, logs, recipes] = await Promise.all([
    getDayTotals(data),
    getMealLogsWithItems(data),
    listRecipesWithItems(),
  ]);

  const byRefeicao = new Map(logs.map((l) => [l.refeicao, l]));
  let firstLogged = true;

  const meals: DietMeal[] = REFEICOES.map(({ key, label }) => {
    const log = byRefeicao.get(key);
    const items = log?.items ?? [];
    if (items.length === 0) {
      return { refeicao: key, label, logged: false, expanded: false, kcal: 0, foods: [], detail: null };
    }
    const time = log ? timeOf(log.criado_em) : "";
    const detail = toDetail(label, time, log!);
    const expanded = firstLogged;
    firstLogged = false;
    return {
      refeicao: key,
      label,
      logged: true,
      expanded,
      kcal: detail.kcal,
      time,
      foods: items.slice(0, 2).map((it) => short(it.food.nome)),
      macros: detail.macros,
      detail,
    };
  });

  const dietRecipes: DietRecipe[] = recipes.map((rec) => {
    const detail = recipeDetail(rec);
    return {
      id: rec.id,
      name: rec.nome,
      kcal: detail.kcal,
      foods: rec.items.slice(0, 2).map((it) => short(it.food.nome)),
      detail,
    };
  });

  const now = new Date();
  const month = now.toLocaleDateString("pt-BR", { month: "long" });
  const dateStr = `${month.charAt(0).toUpperCase()}${month.slice(1)} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <div className="min-h-svh bg-black pb-32 font-[family-name:var(--font-lexend)] text-white">
      <div className="mx-auto max-w-[440px]">
        <header className="flex items-start justify-between px-6 pt-14">
          <div>
            <p className="text-[13px] text-white/55">{dateStr}</p>
            <h1 className="mt-1.5 text-[26px] font-medium uppercase leading-[1.1] tracking-tight">
              Protocolo
            </h1>
          </div>
          <button
            type="button"
            aria-label="Perfil"
            className="mt-1 size-12 shrink-0 rounded-full bg-[#F24510] transition-transform active:scale-95"
          />
        </header>

        <div className="mt-8">
          <CalendarStrip />
        </div>

        <div className="mt-8 px-6">
          <CaloriesCard kcal={r(totals.kcal)} />
          <div className="mt-3 flex gap-3">
            <MacroCard label="Proteína" value={`${r(totals.proteina)}g`} />
            <MacroCard label="Carboidrato" value={`${r(totals.carbo)}g`} />
            <MacroCard label="Gordura" value={`${r(totals.gordura)}g`} />
          </div>
        </div>

        <DietMeals data={data} meals={meals} recipes={dietRecipes} />
      </div>

      <BottomNav />
    </div>
  );
}
