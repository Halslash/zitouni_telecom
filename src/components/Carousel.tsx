import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { getFeaturedProducts } from '../data/products';
import ProductImage from './ProductImage';
import { ChevronRightIcon } from './Icons';
import './Carousel.css';

interface Slide {
  id: string;
  title: string;
  tagline: string;
  image?: string;
  category?: string;
  productId?: string;
  type: 'brand' | 'product';
}

export default function Carousel() {
  const featured = getFeaturedProducts(4);
  const slides: Slide[] = [
    {
      id: 'brand',
      title: 'Votre technologie. Votre choix.',
      tagline: 'Zitouni Telecom',
      type: 'brand' as const,
    },
    ...featured.map((p) => ({
      id: p.id,
      title: p.name,
      tagline: p.tagline || p.brand,
      image: p.image,
      category: p.category,
      productId: p.id,
      type: 'product' as const,
    })),
  ].slice(0, 4) as Slide[];

  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const goTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slidesEl = track.querySelectorAll('.carousel__slide');
    const target = slidesEl[idx] as HTMLElement | undefined;
    if (target) {
      track.scrollTo({
        left: target.offsetLeft - 24,
        behavior: 'smooth',
      });
    }
    setCurrent(idx);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !playing) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % slides.length;
        goTo(next);
        return next;
      });
    }, 4000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const slidesEl = track.querySelectorAll('.carousel__slide');
      let best = 0;
      let bestDist = Infinity;
      slidesEl.forEach((el, idx) => {
        const dist = Math.abs((el as HTMLElement).offsetLeft - track.scrollLeft - 24);
        if (dist < bestDist) {
          bestDist = dist;
          best = idx;
        }
      });
      setCurrent(best);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.pageX - track.offsetLeft;
    scrollLeft.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
    setPlaying(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    track.scrollLeft = scrollLeft.current - walk;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = false;
    track.releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(Math.max(0, current - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(Math.min(slides.length - 1, current + 1));
    }
  };

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label="Sélection en vedette"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setPlaying(false)}
      onBlur={() => setPlaying(true)}
    >
      <div className="carousel__container">
        <div
          ref={trackRef}
          className="carousel__track"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {slides.map((slide, idx) => (
            <article
              key={slide.id}
              className={`carousel__slide ${idx === 1 ? 'carousel__slide--dark' : ''}`}
              aria-roledescription="slide"
              aria-label={`${idx + 1} sur ${slides.length}`}
              aria-hidden={idx !== current}
            >
              <div className="carousel__content">
                <div className="carousel__header">
                  <div className="carousel__text">
                    <h2 className="carousel__title">{slide.title}</h2>
                    <p className="carousel__tagline">{slide.tagline}</p>
                  </div>
                  <div className="carousel__actions">
                    {slide.type === 'brand' ? (
                      <>
                        <Link to="/produits" className="carousel__btn carousel__btn--filled" viewTransition>
                          Découvrir
                        </Link>
                        <Link to="/aide" className="carousel__btn carousel__btn--ghost" viewTransition>
                          En savoir plus
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/produit/${slide.productId}`}
                          className="carousel__btn carousel__btn--outline"
                          viewTransition
                        >
                          En savoir plus <ChevronRightIcon size={14} />
                        </Link>
                        <Link to="/panier" className="carousel__btn carousel__btn--filled" viewTransition>
                          Ajouter au panier
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="carousel__media">
                  {slide.image ? (
                    <ProductImage
                      src={slide.image}
                      alt={slide.title}
                      category={slide.category as any}
                      view={1}
                    />
                  ) : (
                    <div className="carousel__media-placeholder" aria-hidden="true" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="carousel__controls">
        <div className="carousel__pagination" role="tablist" aria-label="Navigation du carrousel">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`carousel__dot ${idx === current ? 'is-active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Diapositive ${idx + 1} sur ${slides.length}`}
              role="tab"
              aria-selected={idx === current}
            />
          ))}
        </div>
        <button
          className="carousel__playpause"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Mettre en pause' : 'Lancer le diaporama'}
        >
          {playing ? '||' : '▶'}
        </button>
      </div>
    </section>
  );
}
