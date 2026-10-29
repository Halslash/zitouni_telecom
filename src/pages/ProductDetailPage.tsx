import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from '../components/AppLink';
import ProductImage from '../components/ProductImage';
import QuantityStepper from '../components/QuantityStepper';
import Reveal from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import { formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { ChevronRightIcon } from '../components/Icons';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  usePageTitle();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const product = id ? getProductById(id) : undefined;
  const [quantity, setQuantity] = useState(1);

  const priceLabel = useMemo(
    () => (product ? formatPrice(product.price) : ''),
    [product]
  );

  if (!product) {
    return (
      <section className="product-page">
        <div className="container product-page__empty">
          <h1>Produit introuvable</h1>
          <Link to="/produits" className="text-link">
            Retour à la boutique
            <ChevronRightIcon size={14} />
          </Link>
        </div>
      </section>
    );
  }

  const handleAdd = () => {
    add(product, quantity);
    navigate('/panier');
  };

  return (
    <article className="product-page">
      <div className="container product-page__header">
        <nav className="product-page__breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/produits">Boutique</Link>
          <ChevronRightIcon size={14} />
          <span aria-current="page">{product.name}</span>
        </nav>
      </div>

      <section className="product-page__hero">
        <div className="container product-page__hero-grid">
          <Reveal className="product-page__media">
            <div className="product-page__media-frame">
              <ProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                view={1}
              />
            </div>
          </Reveal>
          <Reveal className="product-page__details" delay={0.1}>
            <header className="product-page__title-group">
              <h1 className="product-page__title">{product.name}</h1>
              {product.tagline && (
                <p className="product-page__tagline">{product.tagline}</p>
              )}
            </header>
            <p className="product-page__price">{priceLabel}</p>
            <div className="product-page__purchase">
              <QuantityStepper
                value={quantity}
                min={1}
                max={10}
                onChange={setQuantity}
                label="Quantité"
              />
              <button type="button" className="product-page__cta" onClick={handleAdd}>
                Ajouter au panier
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
