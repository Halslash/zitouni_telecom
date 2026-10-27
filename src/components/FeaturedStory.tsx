import { useEffect, useRef, useState } from 'react';
import { Link } from './AppLink';
import { AnimatePresence, m } from 'motion/react';
import { Slide } from '@animate-ui/react/primitives/effects/slide';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { getProductById } from '../data/products';
import { formatPrice } from '../lib/format';
import { cinematicTransition } from '../lib/motion';
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons';
import ProductImage from './ProductImage';
import './FeaturedStory.css';

interface StoryChapter {
  eyebrow: string;
  title: string;
  copy: string;
  finish: string;
  finishColor: string;
  metrics: Array<{ label: string; value: string }>;
  view: number;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    eyebrow: 'Chapitre 01 · Structure',
    title: 'Le titane, taillé pour durer.',
    copy:
      "Un châssis en titane de qualité aérospatiale, poli pour rester léger dans la main et solide dans le temps. Les angles sont adoucis, la matière reste brute.",
    finish: 'Titane naturel',
    finishColor: '#b9b0a7',
    metrics: [
      { label: 'Écran', value: '6,9 pouces' },
      { label: 'Matière', value: 'Titane' },
    ],
    view: 0,
  },
  {
    eyebrow: 'Chapitre 02 · Puissance',
    title: 'La performance, sans le bruit.',
    copy:
      "La puce A18 Pro absorbe les tâches lourdes avec une efficacité tranquille. Jeux, montage, multitâche : la machine garde son calme, même quand le rythme accélère.",
    finish: 'Titane noir',
    finishColor: '#3f3b3c',
    metrics: [
      { label: 'Processeur', value: 'A18 Pro' },
      { label: 'GPU', value: '6 cœurs' },
    ],
    view: 1,
  },
  {
    eyebrow: 'Chapitre 03 · Regard',
    title: 'Chaque détail, à sa juste place.',
    copy:
      "Un système photo Pro de 48 Mpx capte la lumière sans forcer le trait. Le zoom reste net, les couleurs naturelles, et la vidéo garde sa texture jusque dans les mouvements.",
    finish: 'Titane désert',
    finishColor: '#c8ae8e',
    metrics: [
      { label: 'Photo', value: '48 Mpx' },
      { label: 'Vidéo', value: '4K 120 ips' },
    ],
    view: 2,
  },
];

export default function FeaturedStory() {
  const product = getProductById('iphone-16-pro-max');
  const reduceMotion = useShouldReduceMotion();
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const chapters = chapterRefs.current.filter(
      (chapter): chapter is HTMLElement => Boolean(chapter)
    );

    if (chapters.length === 0) return undefined;

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
        rootMargin: '-31% 0px -31% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  if (!product) return null;

  const chapter = STORY_CHAPTERS[activeChapter];

  const goToChapter = (index: number) => {
    chapterRefs.current[index]?.scrollIntoView({
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
      <div className="product-story__grid" aria-hidden="true" />

      <div className="container">
        <Slide
          inView
          inViewMargin="-14% 0px -14% 0px"
          offset={30}
          transition={cinematicTransition}
          className="product-story__intro"
        >
          <span className="eyebrow product-story__eyebrow">
            Chapitre signature · iPhone 16 Pro Max
          </span>
          <h2 id="product-story-title" className="product-story__title">
            Taillé dans le titane.
            <br />
            <span>Pensé pour durer.</span>
          </h2>
          <p className="product-story__lead">
            Une matière, une architecture, un regard. Faites défiler pour
            découvrir ce qui transforme un smartphone en objet de précision.
          </p>
        </Slide>
      </div>

      <div className="container product-story__stage">
        <div className="product-story__visual">
          <div className="product-story__sticky">
            <div className="product-story__visual-head">
              <span>iPhone 16 Pro Max</span>
              <span className="product-story__counter">
                <SlidingNumber
                  number={activeChapter + 1}
                  padStart
                  initiallyStable
                  transition={{ stiffness: 180, damping: 26 }}
                />
                <span aria-hidden="true"> / 03</span>
              </span>
            </div>

            <div className="product-story__device-wrap">
              <span className="product-story__orb" aria-hidden="true" />
              <span className="product-story__halo" aria-hidden="true" />
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={chapter.view}
                  className="product-story__device"
                  initial={{
                    opacity: 0,
                    x: reduceMotion ? 0 : chapter.view % 2 === 0 ? -22 : 22,
                    scale: reduceMotion ? 1 : 0.955,
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: reduceMotion ? 0 : chapter.view % 2 === 0 ? 16 : -16,
                    scale: reduceMotion ? 1 : 1.02,
                    transition: { duration: reduceMotion ? 0.12 : 0.28 },
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0.12 }
                      : { duration: 0.62, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  <ProductImage
                    src={product.images[chapter.view]}
                    alt={`${product.name} — ${chapter.finish}`}
                    category={product.category}
                    view={chapter.view}
                  />
                </m.div>
              </AnimatePresence>
            </div>

            <div className="product-story__visual-foot">
              <div>
                <span className="product-story__meta-label">Finition</span>
                <strong className="product-story__finish">
                  <span
                    className="product-story__swatch"
                    style={{ backgroundColor: chapter.finishColor }}
                    aria-hidden="true"
                  />
                  {chapter.finish}
                </strong>
              </div>
              <div className="product-story__stage-note">
                <span className="product-story__meta-label">Présentation</span>
                <strong>Vue {String(activeChapter + 1).padStart(2, '0')}</strong>
              </div>
            </div>

            <div
              className="product-story__progress"
              role="group"
              aria-label="Chapitres de la présentation"
            >
              {STORY_CHAPTERS.map((item, index) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  className={`product-story__progress-segment${
                    index === activeChapter ? ' is-active' : ''
                  }`}
                  onClick={() => goToChapter(index)}
                  aria-label={`Aller au ${item.eyebrow.split(' · ')[0].toLowerCase()}`}
                  aria-pressed={index === activeChapter}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-story__chapters">
          {STORY_CHAPTERS.map((item, index) => (
            <article
              key={item.eyebrow}
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              data-story-index={index}
              className={`product-story__chapter${
                index === activeChapter ? ' is-active' : ''
              }`}
              aria-current={index === activeChapter ? 'step' : undefined}
            >
              <Slide
                inView
                inViewMargin="-18% 0px -18% 0px"
                offset={28}
                transition={cinematicTransition}
                className="product-story__chapter-slide"
              >
                <div className="product-story__chapter-inner">
                  <span className="product-story__chapter-eyebrow">
                    {item.eyebrow}
                  </span>
                  <h3 className="product-story__chapter-title">
                    {item.title}
                  </h3>
                  <p className="product-story__chapter-copy">{item.copy}</p>

                  <dl className="product-story__metrics">
                    {item.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Slide>
            </article>
          ))}
        </div>
      </div>

      <div className="container product-story__outro">
        <div className="product-story__outro-copy">
          <span className="eyebrow product-story__eyebrow">
            Disponible maintenant
          </span>
          <p>
            {product.name} · à partir de{' '}
            <strong>{formatPrice(product.price)}</strong>
          </p>
        </div>
        <Link
          to={`/produit/${product.id}`}
          className="btn btn--light btn--lg"
          viewTransition
        >
          Découvrir la fiche produit
          <ArrowUpRightIcon size={17} />
        </Link>
        <Link
          to="/telephones"
          className="product-story__secondary-link"
          viewTransition
        >
          Comparer les smartphones
          <ArrowRightIcon size={15} />
        </Link>
      </div>
    </section>
  );
}
