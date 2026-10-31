import type { CSSProperties } from 'react';
import { Link } from './AppLink';
import ProductImage from './ProductImage';
import Reveal from './Reveal';
import { GridIcon } from './Icons';
import type { Product } from '../data/products';
import './DeviceStrip.css';

/** 28 ms between neighbouring items, matching the site's reveal rhythm. */
const STAGGER_STEP = 28;

interface DeviceStripProps {
  /** Products already filtered and ordered by the caller. */
  products: Product[];
  /** Accessible name for the navigation landmark. */
  label: string;
  /** Home adds the catalogue link and the section's vertical rhythm. */
  context?: 'home' | 'category';
}

function staggerStyle(index: number): CSSProperties {
  return {
    animationDelay: `calc(var(--reveal-delay, 0ms) + ${
      index * STAGGER_STEP
    }ms)`,
  };
}

function StripItem({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      to={`/produit/${product.id}`}
      className="device-strip__item"
      style={staggerStyle(index)}
      viewTransition
    >
      <span className="device-strip__thumb">
        <ProductImage
          src={product.image}
          alt=""
          category={product.category}
          variant="bare"
          view={1}
        />
      </span>
      <span className="device-strip__copy">
        <span className="device-strip__brand">{product.brand}</span>
        <span className="device-strip__name">{product.name}</span>
        <span className="device-strip__tag">
          {product.featured ? 'Sélection' : ''}
        </span>
      </span>
    </Link>
  );
}

function StoreItem({ index }: { index: number }) {
  return (
    <Link
      to="/produits"
      className="device-strip__item device-strip__item--store"
      style={staggerStyle(index)}
      viewTransition
    >
      <span className="device-strip__thumb">
        <span className="device-strip__glyph">
          <GridIcon size={24} strokeWidth={1.4} />
        </span>
      </span>
      <span className="device-strip__copy">
        <span className="device-strip__brand">Catalogue</span>
        <span className="device-strip__name">Toute la boutique</span>
        <span className="device-strip__tag" aria-hidden="true" />
      </span>
    </Link>
  );
}

/**
 * One discovery strip for the whole storefront.
 *
 * The home page passes every product in catalogue order; category pages pass
 * the products already filtered for their category. Filtering and ordering
 * stay in `data/products.ts`, while presentation and scroll behaviour live here
 * exactly once.
 */
export default function DeviceStrip({
  products,
  label,
  context = 'home',
}: DeviceStripProps) {
  if (products.length === 0) return null;

  const showStoreLink = context === 'home';
  const itemCount = products.length + (showStoreLink ? 1 : 0);
  const trackClassName = [
    'device-strip__track',
    itemCount < 3 ? 'device-strip__track--centered' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav
      className={`device-strip device-strip--${context}`}
      aria-label={label}
    >
      <Reveal
        as="div"
        className={trackClassName}
        stagger
        distance={8}
        threshold={0.05}
      >
        {products.map((product, index) => (
          <StripItem key={product.id} product={product} index={index} />
        ))}
        {showStoreLink && <StoreItem index={products.length} />}
      </Reveal>
    </nav>
  );
}
