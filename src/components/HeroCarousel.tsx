import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { getFeaturedProducts } from '../data/products';
import ProductImage from './ProductImage';
import { ChevronRightIcon } from './Icons';
import './HeroCarousel.css';

interface Slide {
  id: string;
  title: string;
  tagline: string;
  image?: string;
  category?: string;
  productId?: string;
  type: 'brand' | 'product';
}

export default function HeroCarousel() {
  const featured = getFeaturedProducts(4);
  const slides: Slide[] = [
    {
      id: 'brand',
      title: 'Votre technologie. Votre choix.',
      tagline: 'Zitouni Telecom',
      type: 'brand',
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

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goTo = (idx: number) => {
    setCurrent((idx + slides.length) % slides.length);
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
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, slides.length]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(current + 1);
    }
  };

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Sélection en vedette"
      ref={carouselRef}
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onFocus={() => setPlaying(false)}
      onBlur={() => setPlaying(true)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="hero-carousel__viewport">
        <div
          className="hero-carousel__track"
          style={{ transform: `translateX(-${current * (100 / slides.length)}%)` }}
        >
          {slides.map((slide, idx) => (
            <article
              key={slide.id}
              className={`hero-carousel__slide ${idx === 1 ? 'hero-carousel__slide--dark' : ''}`}
              aria-roledescription="slide"
              aria-label={`${idx + 1} sur ${slides.length}`}
              aria-hidden={idx !== current}
            >
              <div className="hero-carousel__content">
                <div className="hero-carousel__text">
                  <h2 className="hero-carousel__title">{slide.title}</h2>
                  <p className="hero-carousel__tagline">{slide.tagline}</p>
                </div>
                <div className="hero-carousel__actions">
                  {slide.type === 'brand' ? (
                    <>
                      <Link to="/produits" className="hero-carousel__btn hero-carousel__btn--filled" viewTransition>
                        Découvrir
                      </Link>
                      <Link to="/aide" className="hero-carousel__btn hero-carousel__btn--ghost" viewTransition>
                        En savoir plus
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/produit/${slide.productId}`}
                        className="hero-carousel__btn hero-carousel__btn--outline"
                        viewTransition
                      >
                        En savoir plus
                        <ChevronRightIcon size={14} />
                      </Link>
                      <Link to="/panier" className="hero-carousel__btn hero-carousel__btn--filled" viewTransition>
                        Ajouter au panier
                      </Link>
                    </>
                  )}
                </div>
                <div className="hero-carousel__media">
                  {slide.image ? (
                    <ProductImage
                      src={slide.image}
                      alt={slide.title}
                      category={slide.category as any}
                      view={1}
                    />
                  ) : (
                    <div className="hero-carousel__media-placeholder" aria-hidden="true" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-carousel__controls">
        <div className="hero-carousel__pagination" role="tablist" aria-label="Navigation du carrousel">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`hero-carousel__dot ${idx === current ? 'is-active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Diapositive ${idx + 1} sur ${slides.length}`}
              role="tab"
              aria-selected={idx === current}
            />
          ))}
        </div>
        <button
          className="hero-carousel__playpause"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Mettre en pause' : 'Lancer le diaporama'}
        >
          {playing ? 'II' : '▶'}
        </button>
      </div>
    </section>
  );
}
