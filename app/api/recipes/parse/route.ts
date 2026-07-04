import { NextResponse } from "next/server";
import { matchRecipeFromText } from "@/lib/food-ai";
import { listFoods } from "@/lib/food";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Texto inválido" }, { status: 400 });
  }

  try {
    const catalog = await listFoods();
    const result = await matchRecipeFromText(text, catalog);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao interpretar texto" },
      { status: 500 },
    );
  }
}
