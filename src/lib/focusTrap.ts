const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Returns the elements that can actually receive Tab focus.
 *
 * Radios share a single tab stop (the checked one), so treating every radio
 * as tabbable lets focus escape a modal that ends with a radio group.
 */
export function getTabbable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    if (element.hidden) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    if (element.getClientRects().length === 0) return false;
    if (
      element instanceof HTMLInputElement &&
      element.type === 'radio' &&
      !element.checked
    ) {
      return false;
    }
    return true;
  });
}

/** Keeps Tab / Shift+Tab inside a modal layer. */
export function trapTabKey(
  event: KeyboardEvent,
  container: HTMLElement | null
): void {
  if (event.key !== 'Tab') return;

  const tabbables = getTabbable(container);
  if (tabbables.length === 0) {
    event.preventDefault();
    return;
  }

  const currentIndex = tabbables.indexOf(
    document.activeElement as HTMLElement
  );
  const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;

  if (currentIndex === -1 || nextIndex < 0 || nextIndex >= tabbables.length) {
    event.preventDefault();
    const target = event.shiftKey
      ? tabbables[tabbables.length - 1]
      : tabbables[0];
    target.focus();
  }
}
