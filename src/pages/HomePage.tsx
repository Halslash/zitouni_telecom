import { useEffect, useRef, useState } from 'react';
import { Link } from '../components/AppLink';
import LineReveal from '../components/LineReveal';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import Stage from '../components/Stage';
import { WilayaSelector } from '../components/WilayaSelector';
import {
  CATEGORY_PATHS,
  DISCOVERY_CATEGORY_ORDER,
  categories,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsInDiscoveryOrder,
  products,
  type Product,
} from '../data/products';
import { formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '../components/Icons';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { AnimatePresence, m } from 'motion/react';
import './HomePage.css';

const SERVICES = [
  {
    icon: TruckIcon,
    title: 'Livraison',
    copy: 'Dans les 58 wilayas, à domicile ou en point relais.',
  },
  {
    icon: CreditCardIcon,
    title: 'Paiement',
    copy: 'À la livraison, après vérification du colis.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garantie',
    copy: 'Constructeur 24 mois et retour sous 7 jours.',
  },
];

const HERO_HEADLINE = ['La tech,', 'sans', 'compromis.'];

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export default function HomePage() {
  usePageTitle();
  const reduceMotion = useShouldReduceMotion();
  const featured = getFeaturedProducts(4);
  const lineup = getProductsInDiscoveryOrder();
  const lead: Product = featured[0] ?? products[0];
  const storyProducts = featured.slice(0, 3);
  const spotlight = featured[1] ?? featured[0] ?? products[0];
  const brands = Array.from(new Set(products.map((product) => product.brand)));

  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railWrapRef = useRef<HTMLDivElement>(null);
  const storyIndexRef = useRef(0);
  const [storyIndex, setStoryIndex] = useState(0);

  /* Hero: scroll-linked rise/scale and a ≤12px pointer parallax. */
  useEffect(() => {
    const node = heroRef.current;
    if (!node || reduceMotion) return undefined;
    let frame = 0;

    const update = () => {
      const height = node.offsetHeight || 1;
      node.style.setProperty(
        '--hero-shift',
        clamp01(window.scrollY / height).toFixed(4)
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty('--parallax-x', `${x.toFixed(1)}px`);
        node.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
      });
    };
    const onLeave = () => {
      node.style.setProperty('--parallax-x', '0px');
      node.style.setProperty('--parallax-y', '0px');
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      node.addEventListener('pointermove', onMove, { passive: true });
      node.addEventListener('pointerleave', onLeave);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [reduceMotion]);

  /* Pinned story: progress line + index, no per-frame React renders. */
  useEffect(() => {
    const node = storyRef.current;
    if (!node || storyProducts.length === 0) return undefined;
    let frame = 0;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const total = node.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp01(-rect.top / total) : 0;
      node.style.setProperty('--story-progress', progress.toFixed(4));
      const next = Math.min(
        storyProducts.length - 1,
        Math.floor(progress * storyProducts.length)
      );
      if (next !== storyIndexRef.current) {
        storyIndexRef.current = next;
        setStoryIndex(next);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [storyProducts.length]);

  /* Rail progress bar. */
  useEffect(() => {
    const track = railRef.current;
    const wrap = railWrapRef.current;
    if (!track || !wrap) return undefined;
    let frame = 0;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      wrap.style.setProperty(
        '--rail-progress',
        (max > 0 ? track.scrollLeft / max : 0).toFixed(4)
      );
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({
      left: direction * 360,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const activeStory = (storyProducts[storyIndex] ??
    storyProducts[0]) as Product;

  return (
    <>
      <h1 className="visually-hidden">
        Zitouni Telecom — téléphonie, informatique et accessoires à Alger
      </h1>

      {/* HERO */}
      <section className="home-hero" ref={heroRef} aria-label="Zitouni Telecom">
        <div className="home-hero__scrim" aria-hidden="true" />
        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <LineReveal
              as="h2"
              className="home-hero__title"
              immediate
              lines={HERO_HEADLINE.map((line, index) =>
                index === HERO_HEADLINE.length - 1 ? (
                  <span className="home-hero__accent">{line}</span>
                ) : (
                  line
                )
              )}
            />
            <p className="home-hero__lede">
              Une sélection courte de téléphones, d&rsquo;ordinateurs et
              d&rsquo;accessoires, livrée dans les 58 wilayas.
            </p>
            <div className="home-hero__actions">
              <Link to="/produits" className="btn btn--primary" viewTransition>
                Explorer la boutique
              </Link>
              <a href="#selection" className="text-link">
                Voir la sélection
                <ChevronRightIcon size={14} />
              </a>
            </div>
          </div>

          <div className="home-hero__media">
            <div className="home-hero__stage">
              <Stage reflect tilt sheen className="home-hero__device">
                <ProductImage
                  src={lead.image}
                  alt={lead.name}
                  category={lead.category}
                  variant="bare"
                  priority
                />
              </Stage>
            </div>

            {lead.highlights && lead.highlights.length > 0 && (
              <ul className="home-hero__hotspots" aria-label="Points clés">
                {lead.highlights.slice(0, 3).map((highlight, index) => (
                  <li
                    key={highlight}
                    className={`home-hotspot home-hotspot--${index + 1}`}
                  >
                    <span className="home-hotspot__dot" aria-hidden="true" />
                    <span className="home-hotspot__line" aria-hidden="true" />
                    <span className="home-hotspot__text">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="home-hero__caption">
              {lead.brand} · {lead.name}
            </p>
          </div>
        </div>
      </section>

      {/* BRAND ROW */}
      <div className="home-brands" aria-label="Marques disponibles">
        <ul className="container home-brands__list">
          {brands.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
      </div>

      {/* CATEGORY BENTO */}
      <section className="home-section" aria-labelledby="rayons-title">
        <div className="container">
          <Reveal className="home-section__head">
            <LineReveal
              as="h2"
              id="rayons-title"
              lines={['Cinq rayons, une même exigence.']}
            />
            <Link to="/produits" className="text-link" viewTransition>
              Tout le catalogue
              <ChevronRightIcon size={14} />
            </Link>
          </Reveal>

          <Reveal className="home-bento" stagger>
            {DISCOVERY_CATEGORY_ORDER.map((id) => {
              const category = categories.find((item) => item.id === id);
              if (!category) return null;
              const names = getProductsByCategory(id).map(
                (product) => product.name
              );
              return (
                <Link
                  key={id}
                  to={CATEGORY_PATHS[id]}
                  viewTransition
                  className={`home-bento__tile home-bento__tile--${id}`}
                >
                  <span className="home-bento__art" aria-hidden="true">
                    <ProductImage category={id} alt="" variant="bare" />
                  </span>
                  <span className="home-bento__body">
                    <span className="home-bento__count">
                      {String(
                        getProductsByCategory(id).length
                      ).padStart(2, '0')}
                    </span>
                    <h3 className="home-bento__title">{category.name}</h3>
                    <span className="home-bento__names">
                      {names.map((name) => (
                        <span key={name}>{name}</span>
                      ))}
                    </span>
                    <span className="home-bento__cta">
                      Explorer
                      <ChevronRightIcon size={14} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* FEATURED LINEUP */}
      <section
        className="home-section"
        id="selection"
        aria-labelledby="selection-title"
      >
        <div className="container">
          <Reveal className="home-section__head">
            <LineReveal
              as="h2"
              id="selection-title"
              lines={['La sélection.']}
            />
            <Link to="/produits" className="text-link" viewTransition>
              Tous les produits
              <ChevronRightIcon size={14} />
            </Link>
          </Reveal>

          <div className="home-rail" ref={railWrapRef}>
            <div
              ref={railRef}
              className="home-rail__track"
              role="region"
              aria-label="Sélection de produits"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  scrollRail(1);
                } else if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  scrollRail(-1);
                }
              }}
            >
              {lineup.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="lineup"
                />
              ))}
            </div>
            <div className="home-rail__foot">
              <span className="home-rail__bar" aria-hidden="true">
                <span />
              </span>
              <span className="home-rail__arrows">
                <button
                  type="button"
                  className="home-rail__arrow"
                  onClick={() => scrollRail(-1)}
                  aria-label="Produits précédents"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <button
                  type="button"
                  className="home-rail__arrow"
                  onClick={() => scrollRail(1)}
                  aria-label="Produits suivants"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PINNED STORY */}
      {storyProducts.length > 0 && (
        <section
          className="home-story"
          ref={storyRef}
          aria-label="Produits en vedette"
          style={{ height: `${storyProducts.length * 100}vh` }}
        >
          <div className="home-story__pin">
            <div className="container home-story__inner">
              <div className="home-story__text">
                <span className="home-story__index">
                  {String(storyIndex + 1).padStart(2, '0')}
                  <span> / </span>
                  {String(storyProducts.length).padStart(2, '0')}
                </span>
                <AnimatePresence mode="wait">
                  <m.div
                    key={activeStory.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: reduceMotion ? 0.12 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="home-story__title">{activeStory.name}</h2>
                    {activeStory.highlights?.[0] && (
                      <p className="home-story__copy">
                        {activeStory.highlights[0]}
                      </p>
                    )}
                    <Link
                      to={`/produit/${activeStory.id}`}
                      className="text-link"
                      viewTransition
                    >
                      Voir le produit
                      <ChevronRightIcon size={14} />
                    </Link>
                  </m.div>
                </AnimatePresence>
              </div>

              <div className="home-story__media">
                <span className="home-story__line" aria-hidden="true">
                  <span />
                </span>
                <Stage reflect tilt sheen className="home-story__device">
                  <ProductImage
                    src={activeStory.image}
                    alt={activeStory.name}
                    category={activeStory.category}
                    variant="bare"
                  />
                </Stage>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SPOTLIGHT BAND */}
      <section className="home-spotlight" aria-labelledby="spotlight-title">
        <div className="container home-spotlight__inner">
          <div className="home-spotlight__copy">
            <span className="home-spotlight__meta">
              {spotlight.brand} · {formatPrice(spotlight.price)}
            </span>
            <LineReveal
              as="h2"
              id="spotlight-title"
              lines={[spotlight.name]}
            />
            {spotlight.highlights?.[0] && (
              <p>{spotlight.highlights[0]}</p>
            )}
            <Link
              to={`/produit/${spotlight.id}`}
              className="text-link text-link--light"
              viewTransition
            >
              Découvrir
              <ChevronRightIcon size={14} />
            </Link>
          </div>
          <div className="home-spotlight__media">
            <Stage reflect sheen className="home-spotlight__device">
              <ProductImage
                src={spotlight.image}
                alt={spotlight.name}
                category={spotlight.category}
                variant="bare"
              />
            </Stage>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section className="home-section" aria-labelledby="livraison-title">
        <div className="container">
          <Reveal className="home-delivery">
            <div className="home-delivery__intro">
              <LineReveal
                as="h2"
                id="livraison-title"
                lines={['Livraison dans les 58 wilayas.']}
              />
              <p>
                Choisissez votre wilaya pour connaître la zone et le délai
                indicatif. Le paiement se fait à la réception.
              </p>
              <WilayaSelector variant="field" label="Livraison vers" />
            </div>
            <div className="home-delivery__rows">
              {SERVICES.map((service) => {
                const ServiceIcon = service.icon;
                return (
                  <div key={service.title} className="home-delivery__row">
                    <span className="home-delivery__icon">
                      <ServiceIcon size={20} strokeWidth={1.6} />
                    </span>
                    <span>
                      <span className="home-delivery__label">
                        {service.title}
                      </span>
                      <span className="home-delivery__text">
                        {service.copy}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
