"use client";

import { useState } from "react";
import { bulkCreateFoods, type NewFoodInput } from "@/lib/food";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditableFood = NewFoodInput & { key: string };

export function AiFoodImport() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<EditableFood[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/food/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao interpretar texto");
      setItems(
        (data.foods as NewFoodInput[]).map((f) => ({
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

  function updateItem(key: string, field: keyof NewFoodInput, value: string) {
    setItems((prev) =>
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

  function removeItem(key: string) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  async function handleSaveAll() {
    if (items.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await bulkCreateFoods(
        items.map((item): NewFoodInput => {
          const { nome, unidade, base_qtd, kcal, proteina_g, carbo_g, gordura_g } = item;
          return { nome, unidade, base_qtd, kcal, proteina_g, carbo_g, gordura_g };
        }),
      );
      setItems([]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar alimentos");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar em lote com IA</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole uma lista, tabela ou descrição dos alimentos (nome, quantidade, kcal, macros)..."
          rows={6}
        />
        <Button
          type="button"
          variant="outline"
          disabled={analyzing || !text.trim()}
          onClick={handleAnalyze}
          className="w-fit"
        >
          {analyzing ? "Analisando..." : "Analisar com IA"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {items.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Confira e edite antes de salvar:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="p-1">Nome</th>
                    <th className="p-1">Unid.</th>
                    <th className="p-1">Base</th>
                    <th className="p-1">Kcal</th>
                    <th className="p-1">Prot</th>
                    <th className="p-1">Carbo</th>
                    <th className="p-1">Gord</th>
                    <th className="p-1"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.key} className="border-t">
                      <td className="p-1">
                        <Input
                          value={item.nome}
                          onChange={(e) => updateItem(item.key, "nome", e.target.value)}
                          className="w-36"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          value={item.unidade}
                          onChange={(e) => updateItem(item.key, "unidade", e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={item.base_qtd}
                          onChange={(e) => updateItem(item.key, "base_qtd", e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={item.kcal}
                          onChange={(e) => updateItem(item.key, "kcal", e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={item.proteina_g}
                          onChange={(e) => updateItem(item.key, "proteina_g", e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={item.carbo_g}
                          onChange={(e) => updateItem(item.key, "carbo_g", e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-1">
                        <Input
                          type="number"
                          value={item.gordura_g}
                          onChange={(e) => updateItem(item.key, "gordura_g", e.target.value)}
                          className="w-16"
                        />
                      </td>
                      <td className="p-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.key)}
                        >
                          Remover
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              type="button"
              disabled={saving}
              onClick={handleSaveAll}
              className="w-fit"
            >
              {saving ? "Salvando..." : `Salvar ${items.length} alimentos`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
