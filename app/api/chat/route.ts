import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { getRecentMessages, saveMessage } from "@/lib/chat";
import { buildContextSummary } from "@/lib/chat-context";
import { AGENT_TOOLS, executeTool, buildAgentCatalogContext } from "@/lib/agent-tools";

const SYSTEM_RULES = `Você é o assistente pessoal de rotina e saúde do usuário, dentro de um app de uso individual. Você pode agir no app usando as ferramentas disponíveis (registrar sono, refeição, medicação, treino) — não é só um chatbot de perguntas e respostas.

Regras:
- Quando o usuário pedir pra registrar algo (sono, refeição, remédio tomado, série de treino), use a ferramenta correspondente em vez de só explicar como fazer.
- Para alimentos: SEMPRE prefira casar com o catálogo existente (veja a lista abaixo) e usar o food_id exato. Só cadastre um alimento novo com estimativa quando ele realmente não existir no catálogo — e sempre avise no final da resposta que aquele item foi estimado.
- Você NUNCA diagnostica, não conclui doença e não prescreve tratamento ou medicação. Você organiza, resume, sinaliza padrões e registra dados.
- Se faltar alguma informação obrigatória pra registrar algo (ex: disposição do sono, carga do treino), pergunte antes de chamar a ferramenta — não invente valor.
- Depois de executar uma ou mais ferramentas, responda de forma direta confirmando o que foi feito, com os números relevantes.
- Se os dados forem insuficientes pra responder uma pergunta analítica, diga isso claramente em vez de especular.
- Ao falar de progresso de treino, compare cargas/reps entre sessões do mesmo exercício.
- Ao falar de sono, relacione disposição ao acordar com noites que a pessoa considerou ter dormido bem.
- Ao falar de aderência a medicação, distinga doses no horário de doses atrasadas.
- Ao falar de calorias/proteína, compare com a meta diária quando ela existir.`;

const MAX_TOOL_ITERATIONS = 6;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const message = body?.message;

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
  }

  const history = await getRecentMessages(20);
  await saveMessage("user", message);

  const [contextSummary, catalogContext] = await Promise.all([
    buildContextSummary(),
    buildAgentCatalogContext(),
  ]);
  const system = `${SYSTEM_RULES}\n\n# Dados do usuário (últimos 7 dias)\n\n${contextSummary}\n\n${catalogContext}`;

  const apiMessages: Anthropic.MessageParam[] = [
    ...history.map(
      (m) => ({ role: m.papel, content: m.conteudo }) as Anthropic.MessageParam,
    ),
    { role: "user", content: message },
  ];

  let finalText = "";

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 2048,
      system,
      messages: apiMessages,
      tools: AGENT_TOOLS as unknown as Anthropic.Tool[],
    });

    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    if (response.stop_reason !== "tool_use" || toolUseBlocks.length === 0) {
      finalText = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      break;
    }

    apiMessages.push({ role: "assistant", content: response.content });

    const toolResults = await Promise.all(
      toolUseBlocks.map(async (block) => {
        let resultText: string;
        try {
          resultText = await executeTool(
            block.name,
            block.input as Record<string, unknown>,
          );
        } catch (error) {
          resultText = `Erro ao executar ${block.name}: ${
            error instanceof Error ? error.message : "erro desconhecido"
          }`;
        }
        return {
          type: "tool_result" as const,
          tool_use_id: block.id,
          content: resultText,
        };
      }),
    );

    apiMessages.push({ role: "user", content: toolResults });
  }

  if (!finalText) {
    finalText = "Não consegui concluir a ação. Tenta reformular o pedido.";
  }

  await saveMessage("assistant", finalText);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(finalText));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
