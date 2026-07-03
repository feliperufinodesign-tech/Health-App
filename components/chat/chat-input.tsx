"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInput({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pergunte sobre sua rotina..."
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled || !value.trim()}>
        Enviar
      </Button>
    </form>
  );
}
