/** Client ↔ API message shape (OpenRouter may attach reasoning_details to assistant turns). */
export type ClientChatMessage =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string; reasoning_details?: unknown };
