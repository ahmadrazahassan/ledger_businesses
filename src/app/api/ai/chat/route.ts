import { NextResponse } from 'next/server';
import { fetchAssistantArticleCatalog } from '@/lib/ai/assistant-article-catalog';
import { buildAssistantSystemPrompt } from '@/lib/ai/assistant-system-prompt';
import { createOpenRouterClient, getOpenRouterModel } from '@/lib/ai/openrouter-client';
import type { ClientChatMessage } from '@/lib/ai/chat-types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 12000;

type ORChatMessage = {
  role: 'assistant' | 'user' | 'system';
  content: string | null;
  reasoning_details?: unknown;
};

function toOpenRouterMessages(
  system: string,
  messages: ClientChatMessage[]
): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [{ role: 'system', content: system }];
  for (const m of messages) {
    if (m.role === 'user') {
      out.push({ role: 'user', content: m.content });
    } else {
      const row: Record<string, unknown> = {
        role: 'assistant',
        content: m.content,
      };
      if (m.reasoning_details !== undefined) {
        row.reasoning_details = m.reasoning_details;
      }
      out.push(row);
    }
  }
  return out;
}

export async function POST(req: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'AI assistant is not configured. Set OPENROUTER_API_KEY in the environment.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const messages = (body as { messages?: ClientChatMessage[] }).messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages[] is required' }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: 'Too many messages in thread' }, { status: 400 });
  }

  for (const m of messages) {
    if (m.role === 'user' && typeof m.content === 'string') {
      if (m.content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ error: 'Message too long' }, { status: 400 });
      }
    } else if (m.role === 'assistant' && typeof m.content === 'string') {
      if (m.content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json({ error: 'Message too long' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid message shape' }, { status: 400 });
    }
  }

  const articles = await fetchAssistantArticleCatalog();
  const system = buildAssistantSystemPrompt(articles);
  const openaiMessages = toOpenRouterMessages(system, messages);
  const model = getOpenRouterModel();

  let client;
  try {
    client = createOpenRouterClient();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Configuration error' },
      { status: 503 }
    );
  }

  const basePayload = {
    model,
    messages: openaiMessages,
    max_tokens: 2000,
    temperature: 0.35,
  };

  const withReasoning = {
    ...basePayload,
    reasoning: { enabled: true },
  };

  try {
    const completion = await client.chat.completions.create(withReasoning as never);
    const raw = completion.choices[0]?.message;
    const msg = raw as ORChatMessage | undefined;
    if (!msg) {
      return NextResponse.json({ error: 'Empty response from model' }, { status: 502 });
    }

    return NextResponse.json({
      message: {
        role: 'assistant' as const,
        content: msg.content ?? '',
        reasoning_details: msg.reasoning_details,
      },
    });
  } catch (firstErr) {
    try {
      const completion = await client.chat.completions.create(basePayload as never);
      const raw = completion.choices[0]?.message;
      const msg = raw as ORChatMessage | undefined;
      if (!msg) {
        return NextResponse.json({ error: 'Empty response from model' }, { status: 502 });
      }
      return NextResponse.json({
        message: {
          role: 'assistant' as const,
          content: msg.content ?? '',
          reasoning_details: msg.reasoning_details,
        },
      });
    } catch {
      console.error('OpenRouter chat error:', firstErr);
      return NextResponse.json(
        { error: 'The assistant could not complete this request. Try again shortly.' },
        { status: 502 }
      );
    }
  }
}
