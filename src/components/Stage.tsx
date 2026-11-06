import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { perfDisablesTilt } from '../lib/perf';
import './Stage.css';

/**
 * The common way a device is presented: a soft radial spotlight behind it,
 * an elliptical floor shadow, and optionally a flipped copy at ~10% opacity
 * masked into the floor as a reflection.
 *
 * The reflection is desktop-only (extra horizontal space) and removed under
 * reduced motion — both handled purely in CSS. Tilt is pointer-driven,
 * transform-only, capped at 3 degrees, and only engages on fine pointers
 * without reduced motion.
 */
interface StageProps {
  children: ReactNode;
  /** Render a masked floor reflection (desktop only). */
  reflect?: boolean;
  /** Enable the ±3° pointer tilt on the device. */
  tilt?: boolean;
  /** Add a pointer-following highlight over the device (desktop only). */
  sheen?: boolean;
  className?: string;
}

const TILT_MAX = 3;

export default function Stage({
  children,
  reflect = false,
  tilt = false,
  sheen = false,
  className,
}: StageProps) {
  const nodeRef = useRef<HTMLElement>(null);
  const frameRef = useRef(0);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const node = nodeRef.current;
      if (!node || event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        if (sheen) {
          node.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
          node.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
          node.style.setProperty('--sheen-opacity', '1');
        }
        if (tilt && !perfDisablesTilt()) {
          const tiltX = -((y / rect.height) * 2 - 1) * TILT_MAX;
          const tiltY = ((x / rect.width) * 2 - 1) * TILT_MAX;
          node.style.setProperty('--stage-tilt-x', `${tiltX.toFixed(2)}deg`);
          node.style.setProperty('--stage-tilt-y', `${tiltY.toFixed(2)}deg`);
        }
      });
    },
    [sheen, tilt]
  );

  const onPointerLeave = useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    cancelAnimationFrame(frameRef.current);
    node.style.setProperty('--sheen-opacity', '0');
    node.style.setProperty('--stage-tilt-x', '0deg');
    node.style.setProperty('--stage-tilt-y', '0deg');
  }, []);

  const stageClass = [
    'stage',
    reflect ? 'stage--reflect' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure
      ref={nodeRef}
      className={stageClass}
      data-tilt={tilt || undefined}
      data-sheen={sheen || undefined}
      aria-hidden="true"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span className="stage__spot" aria-hidden="true" />
      <div className="stage__device">{children}</div>
      <span className="stage__shadow" aria-hidden="true" />
      {sheen && <span className="stage__sheen" aria-hidden="true" />}
      {reflect && (
        <div className="stage__reflection" aria-hidden="true">
          {children}
        </div>
      )}
    </figure>
  );
}
