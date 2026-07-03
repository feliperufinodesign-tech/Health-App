import Anthropic from "@anthropic-ai/sdk";

export const CHAT_MODEL = "claude-sonnet-5";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
