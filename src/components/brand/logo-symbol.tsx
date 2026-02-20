export function LogoSymbol({ size = 40, className = '', variant = 'dark' }: { size?: number; className?: string; variant?: 'dark' | 'light' }) {
  const strokeColor = variant === 'light' ? '#ffffff' : '#1e1f26';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ledger Businesses"
    >
      {/* Outer seal ring */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="12"
        stroke={strokeColor}
        strokeWidth="3"
        fill="none"
      />
      {/* Inner frame */}
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="8"
        stroke={strokeColor}
        strokeWidth="1.5"
        fill="none"
      />
      {/* L letterform — geometric */}
      <path
        d="M24 18v28h16"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Accent dot — brand mark */}
      <rect
        x="40"
        y="18"
        width="6"
        height="6"
        rx="1.5"
        fill="#ff5533"
      />
    </svg>
  );
}
