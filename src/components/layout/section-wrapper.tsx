import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'aside';
  narrow?: boolean;
  noPadding?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  as: Component = 'section',
  narrow = false,
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
          narrow ? 'max-w-4xl' : 'max-w-[1400px]'
        )}
      >
        {children}
      </div>
    </Component>
  );
}
