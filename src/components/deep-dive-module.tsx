import Link from 'next/link';
import { IconArrowRight } from '@/components/icons';

const guideChapters = [
  'Understanding the enterprise AI value chain',
  'Selecting the right deployment architecture',
  'Data governance and model validation',
  'Measuring ROI beyond the proof of concept',
];

export function DeepDiveModule() {
  return (
    <div
      className="rounded-[24px] overflow-hidden"
      style={{
        backgroundColor: '#eef0f2',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'1\' height=\'1\' fill=\'%231e1f26\' fill-opacity=\'0.03\'/%3E%3C/svg%3E")',
      }}
    >
      <div className="p-8 md:p-12 lg:p-14">
        {/* Top row: label + issue */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-accent text-white text-[10px] font-black rounded-md uppercase tracking-[0.1em]">
              Deep Dive
            </span>
            <p className="text-[11px] text-ink/50 mt-2 font-medium">
              Guide of the Week
            </p>
          </div>
          <span className="text-[56px] md:text-[72px] font-heading font-black text-ink/[0.05] leading-none select-none">
            01
          </span>
        </div>

        {/* Title + description */}
        <h2 className="text-[26px] md:text-[34px] lg:text-[40px] font-heading font-bold text-ink leading-[1.1] mb-4 max-w-2xl">
          The Enterprise AI Playbook: From Pilot to Production
        </h2>

        <p className="text-[15px] text-ink/55 leading-relaxed mb-10 max-w-xl">
          A comprehensive guide for technology leaders navigating the transition from pilot AI to production-grade systems.
        </p>

        {/* Chapters — 2x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0 mb-10 border-t border-ink/[0.07]">
          {guideChapters.map((chapter, i) => (
            <div key={i} className="flex items-start gap-3 py-4 border-b border-ink/[0.07]">
              <span className="shrink-0 text-[13px] font-bold text-accent tabular-nums mt-px">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[13px] text-ink/65 leading-snug">{chapter}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/articles/enterprise-ai-playbook-pilot-production"
          className="inline-flex items-center gap-2 pl-6 pr-4 py-3 bg-ink text-white text-[13px] font-semibold rounded-full hover:bg-ink/85 transition-colors"
        >
          Read the Guide
          <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <IconArrowRight size={11} className="text-white" />
          </span>
        </Link>
      </div>
    </div>
  );
}
