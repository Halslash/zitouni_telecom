import { useEffect, useRef, useState } from 'react';
import { Link } from '../components/AppLink';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import { formatItemCount, formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  CheckIcon,
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
} from '../components/Icons';
import './WishlistPage.css';

export default function WishlistPage() {
  usePageTitle('Mes favoris');

  const { ids, clear } = useWishlist();
  const { add } = useCart();
  const [addedCount, setAddedCount] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const confirmTimer = useRef<number | null>(null);
  const shouldFocusEmpty = useRef(false);

  useEffect(() => {
    return () => {
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!shouldFocusEmpty.current || ids.length > 0) return;
    shouldFocusEmpty.current = false;
    const timer = window.setTimeout(() => {
      document.querySelector<HTMLElement>('.wishlist-empty .btn')?.focus();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [ids.length]);

  const savedProducts = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is (typeof products)[number] =>
      Boolean(product)
    );

  const availableProducts = savedProducts;
  const availableValue = availableProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const handleAddAll = () => {
    availableProducts.forEach((product) =>
      add(product, 1, { variant: product.variants?.[0]?.name })
    );
    setAddedCount(availableProducts.length);
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setAnnouncement(
        'Appuyez à nouveau sur « Confirmer » pour vider votre liste de favoris.'
      );
      confirmTimer.current = window.setTimeout(() => {
        setConfirmClear(false);
      }, 4000);
      return;
    }

    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    shouldFocusEmpty.current = true;
    setConfirmClear(false);
    setAddedCount(0);
    setAnnouncement('Votre liste de favoris a été vidée.');
    clear();
  };

  return (
    <div className="wishlist-page">
      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      <section className="page-hero wishlist-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">Favoris</span>
          </nav>

          <span className="eyebrow">Votre sélection</span>
          <h1 className="page-hero__title">Mes favoris</h1>
          <p className="page-hero__desc">
            Gardez les produits qui vous intéressent sous la main, comparez-les
            puis ajoutez-les au panier quand votre choix est fait.
          </p>

          {savedProducts.length > 0 && (
            <div className="page-hero__meta">
              <span>
                <HeartIcon size={15} />
                {formatItemCount(savedProducts.length)} enregistré
                {savedProducts.length > 1 ? 's' : ''}
              </span>
              <span>
                <ShoppingBagIcon size={15} />
                {formatPrice(availableValue)} de sélection
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="section wishlist-body">
        <div className="container">
          {savedProducts.length === 0 ? (
            <div className="empty-state wishlist-empty">
              <span className="empty-state__icon">
                <HeartIcon size={28} />
              </span>
              <h2>Votre liste est encore vide</h2>
              <p>
                Touchez le cœur sur un produit pour le retrouver ici. Votre
                sélection est conservée sur cet appareil, sans création de
                compte.
              </p>
              <div className="empty-state__actions">
                <Link to="/produits" className="btn btn--primary">
                  Découvrir le catalogue
                  <ArrowRightIcon size={16} />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="wishlist-toolbar">
                <div className="wishlist-toolbar__copy">
                  <p>
                    <strong>{formatItemCount(savedProducts.length)}</strong>{' '}
                    dans votre liste de favoris
                  </p>
                  <span>
                    {formatItemCount(savedProducts.length)} dans votre liste
                  </span>
                </div>

                <div className="wishlist-toolbar__actions">
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={handleAddAll}
                  >
                    <ShoppingBagIcon size={15} />
                    Tout ajouter au panier
                  </button>
                  <button
                    type="button"
                    className={`btn btn--ghost btn--sm wishlist-toolbar__clear${
                      confirmClear ? ' is-confirming' : ''
                    }`}
                    onClick={handleClear}
                    aria-label={
                      confirmClear
                        ? 'Confirmer le vidage de la liste de favoris'
                        : 'Vider la liste de favoris'
                    }
                  >
                    <TrashIcon size={14} />
                    {confirmClear ? 'Confirmer' : 'Vider la liste'}
                  </button>
                </div>
              </div>

              {addedCount > 0 && (
                <p className="wishlist-notice" role="status">
                  <CheckIcon size={16} />
                  <span>
                    {formatItemCount(addedCount)} ajouté
                    {addedCount > 1 ? 's' : ''} au panier.
                  </span>
                  <Link to="/panier" className="wishlist-notice__link">
                    Voir le panier
                    <ArrowRightIcon size={14} />
                  </Link>
                </p>
              )}

              <div className="product-grid wishlist-grid">
                {savedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="wishlist-footnote">
                <p className="demo-note">
                  <HeartIcon size={14} />
                  Votre liste est enregistrée localement dans ce navigateur.
                  Aucune donnée n'est envoyée à un serveur.
                </p>
                <Link to="/produits" className="section-link">
                  Continuer mes achats
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
