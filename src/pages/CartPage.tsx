import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { Link } from '../components/AppLink';
import LineReveal from '../components/LineReveal';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import { useCart } from '../context/CartContext';
import { getVariantPrice } from '../data/products';
import { formatItemCount, formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  InfoIcon,
  ShoppingBagIcon,
  TrashIcon,
} from '../components/Icons';
import './CartPage.css';

export default function CartPage() {
  usePageTitle('Panier');
  const { state, remove, updateQuantity } = useCart();
  const reduceMotion = useShouldReduceMotion();
  const [notice, setNotice] = useState(false);

  const count = state.items.reduce((sum, item) => sum + item.quantity, 0);

  if (state.items.length === 0) {
    return (
      <section className="cart-page cart-page--empty">
        <div className="container cart-page__empty">
          <div className="cart-empty">
            <span className="cart-empty__icon">
              <ShoppingBagIcon size={30} strokeWidth={1.4} />
            </span>
            <LineReveal
              as="h1"
              immediate
              lines={['Votre panier est vide']}
            />
            <p>
              Parcourez la sélection et ajoutez un produit pour préparer votre
              commande.
            </p>
            <Link to="/produits" className="btn btn--primary">
              Explorer la boutique
              <ChevronRightIcon size={15} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container cart-page__header">
        <LineReveal as="h1" immediate lines={['Panier']} />
        <p className="cart-page__count">{formatItemCount(count)}</p>
      </div>

      <div className="container cart-page__grid">
        <div className="cart-page__items">
          {state.items.map((item) => {
            const unitPrice = getVariantPrice(
              item.product,
              item.variant?.variant
            );
            const options = [item.variant?.variant, item.variant?.color].filter(
              Boolean
            );

            return (
              <article key={item.lineId} className="cart-item">
                <Link
                  to={`/produit/${item.product.id}`}
                  className="cart-item__media"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <ProductImage
                    src={item.product.image}
                    alt=""
                    category={item.product.category}
                    view={1}
                    variant="bare"
                  />
                </Link>

                <div className="cart-item__details">
                  <div className="cart-item__header">
                    <div className="cart-item__copy">
                      <p className="cart-item__meta">{item.product.brand}</p>
                      <Link
                        to={`/produit/${item.product.id}`}
                        className="cart-item__name"
                      >
                        {item.product.name}
                      </Link>
                      {options.length > 0 && (
                        <p className="cart-item__options">
                          {options.join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="cart-item__line-price">
                      <span className="cart-item__price">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                      <span className="cart-item__unit">
                        {formatPrice(unitPrice)} l’unité
                      </span>
                    </div>
                  </div>

                  <div className="cart-item__row">
                    <QuantityStepper
                      value={item.quantity}
                      min={1}
                      max={10}
                      onChange={(quantity) =>
                        updateQuantity(item.lineId, quantity)
                      }
                      label={item.product.name}
                      size="sm"
                    />

                    <button
                      type="button"
                      className="cart-item__remove"
                      onClick={() => remove(item.lineId)}
                    >
                      <TrashIcon size={15} />
                      Retirer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          <Link to="/produits" className="cart-page__continue text-link">
            Continuer mes achats
            <ChevronRightIcon size={14} />
          </Link>
        </div>

        <aside className="cart-page__summary" aria-label="Résumé du panier">
          <div className="cart-summary">
            <h2>Résumé</h2>

            <div className="cart-summary__row cart-summary__row--total">
              <span>Sous-total</span>
              <span className="cart-summary__amount">
                <AnimatePresence mode="wait" initial={false}>
                  <m.span
                    key={state.total}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {formatPrice(state.total)}
                  </m.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="cart-summary__row cart-summary__row--muted">
              <span>Livraison</span>
              <span>Calculée selon la wilaya</span>
            </div>

            <p className="cart-summary__detail">
              {formatItemCount(count)} · paiement à la livraison
            </p>

            <button
              type="button"
              className="btn btn--primary cart-summary__cta"
              onClick={() => setNotice(true)}
              aria-describedby={notice ? 'cart-demo-note' : undefined}
            >
              Passer la commande
              <ArrowRightIcon size={16} />
            </button>

            <p className="cart-summary__note" id="cart-demo-note" role="status">
              {notice ? (
                <>
                  <InfoIcon size={14} />
                  Commande de démonstration : aucun paiement n’est effectué et
                  aucune réservation n’est créée.
                </>
              ) : (
                <>
                  <InfoIcon size={14} />
                  Prototype : aucune commande réelle n’est créée.
                </>
              )}
            </p>

            <Link to="/aide#paiement" className="cart-summary__help text-link">
              Paiement, livraison et retours
              <ChevronRightIcon size={13} />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
