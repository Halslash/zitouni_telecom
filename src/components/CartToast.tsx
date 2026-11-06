import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from './AppLink';
import { CheckIcon, CloseIcon } from './Icons';
import './CartToast.css';

interface CartToastProps {
  /** Product name echoed back to confirm what was added. */
  productName: string;
  onClose: () => void;
  /** Milliseconds before it dismisses itself. */
  duration?: number;
}

/**
 * Bottom-centre glass confirmation. Announced politely, dismissible with the
 * close button or Escape, and it never blocks the page: no focus trap, no
 * scroll lock, pointer events only on the card itself.
 */
export default function CartToast({
  productName,
  onClose,
  duration = 3500,
}: CartToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, duration);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [duration, onClose]);

  return createPortal(
    <div className="cart-toast" role="status" aria-live="polite">
      <div className="cart-toast__card">
        <span className="cart-toast__icon" aria-hidden="true">
          <CheckIcon size={14} strokeWidth={2.4} />
        </span>
        <p className="cart-toast__copy">
          <strong>{productName}</strong>
          <span> ajouté au panier</span>
        </p>
        <Link to="/panier" className="cart-toast__link">
          Voir le panier
          <span aria-hidden="true"> ›</span>
        </Link>
        <button
          type="button"
          className="cart-toast__close"
          onClick={onClose}
          aria-label="Fermer la notification"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>,
    document.body
  );
}
