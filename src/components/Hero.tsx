import { Link } from './AppLink';
import { m } from 'motion/react';
import { Tilt, TiltContent } from '@animate-ui/react/primitives/effects/tilt';
import { getProductById } from '../data/products';
import { formatDiscount, formatPrice } from '../lib/format';
import { useEntrance, useStaggerReveal } from '../lib/motion';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  TruckIcon,
} from './Icons';
import ProductImage from './ProductImage';
import './Hero.css';

export default function Hero() {
  const heroProduct = getProductById('iphone-16-pro-max');
  const promoProduct = getProductById('samsung-galaxy-s25-ultra');
  const heroCopy = useStaggerReveal(28, 0.085);
  const heroVisual = useEntrance({
    distance: 34,
    delay: 0.12,
    scale: 0.975,
    duration: 0.92,
  });

  if (!heroProduct || !promoProduct) return null;

  const promoLabel = formatDiscount(promoProduct);

  return (
    <section className="hero on-dark" aria-labelledby="hero-title">
      <div className="hero__texture" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy-scroll">
          <m.div
            className="hero__copy"
            variants={heroCopy.container}
            initial="hidden"
            animate="show"
          >
            <m.span className="eyebrow" variants={heroCopy.item}>
              Électronique · Sélection 2026
            </m.span>

            <m.h1
              id="hero-title"
              className="hero__title"
              variants={heroCopy.item}
            >
              La tech,
              <br />
              <span className="hero__title-accent">sans compromis.</span>
            </m.h1>

            <m.p className="hero__lead" variants={heroCopy.item}>
              Smartphones, ordinateurs, gaming et accessoires. Une sélection
              exigeante, des prix justes et la livraison dans les 58 wilayas.
            </m.p>

            <m.div className="hero__actions" variants={heroCopy.item}>
              <Link
                to="/produits"
                className="btn btn--light btn--lg"
                viewTransition
              >
                Explorer la boutique
                <ArrowRightIcon size={17} />
              </Link>
              <Link
                to="/promotions"
                className="btn btn--outline-light btn--lg"
                viewTransition
              >
                Voir les offres
              </Link>
            </m.div>

            <m.dl className="hero__stats" variants={heroCopy.item}>
              <div className="hero__stat">
                <dt>58</dt>
                <dd>wilayas livrées</dd>
              </div>
              <div className="hero__stat">
                <dt>24–72&nbsp;h</dt>
                <dd>délai de livraison</dd>
              </div>
              <div className="hero__stat">
                <dt>2 ans</dt>
                <dd>garantie officielle</dd>
              </div>
            </m.dl>
          </m.div>
        </div>

        <m.div className="hero__visual" {...heroVisual}>
          <Tilt
            className="hero__frame-tilt"
            maxTilt={2.4}
            perspective={1400}
          >
            <TiltContent className="hero__frame-tilt-content">
              <article className="hero__frame">
                <div className="hero__frame-head">
                  <span>Pièce maîtresse</span>
                  <span>Sélection</span>
                </div>

                <Link
                  to={`/produit/${heroProduct.id}`}
                  className="hero__frame-media"
                  viewTransition
                >
                  <span className="visually-hidden">
                    Découvrir {heroProduct.name}
                  </span>
                  <ProductImage
                    src={heroProduct.image}
                    alt={heroProduct.name}
                    category={heroProduct.category}
                    priority
                  />
                  <span className="badge badge--new hero__frame-badge">
                    Nouveauté
                  </span>
                </Link>

                <div className="hero__frame-caption">
                  <div className="hero__frame-copy">
                    <span className="hero__frame-brand">
                      {heroProduct.brand}
                    </span>
                    <h2 className="hero__frame-name">
                      {heroProduct.name}
                    </h2>
                    <span className="hero__frame-price">
                      {formatPrice(heroProduct.price)}
                    </span>
                  </div>

                  <Link
                    to={`/produit/${heroProduct.id}`}
                    className="hero__frame-link"
                    aria-label={`Voir la fiche de ${heroProduct.name}`}
                    viewTransition
                  >
                    <ArrowUpRightIcon size={19} />
                  </Link>
                </div>
              </article>
            </TiltContent>
          </Tilt>

          <aside className="hero__mini" aria-label="Offre de la semaine">
            <div className="hero__mini-media">
              <ProductImage
                src={promoProduct.image}
                alt={promoProduct.name}
                category={promoProduct.category}
              />
              {promoLabel && (
                <span className="hero__mini-badge">{promoLabel}</span>
              )}
            </div>

            <div className="hero__mini-copy">
              <span className="hero__mini-label">Offre de la semaine</span>
              <h3 className="hero__mini-name">{promoProduct.name}</h3>
              <span className="hero__mini-price">
                {formatPrice(promoProduct.price)}
              </span>
              <Link
                to={`/produit/${promoProduct.id}`}
                className="hero__mini-link"
                viewTransition
              >
                Voir l'offre
                <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div className="hero__mini-note">
              <TruckIcon size={15} />
              <span>
                Livraison 24–72 h
                <small>Selon votre wilaya</small>
              </span>
            </div>

            <div className="hero__mini-note">
              <ShieldCheckIcon size={15} />
              <span>
                Garantie officielle
                <small>Produits authentiques</small>
              </span>
            </div>
          </aside>
        </m.div>
      </div>
    </section>
  );
}
