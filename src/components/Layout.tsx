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
import { clearProductMorph, startProductMorph } from '../lib/morph';
import { escalatePerf } from '../lib/perf';

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
    clearProductMorph();
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  /* Mark the clicked product visual so the destination stage can morph into it. */
  useEffect(() => {
    if (reduceMotion) return undefined;
    if (!supportsViewTransitions) return undefined;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>('a[data-morph-source]');
      if (!link) return;
      startProductMorph(link.querySelector<HTMLElement>('.product-visual'));
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [reduceMotion]);

  /* Frame-time guard: sample briefly after load, then degrade in order. */
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let started = last;
    let elapsed = 0;
    let frames = 0;

    const sample = (now: number) => {
      const dt = Math.min(80, now - last);
      last = now;
      const sinceStart = now - started;

      // Ignore the first frames while the page settles.
      if (sinceStart > 400) {
        elapsed += dt;
        frames += 1;
      }

      if (frames >= 90) {
        const average = elapsed / frames;
        elapsed = 0;
        frames = 0;
        if (average > 22) escalatePerf();
      }

      if (sinceStart < 6000) frame = requestAnimationFrame(sample);
    };

    frame = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(frame);
  }, []);

  /* Subtle magnetic pull on primary pills — fine pointers, full motion only. */
  useEffect(() => {
    if (reduceMotion) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined;
    }

    let current: HTMLElement | null = null;
    let frame = 0;

    const reset = () => {
      if (!current) return;
      current.style.removeProperty('--magnet-x');
      current.style.removeProperty('--magnet-y');
      current = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLElement>(
        '.btn--primary, .btn--accent'
      );
      if (!button) {
        reset();
        return;
      }
      if (button !== current) {
        reset();
        current = button;
      }
      const rect = button.getBoundingClientRect();
      const dx = ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 6;
      const dy = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 6;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        button.style.setProperty('--magnet-x', `${dx.toFixed(1)}px`);
        button.style.setProperty('--magnet-y', `${dy.toFixed(1)}px`);
      });
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', reset);
    window.addEventListener('scroll', reset, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', reset);
      window.removeEventListener('scroll', reset);
      reset();
    };
  }, [reduceMotion]);

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
