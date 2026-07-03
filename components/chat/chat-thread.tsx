"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { cn } from "@/lib/utils";
import type { AiMessage } from "@/lib/chat";

type LocalMessage = {
  id: string;
  papel: "user" | "assistant";
  conteudo: string;
};

export function ChatThread({ initialMessages }: { initialMessages: AiMessage[] }) {
  const [messages, setMessages] = useState<LocalMessage[]>(
    initialMessages.map((m) => ({ id: m.id, papel: m.papel, conteudo: m.conteudo })),
  );
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text: string) {
    const userId = crypto.randomUUID();
    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userId, papel: "user", conteudo: text },
      { id: assistantId, papel: "assistant", conteudo: "" },
    ]);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.body) throw new Error("Sem resposta do servidor");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, conteudo: m.conteudo + chunk } : m,
          ),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, conteudo: "Erro ao gerar resposta. Tente novamente." }
            : m,
        ),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Pergunte sobre sua aderência, progresso de treino, sono ou calorias.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
                m.papel === "user"
                  ? "self-end bg-primary text-primary-foreground"
                  : "self-start bg-muted",
              )}
            >
              {m.conteudo || (pending ? "..." : "")}
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      <ChatInput disabled={pending} onSend={handleSend} />
    </div>
  );
}
