import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Thin line + arrowhead — editorial / luxury brand pattern */
export function EditorialArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={40}
      height={10}
      viewBox="0 0 40 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <line x1="0" y1="5" x2="24" y2="5" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path
        d="M23 1.35L31.5 5 23 8.65"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const linkBase =
  'group inline-flex items-center gap-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-300';

const linkHover = 'hover:text-ink/80';

/** Text link + arrow (About, Methodology CTAs) */
export function EditorialArrowLink({
  href,
  children,
  className = '',
  ...rest
}: ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link href={href} className={`${linkBase} ${linkHover} ${className}`} {...rest}>
      <span>{children}</span>
      <span className="text-ink transition-transform duration-300 ease-out group-hover:translate-x-1">
        <EditorialArrowIcon className="block" />
      </span>
    </Link>
  );
}

type SubmitButtonProps = ComponentPropsWithoutRef<'button'> & {
  children?: ReactNode;
};

/** Solid primary submit — Contact form */
export function EditorialSubmitButton({ children = 'Submit', className = '', ...rest }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className={`
        group relative inline-flex w-full items-center justify-center gap-4 overflow-hidden
        border border-ink bg-ink px-10 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white
        transition-all duration-300 ease-out
        hover:bg-ink/90 active:scale-[0.995]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/30
        sm:w-auto sm:min-w-[220px]
        ${className}
      `}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5">
        <EditorialArrowIcon className="block" />
      </span>
    </button>
  );
}
