import { Link } from './AppLink';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import type { Product } from '../data/products';
import { ChevronRightIcon } from './Icons';
import ProductImage from './ProductImage';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'lineup';
}

export default function ProductCard({
  product,
  variant = 'grid',
}: ProductCardProps) {
  const { add } = useCart();
  const hasColors = product.colors && product.colors.length > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product, 1);
  };

  return (
    <article className={`product-card product-card--${variant}`}>
      <Link
        to={`/produit/${product.id}`}
        className="product-card__media"
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
      <div className="product-card__body">
        <div className="product-card__header">
          <Link to={`/produit/${product.id}`} className="product-card__name" viewTransition>
            {product.name}
          </Link>
          {product.tagline && (
            <p className="product-card__tagline">{product.tagline}</p>
          )}
        </div>
        {hasColors && (
          <div className="product-card__colors" aria-label="Couleurs disponibles">
            {product.colors!.slice(0, 4).map((color) => (
              <span
                key={color.name}
                className="product-card__color-dot"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
        <div className="product-card__meta">
          <span className="product-card__price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-card__actions">
          <Link to={`/produit/${product.id}`} className="text-link" viewTransition>
            En savoir plus
            <ChevronRightIcon size={14} />
          </Link>
          <button type="button" className="text-link" onClick={handleAdd}>
            Ajouter au panier
            <ChevronRightIcon size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
