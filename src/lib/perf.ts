/**
 * Progressive performance guard.
 *
 * One short sampling window after load measures frame time. If the device
 * cannot hold the budget, effects are removed in a fixed order — reflection,
 * sheen, tilt, hotspot leaders, then extra lava blobs — so the page gets
 * cheaper without ever dropping content or functionality.
 */

export type PerfLevel = 0 | 1 | 2 | 3 | 4 | 5;

const EVENTS: Record<Exclude<PerfLevel, 0>, string> = {
  1: 'reflection',
  2: 'sheen',
  3: 'tilt',
  4: 'hotspots',
  5: 'blobs',
};

let level: PerfLevel = 0;

export function getPerfLevel(): PerfLevel {
  return level;
}

export function escalatePerf(): PerfLevel {
  if (level >= 5) return level;
  const next = (level + 1) as Exclude<PerfLevel, 0>;
  level = next;
  document.documentElement.dataset.perf = String(next);
  window.dispatchEvent(
    new CustomEvent('zitouni:perf', { detail: EVENTS[next] })
  );
  return next;
}

/** True once tilt should stop responding (sheen and reflection are CSS-only). */
export function perfDisablesTilt(): boolean {
  return level >= 3;
}
