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
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [displayCategory, setDisplayCategory] = useState<Category | null>(activeCategory);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    if (activeCategory === null) {
      setDisplayCategory(null);
      setIsSwitching(false);
      return;
    }
    if (activeCategory === displayCategory) {
      setIsSwitching(false);
      return;
    }
    setIsSwitching(true);
    const timer = window.setTimeout(() => {
      setDisplayCategory(activeCategory);
      setIsSwitching(false);
    }, 140);
    return () => window.clearTimeout(timer);
  }, [activeCategory]);

  if (displayCategory === null && activeCategory === null) {
    return null;
  }

  const cat = displayCategory || activeCategory;
  if (!cat) return null;

  const products = getProductsByCategory(cat);
  const categoryPath =
    cat === 'smartphones'
      ? '/telephones'
      : cat === 'laptops'
        ? '/ordinateurs'
        : cat === 'tablets'
          ? '/tablettes'
          : cat === 'gaming'
            ? '/gaming'
            : '/accessoires';

  return (
    <div
      ref={flyoutRef}
      className={`nav-flyout ${activeCategory ? 'is-open' : ''} ${isSwitching ? 'is-switching' : ''}`}
      role="region"
      aria-label={`Menu ${CATEGORY_LABELS[cat]}`}
      onMouseEnter={() => onOpen(cat)}
      onMouseLeave={() => onOpen(null)}
    >
      <div className="nav-flyout__inner">
        <div className="nav-flyout__grid" key={cat}>
          <div className="nav-flyout__col">
            <div className="nav-flyout__label">
              Explorer les {CATEGORY_LABELS[cat].toLowerCase()}
            </div>
            <Link
              to={categoryPath}
              className="nav-flyout__link nav-flyout__link--large"
              viewTransition
              onClick={() => onOpen(null)}
            >
              Tout voir ›
            </Link>
            {products.map((product, idx) => (
              <Link
                key={product.id}
                to={`/produit/${product.id}`}
                className="nav-flyout__link"
                viewTransition
                onClick={() => onOpen(null)}
                style={{ animationDelay: `${idx * 25}ms` }}
              >
                {product.name}
              </Link>
            ))}
          </div>
          <div className="nav-flyout__col">
            <div className="nav-flyout__label">Acheter</div>
            <Link to={categoryPath} className="nav-flyout__link" viewTransition onClick={() => onOpen(null)}>
              Tous les {CATEGORY_LABELS[cat].toLowerCase()}
            </Link>
            <Link to="/produits" className="nav-flyout__link" viewTransition onClick={() => onOpen(null)}>
              Toute la boutique
            </Link>
          </div>
          <div className="nav-flyout__col">
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
  );
}

export { NavFlyout };
