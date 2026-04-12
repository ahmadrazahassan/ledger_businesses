import { LOGO_CUBE_PATHS } from './logo-cube-paths';

/**
 * Isometric cube mark — three visible faces (true parallelograms) with a pinched triple-point gap.
 * Uses currentColor for theme + accent overrides. Matches reference: bold isometric block, minimal.
 */
export function LogoSymbol({
  size = 40,
  className = '',
  variant = 'dark',
}: {
  size?: number;
  className?: string;
  variant?: 'dark' | 'light';
}) {
  const colorClass = variant === 'light' ? 'text-white' : 'text-ink';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${colorClass} ${className}`.trim()}
      aria-hidden
    >
      <title>Ledger Businesses</title>
      <g fill="currentColor">
        <path d={LOGO_CUBE_PATHS.top} />
        <path d={LOGO_CUBE_PATHS.left} />
        <path d={LOGO_CUBE_PATHS.right} />
      </g>
    </svg>
  );
}
