import { NextResponse } from "next/server";
import { parseFoodsFromText } from "@/lib/food-ai";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = body?.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "Texto inválido" }, { status: 400 });
  }

  try {
    const foods = await parseFoodsFromText(text);
    return NextResponse.json({ foods });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao interpretar texto" },
      { status: 500 },
    );
  }
}
