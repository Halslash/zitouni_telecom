/**
 * Shared image morph between a product card / strip / flyout preview and the
 * product page's media stage.
 *
 * React Router's `viewTransition` links call `document.startViewTransition`
 * themselves, so all this helper does is give the clicked visual a unique
 * `view-transition-name` before the snapshot and let CSS opt the destination
 * stage into the same name. The name is removed shortly after, and the whole
 * thing is skipped when the browser has no View Transitions or the user asked
 * for reduced motion — navigation then falls back to the normal page fade.
 */

const MORPH_NAME = 'product-morph';
const MORPH_CLASS = 'is-morphing';
const CLEAR_AFTER = 1000;

let active: HTMLElement | null = null;
let timer = 0;

export function clearProductMorph(): void {
  if (timer) {
    window.clearTimeout(timer);
    timer = 0;
  }
  if (active) {
    active.style.removeProperty('view-transition-name');
    active = null;
  }
  document.documentElement.classList.remove(MORPH_CLASS);
}

export function startProductMorph(source: HTMLElement | null): void {
  if (!source) return;
  if (typeof document === 'undefined' || !('startViewTransition' in document)) {
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  clearProductMorph();
  document.documentElement.classList.add(MORPH_CLASS);
  source.style.viewTransitionName = MORPH_NAME;
  active = source;
  timer = window.setTimeout(clearProductMorph, CLEAR_AFTER);
}
