import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import type { NewFoodInput } from "@/lib/food";
import type { Food, Unidade } from "@/lib/types";

const UNIDADE_ENUM = ["g", "ml", "unidade", "lata", "colher"];

const FOOD_ITEM_SCHEMA = {
  type: "object",
  properties: {
    nome: { type: "string" },
    unidade: { type: "string", enum: UNIDADE_ENUM },
    base_qtd: { type: "number" },
    kcal: { type: "number" },
    proteina_g: { type: "number" },
    carbo_g: { type: "number" },
    gordura_g: { type: "number" },
  },
  required: [
    "nome",
    "unidade",
    "base_qtd",
    "kcal",
    "proteina_g",
    "carbo_g",
    "gordura_g",
  ],
  additionalProperties: false,
} as const;

const FOODS_LIST_SCHEMA = {
  type: "object",
  properties: {
    foods: { type: "array", items: FOOD_ITEM_SCHEMA },
  },
  required: ["foods"],
  additionalProperties: false,
} as const;

function extractText(content: unknown): string {
  const blocks = content as { type: string; text?: string }[];
  const textBlock = blocks.find((b) => b.type === "text");
  if (!textBlock?.text) throw new Error("A IA não retornou uma resposta válida.");
  return textBlock.text;
}

export async function parseFoodsFromText(text: string): Promise<NewFoodInput[]> {
  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 4096,
    system:
      "Você extrai dados nutricionais de um texto (lista, tabela colada ou descrição livre) e devolve cada alimento em formato estruturado. " +
      "Use os valores exatamente como informados no texto (não arredonde nem converta unidades). " +
      "Se o texto não trouxer proteína/carbo/gordura para um item, estime com base em alimentos semelhantes.",
    messages: [{ role: "user", content: text }],
    output_config: { format: { type: "json_schema", schema: FOODS_LIST_SCHEMA } },
  });

  const parsed = JSON.parse(extractText(response.content)) as {
    foods: NewFoodInput[];
  };

  return parsed.foods.map((f) => ({
    ...f,
    unidade: f.unidade as Unidade,
  }));
}

const RECIPE_MATCH_SCHEMA = {
  type: "object",
  properties: {
    nome_sugerido: { type: "string" },
    itens_encontrados: {
      type: "array",
      items: {
        type: "object",
        properties: {
          food_id: { type: "string" },
          quantidade: { type: "number" },
        },
        required: ["food_id", "quantidade"],
        additionalProperties: false,
      },
    },
    itens_nao_encontrados: { type: "array", items: FOOD_ITEM_SCHEMA },
  },
  required: ["nome_sugerido", "itens_encontrados", "itens_nao_encontrados"],
  additionalProperties: false,
} as const;

export type RecipeMatchResult = {
  nomeSugerido: string;
  itensEncontrados: { food_id: string; quantidade: number }[];
  itensNaoEncontrados: NewFoodInput[];
};

export async function matchRecipeFromText(
  text: string,
  catalog: Food[],
): Promise<RecipeMatchResult> {
  const catalogList = catalog
    .map((f) => `- id=${f.id} | ${f.nome} (base: ${f.base_qtd}${f.unidade})`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 4096,
    system:
      "Você monta uma receita a partir de uma descrição em texto livre, casando cada ingrediente com o catálogo de alimentos abaixo sempre que possível.\n\n" +
      `Catálogo disponível:\n${catalogList}\n\n` +
      "Regras:\n" +
      "- Para ingredientes que existem no catálogo, retorne o food_id exato e a quantidade na mesma unidade do catálogo.\n" +
      "- Para ingredientes que NÃO existem no catálogo, coloque em itens_nao_encontrados com dados nutricionais estimados (marque como estimativa mentalmente — o usuário vai revisar antes de salvar).\n" +
      "- Sugira um nome curto para a receita em nome_sugerido, baseado na descrição do usuário.",
    messages: [{ role: "user", content: text }],
    output_config: { format: { type: "json_schema", schema: RECIPE_MATCH_SCHEMA } },
  });

  const parsed = JSON.parse(extractText(response.content)) as {
    nome_sugerido: string;
    itens_encontrados: { food_id: string; quantidade: number }[];
    itens_nao_encontrados: NewFoodInput[];
  };

  return {
    nomeSugerido: parsed.nome_sugerido,
    itensEncontrados: parsed.itens_encontrados,
    itensNaoEncontrados: parsed.itens_nao_encontrados.map((f) => ({
      ...f,
      unidade: f.unidade as Unidade,
    })),
  };
}
