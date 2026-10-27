import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/AppLink';
import { AnimatePresence, m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { WilayaSelector } from '../components/WilayaSelector';
import { useCart } from '../context/CartContext';
import { useWilaya } from '../context/WilayaContext';
import { useWishlist } from '../context/WishlistContext';
import {
  CATEGORY_PATHS,
  getCategoryById,
  getProductById,
  getRelatedProducts,
  getVariantPrice,
  type Product,
} from '../data/products';
import { getDeliveryEstimate } from '../data/wilayas';
import { formatPrice } from '../lib/format';
import { cinematicEase, useStaggerReveal } from '../lib/motion';
import { usePageTitle } from '../lib/usePageTitle';
import {
  CheckIcon,
  HeartIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
} from '../components/Icons';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  usePageTitle(product ? product.name : 'Produit introuvable');

  if (!product) {
    return (
      <section className="section product-missing">
        <div className="container">
          <div className="empty-state">
            <span className="empty-state__icon">
              <PackageIcon size={28} />
            </span>
            <h1>Produit introuvable</h1>
            <p>
              Cette référence n'existe pas ou a été retirée du catalogue.
              Parcourez les rayons pour trouver un modèle équivalent.
            </p>
            <div className="empty-state__actions">
              <Link to="/produits" className="btn btn--primary">
                Voir le catalogue
              </Link>
              <Link to="/" className="btn btn--outline">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const { add } = useCart();
  const wishlist = useWishlist();
  const { wilaya } = useWilaya();
  const { spring, transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const infoReveal = useStaggerReveal(18, 0.08, 0.9);
  const estimate = getDeliveryEstimate(wilaya);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.name ?? ''
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name ?? ''
  );
  const [added, setAdded] = useState(false);
  const [showSubbar, setShowSubbar] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantity(1);
    setSelectedVariant(product.variants?.[0]?.name ?? '');
    setSelectedColor(product.colors?.[0]?.name ?? '');
    setAdded(false);
  }, [product]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* The buy bar only exists once the hero is out of the way. */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      const onScroll = () => {
        setShowSubbar(hero.getBoundingClientRect().bottom < 88);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowSubbar(!entry?.isIntersecting),
      { threshold: 0, rootMargin: '-88px 0px 0px 0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const category = getCategoryById(product.category);
  const relatedProducts = getRelatedProducts(product, 3);
  const isWishlisted = wishlist.has(product.id);
  const activeColor = product.colors?.find(
    (color) => color.name === selectedColor
  );
  const selectedPrice = getVariantPrice(product, selectedVariant);
  const highlights = product.highlights ?? [];
  const specs = product.specs ? Object.entries(product.specs) : [];

  const handleAdd = () => {
    add(product, quantity, {
      variant: selectedVariant || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="product-page">
      <div className="container">
        <nav
          className="breadcrumb product-page__breadcrumb"
          aria-label="Fil d'Ariane"
        >
          <Link to="/" viewTransition>
            Accueil
          </Link>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <Link to="/produits" viewTransition>
            Boutique
          </Link>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          {category && (
            <>
              <Link to={CATEGORY_PATHS[category.id]} viewTransition>
                {category.name}
              </Link>
              <span className="breadcrumb__sep" aria-hidden="true">
                /
              </span>
            </>
          )}
          <span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <section
        ref={heroRef}
        className="product-hero"
        aria-labelledby="product-title"
      >
        <div className="container product-hero__inner">
          <m.div
            className="product-hero__copy"
            variants={infoReveal.container}
            initial="hidden"
            animate="show"
          >
            <m.span className="eyebrow" variants={infoReveal.item}>
              {product.brand}
              {category ? ` · ${category.name}` : ''}
            </m.span>
            <m.h1
              id="product-title"
              className="product-hero__title"
              variants={infoReveal.item}
            >
              {product.name}
            </m.h1>
            {product.tagline && (
              <m.p
                className="product-hero__tagline"
                variants={infoReveal.item}
              >
                {product.tagline}
              </m.p>
            )}
            <m.div className="product-hero__price" variants={infoReveal.item}>
              <div className="price price--lg">
                <span className="price__now">{formatPrice(selectedPrice)}</span>
              </div>
              <div className="product-hero__price-meta">
                <span>Prix TTC</span>
                {selectedVariant && <span>{selectedVariant}</span>}
              </div>
            </m.div>
          </m.div>

          <div className="product-hero__stage">
            <span className="product-hero__aura" aria-hidden="true" />
            <AnimatePresence initial={false} mode="sync">
              <m.div
                key={activeColor?.hex ?? 'default'}
                className="product-hero__slide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0.12 : 0.45,
                  ease: cinematicEase,
                }}
              >
                <ProductImage
                  src={product.image}
                  alt={`${product.name}${
                    activeColor ? ` — ${activeColor.name}` : ''
                  }`}
                  category={product.category}
                  view={0}
                  finish={activeColor?.hex}
                  priority
                />
              </m.div>
            </AnimatePresence>
          </div>

          <div className="product-hero__config">
            {product.colors && product.colors.length > 0 && (
              <fieldset className="product-option">
                <legend className="product-option__legend">
                  Couleur
                  <span className="product-option__value">{selectedColor}</span>
                </legend>
                <div className="product-swatches">
                  {product.colors.map((color) => (
                    <label
                      key={color.name}
                      className={`product-swatch${
                        selectedColor === color.name ? ' is-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        className="visually-hidden"
                        name={`color-${product.id}`}
                        value={color.name}
                        checked={selectedColor === color.name}
                        onChange={() => setSelectedColor(color.name)}
                      />
                      <span
                        className="product-swatch__dot"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span className="product-swatch__name">{color.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {product.variants && product.variants.length > 0 && (
              <fieldset className="product-option">
                <legend className="product-option__legend">
                  Configuration
                  <span className="product-option__value">
                    {selectedVariant}
                  </span>
                </legend>
                <div className="product-tiers">
                  {product.variants.map((variant) => (
                    <label
                      key={variant.name}
                      className={`product-tier${
                        selectedVariant === variant.name ? ' is-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        className="visually-hidden"
                        name={`variant-${product.id}`}
                        value={variant.name}
                        checked={selectedVariant === variant.name}
                        onChange={() => setSelectedVariant(variant.name)}
                      />
                      <span className="product-tier__name">{variant.name}</span>
                      <span className="product-tier__price">
                        {formatPrice(variant.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="product-buy">
              <div className="product-buy__quantity">
                <span className="field-label">Quantité</span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                  label={product.name}
                />
              </div>

              <button
                type="button"
                className={`btn btn--primary btn--lg product-buy__add${
                  added ? ' is-added' : ''
                }`}
                onClick={handleAdd}
              >
                <m.span
                  key={added ? 'added' : 'idle'}
                  className="product-buy__add-content"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transition.fade}
                >
                  {added ? (
                    <CheckIcon size={17} />
                  ) : (
                    <ShoppingBagIcon size={17} />
                  )}
                  {added ? 'Ajouté au panier' : 'Ajouter au panier'}
                </m.span>
              </button>

              <button
                type="button"
                className={`product-buy__wishlist${
                  isWishlisted ? ' is-active' : ''
                }`}
                onClick={() => wishlist.toggle(product.id)}
                aria-pressed={isWishlisted}
              >
                <m.span
                  key={isWishlisted ? 'filled' : 'outline'}
                  className="product-buy__wishlist-icon"
                  initial={{
                    opacity: 0.4,
                    scale: reduceMotion ? 1 : 0.6,
                  }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={spring.pop}
                >
                  <HeartIcon size={17} filled={isWishlisted} />
                </m.span>
                {isWishlisted ? 'Dans les favoris' : 'Ajouter aux favoris'}
              </button>
            </div>

            <div className="product-hero__availability">
              <span className="product-hero__ref">
                Réf. {product.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <p className="visually-hidden" role="status" aria-live="polite">
              {added
                ? `${quantity} × ${product.name} ajouté${
                    quantity > 1 ? 's' : ''
                  } au panier.`
                : ''}
            </p>
          </div>
        </div>
      </section>

      <div
        className={`product-subbar${showSubbar ? ' is-stuck' : ''}`}
        inert={showSubbar ? undefined : true}
      >
        <div className="container product-subbar__inner">
          <span className="product-subbar__name">{product.name}</span>
          <div className="product-subbar__actions">
            <span className="product-subbar__price">
              {formatPrice(selectedPrice)}
            </span>
            <button
              type="button"
              className="btn btn--primary product-subbar__add"
              onClick={handleAdd}
            >
              {added ? (
                'Ajouté'
              ) : (
                <>
                  <span className="product-subbar__add-full">
                    Ajouter au panier
                  </span>
                  <span className="product-subbar__add-short">Ajouter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {highlights.length > 0 && (
        <section
          className="product-highlights"
          aria-labelledby="product-highlights-title"
        >
          <div className="container">
            <Reveal className="product-highlights__head">
              <span className="eyebrow">Points forts</span>
              <h2 id="product-highlights-title">
                Ce qui fait la différence.
              </h2>
            </Reveal>

            <Reveal
              className="product-highlights__grid"
              stagger
            >
              {highlights.map((highlight, index) => (
                <article className="product-highlight" key={highlight}>
                  <span className="product-highlight__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="product-highlight__text">{highlight}</p>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {specs.length > 0 && (
        <section
          className="product-specs"
          aria-labelledby="product-specs-title"
        >
          <div className="container product-specs__inner">
            <Reveal className="product-specs__head">
              <span className="eyebrow">Fiche technique</span>
              <h2 id="product-specs-title">
                Les caractéristiques essentielles.
              </h2>
              <p>Les points vérifiés de la référence, sans détour.</p>
            </Reveal>

            <details className="product-accordion" open>
              <summary className="product-accordion__summary">
                <span className="product-accordion__label">
                  <span className="product-accordion__kicker">
                    Caractéristiques
                  </span>
                  <span className="product-accordion__title">
                    {product.name}
                  </span>
                </span>
                <span className="product-accordion__meta">
                  {specs.length} points
                </span>
              </summary>
              <div className="product-accordion__body">
                <Reveal
                  as="dl"
                  className="product-specs__grid"
                  stagger
                >
                  {specs.map(([key, value]) => (
                    <div key={key} className="product-specs__row">
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </Reveal>
              </div>
            </details>
          </div>
        </section>
      )}

      <section
        className="product-delivery-band on-dark"
        aria-labelledby="product-delivery-title"
      >
        <div className="container product-delivery-band__inner">
          <Reveal className="product-delivery-band__copy">
            <span className="eyebrow">Livraison</span>
            <h2 id="product-delivery-title">
              Livré chez vous, partout en Algérie.
            </h2>
            <p>
              Choisissez votre wilaya : le délai estimé s'ajuste
              automatiquement.
            </p>
          </Reveal>

          <Reveal className="product-delivery__panel">
            <WilayaSelector variant="field" label="Livraison vers" />

            <dl className="product-delivery__estimate">
              <div>
                <dt>Zone</dt>
                <dd>{estimate.zoneLabel}</dd>
              </div>
              <div>
                <dt>Délai estimé</dt>
                <dd>{estimate.label}</dd>
              </div>
              <div>
                <dt>Paiement</dt>
                <dd>À la livraison</dd>
              </div>
            </dl>

            <ul className="product-delivery__trust">
              <li>
                <ShieldCheckIcon size={15} />
                Garantie officielle 24 mois
              </li>
              <li>
                <PackageIcon size={15} />
                Produit neuf, scellé et vérifié
              </li>
              <li>
                <MapPinIcon size={15} />
                {wilaya.name} · 58 wilayas desservies
              </li>
            </ul>

            <Link
              to="/aide#livraison"
              className="product-delivery__link"
              viewTransition
            >
              <TruckIcon size={16} />
              Détails de livraison
            </Link>
          </Reveal>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section
          className="section section--surface product-related"
          aria-labelledby="related-title"
        >
          <div className="container">
            <SectionHeader
              id="related-title"
              eyebrow="À découvrir aussi"
              title="D'autres références, d'autres usages."
              description="Des produits proches ou complémentaires, avec leurs propres forces et leur propre budget."
              link={{
                to: '/produits',
                label: 'Tout le catalogue',
              }}
            />
            <Reveal
              className="product-grid product-grid--3"
              stagger
            >
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
