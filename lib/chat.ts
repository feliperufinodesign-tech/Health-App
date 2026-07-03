"use server";

import { createClient } from "@/lib/supabase/server";

export type AiMessage = {
  id: string;
  papel: "user" | "assistant";
  conteudo: string;
  criado_em: string;
};

export async function getRecentMessages(limit = 30): Promise<AiMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).reverse();
}

export async function saveMessage(papel: "user" | "assistant", conteudo: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("ai_messages").insert({ papel, conteudo });
  if (error) throw new Error(error.message);
}
