import { LogoSymbol } from './logo-symbol';

interface LogoFullProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function LogoFull({ className = '', variant = 'dark' }: LogoFullProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-ink';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoSymbol size={30} variant={variant} />
      <div className="flex items-baseline gap-[5px]">
        <span className={`text-[17px] font-extrabold tracking-[-0.03em] ${textColor}`}>
          Ledger
        </span>
        <span
          className={`text-[17px] font-extrabold tracking-[-0.03em] ${variant === 'light' ? 'text-accent' : 'text-accent-content'}`}
        >
          Businesses
        </span>
      </div>
    </div>
  );
}
