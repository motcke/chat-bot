import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }
  return anthropicClient;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  systemPrompt: string,
  context: string
): Promise<string> {
  try {
    const fullSystemPrompt = context
      ? `${systemPrompt}\n\nהנה מידע רלוונטי מבסיס הידע שלך:\n${context}\n\nהשתמש במידע הזה כדי לענות על שאלות המשתמש. אם המידע לא רלוונטי לשאלה, אל תציין אותו.`
      : systemPrompt;

    const response = await getAnthropicClient().messages.create({
      model: "anthropic/claude-3.5-sonnet",
      max_tokens: 1024,
      system: fullSystemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "";
  } catch (error: any) {
    console.error("OpenRouter API error:", error.message || error);
    throw new Error(`Chat API error: ${error.message || "Unknown error"}`);
  }
}

export async function* generateChatResponseStream(
  messages: ChatMessage[],
  systemPrompt: string,
  context: string
): AsyncGenerator<string> {
  const fullSystemPrompt = context
    ? `${systemPrompt}\n\nהנה מידע רלוונטי מבסיס הידע שלך:\n${context}\n\nהשתמש במידע הזה כדי לענות על שאלות המשתמש. אם המידע לא רלוונטי לשאלה, אל תציין אותו.`
    : systemPrompt;

  try {
    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model: "anthropic/claude-3.5-sonnet",
      max_tokens: 1024,
      system: fullSystemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  } catch (error: any) {
    console.error("OpenRouter stream error:", error.message || error);
    throw new Error(`Stream error: ${error.message || "Unknown error"}`);
  }
}
