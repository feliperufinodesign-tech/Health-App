"use client";

import { useState } from "react";
import { X, Camera, ImageIcon, Mic, ArrowUp } from "lucide-react";
import { Sheet } from "@/components/figma-home/sheet";

type Message = { role: "user" | "assistant"; text: string };

const INITIAL: Message[] = [
  {
    role: "user",
    text: "Adicione shake da tarde. Iorgute grego, 100g de banana, 20g leite em pó, 20g de granola e 7 g de castanha de caju",
  },
  {
    role: "assistant",
    text: "Refeição adicionada, lembre de treinar as 14h. Como você comeu agora de um intervalo para iniciar o treino",
  },
];

export function MealRegisterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [draft, setDraft] = useState("");

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      { role: "assistant", text: "Refeição adicionada. Registrei os alimentos e as calorias." },
    ]);
    setDraft("");
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex min-h-[78vh] flex-col px-7 pt-1">
        {/* Close */}
        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="flex size-8 items-center justify-center text-white/80"
          >
            <X className="size-6" strokeWidth={2} />
          </button>
        </div>

        {/* Heading */}
        <p className="text-center text-[13px] uppercase tracking-[0.14em] text-white/55">
          Assistente
        </p>
        <h2 className="mt-2 text-center font-[family-name:var(--font-copernicus)] text-[27px] leading-[1.12] text-white text-balance">
          Descreva sua refeição que a IA vai adicionar
        </h2>

        {/* Messages */}
        <div className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"}
            >
              <p className="text-[16px] font-semibold text-white">
                {m.role === "user" ? "Você" : "Assistente"}
              </p>
              <p
                className={`mt-1.5 max-w-[85%] text-[17px] leading-[1.5] text-white/85 ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-3 pt-3">
          <button type="button" aria-label="Câmera" className="text-white">
            <Camera className="size-7" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Galeria" className="text-white">
            <ImageIcon className="size-7" strokeWidth={1.75} />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-5 py-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message"
              className="min-w-0 flex-1 bg-transparent text-[16px] text-black outline-none placeholder:text-black/40"
            />
            <Mic className="size-5 shrink-0 text-black/70" strokeWidth={1.75} />
          </div>
          <button
            type="button"
            aria-label="Enviar"
            onClick={send}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform active:scale-95"
          >
            <ArrowUp className="size-6" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </Sheet>
  );
}
