"use client";

import { useState } from "react";
import { X, Camera, ImageIcon, Mic, ArrowUp } from "lucide-react";
import { Sheet } from "@/components/figma-home/sheet";
import { registerMealFromText } from "@/lib/food";
import type { Refeicao } from "@/lib/types";

type Message = { role: "user" | "assistant"; text: string };

const REFEICAO_LABEL: Record<Refeicao, string> = {
  cafe: "café da manhã",
  almoco: "almoço",
  lanche: "lanche",
  jantar: "jantar",
};

export function MealRegisterSheet({
  open,
  onClose,
  data,
  refeicao,
  onRegistered,
}: {
  open: boolean;
  onClose: () => void;
  data: string;
  refeicao: Refeicao;
  onRegistered: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);

  async function send() {
    const text = draft.trim();
    if (!text || pending) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text }]);
    setPending(true);
    setMessages((m) => [...m, { role: "assistant", text: "Analisando…" }]);

    const result = await registerMealFromText(data, refeicao, text);

    setMessages((m) => {
      const next = m.slice(0, -1);
      if (result.error) {
        next.push({ role: "assistant", text: result.error });
      } else {
        next.push({
          role: "assistant",
          text: `Refeição adicionada ao ${REFEICAO_LABEL[refeicao]}${
            result.kcal ? `, ${result.kcal} kcal.` : "."
          }`,
        });
      }
      return next;
    });
    setPending(false);
    if (!result.error) onRegistered();
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex min-h-[78vh] flex-col px-7 pt-1">
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

        <p className="text-center text-[13px] uppercase tracking-[0.14em] text-white/55">
          Assistente
        </p>
        <h2 className="mt-2 text-center font-[family-name:var(--font-copernicus)] text-[27px] leading-[1.12] text-white text-balance">
          Descreva sua refeição que a IA vai adicionar
        </h2>

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
              placeholder="Descreva a refeição…"
              disabled={pending}
              className="min-w-0 flex-1 bg-transparent text-[16px] text-black outline-none placeholder:text-black/40"
            />
            <Mic className="size-5 shrink-0 text-black/70" strokeWidth={1.75} />
          </div>
          <button
            type="button"
            aria-label="Enviar"
            onClick={send}
            disabled={pending}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform active:scale-95 disabled:opacity-50"
          >
            <ArrowUp className="size-6" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    </Sheet>
  );
}
