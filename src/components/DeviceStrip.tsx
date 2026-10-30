import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { Link } from './AppLink';
import ProductImage from './ProductImage';
import Reveal from './Reveal';
import { ShoppingBagIcon } from './Icons';
import type { Product } from '../data/products';
import './DeviceStrip.css';

/** 30 ms between neighbouring items, matching the site's reveal rhythm. */
const STAGGER_STEP = 30;
/** The tilt stays a suggestion, never a showcase. */
const MAX_TILT = 4.5;

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

/**
 * Pointer-following tilt for one item.
 *
 * Values land directly on the element as custom properties through a single
 * animation frame, so pointer movement never re-renders React and the tilt
 * is interpolated by the same CSS transition that handles hover.
 */
function usePointerTilt(enabled: boolean) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const deviceRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) {
      const device = deviceRef.current;
      device?.style.removeProperty('--device-tilt-x');
      device?.style.removeProperty('--device-tilt-y');
      return undefined;
    }

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [enabled]);

  function apply() {
    frameRef.current = null;

    const item = itemRef.current;
    const device = deviceRef.current;
    const point = pointRef.current;
    if (!item || !device || !point) return;

    const rect = item.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = Math.max(
      -1,
      Math.min(1, ((point.x - rect.left) / rect.width) * 2 - 1)
    );
    const y = Math.max(
      -1,
      Math.min(1, ((point.y - rect.top) / rect.height) * 2 - 1)
    );

    device.style.setProperty(
      '--device-tilt-x',
      `${(-y * MAX_TILT).toFixed(2)}deg`
    );
    device.style.setProperty(
      '--device-tilt-y',
      `${(x * MAX_TILT).toFixed(2)}deg`
    );
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (!enabled || event.pointerType !== 'mouse') return;

    pointRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(apply);
  }

  function reset() {
    pointRef.current = null;

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const device = deviceRef.current;
    if (!device) return;

    device.style.removeProperty('--device-tilt-x');
    device.style.removeProperty('--device-tilt-y');
  }

  return { itemRef, deviceRef, handlePointerMove, reset };
}

function StripItem({ product, index }: { product: Product; index: number }) {
  const reduceMotion = useShouldReduceMotion();
  const tilt = usePointerTilt(!reduceMotion);

  return (
    <Link
      ref={tilt.itemRef}
      to={`/produit/${product.id}`}
      className="device-strip__item"
      style={staggerStyle(index)}
      onPointerMove={tilt.handlePointerMove}
      onPointerLeave={tilt.reset}
      onPointerCancel={tilt.reset}
      onBlur={tilt.reset}
    >
      <span className="device-strip__thumb">
        <span ref={tilt.deviceRef} className="device-strip__device">
          <ProductImage
            src={product.image}
            alt=""
            category={product.category}
            view={1}
            variant="bare"
            width={64}
            height={64}
          />
        </span>
      </span>
      <span className="device-strip__name">{product.name}</span>
      <span
        className="device-strip__tag"
        aria-hidden={product.featured ? undefined : true}
      >
        {product.featured ? 'Nouveau' : null}
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
    >
      <span className="device-strip__thumb">
        <span className="device-strip__device device-strip__device--icon">
          <ShoppingBagIcon size={30} strokeWidth={1.5} />
        </span>
      </span>
      <span className="device-strip__name">Toute la boutique</span>
      <span className="device-strip__tag" aria-hidden="true" />
    </Link>
  );
}

/**
 * One discovery strip for the whole storefront.
 *
 * The home page passes every product in catalogue order; category pages pass
 * the products already filtered for their category. Filtering and ordering
 * stay in `data/products.ts`, while presentation, scroll behaviour and the
 * tilt live here exactly once.
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
