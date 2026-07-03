import { NextResponse } from "next/server";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { getRecentMessages, saveMessage } from "@/lib/chat";
import { buildContextSummary } from "@/lib/chat-context";

const SYSTEM_RULES = `Você é o assistente pessoal de rotina e saúde do usuário, dentro de um app de uso individual.

Regras:
- Baseie toda orientação nos dados fornecidos abaixo. Não invente números.
- Você NUNCA diagnostica, não conclui doença e não prescreve tratamento ou medicação. Você organiza, resume e sinaliza padrões nos dados.
- Se os dados forem insuficientes para responder algo com confiança, diga isso claramente em vez de especular.
- Seja direto e objetivo. Respostas curtas quando possível, mas com números concretos quando disponíveis.
- Ao falar de progresso de treino, compare cargas/reps entre sessões do mesmo exercício.
- Ao falar de sono, relacione disposição ao acordar com noites que a pessoa considerou ter dormido bem.
- Ao falar de aderência a medicação, distinga doses no horário de doses atrasadas.
- Ao falar de calorias/proteína, compare com a meta diária quando ela existir.`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = body?.message;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
  }

  const history = await getRecentMessages(20);
  await saveMessage("user", message);

  const contextSummary = await buildContextSummary();
  const system = `${SYSTEM_RULES}\n\n# Dados do usuário\n\n${contextSummary}`;

  const apiMessages = [
    ...history.map((m) => ({ role: m.papel, content: m.conteudo })),
    { role: "user" as const, content: message },
  ];

  const encoder = new TextEncoder();
  let fullText = "";

  const stream = new ReadableStream({
    async start(controller) {
      const anthropicStream = anthropic.messages.stream({
        model: CHAT_MODEL,
        max_tokens: 2048,
        system,
        messages: apiMessages,
      });

      anthropicStream.on("text", (delta) => {
        fullText += delta;
        controller.enqueue(encoder.encode(delta));
      });

      try {
        await anthropicStream.finalMessage();
        await saveMessage("assistant", fullText);
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
