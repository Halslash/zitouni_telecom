import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, m } from 'motion/react';
import { useMotionTokens, useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { searchProducts, categories, CATEGORY_PATHS } from '../data/products';
import type { Product } from '../data/products';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { trapTabKey } from '../lib/focusTrap';
import ProductImage from './ProductImage';
import { ChevronRightIcon, SearchIcon } from './Icons';
import './SearchPalette.css';

const PRODUCTS_GROUP_ID = 'search-palette-products';
const CATEGORIES_GROUP_ID = 'search-palette-categories';

interface PaletteResult {
  kind: 'product' | 'category';
  id: string;
  name: string;
  href: string;
  product?: Product;
}

/**
 * Full-screen command palette. A large input, live results grouped by
 * Produits and Catégories (existing data only), arrow-key navigation,
 * Enter opens, Escape closes and focus returns to the trigger.
 */
interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
  /** Where focus returns when the palette closes. */
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

export default function SearchPalette({
  open,
  onClose,
  restoreFocusRef,
}: SearchPaletteProps) {
  const navigate = useNavigate();
  const reduceMotion = useShouldReduceMotion();
  const { spring } = useMotionTokens();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const term = query.trim();
  const matchedProducts = term ? searchProducts(term) : [];
  const matchedCategories = term
    ? categories.filter((category) =>
        `${category.name} ${category.description}`
          .toLowerCase()
          .includes(term.toLowerCase())
      )
    : [];

  const results: PaletteResult[] = [
    ...matchedProducts.map((product) => ({
      kind: 'product' as const,
      id: product.id,
      name: product.name,
      href: `/produit/${product.id}`,
      product,
    })),
    ...matchedCategories.map((category) => ({
      kind: 'category' as const,
      id: category.id,
      name: category.name,
      href: CATEGORY_PATHS[category.id],
    })),
  ];

  const hasResults = term.length > 0 && results.length > 0;
  const hasTerm = term.length > 0;

  useEffect(() => {
    setActiveIndex(0);
  }, [term]);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    boxRef.current?.removeAttribute('inert');
    lockAppInert();
    lockBodyScroll();
    const focusTimer = window.setTimeout(
      () => inputRef.current?.focus(),
      40
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      trapTabKey(event, boxRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      unlockAppInert();
      boxRef.current?.setAttribute('inert', '');
      (restoreFocusRef?.current ?? previouslyFocused)?.focus?.();
    };
  }, [open, onClose, restoreFocusRef]);

  const openResult = useCallback(
    (href: string) => {
      navigate(href);
      onClose();
    },
    [navigate, onClose]
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!hasResults) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(
        (index) => (index - 1 + results.length) % results.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) openResult(target.href);
    }
  };

  let flatIndex = -1;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="search-palette"
          role="dialog"
          aria-modal="true"
          aria-label="Rechercher dans la boutique"
        >
          <m.div
            className="search-palette__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.24 }}
            onClick={onClose}
          />
          <m.div
            ref={boxRef}
            className="search-palette__panel"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-haspopup="listbox"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.985 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.99 }}
            transition={reduceMotion ? { duration: 0.12 } : spring.dialog}
            onKeyDown={handleKeyDown}
          >
            <form
              className="search-palette__field"
              role="search"
              aria-label="Rechercher"
              onSubmit={(event) => {
                event.preventDefault();
                if (!term) return;
                navigate(`/produits?q=${encodeURIComponent(term)}`);
                onClose();
              }}
            >
              <SearchIcon size={20} className="search-palette__glass-icon" />
              <input
                ref={inputRef}
                className="search-palette__input"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un produit, une catégorie…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Rechercher un produit ou une catégorie"
                aria-activedescendant={
                  hasResults
                    ? `${listId}-${results[activeIndex]?.kind}-${results[activeIndex]?.id}`
                    : undefined
                }
              />
            </form>

            <div
              id={listId}
              role="listbox"
              aria-label="Résultats de recherche"
              className="search-palette__results"
            >
              {!hasTerm && (
                <p className="search-palette__hint">
                  Commencez à taper — les produits et les catégories
                  apparaissent ici.
                </p>
              )}

              {hasTerm && results.length === 0 && (
                <p className="search-palette__empty" role="status">
                  Aucun résultat pour « {term} ».
                </p>
              )}

              {matchedProducts.length > 0 && (
                <p
                  className="search-palette__label"
                  aria-hidden="true"
                >
                  Produits
                </p>
              )}
              <ul
                id={PRODUCTS_GROUP_ID}
                className="search-palette__group"
                aria-owns={PRODUCTS_GROUP_ID}
              >
                {matchedProducts.map((product) => {
                  flatIndex += 1;
                  const index = flatIndex;
                  return (
                    <li
                      key={product.id}
                      id={`${listId}-product-${product.id}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={`search-palette__item${
                        index === activeIndex ? ' is-active' : ''
                      }`}
                      onPointerMove={() => setActiveIndex(index)}
                    >
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => {
                          openResult(`/produit/${product.id}`);
                        }}
                      >
                        <span className="search-palette__thumb" aria-hidden="true">
                          <ProductImage
                            src={product.image}
                            alt=""
                            category={product.category}
                            view={1}
                            variant="bare"
                          />
                        </span>
                        <span className="search-palette__item-name">
                          {product.name}
                        </span>
                        <span className="search-palette__group-tag">
                          {product.brand}
                        </span>
                        <ChevronRightIcon size={15} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {matchedCategories.length > 0 && (
                <p
                  className="search-palette__label"
                  aria-hidden="true"
                >
                  Catégories
                </p>
              )}
              <ul
                id={CATEGORIES_GROUP_ID}
                className="search-palette__group"
                aria-owns={CATEGORIES_GROUP_ID}
              >
                {matchedCategories.map((category) => {
                  flatIndex += 1;
                  const index = flatIndex;
                  return (
                    <li
                      key={category.id}
                      id={`${listId}-category-${category.id}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      className={`search-palette__item${
                        index === activeIndex ? ' is-active' : ''
                      }`}
                      onPointerMove={() => setActiveIndex(index)}
                    >
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => openResult(CATEGORY_PATHS[category.id])}
                      >
                        <span
                          className="search-palette__thumb search-palette__thumb--glyph"
                          aria-hidden="true"
                        >
                          <SearchIcon size={16} />
                        </span>
                        <span className="search-palette__item-name">
                          {category.name}
                        </span>
                        <span className="search-palette__group-tag">
                          Catégorie
                        </span>
                        <ChevronRightIcon size={15} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="search-palette__foot" aria-hidden="true">
              <kbd>↑↓</kbd> naviguer
              <kbd>↵</kbd> ouvrir
              <kbd>esc</kbd> fermer
            </p>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
