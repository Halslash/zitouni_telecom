import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { AnimatePresence, m } from 'motion/react';
import { Slide } from '@animate-ui/react/primitives/effects/slide';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import {
  getCategoryById,
  getFeaturedProducts,
  type Product,
} from '../data/products';
import { formatPrice } from '../lib/format';
import { cinematicEase, cinematicTransition } from '../lib/motion';
import { ArrowUpRightIcon } from './Icons';
import ProductImage from './ProductImage';
import './FeaturedStory.css';

interface StoryChapter {
  eyebrow: string;
  title: string;
  copy: string;
  finish: string;
  finishColor?: string;
  view: number;
  product: Product;
}

function buildChapters(featured: Product[]): StoryChapter[] {
  return featured.map((product, index) => {
    const category = getCategoryById(product.category);

    return {
      eyebrow: `${String(index + 1).padStart(2, '0')} · ${
        category?.name ?? product.brand
      }`,
      title: product.name,
      copy:
        product.tagline ??
        `${product.brand} — ${formatPrice(product.price)}, présenté sans détour.`,
      finish: product.colors?.[0]?.name ?? product.brand,
      finishColor: product.colors?.[0]?.hex,
      view: index,
      product,
    };
  });
}

export default function FeaturedStory() {
  const featured = getFeaturedProducts(4);
  const chapters = buildChapters(featured);
  const chapterCount = chapters.length;
  const reduceMotion = useShouldReduceMotion();
  const [activeChapter, setActiveChapter] = useState(0);
  const sentinelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const sentinels = sentinelRefs.current.filter(
      (sentinel): sentinel is HTMLDivElement => Boolean(sentinel)
    );

    if (sentinels.length === 0) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setActiveChapter(0);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const index = Number(
          (visible[0].target as HTMLElement).dataset.storyIndex
        );

        if (Number.isFinite(index)) {
          setActiveChapter(index);
        }
      },
      {
        rootMargin: '-38% 0px -38% 0px',
        threshold: [0, 0.2, 0.5, 1],
      }
    );

    sentinels.forEach((sentinel) => observer.observe(sentinel));
    return () => observer.disconnect();
  }, [chapterCount]);

  const chapter = chapters[activeChapter] ?? chapters[0];

  if (!chapter) return null;

  const goToChapter = (index: number) => {
    sentinelRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <section
      id="featured-story"
      className="product-story on-dark"
      aria-labelledby="product-story-title"
    >
      <div className="product-story__atmosphere" aria-hidden="true" />

      <div className="container">
        <Slide
          inView
          inViewMargin="-14% 0px -14% 0px"
          offset={24}
          transition={cinematicTransition}
          className="product-story__intro"
        >
          <span className="eyebrow">La sélection Zitouni</span>
          <h2 id="product-story-title" className="product-story__title">
            Une même exigence.
          </h2>
          <p className="product-story__lead">
            Les références que nous retenons, présentées une à une. Faites
            défiler pour passer d&apos;un produit à l&apos;autre.
          </p>
        </Slide>
      </div>

      <div className="product-story__stage">
        <div className="product-story__sticky">
          <div className="product-story__device-wrap">
            <span className="product-story__halo" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={chapter.view}
                className="product-story__device"
                initial={{
                  opacity: 0,
                  scale: reduceMotion ? 1 : 0.97,
                }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: reduceMotion ? 1 : 1.015,
                  transition: { duration: reduceMotion ? 0.12 : 0.28 },
                }}
                transition={
                  reduceMotion
                    ? { duration: 0.12 }
                    : { duration: 0.62, ease: cinematicEase }
                }
              >
                <ProductImage
                  src={chapter.product.image}
                  alt={`${chapter.product.name} — ${chapter.finish}`}
                  category={chapter.product.category}
                  view={chapter.view}
                  finish={chapter.finishColor}
                />
              </m.div>
            </AnimatePresence>
          </div>

          <div className="product-story__statement" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={activeChapter}
                className="product-story__statement-inner"
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : 12,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: reduceMotion ? 0 : -10,
                  transition: { duration: reduceMotion ? 0.1 : 0.3 },
                }}
                transition={
                  reduceMotion
                    ? { duration: 0.12 }
                    : { duration: 0.55, ease: cinematicEase }
                }
              >
                <span className="product-story__chapter-eyebrow">
                  {chapter.eyebrow}
                </span>
                <h3 className="product-story__chapter-title">
                  {chapter.title}
                </h3>
                <p className="product-story__chapter-copy">{chapter.copy}</p>
              </m.div>
            </AnimatePresence>
          </div>

          <div
            className="product-story__controls"
            role="group"
            aria-label="Chapitres de la sélection"
          >
            {chapters.map((item, index) => (
              <button
                key={item.product.id}
                type="button"
                className={`product-story__progress-segment${
                  index === activeChapter ? ' is-active' : ''
                }`}
                onClick={() => goToChapter(index)}
                aria-label={`Aller à la référence ${index + 1} : ${item.title}`}
                aria-pressed={index === activeChapter}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
            <span className="product-story__finish">
              {chapter.finishColor && (
                <span
                  className="product-story__swatch"
                  style={{ backgroundColor: chapter.finishColor }}
                  aria-hidden="true"
                />
              )}
              {chapter.finish}
            </span>
          </div>
        </div>

        <div className="product-story__track" aria-hidden="true">
          {chapters.map((item, index) => (
            <div
              key={item.product.id}
              ref={(node) => {
                sentinelRefs.current[index] = node;
              }}
              data-story-index={index}
              className="product-story__sentinel"
            />
          ))}
        </div>
      </div>

      <div className="container product-story__outro">
        <p>
          {chapterCount} référence{chapterCount > 1 ? 's' : ''} retenue
          {chapterCount > 1 ? 's' : ''} · prix TTC
        </p>
        <Link
          to="/produits"
          className="btn btn--light btn--lg"
          viewTransition
        >
          Voir toute la sélection
          <ArrowUpRightIcon size={17} />
        </Link>
      </div>
    </section>
  );
}
