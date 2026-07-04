"use client";

import { useState } from "react";
import { bulkCreateFoods, type NewFoodInput } from "@/lib/food";
import { createRecipeWithItems } from "@/lib/recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Food } from "@/lib/types";

type MatchedItem = { food_id: string; quantidade: number };
type UnmatchedItem = NewFoodInput & { key: string };

export function RecipeAiBuilder({ catalog }: { catalog: Food[] }) {
  const [text, setText] = useState("");
  const [nome, setNome] = useState("");
  const [matched, setMatched] = useState<MatchedItem[]>([]);
  const [unmatched, setUnmatched] = useState<UnmatchedItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const catalogById = new Map(catalog.map((f) => [f.id, f]));

  async function handleAnalyze() {
    if (!text.trim()) return;
    setAnalyzing(true);
    setError(null);
    setDone(false);
    try {
      const res = await fetch("/api/recipes/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao interpretar texto");
      setNome(data.nomeSugerido ?? "");
      setMatched(data.itensEncontrados ?? []);
      setUnmatched(
        (data.itensNaoEncontrados as NewFoodInput[]).map((f) => ({
          ...f,
          key: crypto.randomUUID(),
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao interpretar texto");
    } finally {
      setAnalyzing(false);
    }
  }

  function updateUnmatched(key: string, field: keyof NewFoodInput, value: string) {
    setUnmatched((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              [field]: field === "nome" || field === "unidade" ? value : Number(value),
            }
          : item,
      ),
    );
  }

  async function handleCreateRecipe() {
    if (!nome.trim() || (matched.length === 0 && unmatched.length === 0)) return;
    setSaving(true);
    setError(null);
    try {
      let newFoodItems: MatchedItem[] = [];
      if (unmatched.length > 0) {
        const created = await bulkCreateFoods(
          unmatched.map((item): NewFoodInput => {
            const { nome, unidade, base_qtd, kcal, proteina_g, carbo_g, gordura_g } = item;
            return { nome, unidade, base_qtd, kcal, proteina_g, carbo_g, gordura_g };
          }),
        );
        newFoodItems = created.map((food, i) => ({
          food_id: food.id,
          quantidade: unmatched[i].base_qtd,
        }));
      }

      await createRecipeWithItems({
        nome,
        items: [...matched, ...newFoodItems],
      });

      setText("");
      setNome("");
      setMatched([]);
      setUnmatched([]);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar receita");
    } finally {
      setSaving(false);
    }
  }

  const hasResult = matched.length > 0 || unmatched.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Descreva a receita (ex: shake com 300ml leite integral, 30g aveia, 1 banana, 30g pasta de amendoim)..."
          rows={4}
        />
        <Button
          type="button"
          variant="outline"
          disabled={analyzing || !text.trim()}
          onClick={handleAnalyze}
          className="w-fit"
        >
          {analyzing ? "Montando..." : "Montar com IA"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {done && (
          <p className="text-sm text-muted-foreground">Receita criada com sucesso.</p>
        )}

        {hasResult && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="recipe-nome">Nome da receita</Label>
              <Input
                id="recipe-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {matched.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-medium">
                  Itens encontrados no catálogo
                </p>
                <ul className="flex flex-col gap-1 text-sm">
                  {matched.map((item, i) => {
                    const food = catalogById.get(item.food_id);
                    return (
                      <li key={i}>
                        {food?.nome ?? "?"} — {item.quantidade}
                        {food?.unidade}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {unmatched.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-medium">
                  Novos alimentos (serão cadastrados no catálogo — confira os valores)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="p-1">Nome</th>
                        <th className="p-1">Unid.</th>
                        <th className="p-1">Qtd</th>
                        <th className="p-1">Kcal</th>
                        <th className="p-1">Prot</th>
                        <th className="p-1">Carbo</th>
                        <th className="p-1">Gord</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unmatched.map((item) => (
                        <tr key={item.key} className="border-t">
                          <td className="p-1">
                            <Input
                              value={item.nome}
                              onChange={(e) =>
                                updateUnmatched(item.key, "nome", e.target.value)
                              }
                              className="w-32"
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              value={item.unidade}
                              onChange={(e) =>
                                updateUnmatched(item.key, "unidade", e.target.value)
                              }
                              className="w-14"
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              type="number"
                              value={item.base_qtd}
                              onChange={(e) =>
                                updateUnmatched(item.key, "base_qtd", e.target.value)
                              }
                              className="w-16"
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              type="number"
                              value={item.kcal}
                              onChange={(e) =>
                                updateUnmatched(item.key, "kcal", e.target.value)
                              }
                              className="w-16"
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              type="number"
                              value={item.proteina_g}
                              onChange={(e) =>
                                updateUnmatched(item.key, "proteina_g", e.target.value)
                              }
                              className="w-16"
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              type="number"
                              value={item.carbo_g}
                              onChange={(e) =>
                                updateUnmatched(item.key, "carbo_g", e.target.value)
                              }
                              className="w-16"
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              type="number"
                              value={item.gordura_g}
                              onChange={(e) =>
                                updateUnmatched(item.key, "gordura_g", e.target.value)
                              }
                              className="w-16"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Button
              type="button"
              disabled={saving || !nome.trim()}
              onClick={handleCreateRecipe}
              className="w-fit"
            >
              {saving ? "Criando..." : "Criar receita"}
            </Button>
          </div>
        )}
    </div>
  );
}
