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
  getDiscountPercent,
  getProductById,
  getRelatedProducts,
  type Product,
} from '../data/products';
import { getDeliveryEstimate } from '../data/wilayas';
import { formatPrice, getStockState } from '../lib/format';
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

const GALLERY_LABELS = ['Vue d’ensemble', 'Vue de détail', 'Vue de profil'];

function galleryLabel(index: number) {
  return GALLERY_LABELS[index] ?? `Vue ${index + 1}`;
}

const BADGE_LABELS = {
  new: 'Nouveau',
  sale: 'Promotion',
  bestseller: 'Best-seller',
} as const;

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
  const infoReveal = useStaggerReveal(18, 0.065, 0.76);
  const estimate = getDeliveryEstimate(wilaya);

  const [quantity, setQuantity] = useState(1);
  const [activeView, setActiveView] = useState(0);
  const [galleryDirection, setGalleryDirection] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions?.[0] ?? ''
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name ?? ''
  );
  const [added, setAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuantity(1);
    setActiveView(0);
    setGalleryDirection(1);
    setSelectedStorage(product.storageOptions?.[0] ?? '');
    setSelectedColor(product.colors?.[0]?.name ?? '');
    setAdded(false);
  }, [product]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const category = getCategoryById(product.category);
  const relatedProducts = getRelatedProducts(product, 3);
  const discount = getDiscountPercent(product);
  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;
  const stock = getStockState(product);
  const isWishlisted = wishlist.has(product.id);
  const maxQuantity = product.stockCount
    ? Math.max(1, product.stockCount)
    : 99;

  const handleGalleryView = (view: number) => {
    if (view === activeView) return;
    setGalleryDirection(view > activeView ? 1 : -1);
    setActiveView(view);
  };

  const handleAdd = () => {
    if (!product.inStock) return;

    add(product, quantity, {
      storage: selectedStorage || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="product-page">
      <div className="container">
        <nav className="breadcrumb product-page__breadcrumb" aria-label="Fil d'Ariane">
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

        <article className="product-detail">
          <div className="product-detail__grid">
            <div className="product-gallery">
              <div className="product-gallery__stage">
                <AnimatePresence initial={false}>
                  <m.div
                    key={activeView}
                    className="product-gallery__slide"
                    initial={{
                      opacity: 0,
                      x: reduceMotion ? 0 : galleryDirection * 34,
                      scale: reduceMotion ? 1 : 1.035,
                    }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: reduceMotion ? 0 : galleryDirection * -20,
                      scale: reduceMotion ? 1 : 1.012,
                      transition: {
                        duration: reduceMotion ? 0.12 : 0.25,
                        ease: cinematicEase,
                      },
                    }}
                    transition={{
                      duration: reduceMotion ? 0.12 : 0.52,
                      ease: cinematicEase,
                    }}
                  >
                    <ProductImage
                      src={product.images[activeView]}
                      alt={`${product.name} — ${galleryLabel(activeView)}`}
                      category={product.category}
                      view={activeView}
                      priority
                    />
                  </m.div>
                </AnimatePresence>

                <div className="product-gallery__badges">
                  {discount ? (
                    <span className="badge badge--sale">−{discount}&nbsp;%</span>
                  ) : product.badge ? (
                    <span className={`badge badge--${product.badge}`}>
                      {BADGE_LABELS[product.badge]}
                    </span>
                  ) : null}
                </div>

                <span className="product-gallery__view-label">
                  <m.span
                    key={activeView}
                    initial={{ opacity: 0.35 }}
                    animate={{ opacity: 1 }}
                    transition={transition.fade}
                  >
                    {String(activeView + 1).padStart(2, '0')} /{' '}
                    {String(product.images.length).padStart(2, '0')} ·{' '}
                    {galleryLabel(activeView)}
                  </m.span>
                </span>
              </div>

              <div
                className="product-gallery__thumbs"
                role="group"
                aria-label="Choisir une vue du produit"
              >
                {product.images.map((_, view) => (
                  <button
                    key={view}
                    type="button"
                    className={`product-gallery__thumb${
                      activeView === view ? ' is-active' : ''
                    }`}
                    onClick={() => handleGalleryView(view)}
                    aria-pressed={activeView === view}
                  >
                    <span className="visually-hidden">
                      Vue {String(view + 1).padStart(2, '0')} :{' '}
                      {galleryLabel(view)}
                    </span>
                    <ProductImage
                      src={product.images[view]}
                      alt=""
                      category={product.category}
                      view={view}
                    />
                    <span
                      className="product-gallery__thumb-index"
                      aria-hidden="true"
                    >
                      {String(view + 1).padStart(2, '0')}
                    </span>
                    {activeView === view && (
                      <m.span
                        className="product-gallery__thumb-ring"
                        aria-hidden="true"
                        initial={{
                          opacity: 0,
                          scale: reduceMotion ? 1 : 0.94,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={spring.selection}
                      />
                    )}
                  </button>
                ))}
              </div>

              <ul className="product-gallery__notes">
                <li>
                  <ShieldCheckIcon size={15} />
                  Visuels de démonstration — produit neuf et garanti
                </li>
                <li>
                  <CheckIcon size={15} />
                  Référence vérifiée · {product.brand}
                </li>
              </ul>
            </div>

            <m.div
              className="product-info"
              variants={infoReveal.container}
              initial="hidden"
              animate="show"
            >
              <m.div
                className="product-info__head"
                variants={infoReveal.item}
              >
                <div>
                  <span className="eyebrow eyebrow--plain">
                    {product.brand}
                    {category ? ` · ${category.name}` : ''}
                  </span>
                  <h1 className="product-info__name">{product.name}</h1>
                </div>

                <div className="product-info__meta">
                  <span className={`availability ${stock.modifier}`}>
                    {stock.label}
                  </span>
                  <span className="product-info__ref">
                    Réf. {product.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </m.div>

              <m.p className="product-info__desc" variants={infoReveal.item}>
                {product.description}
              </m.p>

              <m.div
                className="product-info__price"
                variants={infoReveal.item}
              >
                <div className="price price--lg">
                  {product.originalPrice && (
                    <span className="price__old">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="price__now">{formatPrice(product.price)}</span>
                </div>

                <div className="product-info__price-meta">
                  <span>Prix TTC</span>
                  {discount && savings > 0 && (
                    <span className="product-info__save">
                      Économisez {formatPrice(savings)}
                    </span>
                  )}
                </div>
              </m.div>

              {product.storageOptions && product.storageOptions.length > 0 && (
                <m.fieldset
                  className="product-option"
                  variants={infoReveal.item}
                >
                  <legend className="product-option__legend">
                    Stockage
                    <m.span
                      key={selectedStorage}
                      className="product-option__value"
                      initial={{
                        opacity: 0.35,
                        y: reduceMotion ? 0 : -2,
                      }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transition.fade}
                    >
                      {selectedStorage}
                    </m.span>
                  </legend>
                  <div className="product-option__chips">
                    {product.storageOptions.map((option) => (
                      <label
                        key={option}
                        className={`product-chip${
                          selectedStorage === option ? ' is-selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`storage-${product.id}`}
                          value={option}
                          checked={selectedStorage === option}
                          onChange={() => setSelectedStorage(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </m.fieldset>
              )}

              {product.colors && product.colors.length > 0 && (
                <m.fieldset
                  className="product-option"
                  variants={infoReveal.item}
                >
                  <legend className="product-option__legend">
                    Couleur
                    <m.span
                      key={selectedColor}
                      className="product-option__value"
                      initial={{
                        opacity: 0.35,
                        y: reduceMotion ? 0 : -2,
                      }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transition.fade}
                    >
                      {selectedColor}
                    </m.span>
                  </legend>
                  <div className="product-colors">
                    {product.colors.map((color) => (
                      <label
                        key={color.name}
                        className={`product-color${
                          selectedColor === color.name ? ' is-selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`color-${product.id}`}
                          value={color.name}
                          checked={selectedColor === color.name}
                          onChange={() => setSelectedColor(color.name)}
                        />
                        <span
                          className="product-color__swatch"
                          style={{ backgroundColor: color.hex }}
                          aria-hidden="true"
                        >
                          <CheckIcon size={12} />
                        </span>
                        <span className="visually-hidden">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </m.fieldset>
              )}

              <m.div className="product-buy" variants={infoReveal.item}>
                <div className="product-buy__quantity">
                  <span className="field-label">Quantité</span>
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={maxQuantity}
                    label={product.name}
                  />
                </div>

                <button
                  type="button"
                  className={`btn btn--primary btn--lg product-buy__add${
                    added ? ' is-added' : ''
                  }`}
                  onClick={handleAdd}
                  disabled={!product.inStock}
                >
                  <m.span
                    key={added ? 'added' : 'idle'}
                    className="product-buy__add-content"
                    initial={{
                      opacity: 0,
                      y: reduceMotion ? 0 : 3,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition.fade}
                  >
                    {added ? (
                      <CheckIcon size={17} />
                    ) : (
                      <ShoppingBagIcon size={17} />
                    )}
                    {added
                      ? 'Ajouté au panier'
                      : product.inStock
                        ? 'Ajouter au panier'
                        : 'Produit épuisé'}
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
              </m.div>

              <p
                className="product-buy__feedback"
                role="status"
                aria-live="polite"
              >
                {added
                  ? `${quantity} × ${product.name} ajouté${
                      quantity > 1 ? 's' : ''
                    } au panier.`
                  : ''}
              </p>

              <m.div
                className="product-delivery"
                variants={infoReveal.item}
              >
                <div className="product-delivery__head">
                  <span className="product-delivery__icon" aria-hidden="true">
                    <TruckIcon size={18} />
                  </span>
                  <div>
                    <h2>Livraison &amp; paiement</h2>
                    <p>Estimez la réception selon votre wilaya.</p>
                  </div>
                </div>

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
                    <ShieldCheckIcon size={14} />
                    Garantie officielle 24 mois
                  </li>
                  <li>
                    <PackageIcon size={14} />
                    Produit neuf, scellé et vérifié
                  </li>
                  <li>
                    <MapPinIcon size={14} />
                    {wilaya.name} · 58 wilayas desservies
                  </li>
                </ul>
              </m.div>
            </m.div>
          </div>

          <section className="product-specs" aria-labelledby="specs-title">
            <div className="product-specs__head">
              <span className="eyebrow">Fiche technique</span>
              <h2 id="specs-title">Les caractéristiques essentielles.</h2>
              <p>
                Les informations ci-dessous proviennent de la fiche
                constructeur. Elles servent à comparer les modèles avant
                votre choix.
              </p>
            </div>

            <Reveal
              as="dl"
              className="product-specs__grid"
              stagger
              distance={16}
            >
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="product-specs__row">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </Reveal>
          </section>
        </article>
      </div>

      {relatedProducts.length > 0 && (
        <section
          className="section section--surface product-related"
          aria-labelledby="related-title"
        >
          <div className="container">
            <SectionHeader
              id="related-title"
              eyebrow="Dans le même rayon"
              title="À comparer avant de choisir."
              description="Des références proches, avec leurs propres forces et leur propre budget."
              link={
                category
                  ? {
                      to: CATEGORY_PATHS[category.id],
                      label: `Tout le rayon ${category.name.toLowerCase()}`,
                    }
                  : undefined
              }
            />
            <Reveal
              className="product-grid product-grid--3"
              stagger
              distance={20}
            >
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <div className="product-sticky">
        <div className="product-sticky__price">
          {product.originalPrice && (
            <span className="price__old">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <button
          type="button"
          className="btn btn--primary product-sticky__add"
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          <m.span
            key={added ? 'added' : 'idle'}
            className="product-sticky__add-content"
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 3,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition.fade}
          >
            <ShoppingBagIcon size={16} />
            {added ? 'Ajouté' : 'Ajouter'}
          </m.span>
        </button>
      </div>
    </div>
  );
}
