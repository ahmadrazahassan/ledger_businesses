import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'aside';
  narrow?: boolean;
  /** Wider reading width for grids (category strips, listings). */
  wide?: boolean;
  noPadding?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  as: Component = 'section',
  narrow = false,
  wide = false,
  noPadding = false,
}: SectionWrapperProps) {
  return (
    <Component
      id={id}
      className={cn(
        'w-full',
        !noPadding && 'py-14 md:py-18',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto px-5 md:px-10',
          narrow ? 'max-w-4xl' : wide ? 'max-w-[min(1520px,calc(100vw-2.5rem))]' : 'max-w-[min(1480px,calc(100vw-2.5rem))]'
        )}
      >
        {children}
      </div>
    </Component>
  );
}
