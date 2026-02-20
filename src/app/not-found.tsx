import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SectionWrapper } from '@/components/layout/section-wrapper';
import { IconArrowRight } from '@/components/icons';

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <SectionWrapper className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl font-heading font-bold text-ink/10">404</span>
            <h1 className="text-2xl font-heading font-bold text-ink mt-4 mb-2">
              Page not found
            </h1>
            <p className="text-sm text-gray mb-8">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-cream text-sm font-semibold rounded-[10px] hover:bg-ink/90 transition-colors"
            >
              Return home
              <IconArrowRight size={16} />
            </Link>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
