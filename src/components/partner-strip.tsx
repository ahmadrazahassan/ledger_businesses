const partners = [
  'Meridian Capital',
  'Northvane Systems',
  'Aperture Ventures',
  'Claridge & Co.',
  'Sterling Group',
  'Equinox Digital',
  'Blackmere Advisory',
  'Voss & Partners',
];

export function PartnerStrip() {
  const doubled = [...partners, ...partners];

  return (
    <div className="w-full py-6 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 mb-4">
        <span className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.2em]">
          Trusted by teams at
        </span>
      </div>
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex items-center gap-10 w-max">
          {doubled.map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center gap-10">
              <span className="text-[15px] font-semibold text-ink/30 whitespace-nowrap hover:text-accent-content/60 transition-colors duration-300 cursor-default select-none">
                {name}
              </span>
              <span className="w-1 h-1 rounded-full bg-accent/30" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
