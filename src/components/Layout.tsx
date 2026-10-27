import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

const supportsViewTransitions =
  typeof document !== 'undefined' && 'startViewTransition' in document;

export default function Layout({ children }: LayoutProps) {
  const { pathname, hash } = useLocation();
  const { transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (hash) {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        return;
      }

      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <Header />
      <m.main
        key={pathname}
        ref={mainRef}
        id="main"
        tabIndex={-1}
        initial={supportsViewTransitions ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ...transition.fade,
          duration: reduceMotion ? 0.12 : transition.fade.duration,
        }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </m.main>
      <Footer />
    </>
  );
}
