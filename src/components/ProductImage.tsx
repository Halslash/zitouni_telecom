import { useEffect, useState, type ComponentType, type CSSProperties } from 'react';
import type { Category } from '../data/products';
import {
  CableIcon,
  GamepadIcon,
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  type IconProps,
} from './Icons';
import './ProductImage.css';

interface CategoryVisual {
  label: string;
  icon: ComponentType<IconProps>;
}

const CATEGORY_VISUALS: Record<Category, CategoryVisual> = {
  smartphones: { label: 'Téléphones', icon: SmartphoneIcon },
  laptops: { label: 'Ordinateurs', icon: LaptopIcon },
  tablets: { label: 'Tablettes', icon: TabletIcon },
  gaming: { label: 'Gaming', icon: GamepadIcon },
  accessories: { label: 'Accessoires', icon: CableIcon },
};

interface ProductImageProps {
  /** Real photography, layered over the placeholder as soon as it loads. */
  src?: string;
  alt: string;
  category?: Category;
  className?: string;
  priority?: boolean;
  /** Kept for callers that frame gallery variants; the plate itself is fixed. */
  view?: number;
  /** Selected product finish, used to warm the specimen surface. */
  finish?: string;
  /**
   * `plate` is the catalogue specimen: tinted field, glyph, registration type.
   * `bare` is the glyph alone on a transparent field for compact navigation.
   */
  variant?: 'plate' | 'bare';
  /** Displayed on the product detail page to state the visual is a placeholder. */
  showNote?: boolean;
  /** Intrinsic photo dimensions; CSS still owns the rendered size. */
  width?: number;
  height?: number;
}

/**
 * One intentional product-visual system for the whole storefront.
 *
 * No photography exists yet, so every product gets a quiet specimen plate built
 * from its category glyph, a warm neutral field and registration type. Real
 * photography can be dropped in later without touching any surrounding layout:
 * it simply covers the plate once it loads.
 */
export default function ProductImage({
  src,
  alt,
  category = 'accessories',
  className,
  priority = false,
  view = 0,
  finish,
  variant = 'plate',
  showNote = false,
  width,
  height,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const visual = CATEGORY_VISUALS[category];
  const Glyph = visual.icon;
  const decorative = alt.trim().length === 0;

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  const style = finish
    ? ({ '--plate-finish': finish } as CSSProperties)
    : undefined;

  return (
    <div
      className={`product-visual product-visual--${category} product-visual--${variant}${
        loaded && !failed ? ' has-photo' : ''
      }${className ? ` ${className}` : ''}`}
      data-category={category}
      data-view={view}
      style={style}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `${alt} — visuel de démonstration`}
      aria-hidden={decorative || undefined}
    >
      <span className="product-visual__field" aria-hidden="true" />

      {variant === 'plate' && (
        <>
          <span className="product-visual__label" aria-hidden="true">
            {visual.label}
          </span>
          <span className="product-visual__mark" aria-hidden="true">
            ZT / 26
          </span>
        </>
      )}

      <span className="product-visual__artifact" aria-hidden="true">
        <span className="product-visual__halo" />
        <span className="product-visual__glyph">
          <Glyph size={48} strokeWidth={1.35} />
        </span>
      </span>

      {showNote && variant === 'plate' && (
        <span className="product-visual__note" aria-hidden="true">
          Visuel de démonstration
        </span>
      )}

      {src && !failed && (
        <img
          src={src}
          alt=""
          className={`product-visual__photo${loaded ? ' is-loaded' : ''}`}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
