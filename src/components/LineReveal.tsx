import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import './LineReveal.css';

type LineTag = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface LineRevealProps {
  /** One entry per visual line; each line rises out of its own mask. */
  lines: ReactNode[];
  as?: LineTag;
  className?: string;
  id?: string;
  /** Hero headlines above the fold reveal on mount instead of on scroll. */
  immediate?: boolean;
}

/**
 * Headline line-mask reveal: each line sits in an overflow-hidden mask and
 * rises into place with a 90 ms stagger. It runs once, and reduced motion
 * shows the finished state immediately.
 */
export default function LineReveal({
  lines,
  as = 'h2',
  className,
  id,
  immediate = false,
}: LineRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useShouldReduceMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (
      reduceMotion ||
      immediate ||
      typeof IntersectionObserver === 'undefined'
    ) {
      node.classList.add('is-revealed');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        node.classList.add('is-revealed');
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate, reduceMotion]);

  const Tag = as as ElementType;

  return createElement(
    Tag,
    {
      ref,
      id,
      className: ['line-reveal', className ?? ''].filter(Boolean).join(' '),
    },
    lines.map((line, index) => (
      <span
        // Lines are positional; content is not a stable key.
        key={index}
        className="line-reveal__mask"
        style={{ '--line-index': index } as CSSProperties}
      >
        <span className="line-reveal__inner">{line}</span>
      </span>
    ))
  );
}
