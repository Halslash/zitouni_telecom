import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';

type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'ul'
  | 'ol'
  | 'dl';

interface RevealProps {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  id?: string;
  /** Reveal direct children with a short, synchronized stagger. */
  stagger?: boolean;
  /** Extra delay in milliseconds. */
  delay?: number;
  /** Travel distance in pixels. */
  distance?: number;
  /** IntersectionObserver threshold. */
  threshold?: number;
}

/**
 * One shared, one-shot reveal group.
 *
 * IntersectionObserver adds a class instead of setting React state, so a
 * section coming into view never re-renders the page. The CSS handles the
 * motion, which also means it can be disabled cleanly for reduced motion.
 */
export default function Reveal({
  children,
  as = 'div',
  className,
  id,
  stagger = false,
  delay = 0,
  distance = 26,
  threshold = 0.08,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useShouldReduceMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-revealed');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        node.classList.add('is-revealed');
        observer.disconnect();
      },
      {
        threshold,
        rootMargin: '0px 0px -9% 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion, threshold]);

  const Tag = as as ElementType;

  return createElement(
    Tag,
    {
      ref,
      id,
      className: [
        'reveal',
        stagger ? 'reveal-stagger' : '',
        reduceMotion ? 'reveal--reduced' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' '),
      style: {
        '--reveal-delay': `${delay}ms`,
        '--reveal-distance': `${distance}px`,
      } as CSSProperties,
    },
    children
  );
}
