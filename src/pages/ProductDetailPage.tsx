import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/AppLink';
import CartToast from '../components/CartToast';
import LineReveal from '../components/LineReveal';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import Stage from '../components/Stage';
import { useCart } from '../context/CartContext';
import {
  CATEGORY_PATHS,
  getCategoryById,
  getProductById,
  getRelatedProducts,
  getVariantPrice,
} from '../data/products';
import { formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CreditCardIcon,
  InfoIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '../components/Icons';
import './ProductDetailPage.css';

const FLIGHT_MS = 600;
const CONFIRM_MS = 1200;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { add } = useCart();
  const reduceMotion = useShouldReduceMotion();
  const product = id ? getProductById(id) : undefined;

  usePageTitle(product?.name);

  const [variantName, setVariantName] = useState<string | undefined>(
    product?.variants?.[0]?.name
  );
  const [colorName, setColorName] = useState<string | undefined>(
    product?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState<{ name: string; id: number } | null>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const addedTimer = useRef(0);

  useEffect(() => {
    setVariantName(product?.variants?.[0]?.name);
    setColorName(product?.colors?.[0]?.name);
    setQuantity(1);
    setAdded(false);
  }, [product]);

  useEffect(() => () => window.clearTimeout(addedTimer.current), []);

  const closeToast = useCallback(() => setToast(null), []);

  const flyToCart = useCallback(() => {
    if (reduceMotion) return;
    const source =
      mediaRef.current?.querySelector<HTMLElement>('.product-visual');
    const target = document.querySelector<HTMLElement>(
      '.header-icon-btn--cart'
    );
    if (!source || !target) return;

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (from.width === 0 || to.width === 0) return;

    const clone = source.cloneNode(true) as HTMLElement;
    clone.classList.add('product-fly');
    Object.assign(clone.style, {
      position: 'fixed',
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      margin: '0',
      zIndex: '90',
      pointerEvents: 'none',
    });
    document.body.appendChild(clone);

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const arcLift = Math.max(70, Math.abs(dx) * 0.22);

    const animation = clone.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        {
          transform: `translate(${dx * 0.55}px, ${dy * 0.55 - arcLift}px) scale(0.6)`,
          opacity: 0.92,
          offset: 0.58,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.12)`,
          opacity: 0,
        },
      ],
      {
        duration: FLIGHT_MS,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
      }
    );
    const cleanup = () => clone.remove();
    animation.onfinish = cleanup;
    animation.oncancel = cleanup;
  }, [reduceMotion]);

  if (!product) {
    return (
      <section className="product-page">
        <div className="container product-page__empty">
          <div className="empty-state">
            <span className="empty-state__icon">
              <InfoIcon size={24} />
            </span>
            <h1>Produit introuvable</h1>
            <p>
              Cette référence n’existe pas ou n’est plus proposée dans la
              boutique.
            </p>
            <div className="empty-state__actions">
              <Link to="/produits" className="btn btn--primary">
                Retour à la boutique
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const category = getCategoryById(product.category);
  const unitPrice = getVariantPrice(product, variantName);
  const related = getRelatedProducts(product, 4);
  const variants = product.variants ?? [];
  const colors = product.colors ?? [];
  const highlights = product.highlights ?? [];

  const handleAdd = () => {
    add(product, quantity, { variant: variantName, color: colorName });
    flyToCart();
    setAdded(true);
    window.clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), CONFIRM_MS);
    setToast({ name: product.name, id: Date.now() });
  };

  return (
    <article className="product-page">
      <div className="container product-page__breadcrumb-wrap">
        <nav
          className="breadcrumb product-page__breadcrumb"
          aria-label="Fil d’Ariane"
        >
          <Link to="/produits">Boutique</Link>
          <ChevronRightIcon size={13} className="breadcrumb__sep" />
          {category && (
            <>
              <Link to={CATEGORY_PATHS[category.id]}>{category.name}</Link>
              <ChevronRightIcon size={13} className="breadcrumb__sep" />
            </>
          )}
          <span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <section className="product-page__hero">
        <div className="container product-page__hero-grid">
          <div className="product-page__gallery" ref={mediaRef}>
            <div className="product-page__media-frame">
              <Stage reflect tilt sheen className="product-page__stage">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  view={1}
                  variant="bare"
                  priority
                />
              </Stage>
            </div>
            <p className="product-page__media-note">
              Visuel de démonstration
            </p>
          </div>

          <div className="product-page__details">
            <header className="product-page__title-group">
              <p className="product-page__eyebrow">
                {product.brand}
                {category ? ` · ${category.name}` : ''}
              </p>
              <LineReveal
                as="h1"
                className="product-page__title"
                immediate
                lines={[product.name]}
              />
              {product.tagline && (
                <p className="product-page__tagline">{product.tagline}</p>
              )}
            </header>

            <div className="product-page__price-row">
              <p className="product-page__price">{formatPrice(unitPrice)}</p>
              <span className="product-page__price-note">
                Prix TTC{variantName ? ` · ${variantName}` : ''}
              </span>
            </div>

            <p className="product-page__availability">
              <span className="product-page__availability-dot" aria-hidden="true" />
              Commande en ligne bientôt disponible
            </p>

            {colors.length > 0 && (
              <div className="product-option">
                <p className="product-option__legend" id="color-legend">
                  Coloris
                </p>
                <div
                  className="product-colors"
                  role="radiogroup"
                  aria-labelledby="color-legend"
                >
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      role="radio"
                      aria-checked={colorName === color.name}
                      className={`product-color${
                        colorName === color.name ? ' is-selected' : ''
                      }`}
                      onClick={() => setColorName(color.name)}
                    >
                      <span
                        className="product-color__swatch"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span className="product-color__name">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {variants.length > 0 && (
              <fieldset className="product-option">
                <legend className="product-option__legend">
                  Configuration
                </legend>
                <div className="product-option__list">
                  {variants.map((variant) => (
                    <label
                      key={variant.name}
                      className={`product-option__choice${
                        variantName === variant.name ? ' is-selected' : ''
                      }`}
                    >
                      <input
                        className="product-option__input"
                        type="radio"
                        name={`variant-${product.id}`}
                        value={variant.name}
                        checked={variantName === variant.name}
                        onChange={() => setVariantName(variant.name)}
                      />
                      <span className="product-option__name">
                        {variant.name}
                      </span>
                      <span className="product-option__price">
                        {formatPrice(variant.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="product-page__purchase">
              <QuantityStepper
                value={quantity}
                min={1}
                max={10}
                onChange={setQuantity}
                label="Quantité"
              />
              <button
                type="button"
                className={`btn btn--primary product-page__cta${
                  added ? ' is-added' : ''
                }`}
                onClick={handleAdd}
                aria-live="polite"
              >
                {added ? (
                  <>
                    <CheckIcon size={16} strokeWidth={2.4} />
                    Ajouté
                  </>
                ) : (
                  'Ajouter au panier'
                )}
              </button>
            </div>

            <ul className="product-page__assurances">
              <li>
                <TruckIcon size={18} strokeWidth={1.5} />
                <span>
                  <strong>Livraison 58 wilayas</strong>
                  24 à 96 h selon la zone
                </span>
              </li>
              <li>
                <CreditCardIcon size={18} strokeWidth={1.5} />
                <span>
                  <strong>Paiement à la livraison</strong>
                  Après vérification du colis
                </span>
              </li>
              <li>
                <ShieldCheckIcon size={18} strokeWidth={1.5} />
                <span>
                  <strong>Garantie 24 mois</strong>
                  Retour sous 7 jours
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section
          className="product-page__bands"
          aria-label="Points clés du produit"
        >
          {highlights.map((highlight, index) => (
            <div
              key={highlight}
              className={`product-band${index % 2 === 1 ? ' product-band--alt' : ''}`}
            >
              <div className="container product-band__inner">
                <span className="product-band__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="product-band__text">{highlight}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <section
          className="container product-page__section product-page__specs-section"
          aria-labelledby="specs-title"
        >
          <div className="product-page__section-head">
            <h2 id="specs-title" className="product-page__section-title">
              Caractéristiques
            </h2>
          </div>

          <div className={`product-accordion${specsOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              className="product-accordion__trigger"
              aria-expanded={specsOpen}
              aria-controls="specs-panel"
              onClick={() => setSpecsOpen((open) => !open)}
            >
              <span>Fiche technique</span>
              <ChevronDownIcon size={18} className="product-accordion__chevron" />
            </button>
            <div className="product-accordion__panel" id="specs-panel">
              <div className="product-accordion__panel-inner">
                <dl className="product-specs">
                  {Object.entries(product.specs).map(([label, value]) => (
                    <div key={label} className="product-specs__row">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section
          className="container product-page__section product-page__related"
          aria-labelledby="related-title"
        >
          <div className="product-page__section-head product-page__section-head--row">
            <h2 id="related-title" className="product-page__section-title">
              À découvrir aussi
            </h2>
            <Link to="/produits" className="text-link" viewTransition>
              Toute la boutique
              <ChevronRightIcon size={14} />
            </Link>
          </div>

          <div className="product-rail" role="region" aria-label="Produits associés">
            <div className="product-rail__track">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} variant="lineup" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile buy bar — same action, always within thumb reach. */}
      <div className="product-buybar">
        <div className="product-buybar__price">
          <span>{formatPrice(unitPrice)}</span>
          <span className="product-buybar__note">Prix TTC</span>
        </div>
        <button
          type="button"
          className={`btn btn--primary product-buybar__cta${
            added ? ' is-added' : ''
          }`}
          onClick={handleAdd}
        >
          {added ? (
            <>
              <CheckIcon size={16} strokeWidth={2.4} />
              Ajouté
            </>
          ) : (
            'Ajouter'
          )}
        </button>
      </div>

      {toast && (
        <CartToast
          key={toast.id}
          productName={toast.name}
          onClose={closeToast}
        />
      )}
    </article>
  );
}
