import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { getProductsByCategory } from '../data/products';
import type { Category } from '../data/products';
import ProductImage from './ProductImage';
import './NavFlyout.css';

export const NAV_FLYOUT_ID = 'site-nav-flyout';

interface NavFlyoutProps {
  activeCategory: Category | null;
  onOpen: (cat: Category | null) => void;
}

type FlyoutState = 'closed' | 'opening' | 'open' | 'switching' | 'closing';

const CATEGORY_LABELS: Record<Category, string> = {
  smartphones: 'Téléphones',
  laptops: 'Ordinateurs',
  tablets: 'Tablettes',
  gaming: 'Gaming',
  accessories: 'Accessoires',
};

const CATEGORY_PATHS: Record<Category, string> = {
  smartphones: '/telephones',
  laptops: '/ordinateurs',
  tablets: '/tablettes',
  gaming: '/gaming',
  accessories: '/accessoires',
};

const OUT_MS = 140;
const IN_MS = 350;
const OPEN_MS = 200;

export default function NavFlyout({ activeCategory, onOpen }: NavFlyoutProps) {
  const [state, setState] = useState<FlyoutState>('closed');
  const [displayCategory, setDisplayCategory] = useState<Category>('smartphones');
  const [contentKey, setContentKey] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((timer) => timer !== id);
      fn();
    }, ms);
    timers.current.push(id);
  };

  const showCategory = (cat: Category) => {
    setDisplayCategory(cat);
    setContentKey((key) => key + 1);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const outMs = reduceMotion ? 0 : OUT_MS;
    const inMs = reduceMotion ? 0 : IN_MS;
    const closeMs = reduceMotion ? 0 : OPEN_MS;

    const run = () => {
      if (activeCategory === null) {
        if (state === 'closed' || state === 'closing') return;
        clearTimers();
        setState('closing');
        schedule(() => setState('closed'), closeMs);
        return;
      }

      if (activeCategory === displayCategory) {
        if (state === 'closed' || state === 'closing' || state === 'switching') {
          clearTimers();
          setContentKey((key) => key + 1);
          setState('opening');
          schedule(() => setState('open'), inMs);
        }
        return;
      }

      if (state === 'closed' || state === 'closing') {
        clearTimers();
        showCategory(activeCategory);
        setState('opening');
        schedule(() => setState('open'), inMs);
        return;
      }

      // Already visible: fade the current columns out, then bring the
      // latest requested category in. A newer request cancels both timers.
      clearTimers();
      setState('switching');
      schedule(() => {
        showCategory(activeCategory);
        setState('opening');
        schedule(() => setState('open'), inMs);
      }, outMs);
    };

    run();
    return clearTimers;
    // The machine reacts to the requested category only; display state
    // is read from the current render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (state === 'closed') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpen(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state, onOpen]);

  const products = getProductsByCategory(displayCategory);
  const categoryPath = CATEGORY_PATHS[displayCategory];
  const isOpen = state === 'opening' || state === 'open' || state === 'switching';
  const isHidden = state === 'closed' || state === 'closing';

  return (
    <>
      <div
        className={`nav-flyout-backdrop${state !== 'closed' ? ' is-visible' : ''}`}
        aria-hidden="true"
        onClick={() => onOpen(null)}
      />
      <div
        id={NAV_FLYOUT_ID}
        className={`nav-flyout${isOpen ? ' is-open' : ''}`}
        role="region"
        aria-label={`Menu ${CATEGORY_LABELS[displayCategory]}`}
        aria-hidden={isHidden || undefined}
        inert={isHidden}
        onMouseEnter={() => onOpen(displayCategory)}
        onMouseLeave={() => onOpen(null)}
      >
        <div className="nav-flyout__inner">
          <div
            className={`nav-flyout__grid${state === 'switching' ? ' is-leaving' : ''}`}
            key={`${displayCategory}-${contentKey}`}
          >
            <div className="nav-flyout__col" style={{ animationDelay: '0ms' }}>
              <div className="nav-flyout__label">
                Explorer les {CATEGORY_LABELS[displayCategory].toLowerCase()}
              </div>
              <Link
                to={categoryPath}
                className="nav-flyout__link nav-flyout__link--large"
                viewTransition
                onClick={() => onOpen(null)}
              >
                Tout voir ›
              </Link>
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/produit/${product.id}`}
                  className="nav-flyout__link nav-flyout__link--product"
                  viewTransition
                  onClick={() => onOpen(null)}
                >
                  <span className="nav-flyout__thumb" aria-hidden="true">
                    <ProductImage
                      src={product.image}
                      alt=""
                      category={product.category}
                      view={1}
                      variant="bare"
                    />
                  </span>
                  {product.name}
                </Link>
              ))}
            </div>
            <div className="nav-flyout__col" style={{ animationDelay: '30ms' }}>
              <div className="nav-flyout__label">Acheter</div>
              <Link
                to={categoryPath}
                className="nav-flyout__link"
                viewTransition
                onClick={() => onOpen(null)}
              >
                Tous les {CATEGORY_LABELS[displayCategory].toLowerCase()}
              </Link>
              <Link
                to="/produits"
                className="nav-flyout__link"
                viewTransition
                onClick={() => onOpen(null)}
              >
                Toute la boutique
              </Link>
            </div>
            <div className="nav-flyout__col" style={{ animationDelay: '60ms' }}>
              <div className="nav-flyout__label">Plus</div>
              <Link to="/aide" className="nav-flyout__link" viewTransition onClick={() => onOpen(null)}>
                Aide
              </Link>
              <Link to="/favoris" className="nav-flyout__link" viewTransition onClick={() => onOpen(null)}>
                Favoris
              </Link>
              <Link to="/compte" className="nav-flyout__link" viewTransition onClick={() => onOpen(null)}>
                Compte
              </Link>
              <Link to="/panier" className="nav-flyout__link" viewTransition onClick={() => onOpen(null)}>
                Panier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { NavFlyout };
