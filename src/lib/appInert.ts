let locks = 0;

/**
 * Ref-counted inert for the app root while a modal layer is open.
 * Portals live outside #root, so the dialog itself stays interactive while
 * the background cannot be tabbed or clicked.
 */
export function lockAppInert() {
  if (locks === 0) {
    document.getElementById('root')?.setAttribute('inert', '');
  }
  locks += 1;
}

export function unlockAppInert() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.getElementById('root')?.removeAttribute('inert');
  }
}
