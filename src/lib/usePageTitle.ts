import { useEffect } from 'react';

const BASE_TITLE = 'Zitouni Telecom';

/**
 * Keeps the document title in sync with the active storefront page.
 * Kept in one hook so product, category and editorial pages stay consistent.
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${BASE_TITLE}`
      : `${BASE_TITLE} — La tech, sans compromis`;
  }, [title]);
}
