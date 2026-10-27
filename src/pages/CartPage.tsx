import { useEffect, useRef, useState } from 'react';
import { Link } from '../components/AppLink';
import { AnimatePresence, m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import { WilayaSelector } from '../components/WilayaSelector';
import { useCart, type CartItem } from '../context/CartContext';
import { useWilaya } from '../context/WilayaContext';
import { getDeliveryEstimate } from '../data/wilayas';
import {
  formatItemCount,
  formatPrice,
  getStockState,
} from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  InfoIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TrashIcon,
  TruckIcon,
} from '../components/Icons';
import './CartPage.css';

function AnimatedPrice({ value }: { value: number }) {
  const { transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();

  return (
    <m.span
      key={value}
      initial={{
        opacity: 0.35,
        y: reduceMotion ? 0 : -2,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.fade}
    >
      {formatPrice(value)}
    </m.span>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, remove } = useCart();
  const { transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const stock = getStockState(item.product);

  return (
    <m.article
      className="cart-item"
      exit={
        reduceMotion
          ? { opacity: 0, transition: transition.fade }
          : {
              opacity: 0,
              height: 0,
              overflow: 'hidden',
              paddingTop: 0,
              paddingBottom: 0,
              borderBottomWidth: 0,
              transition: transition.disclosure,
            }
      }
    >
      <Link
        to={`/produit/${item.product.id}`}
        className="cart-item__media"
        aria-label={`Voir ${item.product.name}`}
      >
        <ProductImage
          src={item.product.image}
          alt={item.product.name}
          category={item.product.category}
          view={1}
        />
      </Link>

      <div className="cart-item__details">
        <span className="cart-item__brand">{item.product.brand}</span>
        <h2 className="cart-item__name">
          <Link to={`/produit/${item.product.id}`}>{item.product.name}</Link>
        </h2>
        <span className={`availability ${stock.modifier}`}>
          {stock.label}
        </span>
        {item.variant && (item.variant.storage || item.variant.color) && (
          <p className="cart-item__variant">
            {[item.variant.storage, item.variant.color]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <p className="cart-item__unit">
          {formatPrice(item.product.price)} l'unité
        </p>
      </div>

      <div className="cart-item__controls">
        <QuantityStepper
          value={item.quantity}
          onChange={(quantity) => updateQuantity(item.lineId, quantity)}
          min={1}
          max={item.product.stockCount ?? 99}
          label={item.product.name}
          size="sm"
        />

        <p className="cart-item__total">
          <AnimatedPrice value={item.product.price * item.quantity} />
        </p>

        <button
          type="button"
          className="cart-item__remove"
          onClick={() => remove(item.lineId)}
        >
          <TrashIcon size={14} />
          Retirer
        </button>
      </div>
    </m.article>
  );
}

export default function CartPage() {
  usePageTitle('Mon panier');

  const { state, clear } = useCart();
  const { wilaya } = useWilaya();
  const { transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const estimate = getDeliveryEstimate(wilaya);
  const [checkoutNotice, setCheckoutNotice] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const previousRows = useRef(0);
  const confirmTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    };
  }, []);

  const requestClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setAnnouncement(
        'Appuyez à nouveau sur « Confirmer » pour vider le panier.'
      );
      confirmTimer.current = window.setTimeout(() => {
        setConfirmClear(false);
      }, 4000);
      return;
    }

    if (confirmTimer.current) window.clearTimeout(confirmTimer.current);
    setConfirmClear(false);
    clear();
  };

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    if (state.items.length >= previousRows.current) {
      previousRows.current = state.items.length;
      return undefined;
    }

    setAnnouncement(
      itemCount === 0
        ? 'Votre panier est vide.'
        : `${formatItemCount(itemCount)} dans le panier.`
    );

    /* Wait for the row exit so focus does not land on the leaving button. */
    const timer = window.setTimeout(
      () => {
        const next =
          document.querySelector<HTMLElement>('.cart-item__remove') ??
          document.querySelector<HTMLElement>('.cart-empty a') ??
          document.getElementById('main');
        next?.focus();
      },
      itemCount === 0 ? 380 : 320
    );

    previousRows.current = state.items.length;
    return () => window.clearTimeout(timer);
  }, [state.items.length, itemCount]);

  return (
    <div className="cart-page">
      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
      <section className="page-hero cart-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">Panier</span>
          </nav>

          <span className="eyebrow">Votre sélection</span>
          <h1 className="page-hero__title">Mon panier</h1>
          <p className="page-hero__desc">
            Vérifiez vos articles, ajustez les quantités puis choisissez votre
            wilaya de livraison.
          </p>

          {state.items.length > 0 && (
            <div className="page-hero__meta">
              <span>
                <ShoppingBagIcon size={15} />
                {formatItemCount(itemCount)}
              </span>
              <span>
                <TruckIcon size={15} />
                Livraison estimée {estimate.label}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="section cart-body">
        <div className="container">
          <AnimatePresence mode="wait" initial={false}>
            {state.items.length === 0 ? (
              <m.div
                key="empty"
                className="empty-state cart-empty"
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : 6,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: transition.dismiss }}
                transition={transition.reveal}
              >
                <span className="empty-state__icon">
                  <ShoppingBagIcon size={29} />
                </span>
                <h2>Votre panier est vide</h2>
                <p>
                  Ajoutez un produit depuis le catalogue : votre sélection sera
                  conservée sur cet appareil.
                </p>
                <div className="empty-state__actions">
                  <Link to="/produits" className="btn btn--primary">
                    Parcourir le catalogue
                  </Link>
                  <Link to="/promotions" className="btn btn--outline">
                    Voir les promotions
                  </Link>
                </div>
              </m.div>
            ) : (
              <m.div
                key="filled"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: transition.fade }}
              >
              <div className="cart-toolbar">
                <p>
                  <strong>{formatItemCount(itemCount)}</strong> dans votre
                  panier
                </p>
                <button
                  type="button"
                  className={`btn btn--ghost btn--sm${
                    confirmClear ? ' is-confirming' : ''
                  }`}
                  onClick={requestClear}
                >
                  <TrashIcon size={14} />
                  {confirmClear ? 'Confirmer' : 'Vider le panier'}
                </button>
              </div>

              <div className="cart-layout">
                <div className="cart-items">
                  <AnimatePresence initial={false}>
                    {state.items.map((item) => (
                      <CartItemRow key={item.lineId} item={item} />
                    ))}
                  </AnimatePresence>
                </div>

                <aside
                  className="cart-summary"
                  aria-labelledby="cart-summary-title"
                >
                  <div className="cart-summary__head">
                    <h2 id="cart-summary-title">Récapitulatif</h2>
                    <span>{formatItemCount(itemCount)}</span>
                  </div>

                  <div className="cart-summary__delivery">
                    <WilayaSelector variant="field" label="Livraison vers" />
                    <p>
                      <TruckIcon size={14} />
                      {estimate.zoneLabel} · estimée sous {estimate.label}
                    </p>
                  </div>

                  <dl className="cart-summary__rows">
                    <div>
                      <dt>Sous-total</dt>
                      <dd>
                        <AnimatedPrice value={state.total} />
                      </dd>
                    </div>
                    <div>
                      <dt>Livraison</dt>
                      <dd>À confirmer à la commande</dd>
                    </div>
                    <div className="cart-summary__total">
                      <dt>Total provisoire</dt>
                      <dd>
                        <AnimatedPrice value={state.total} />
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    className="btn btn--primary btn--lg btn--block"
                    onClick={() => setCheckoutNotice(true)}
                  >
                    Passer la commande
                    <ArrowRightIcon size={16} />
                  </button>

                  <AnimatePresence initial={false}>
                    {checkoutNotice && (
                      <m.p
                        className="cart-summary__notice"
                        role="status"
                        initial={{
                          opacity: 0,
                          y: reduceMotion ? 0 : -4,
                        }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: reduceMotion ? 0 : -4,
                          transition: transition.dismiss,
                        }}
                        transition={transition.fade}
                      >
                        <InfoIcon size={15} />
                        Le paiement n'est pas encore activé sur ce prototype.
                        Votre panier reste enregistré et vous pouvez continuer
                        à comparer les produits.
                      </m.p>
                    )}
                  </AnimatePresence>

                  <Link
                    to="/produits"
                    className="btn btn--outline btn--block"
                  >
                    Continuer mes achats
                  </Link>

                  <ul className="cart-summary__trust">
                    <li>
                      <ShieldCheckIcon size={14} />
                      Garantie officielle sur chaque produit
                    </li>
                    <li>
                      <TruckIcon size={14} />
                      Livraison dans les 58 wilayas
                    </li>
                  </ul>

                  <p className="demo-note cart-summary__note">
                    <InfoIcon size={13} />
                    Prototype de démonstration : aucune commande réelle n'est
                    créée et aucun paiement n'est demandé.
                  </p>
                </aside>
              </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
