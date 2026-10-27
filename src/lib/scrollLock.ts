let locks = 0;
let previousPaddingRight = '';

/**
 * Ref-counted body scroll lock shared by every overlay.
 *
 * Overlays can stack (for example the wilaya picker inside the mobile
 * drawer), so a boolean class is not enough: the inner overlay must not
 * unlock the page while the outer one is still open.
 *
 * The scrollbar gutter is compensated once, on the outermost lock, so
 * opening a drawer does not shift the page sideways on desktop.
 */
export function lockBodyScroll() {
  if (locks === 0) {
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    previousPaddingRight = document.body.style.paddingRight;
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    document.body.classList.add('is-locked');
  }
  locks += 1;
}

export function unlockBodyScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.classList.remove('is-locked');
    document.body.style.paddingRight = previousPaddingRight;
  }
}
