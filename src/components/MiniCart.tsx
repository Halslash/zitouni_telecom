import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from './AppLink';
import { AnimatePresence, m } from 'motion/react';
import { useMotionTokens, useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { useCart } from '../context/CartContext';
import { formatPrice, formatNumber } from '../lib/format';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { trapTabKey } from '../lib/focusTrap';
import ProductImage from './ProductImage';
import QuantityStepper from './QuantityStepper';
import { CloseIcon } from './Icons';
import './MiniCart.css';

/**
 * Desktop slide-over mini-cart: glass sheet from the right with a focus
 * trap, Escape to close, lines with thumbnail + quantity stepper and a
 * subtotal with the primary CTA to the full cart page.
 */
interface MiniCartProps {
  open: boolean;
  onClose: () => void;
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
}

const TITLE_ID = 'mini-cart-title';

export default function MiniCart({
  open,
  onClose,
  restoreFocusRef,
}: MiniCartProps) {
  const { state, updateQuantity, remove } = useCart();
  const reduceMotion = useShouldReduceMotion();
  const { transition } = useMotionTokens();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    sheetRef.current?.removeAttribute('inert');
    lockAppInert();
    lockBodyScroll();
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      trapTabKey(event, sheetRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      unlockAppInert();
      sheetRef.current?.setAttribute('inert', '');
      (restoreFocusRef?.current ?? previouslyFocused)?.focus?.();
    };
  }, [open, onClose, restoreFocusRef]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <m.div
            className="mini-cart__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.24 }}
            onClick={onClose}
          />
          <m.aside
            ref={sheetRef}
            id="mini-cart"
            className="mini-cart"
            role="dialog"
            aria-modal="true"
            aria-labelledby={TITLE_ID}
            initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { x: '100%', transition: transition.drawerOut }
            }
            transition={reduceMotion ? { duration: 0.12 } : transition.drawer}
          >
            <header className="mini-cart__head">
              <h2 id={TITLE_ID} className="mini-cart__title">
                Panier
                <span className="mini-cart__count">
                  {formatNumber(itemCount)}
                </span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                className="mini-cart__close"
                onClick={onClose}
                aria-label="Fermer le panier"
              >
                <CloseIcon size={17} />
              </button>
            </header>

            {state.items.length === 0 ? (
              <p className="mini-cart__empty">
                Votre panier est vide pour l'instant.
              </p>
            ) : (
              <ul className="mini-cart__lines">
                {state.items.map((item) => (
                  <li key={item.lineId} className="mini-cart__line">
                    <Link
                      to={`/produit/${item.product.id}`}
                      className="mini-cart__thumb"
                      viewTransition={false}
                      onClick={onClose}
                    >
                      <ProductImage
                        src={item.product.image}
                        alt=""
                        category={item.product.category}
                        view={1}
                        variant="bare"
                      />
                    </Link>
                    <div className="mini-cart__meta">
                      <span className="mini-cart__name">
                        {item.product.name}
                      </span>
                      <span className="mini-cart__variant">
                        {[
                          item.variant?.variant,
                          item.variant?.color,
                        ]
                          .filter(Boolean)
                          .join(' · ') ||
                          item.product.brand}
                      </span>
                      <div className="mini-cart__stepper">
                        <QuantityStepper
                          size="sm"
                          label={item.product.name}
                          value={item.quantity}
                          onChange={(quantity) =>
                            updateQuantity(item.lineId, quantity)
                          }
                        />
                        <button
                          type="button"
                          className="mini-cart__remove"
                          onClick={() => remove(item.lineId)}
                          aria-label={`Retirer ${item.product.name} du panier`}
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                    <span className="mini-cart__line-price">
                      {formatPrice(
                        item.product.price * item.quantity
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <footer className="mini-cart__foot">
              {state.items.length > 0 && (
                <div className="mini-cart__subtotal">
                  <span>Sous-total</span>
                  <span className="mini-cart__subtotal-value">
                    {formatPrice(state.total)}
                  </span>
                </div>
              )}
              <Link
                to="/panier"
                className="mini-cart__cta"
                viewTransition={false}
                onClick={onClose}
              >
                Voir le panier
              </Link>
              <p className="mini-cart__note">
                Commande en ligne bientôt disponible.
              </p>
            </footer>
          </m.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
