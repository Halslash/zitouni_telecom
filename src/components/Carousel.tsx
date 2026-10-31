import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Link } from './AppLink';
import {
  getCategoryById,
  getFeaturedProducts,
  type Product,
} from '../data/products';
import ProductImage from './ProductImage';
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from './Icons';
import { formatPrice } from '../lib/format';
import './Carousel.css';

/** Long enough to read a headline, short enough to still feel alive. */
const AUTOPLAY_MS = 6500;
/** Drag distance (px) before a pointer gesture counts as a scroll, not a tap. */
const DRAG_THRESHOLD = 6;

interface Slide {
  id: string;
  title: string;
  tagline: string;
  type: 'brand' | 'product';
  product?: Product;
}

interface CarouselProps {
  /** Category products. When provided, the brand slide is omitted. */
  products?: Product[];
  /** Accessible name for the region. */
  label?: string;
}

function toSlide(product: Product): Slide {
  return {
    id: product.id,
    title: product.name,
    tagline: product.tagline || product.brand,
    type: 'product',
    product,
  };
}

function startingPrice(product: Product): number {
  const prices = [
    product.price,
    ...(product.variants?.map((variant) => variant.price) ?? []),
  ];
  return Math.min(...prices);
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {playing ? (
        <>
          <rect x="6.5" y="4.5" width="3.6" height="15" rx="1.2" />
          <rect x="13.9" y="4.5" width="3.6" height="15" rx="1.2" />
        </>
      ) : (
        <path d="M8 4.8v14.4a1 1 0 0 0 1.52.85l11-7.2a1 1 0 0 0 0-1.7l-11-7.2A1 1 0 0 0 8 4.8Z" />
      )}
    </svg>
  );
}

export default function Carousel({ products, label }: CarouselProps = {}) {
  const slides: Slide[] = products?.length
    ? products.map(toSlide)
    : [
        {
          id: 'brand',
          title: 'La technologie, choisie avec soin.',
          tagline:
            'Une sélection de produits tech conseillée en magasin, à Alger. Des références fiables, un accueil qui prend le temps.',
          type: 'brand' as const,
        },
        ...getFeaturedProducts(3).map(toSlide),
      ];

  const isStatic = slides.length < 2;
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const intervalRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [current, setCurrent] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  const playing = !userPaused && !interacting && !pageHidden;

  const goTo = useCallback(
    (idx: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current;
      if (!track) return;
      const target = track.querySelectorAll<HTMLElement>('.carousel__slide')[idx];
      if (target) {
        track.scrollTo({ left: target.offsetLeft, behavior });
      }
      currentRef.current = idx;
      setCurrent(idx);
    },
    []
  );

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  /* Advance only while the hero is idle, visible and motion is allowed. */
  useEffect(() => {
    if (isStatic || !playing) return undefined;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) return undefined;

    intervalRef.current = window.setInterval(() => {
      const next = (currentRef.current + 1) % slides.length;
      goTo(next);
    }, AUTOPLAY_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [goTo, isStatic, playing, slides.length]);

  /* Keep the active dot honest when the rail is scrolled by hand or trackpad. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isStatic) return undefined;

    const onScroll = () => {
      const slidesEl = track.querySelectorAll<HTMLElement>('.carousel__slide');
      let best = 0;
      let bestDist = Infinity;
      slidesEl.forEach((el, idx) => {
        const dist = Math.abs(el.offsetLeft - track.scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      currentRef.current = best;
      setCurrent((previous) => (previous === best ? previous : best));
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [isStatic]);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* Mouse only: touch keeps the browser's native, momentum-aware scrolling. */
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    dragged.current = false;
    startX.current = e.pageX - track.offsetLeft;
    scrollLeft.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    setInteracting(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    const x = e.pageX - track.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > DRAG_THRESHOLD) {
      dragged.current = true;
      e.preventDefault();
    }
    track.scrollLeft = scrollLeft.current - walk;
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !isDragging.current) return;
    isDragging.current = false;
    if (track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
    setInteracting(false);
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragged.current) return;
    dragged.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isStatic) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo((currentRef.current - 1 + slides.length) % slides.length);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo((currentRef.current + 1) % slides.length);
    }
  };

  const renderSlide = (slide: Slide, idx: number) => {
    const product = slide.product;
    const category = product ? getCategoryById(product.category) : undefined;
    const hidden = !isStatic && idx !== current;

    return (
      <article
        key={slide.id}
        className={`carousel__slide${
          slide.type === 'brand' ? ' carousel__slide--brand' : ''
        }`}
        aria-roledescription="slide"
        aria-label={`${idx + 1} sur ${slides.length}`}
        aria-hidden={hidden || undefined}
        inert={hidden || undefined}
      >
        <div className="carousel__panel">
          <div className="carousel__copy">
            <p className="carousel__eyebrow">
              {product
                ? `${product.brand} · ${category?.name ?? 'Sélection'}`
                : 'Zitouni Telecom · Alger'}
            </p>

            <h2 className="carousel__title">{slide.title}</h2>

            <p className="carousel__tagline">{slide.tagline}</p>

            {product && (
              <div className="carousel__price">
                <span className="carousel__price-label">
                  {startingPrice(product) < product.price
                    ? 'À partir de'
                    : 'Prix'}
                </span>
                <span className="carousel__price-value">
                  {formatPrice(startingPrice(product))}
                </span>
              </div>
            )}

            {product?.highlights && product.highlights.length > 0 && (
              <ul className="carousel__points">
                {product.highlights.slice(0, 2).map((highlight) => (
                  <li key={highlight}>
                    <CheckIcon size={13} strokeWidth={2.2} />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="carousel__actions">
              {slide.type === 'brand' ? (
                <>
                  <Link
                    to="/produits"
                    className="carousel__btn carousel__btn--filled"
                    viewTransition
                  >
                    Explorer la boutique
                    <ChevronRightIcon size={15} />
                  </Link>
                  <Link
                    to="/aide"
                    className="carousel__btn carousel__btn--ghost"
                    viewTransition
                  >
                    Nos conseils
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={`/produit/${slide.id}`}
                    className="carousel__btn carousel__btn--filled"
                    viewTransition
                  >
                    Découvrir le produit
                    <ChevronRightIcon size={15} />
                  </Link>
                  <Link
                    to="/produits"
                    className="carousel__btn carousel__btn--ghost"
                    viewTransition
                  >
                    Toute la sélection
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="carousel__visual">
            {product ? (
              <div className="carousel__visual-plate">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  view={1}
                  variant="bare"
                />
              </div>
            ) : (
              <div className="carousel__brand-art" aria-hidden="true">
                <span className="carousel__brand-ring carousel__brand-ring--outer" />
                <span className="carousel__brand-ring" />
                <span className="carousel__brand-mark">
                  <img
                    src="/brand/zitouni-mark-160.jpg"
                    alt=""
                    width="160"
                    height="160"
                    loading="eager"
                  />
                </span>
                <span className="carousel__brand-caption">
                  Téléphonie · Informatique · Accessoires
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  if (isStatic) {
    return (
      <section
        className="carousel carousel--static"
        aria-label={label ?? 'Sélection en vedette'}
      >
        <div className="carousel__container">
          <div className="carousel__static">{renderSlide(slides[0], 0)}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label={label ?? 'Sélection en vedette'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
    >
      <div className="carousel__container">
        <div
          ref={trackRef}
          className="carousel__track"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
        >
          {slides.map(renderSlide)}
        </div>

        <div className="carousel__controls">
          <div
            className="carousel__pagination"
            role="tablist"
            aria-label="Navigation du carrousel"
          >
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                className={`carousel__dot${idx === current ? ' is-active' : ''}`}
                onClick={() => goTo(idx)}
                aria-label={`Diapositive ${idx + 1} sur ${slides.length}`}
                role="tab"
                aria-selected={idx === current}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="carousel__nav">
            <button
              type="button"
              className="carousel__nav-btn"
              onClick={() =>
                goTo((currentRef.current - 1 + slides.length) % slides.length)
              }
              aria-label="Diapositive précédente"
            >
              <ChevronLeftIcon size={17} />
            </button>

            <button
              type="button"
              className="carousel__nav-btn carousel__nav-btn--pause"
              onClick={() => setUserPaused((paused) => !paused)}
              aria-label={
                playing ? 'Mettre le diaporama en pause' : 'Lancer le diaporama'
              }
            >
              <PlayPauseIcon playing={playing} />
            </button>

            <button
              type="button"
              className="carousel__nav-btn"
              onClick={() => goTo((currentRef.current + 1) % slides.length)}
              aria-label="Diapositive suivante"
            >
              <ChevronRightIcon size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
