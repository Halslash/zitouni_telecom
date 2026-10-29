import { Link } from '../components/AppLink';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { ChevronRightIcon } from '../components/Icons';
import './CartPage.css';

export default function CartPage() {
  usePageTitle('Panier');
  const { state, remove, updateQuantity } = useCart();

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (state.items.length === 0) {
    return (
      <section className="cart-page">
        <div className="container cart-page__empty">
          <h1>Panier</h1>
          <p>Votre panier est vide.</p>
          <Link to="/produits" className="text-link">
            Continuer mes achats
            <ChevronRightIcon size={14} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container cart-page__header">
        <h1>Panier</h1>
      </div>
      <div className="container cart-page__grid">
        <div className="cart-page__items">
          {state.items.map((item) => (
            <article key={item.product.id} className="cart-item">
              <div className="cart-item__media">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              <div className="cart-item__details">
                <div className="cart-item__header">
                  <Link to={`/produit/${item.product.id}`} className="cart-item__name">
                    {item.product.name}
                  </Link>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => remove(item.lineId)}
                  >
                    Retirer
                  </button>
                </div>
                <div className="cart-item__row">
                  <div className="cart-item__quantity">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, Math.max(1, item.quantity - 1))}
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item__price">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="cart-page__summary">
          <div className="cart-summary">
            <h2>Résumé</h2>
            <div className="cart-summary__row">
              <span>Sous-total</span>
              <span className="cart-summary__amount">{formatPrice(subtotal)}</span>
            </div>
            <button type="button" className="cart-summary__cta">
              Passer la commande
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
