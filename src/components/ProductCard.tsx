import { useEffect, useState } from 'react';
import { Link } from './AppLink';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import {
  getCategoryById,
  getProductHighlight,
  type Product,
} from '../data/products';
import { CheckIcon, ShoppingBagIcon } from './Icons';
import ProductImage from './ProductImage';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  /** Reserved for future editorial rails; the grid card is the default. */
  variant?: 'grid' | 'lineup';
}

export default function ProductCard({
  product,
  variant = 'grid',
}: ProductCardProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const category = getCategoryById(product.category);
  const highlight = getProductHighlight(product);
  const hasColors = Boolean(product.colors?.length);

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    add(product, 1);
    setAdded(true);
  };

  return (
    <article className={`product-card product-card--${variant}`}>
      <div className="product-card__media">
        <Link
          to={`/produit/${product.id}`}
          className="product-card__media-link"
          aria-label={product.name}
          viewTransition
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
            view={1}
          />
        </Link>
        {product.featured && (
          <span className="product-card__badge">Sélection</span>
        )}
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.brand}</span>
          <span>{category?.name ?? 'Produit'}</span>
        </div>

        <h3 className="product-card__header">
          <Link
            to={`/produit/${product.id}`}
            className="product-card__name"
            viewTransition
          >
            {product.name}
          </Link>
        </h3>

        <p className="product-card__highlight">{highlight}</p>

        {hasColors && (
          <div className="product-card__colors" aria-label="Coloris disponibles">
            {product.colors!.slice(0, 4).map((color) => (
              <span
                key={color.name}
                className="product-card__color-dot"
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-hidden="true"
              />
            ))}
            <span className="product-card__color-count">
              {product.colors!.length} coloris
            </span>
          </div>
        )}

        <div className="product-card__footer">
          <p className="product-card__price">{formatPrice(product.price)}</p>
          <button
            type="button"
            className={`product-card__add${added ? ' is-added' : ''}`}
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {added ? (
              <CheckIcon size={16} strokeWidth={2} />
            ) : (
              <ShoppingBagIcon size={16} />
            )}
            <span>{added ? 'Ajouté' : 'Ajouter'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
