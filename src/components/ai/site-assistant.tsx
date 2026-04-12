'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, Loader2, MessageSquare, Search, X } from 'lucide-react';
import { useCookieBanner } from '@/components/ui/cookie-banner-provider';
import type { ClientChatMessage } from '@/lib/ai/chat-types';

/** Apple-style system stack for assistant copy */
const appleText = 'font-[system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif]';

function AssistantBody({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className={`space-y-2 text-[15px] leading-[1.38] tracking-[-0.01em] text-[#1d1d1f] ${appleText}`}>
      {blocks.map((block, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {block.split(/(\*\*.+?\*\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              return (
                <strong key={j} className="font-semibold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      ))}
    </div>
  );
}

export function SiteAssistant() {
  const { showBanner: cookieBannerVisible } = useCookieBanner();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ClientChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showThread = messages.length > 0 || loading;

  const scrollToEnd = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (showThread) scrollToEnd();
  }, [messages, loading, showThread, scrollToEnd]);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ClientChatMessage = { role: 'user', content: trimmed };
    const nextThread = [...messages, userMsg];
    setMessages(nextThread);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextThread }),
      });
      const data = (await res.json()) as {
        error?: string;
        message?: { role: 'assistant'; content: string; reasoning_details?: unknown };
      };

      if (!res.ok) {
        setError(data.error ?? 'Request failed');
        return;
      }

      if (!data.message?.content) {
        setError('No reply from assistant');
        return;
      }

      const assistant: ClientChatMessage = {
        role: 'assistant',
        content: data.message.content,
        ...(data.message.reasoning_details !== undefined
          ? { reasoning_details: data.message.reasoning_details }
          : {}),
      };
      setMessages([...nextThread, assistant]);
    } catch {
      setError('Network error — try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeChat = () => {
    setMessages([]);
    setError(null);
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="pointer-events-none fixed left-1/2 z-[85] w-full max-w-[440px] -translate-x-1/2 px-4 transition-[bottom] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
      style={{
        bottom: cookieBannerVisible
          ? 'calc(env(safe-area-inset-bottom, 0px) + min(46vh, 18rem))'
          : 'max(0.5rem, env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="pointer-events-auto flex w-full flex-col gap-3">
        {showThread && (
          <div
            className={`flex h-[clamp(17.5rem,min(48vh,26rem),26rem)] w-full flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white/85 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.14),0_8px_16px_-6px_rgba(0,0,0,0.06)] backdrop-blur-2xl ${appleText}`}
          >
            <header className="flex shrink-0 items-center gap-2 border-b border-black/[0.06] px-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="truncate text-[14px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                    Ledger AI
                  </h2>
                  <span className="hidden shrink-0 text-[10px] font-medium uppercase tracking-wide text-[#aeaeb2] sm:inline">
                    ·
                  </span>
                  <p className="hidden min-w-0 truncate text-[11px] font-medium text-[#86868b] sm:inline">
                    UK accounting
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={closeChat}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#86868b] transition-colors hover:bg-black/[0.06] hover:text-[#1d1d1f] active:bg-black/[0.08]"
                  aria-label="Close chat"
                  title="Close"
                >
                  <X size={18} strokeWidth={2} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  className="rounded-full px-2.5 py-1 text-[13px] font-semibold text-accent-content transition-colors hover:bg-accent/10 active:bg-accent/15"
                >
                  Done
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f5f5f7]/50 px-3 py-3">
              <div className="space-y-2" aria-live="polite">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[min(92%,340px)] px-3.5 py-2 ${
                        m.role === 'user'
                          ? 'rounded-[19px] rounded-br-[5px] bg-accent text-accent-foreground'
                          : 'rounded-[19px] rounded-bl-[5px] bg-[#e9e9eb] text-[#1d1d1f]'
                      }`}
                    >
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap text-[15px] leading-[1.38] tracking-[-0.01em]">{m.content}</p>
                      ) : (
                        <AssistantBody text={m.content} />
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-[19px] rounded-bl-[5px] bg-[#e9e9eb] px-3.5 py-2.5 text-[#86868b]">
                      <Loader2 size={15} className="animate-spin" aria-hidden />
                      <span className="text-[14px] font-medium">Thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              {error && (
                <p className="mt-2 px-1 text-[13px] text-[#ff3b30]" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Composer: light tray + charcoal inner field */}
        <form
          onSubmit={send}
          className={`flex w-full items-center gap-2 rounded-[20px] bg-[#f5f5f7] p-1.5 pl-2 shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04] ${appleText}`}
        >
          <Link
            href="/search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#636366] transition-colors hover:bg-black/[0.06] hover:text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Search articles on the site"
            title="Search articles"
            prefetch
          >
            <Search size={18} strokeWidth={1.5} aria-hidden />
          </Link>

          <div className="flex min-h-[44px] min-w-0 flex-1 items-center gap-2 rounded-[14px] bg-[#2c2c2e] px-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <MessageSquare size={17} className="shrink-0 text-[#a1a1a6]" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[16px] leading-snug tracking-[-0.02em] text-[#f5f5f7] placeholder:text-[#8e8e93] focus:outline-none"
              disabled={loading}
              autoComplete="off"
              maxLength={8000}
            />
          </div>

          <button
            type="submit"
            disabled={loading ? false : !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover active:brightness-95 disabled:bg-[#c7c7cc] disabled:text-white disabled:hover:bg-[#c7c7cc]"
            aria-label="Send"
          >
            {loading ? (
              <Loader2 size={17} className="animate-spin" aria-hidden />
            ) : (
              <ArrowUp size={18} strokeWidth={2.25} aria-hidden />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
