import { getRecentMessages } from "@/lib/chat";
import { ChatThread } from "@/components/chat/chat-thread";

export default async function AssistentePage() {
  const messages = await getRecentMessages(30);

  return (
    <main className="flex h-[calc(100svh-4rem)] flex-col">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">Assistente</h1>
      </div>
      <ChatThread initialMessages={messages} />
    </main>
  );
}
