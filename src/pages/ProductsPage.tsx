import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Link } from '../components/AppLink';
import ProductCard from '../components/ProductCard';
import {
  ArrowRightIcon,
  CloseIcon,
  InfoIcon,
  SearchIcon,
  ShieldCheckIcon,
  SlidersIcon,
  SupportIcon,
  TruckIcon,
} from '../components/Icons';
import {
  CATEGORY_PATHS,
  categories,
  getCategoryBySlug,
  getCategoryCount,
  getProductsByCategory,
  getSaleProducts,
  products,
  searchProducts,
  type Product,
} from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { trapTabKey } from '../lib/focusTrap';
import './ProductsPage.css';

const PRICE_RANGES = [
  { id: 'all', label: 'Tous les budgets', min: 0, max: Infinity },
  { id: 'under-50k', label: 'Moins de 50 000 DA', min: 0, max: 49_999 },
  { id: '50k-100k', label: '50 000 – 100 000 DA', min: 50_000, max: 99_999 },
  {
    id: '100k-200k',
    label: '100 000 – 200 000 DA',
    min: 100_000,
    max: 199_999,
  },
  { id: 'over-200k', label: 'Plus de 200 000 DA', min: 200_000, max: Infinity },
] as const;

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Pertinence' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
  { id: 'name', label: 'Nom, A à Z' },
] as const;

interface CatalogNavItem {
  to: string;
  label: string;
  count: number;
  active: boolean;
}

function getPriceRange(id: string) {
  return PRICE_RANGES.find((range) => range.id === id) ?? PRICE_RANGES[0];
}

function sortProducts(items: Product[], sort: string): Product[] {
  const next = [...items];

  switch (sort) {
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price);
    case 'name':
      return next.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    case 'relevance':
    default:
      return next;
  }
}

interface FilterPanelProps {
  navItems: CatalogNavItem[];
  priceId: string;
  hasFilters: boolean;
  onPriceChange: (id: string) => void;
  onClear: () => void;
  onNavigate?: () => void;
}

function FilterPanel({
  navItems,
  priceId,
  hasFilters,
  onPriceChange,
  onClear,
  onNavigate,
}: FilterPanelProps) {
  const groupName = useId();

  return (
    <div className="catalog-filters__inner">
      <div className="catalog-filters__group">
        <h3 className="catalog-filters__title">Rayons</h3>
        <ul className="catalog-rail">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`catalog-rail__link${
                  item.active ? ' is-active' : ''
                }`}
                aria-current={item.active ? 'page' : undefined}
                onClick={onNavigate}
                viewTransition={!onNavigate}
              >
                <span>{item.label}</span>
                <span className="catalog-rail__count">{item.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="catalog-filters__group">
        <h3 className="catalog-filters__title">Budget</h3>
        <div
          className="catalog-budget"
          role="radiogroup"
          aria-label="Filtrer par budget"
        >
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className={`catalog-option${
                priceId === range.id ? ' is-selected' : ''
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={range.id}
                checked={priceId === range.id}
                onChange={() => onPriceChange(range.id)}
              />
              <span className="catalog-option__mark" aria-hidden="true" />
              <span className="catalog-option__label">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="catalog-filters__clear"
        onClick={onClear}
        disabled={!hasFilters}
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { category: categoryParam } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const sheetOffset = reduceMotion ? 0 : 24;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = useId();

  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const isPromotions = pathname === '/promotions';
  const pathCategory = categories.find(
    (category) => CATEGORY_PATHS[category.id] === pathname
  );
  const routeCategory = pathCategory ?? getCategoryBySlug(categoryParam);

  const query = searchParams.get('q')?.trim() ?? '';
  const priceId = getPriceRange(searchParams.get('prix') ?? 'all').id;
  const requestedSort = searchParams.get('tri') ?? 'relevance';
  const sortId = SORT_OPTIONS.some((option) => option.id === requestedSort)
    ? requestedSort
    : 'relevance';

  /* Legacy /produits/:category URLs are permanently moved to the canonical
     category path so navigation, breadcrumbs and links stay consistent. */
  useEffect(() => {
    if (!categoryParam) return;

    const resolved = getCategoryBySlug(categoryParam);
    const target = resolved
      ? `${CATEGORY_PATHS[resolved.id]}${location.search}`
      : `/produits${location.search}`;

    navigate(target, { replace: true });
  }, [categoryParam, location.search, navigate]);

  useEffect(() => {
    setFiltersOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!filtersOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockBodyScroll();
    lockAppInert();
    dialogRef.current?.removeAttribute('inert');

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setFiltersOpen(false);
        return;
      }

      trapTabKey(event, dialogRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      unlockAppInert();
      /* Keep the leaving sheet out of the tab order while it animates out. */
      dialogRef.current?.setAttribute('inert', '');
      previouslyFocused?.focus?.();
    };
  }, [filtersOpen]);

  const catalogProducts = useMemo(() => {
    let source: Product[] = routeCategory
      ? getProductsByCategory(routeCategory.id)
      : products;

    if (isPromotions) {
      source = source.filter(
        (product) => product.originalPrice !== undefined
      );
    }

    if (query) {
      const matchingIds = new Set(
        searchProducts(query).map((product) => product.id)
      );
      source = source.filter((product) => matchingIds.has(product.id));
    }

    const range = getPriceRange(priceId);
    source = source.filter(
      (product) => product.price >= range.min && product.price <= range.max
    );

    return sortProducts(source, sortId);
  }, [routeCategory, isPromotions, query, priceId, sortId]);

  const hasFilters = query.length > 0 || priceId !== 'all';
  const activeFilterCount =
    (query ? 1 : 0) + (priceId !== 'all' ? 1 : 0);
  const saleCount = getSaleProducts().length;
  const gridKey = `${routeCategory?.id ?? 'all'}|${
    isPromotions ? 'promo' : 'all'
  }|${query}|${priceId}|${sortId}`;

  const navItems: CatalogNavItem[] = [
    {
      to: '/produits',
      label: 'Tous les produits',
      count: products.length,
      active: !routeCategory && !isPromotions,
    },
    ...categories.map((category) => ({
      to: CATEGORY_PATHS[category.id],
      label: category.name,
      count: getCategoryCount(category.id),
      active: routeCategory?.id === category.id,
    })),
    {
      to: '/promotions',
      label: 'Promotions',
      count: saleCount,
      active: isPromotions,
    },
  ];

  const heading = routeCategory
    ? routeCategory.name
    : isPromotions
      ? 'Promotions'
      : query
        ? `Résultats pour « ${query} »`
        : 'Tous les produits';

  const description = routeCategory
    ? routeCategory.intro
    : isPromotions
      ? 'Les remises du moment sur des produits neufs et garantis. Le prix barré correspond au prix de référence du catalogue.'
      : 'Smartphones, ordinateurs, tablettes, gaming et accessoires : comparez les références disponibles et choisissez selon votre usage et votre budget.';

  usePageTitle(
    query && !routeCategory && !isPromotions
      ? `Recherche : ${query}`
      : heading
  );

  const updateParams = (
    updates: Record<string, string | null>
  ) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    setSearchParams(next, { replace: true });
  };

  const handleClear = () => {
    setSearchParams({}, { replace: true });
  };

  const priceRange = getPriceRange(priceId);

  return (
    <div className="catalog-page">
      <section className="page-hero catalog-hero">
        <div className="container">
          <div className="catalog-hero__top">
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <Link to="/">Accueil</Link>
              <span className="breadcrumb__sep" aria-hidden="true">
                /
              </span>
              {routeCategory || isPromotions ? (
                <>
                  <Link to="/produits">Boutique</Link>
                  <span className="breadcrumb__sep" aria-hidden="true">
                    /
                  </span>
                  <span aria-current="page">
                    {isPromotions ? 'Promotions' : routeCategory?.name}
                  </span>
                </>
              ) : (
                <span aria-current="page">
                  {query ? 'Recherche' : 'Boutique'}
                </span>
              )}
            </nav>

            <span className="catalog-hero__count">
              {catalogProducts.length} produit
              {catalogProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <span className="eyebrow">
            {isPromotions
              ? 'Offres en cours'
              : routeCategory
                ? 'Collection'
                : 'Catalogue'}
          </span>
          <h1 className="page-hero__title">{heading}</h1>
          <p className="page-hero__desc">{description}</p>

          <div className="page-hero__meta">
            <span>
              <TruckIcon size={15} />
              Livraison 24–72 h
            </span>
            <span>
              <ShieldCheckIcon size={15} />
              Garantie officielle
            </span>
            <span>
              <SupportIcon size={15} />
              Conseil avant achat
            </span>
          </div>

          <nav className="catalog-cats" aria-label="Parcourir les rayons">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`catalog-cats__link${
                  item.active ? ' is-active' : ''
                }`}
                aria-current={item.active ? 'page' : undefined}
                viewTransition
              >
                {item.label}
                <span>{item.count}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="section catalog-body" aria-label="Catalogue">
        <div className="container catalog-layout">
          <aside className="catalog-sidebar" aria-label="Filtres du catalogue">
            <FilterPanel
              navItems={navItems}
              priceId={priceId}
              hasFilters={hasFilters}
              onPriceChange={(id) => updateParams({ prix: id === 'all' ? null : id })}
              onClear={handleClear}
            />

            <div className="catalog-help">
              <span className="catalog-help__icon">
                <SupportIcon size={19} />
              </span>
              <h3>Un doute sur un modèle ?</h3>
              <p>
                Comparez autonomie, stockage et compatibilité avec notre
                équipe avant de commander.
              </p>
              <Link to="/aide#contact" className="catalog-help__link">
                Nous écrire
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </aside>

          <div className="catalog-results">
            <div className="catalog-toolbar">
              <div className="catalog-toolbar__left">
                <button
                  type="button"
                  className="catalog-filter-trigger"
                  onClick={() => setFiltersOpen(true)}
                  aria-expanded={filtersOpen}
                  aria-controls="catalog-filter-sheet"
                >
                  <SlidersIcon size={17} />
                  Filtrer
                  {activeFilterCount > 0 && (
                    <span className="catalog-filter-trigger__count">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <p className="catalog-results__count" role="status">
                  <strong>{catalogProducts.length}</strong>{' '}
                  {catalogProducts.length > 1
                    ? 'références trouvées'
                    : 'référence trouvée'}
                </p>
              </div>

              <div className="catalog-sort">
                <label htmlFor="catalog-sort" className="catalog-sort__label">
                  Trier par
                </label>
                <select
                  id="catalog-sort"
                  className="select catalog-sort__select"
                  value={sortId}
                  onChange={(event) =>
                    updateParams({
                      tri:
                        event.target.value === 'relevance'
                          ? null
                          : event.target.value,
                    })
                  }
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="catalog-chips" aria-label="Filtres actifs">
                <span className="catalog-chips__label">Filtres</span>

                {query && (
                  <button
                    type="button"
                    className="catalog-chip"
                    onClick={() => updateParams({ q: null })}
                  >
                    « {query} »
                    <CloseIcon size={12} />
                  </button>
                )}

                {priceId !== 'all' && (
                  <button
                    type="button"
                    className="catalog-chip"
                    onClick={() => updateParams({ prix: null })}
                  >
                    {priceRange.label}
                    <CloseIcon size={12} />
                  </button>
                )}

                <button
                  type="button"
                  className="catalog-chips__clear"
                  onClick={handleClear}
                >
                  Tout effacer
                </button>
              </div>
            )}

            {catalogProducts.length > 0 ? (
                <m.div
                  key={gridKey}
                  className="product-grid product-grid--3 catalog-grid"
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 6,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transition.fade}
                >
                  {catalogProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </m.div>
              ) : (
                <m.div
                  key="empty"
                  className="empty-state catalog-empty"
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 6,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transition.fade}
                >
                  <span className="empty-state__icon">
                    <SearchIcon size={27} />
                  </span>
                  <h2>Aucun produit ne correspond</h2>
                  <p>
                    Élargissez le budget, retirez la recherche ou parcourez un
                    autre rayon pour retrouver nos références.
                  </p>
                  <div className="empty-state__actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleClear}
                    >
                      Réinitialiser les filtres
                    </button>
                    <Link to="/produits" className="btn btn--outline">
                      Voir tout le catalogue
                    </Link>
                  </div>
                </m.div>
              )}
          </div>
        </div>
      </section>

      {createPortal(
        <AnimatePresence>
          {filtersOpen && (
            <m.div
              key="catalog-filters"
              className="catalog-filter-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fade}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setFiltersOpen(false);
                }
              }}
            >
              <m.div
                ref={dialogRef}
                id="catalog-filter-sheet"
                className="catalog-filter-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby={dialogTitleId}
                initial={{
                  opacity: 0,
                  y: sheetOffset,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: sheetOffset,
                  transition: transition.dismiss,
                }}
                transition={
                  reduceMotion
                    ? transition.fade
                    : { ...transition.sheet, duration: 0.28 }
                }
              >
              <div className="catalog-filter-sheet__head">
                <div>
                  <h2 id={dialogTitleId} className="catalog-filter-sheet__title">
                    Filtrer le catalogue
                  </h2>
                  <p className="catalog-filter-sheet__desc">
                    {catalogProducts.length} produit
                    {catalogProducts.length !== 1 ? 's' : ''} correspondant à
                    votre sélection.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="icon-btn"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Fermer les filtres"
                >
                  <CloseIcon size={19} />
                </button>
              </div>

              <div className="catalog-filter-sheet__body">
                <FilterPanel
                  navItems={navItems}
                  priceId={priceId}
                  hasFilters={hasFilters}
                  onPriceChange={(id) =>
                    updateParams({ prix: id === 'all' ? null : id })
                  }
                  onClear={handleClear}
                  onNavigate={() => setFiltersOpen(false)}
                />
              </div>

              <div className="catalog-filter-sheet__foot">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={handleClear}
                  disabled={!hasFilters}
                >
                  Effacer
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setFiltersOpen(false)}
                >
                  Voir les {catalogProducts.length} produits
                </button>
              </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <div className="catalog-note">
        <div className="container catalog-note__inner">
          <InfoIcon size={16} />
          <p>
            Les prix sont affichés en dinars algériens. La disponibilité est
            indicative et confirmée au moment de la commande.
          </p>
          <Link to="/aide#livraison" className="catalog-note__link">
            Livraison &amp; retours
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
