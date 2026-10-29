import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { getProductsByCategory } from '../data/products';
import type { Category } from '../data/products';
import './NavFlyout.css';

interface NavFlyoutProps {
  activeCategory: Category | null;
  onOpen: (cat: Category | null) => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  smartphones: 'Téléphones',
  laptops: 'Ordinateurs',
  tablets: 'Tablettes',
  gaming: 'Gaming',
  accessories: 'Accessoires',
};

export default function NavFlyout({ activeCategory, onOpen }: NavFlyoutProps) {
  const [closeDelayTimer, setCloseDelayTimer] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    if (closeDelayTimer !== null) {
      window.clearTimeout(closeDelayTimer);
      setCloseDelayTimer(null);
    }
  };

  const handleFlyoutEnter = () => {
    clearTimers();
  };

  const handleFlyoutLeave = () => {
    clearTimers();
    const t = window.setTimeout(() => onOpen(null), 250);
    setCloseDelayTimer(t);
  };

  useEffect(() => {
    clearTimers();
    return () => clearTimers();
  }, []);

  if (!activeCategory) {
    return null;
  }

  const products = getProductsByCategory(activeCategory);
  const categoryPath =
    activeCategory === 'smartphones'
      ? '/telephones'
      : activeCategory === 'laptops'
        ? '/ordinateurs'
        : activeCategory === 'tablets'
          ? '/tablettes'
          : activeCategory === 'gaming'
            ? '/gaming'
            : '/accessoires';

  return (
    <div
      ref={flyoutRef}
      className="nav-flyout"
      role="region"
      aria-label={`Menu ${CATEGORY_LABELS[activeCategory]}`}
      onMouseEnter={handleFlyoutEnter}
      onMouseLeave={handleFlyoutLeave}
    >
      <div className="nav-flyout__inner">
        <div className="nav-flyout__grid">
          <div className="nav-flyout__col">
            <div className="nav-flyout__label">
              Explorer les {CATEGORY_LABELS[activeCategory].toLowerCase()}
            </div>
            <Link
              to={categoryPath}
              className="nav-flyout__link nav-flyout__link--large"
              viewTransition
            >
              Tout voir ›
            </Link>
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/produit/${product.id}`}
                className="nav-flyout__link"
                viewTransition
              >
                {product.name}
              </Link>
            ))}
          </div>
          <div className="nav-flyout__col">
            <div className="nav-flyout__label">Acheter</div>
            <Link to={categoryPath} className="nav-flyout__link" viewTransition>
              Tous les {CATEGORY_LABELS[activeCategory].toLowerCase()}
            </Link>
            <Link to="/produits" className="nav-flyout__link" viewTransition>
              Toute la boutique
            </Link>
          </div>
          <div className="nav-flyout__col">
            <div className="nav-flyout__label">Plus</div>
            <Link to="/aide" className="nav-flyout__link" viewTransition>
              Aide
            </Link>
            <Link to="/favoris" className="nav-flyout__link" viewTransition>
              Favoris
            </Link>
            <Link to="/compte" className="nav-flyout__link" viewTransition>
              Compte
            </Link>
            <Link to="/panier" className="nav-flyout__link" viewTransition>
              Panier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NavFlyout };
