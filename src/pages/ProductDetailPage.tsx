import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from '../components/AppLink';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import Reveal from '../components/Reveal';
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
import {
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  InfoIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '../components/Icons';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const product = id ? getProductById(id) : undefined;

  usePageTitle(product?.name);

  const [variantName, setVariantName] = useState<string | undefined>(
    product?.variants?.[0]?.name
  );
  const [colorName, setColorName] = useState<string | undefined>(
    product?.colors?.[0]?.name
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setVariantName(product?.variants?.[0]?.name);
    setColorName(product?.colors?.[0]?.name);
    setQuantity(1);
  }, [product]);

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
  const related = getRelatedProducts(product, 3);
  const variants = product.variants ?? [];
  const colors = product.colors ?? [];

  const handleAdd = () => {
    add(product, quantity, { variant: variantName, color: colorName });
    navigate('/panier');
  };

  return (
    <article className="product-page">
      <div className="container product-page__breadcrumb-wrap">
        <nav className="breadcrumb product-page__breadcrumb" aria-label="Fil d’Ariane">
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
          <Reveal className="product-page__gallery">
            <div className="product-page__media-frame">
              <ProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                view={1}
                showNote
                priority
              />
            </div>
          </Reveal>

          <Reveal className="product-page__details">
            <header className="product-page__title-group">
              <p className="product-page__eyebrow">
                {product.brand}
                {category ? ` · ${category.name}` : ''}
              </p>
              <h1 className="product-page__title">{product.name}</h1>
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
                className="btn btn--primary product-page__cta"
                onClick={handleAdd}
              >
                Ajouter au panier
              </button>
            </div>

            <ul className="product-page__assurances">
              <li>
                <TruckIcon size={17} />
                <span>
                  <strong>Livraison 58 wilayas</strong>
                  24 à 96 h selon la zone
                </span>
              </li>
              <li>
                <CreditCardIcon size={17} />
                <span>
                  <strong>Paiement à la livraison</strong>
                  Après vérification du colis
                </span>
              </li>
              <li>
                <ShieldCheckIcon size={17} />
                <span>
                  <strong>Garantie 24 mois</strong>
                  Retour sous 7 jours
                </span>
              </li>
            </ul>

            {product.highlights && product.highlights.length > 0 && (
              <div className="product-page__highlights">
                <h2 className="product-page__section-label">Points clés</h2>
                <ul>
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>
                      <CheckIcon size={14} strokeWidth={2.2} />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {product.specs && Object.keys(product.specs).length > 0 && (
        <section
          className="container product-page__section product-page__specs-section"
          aria-labelledby="specs-title"
        >
          <div className="product-page__section-head">
            <p className="product-page__section-kicker">Fiche produit</p>
            <h2 id="specs-title" className="product-page__section-title">
              Caractéristiques
            </h2>
          </div>

          <dl className="product-specs">
            {Object.entries(product.specs).map(([label, value]) => (
              <div key={label} className="product-specs__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {related.length > 0 && (
        <section
          className="container product-page__section product-page__related"
          aria-labelledby="related-title"
        >
          <div className="product-page__section-head product-page__section-head--row">
            <div>
              <p className="product-page__section-kicker">Continuer</p>
              <h2 id="related-title" className="product-page__section-title">
                À découvrir aussi
              </h2>
            </div>
            <Link to="/produits" className="text-link" viewTransition>
              Toute la boutique
              <ChevronRightIcon size={14} />
            </Link>
          </div>

          <div className="product-grid product-grid--3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
