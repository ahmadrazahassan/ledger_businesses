import OpenAI from 'openai';

export function createOpenRouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ledgerbusinesses.com';

  return new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': siteUrl,
      'X-Title': 'Ledger Businesses',
    },
  });
}

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL ?? 'openai/gpt-oss-120b:free';
}
