import { useMemo, type ReactNode } from 'react';
import {
  LazyMotion,
  domAnimation,
  type Transition,
  type Variants,
} from 'motion/react';
import { AnimateUIProvider } from '@animate-ui/react/provider';
import {
  ReducedMotionConfig,
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';

/**
 * The long-form easing curve used for entrances and scene changes. It starts
 * quickly and settles slowly, which reads as depth rather than decoration.
 */
export const cinematicEase = [0.16, 1, 0.3, 1] as const;

export const cinematicTransition: Transition = {
  duration: 0.72,
  ease: cinematicEase,
};

/**
 * Global motion setup.
 *
 * Animate UI's provider paces the shared interaction tokens while the longer
 * cinematic transitions above are used for page-level entrances.
 *
 * `strict` is intentionally off: Animate UI effects use Motion components
 * directly, and strict LazyMotion would reject them. Reduced motion is still
 * handled once for every component below.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <AnimateUIProvider tempo={0.85}>
      <ReducedMotionConfig>
        <LazyMotion features={domAnimation}>{children}</LazyMotion>
      </ReducedMotionConfig>
    </AnimateUIProvider>
  );
}

interface EntranceOptions {
  distance?: number;
  delay?: number;
  scale?: number;
  duration?: number;
}

/**
 * A cinematic fade + rise for a single element.
 * The transform is dropped entirely when the user asks for reduced motion.
 */
export function useEntrance({
  distance = 18,
  delay = 0,
  scale = 1,
  duration = 0.8,
}: EntranceOptions = {}) {
  const reduce = useShouldReduceMotion();

  return useMemo(
    () => ({
      initial: {
        opacity: 0,
        y: reduce ? 0 : distance,
        scale: reduce ? 1 : scale,
      },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        ...cinematicTransition,
        duration: reduce ? 0.18 : duration,
        delay: reduce ? 0 : delay,
      },
    }),
    [distance, delay, duration, reduce, scale]
  );
}

/**
 * Staggered entrance for a small group of elements (hero copy, empty states).
 * The movement is deliberately slower than hover feedback, but still tight
 * enough to settle before the user starts scrolling.
 */
export function useStaggerReveal(
  distance = 24,
  staggerDelay = 0.075,
  duration = 0.72
) {
  const reduce = useShouldReduceMotion();
  const { transition } = useMotionTokens();

  const container: Variants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduce ? 0 : staggerDelay,
          delayChildren: reduce ? 0 : 0.06,
        },
      },
    }),
    [reduce, staggerDelay]
  );

  const item: Variants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: reduce ? 0 : distance,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: reduce ? transition.fade : {
          ...cinematicTransition,
          duration,
        },
      },
    }),
    [distance, duration, reduce, transition]
  );

  return { container, item };
}
