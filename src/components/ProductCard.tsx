import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import {
  getCategoryById,
  getDiscountPercent,
  getProductHighlight,
  type Product,
} from '../data/products';
import { formatPrice, getStockState } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CheckIcon, HeartIcon, PlusIcon } from './Icons';
import ProductImage from './ProductImage';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  tone?: 'light' | 'dark';
}

export default function ProductCard({
  product,
  tone = 'light',
}: ProductCardProps) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const { spring, transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const category = getCategoryById(product.category);
  const discount = getDiscountPercent(product);
  const stock = getStockState(product);
  const isWishlisted = wishlist.has(product.id);

  const badge = discount
    ? { label: `−${discount}\u00a0%`, modifier: 'badge--sale' }
    : product.badge === 'new'
      ? { label: 'Nouveau', modifier: 'badge--new' }
      : product.badge === 'bestseller'
        ? { label: 'Best-seller', modifier: 'badge--bestseller' }
        : null;

  const handleAdd = () => {
    if (!product.inStock) return;
    add(product);
    setAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article
      className={`product-card${tone === 'dark' ? ' product-card--dark' : ''}`}
    >
      <div className="product-card__media">
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
        />

        {badge && (
          <span className={`badge ${badge.modifier} product-card__badge`}>
            {badge.label}
          </span>
        )}

        <button
          type="button"
          className={`product-card__wishlist${
            isWishlisted ? ' is-active' : ''
          }`}
          onClick={() => wishlist.toggle(product.id)}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Retirer ${product.name} des favoris`
              : `Ajouter ${product.name} aux favoris`
          }
        >
          <m.span
            key={isWishlisted ? 'filled' : 'outline'}
            className="product-card__wishlist-icon"
            initial={
              hasMounted.current
                ? {
                    opacity: 0.4,
                    scale: reduceMotion ? 1 : 0.6,
                  }
                : false
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={spring.pop}
          >
            <HeartIcon size={17} filled={isWishlisted} />
          </m.span>
        </button>
      </div>

      <div className="product-card__body">
        <div className="product-card__topline">
          <span className="product-card__brand">{product.brand}</span>
          <span className="product-card__category">{category?.name}</span>
        </div>

        <h3 className="product-card__name">
          <Link
            to={`/produit/${product.id}`}
            className="product-card__link"
            viewTransition
          >
            {product.name}
          </Link>
        </h3>

        <p className="product-card__highlight">
          {getProductHighlight(product)}
        </p>

        <div className="product-card__stock">
          <span className={`availability ${stock.modifier}`}>{stock.label}</span>
        </div>

        <div className="product-card__footer">
          <div className="price">
            {product.originalPrice && (
              <span className="price__old">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="price__now">{formatPrice(product.price)}</span>
          </div>

          <button
            type="button"
            className={`product-card__add${added ? ' is-added' : ''}`}
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={
              added
                ? `${product.name} ajouté au panier`
                : product.inStock
                  ? `Ajouter ${product.name} au panier`
                  : `${product.name} est épuisé`
            }
          >
            <m.span
              key={added ? 'added' : product.inStock ? 'add' : 'out'}
              className="product-card__add-content"
              initial={{
                opacity: 0,
                y: reduceMotion ? 0 : 3,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition.fade}
            >
              {added ? <CheckIcon size={15} /> : <PlusIcon size={15} />}
              <span>
                {added ? 'Ajouté' : product.inStock ? 'Ajouter' : 'Épuisé'}
              </span>
            </m.span>
          </button>
          <span className="visually-hidden" role="status" aria-live="polite">
            {added ? `${product.name} ajouté au panier` : ''}
          </span>
        </div>
      </div>
    </article>
  );
}
