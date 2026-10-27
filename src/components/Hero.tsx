import { Link } from './AppLink';
import { m } from 'motion/react';
import {
  getCategoryById,
  getFeaturedProducts,
  products,
} from '../data/products';
import { useEntrance, useStaggerReveal } from '../lib/motion';
import { ChevronRightIcon } from './Icons';
import ProductImage from './ProductImage';
import './Hero.css';

export default function Hero() {
  const heroProduct = getFeaturedProducts(1)[0] ?? products[0];
  /* One beat per line: eyebrow → headline → lead → links → product,
     100 ms apart, all settling on the shared 0.9 s ease-out curve. */
  const heroCopy = useStaggerReveal(20, 0.1, 0.9);
  const heroVisual = useEntrance({
    distance: 40,
    delay: 0.46,
    scale: 0.985,
    duration: 0.9,
  });

  if (!heroProduct) return null;

  const category = getCategoryById(heroProduct.category);
  const finish = heroProduct.colors?.[0]?.hex;
  const productHref = `/produit/${heroProduct.id}`;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <m.div
          className="hero__copy"
          variants={heroCopy.container}
          initial="hidden"
          animate="show"
        >
          <m.span className="hero__eyebrow" variants={heroCopy.item}>
            {heroProduct.brand}
            {category ? ` · ${category.name}` : ''}
          </m.span>

          <m.h1
            id="hero-title"
            className="hero__title"
            variants={heroCopy.item}
          >
            La précision,
            <br />
            <span>sans compromis.</span>
          </m.h1>

          <m.p className="hero__lead" variants={heroCopy.item}>
            {heroProduct.tagline ??
              `${heroProduct.name}, présenté à la manière Zitouni : l'essentiel, sans détour.`}
          </m.p>

          <m.div className="hero__actions" variants={heroCopy.item}>
            <Link to={productHref} className="hero__cta" viewTransition>
              Découvrir le produit
              <ChevronRightIcon size={16} />
            </Link>
            <Link to="/produits" className="hero__link" viewTransition>
              Toute la sélection
              <ChevronRightIcon size={16} />
            </Link>
          </m.div>
        </m.div>

        <m.div className="hero__visual" {...heroVisual}>
          <div className="hero__device-shell">
            <ProductImage
              src={heroProduct.image}
              alt={heroProduct.name}
              category={heroProduct.category}
              finish={finish}
              priority
            />
          </div>
        </m.div>
      </div>
    </section>
  );
}
