import { Link } from '../components/AppLink';
import Carousel from '../components/Carousel';
import ProductImage from '../components/ProductImage';
import { getCategoryBySlug, getProductsByCategory } from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import { formatPrice } from '../lib/format';
import { ChevronRightIcon } from '../components/Icons';
import './CategoryPage.css';

export default function CategoryPage() {
  const slug = location.pathname.replace(/^\//, '');
  const category = getCategoryBySlug(slug);
  usePageTitle(category?.name);

  if (!category) {
    return null;
  }

  const products = getProductsByCategory(category.id);

  return (
    <main className="category-page">
      <div className="container">
        <header className="category-page__header">
          <h1 className="category-page__title">{category.name}</h1>
        </header>

        <section className="category-strip-page" aria-label="Produits de la catégorie">
          <div className="category-strip-page__track">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/produit/${product.id}`}
                className="category-strip-page__item"
                viewTransition
              >
                <div className="category-strip-page__thumb">
                  <ProductImage src={product.image} alt="" category={product.category} view={1} variant="bare" />
                </div>
                <div className="category-strip-page__label">{product.name}</div>
                {product.featured && <span className="category-strip-page__tag">Nouveau</span>}
              </Link>
            ))}
          </div>
        </section>

        <section className="category-page__carousel" aria-label="Sélection de la catégorie">
          <Carousel products={products} label={`Sélection ${category.name}`} />
        </section>

        <section className="category-page__list-section" aria-label="Tous les produits">
          <h2 className="category-page__list-title">Tous les produits</h2>
          <div className="category-page__grid">
            {products.map((product) => (
              <article key={product.id} className="category-card">
                <Link to={`/produit/${product.id}`} className="category-card__link" viewTransition>
                  <div className="category-card__media">
                    <ProductImage src={product.image} alt={product.name} category={product.category} view={1} variant="bare" />
                  </div>
                  <div className="category-card__body">
                    <h3 className="category-card__title">{product.name}</h3>
                    <p className="category-card__line">{product.tagline || product.brand}</p>
                    <div className="category-card__price">{formatPrice(product.price)}</div>
                    <div className="category-card__cta">
                      En savoir plus <ChevronRightIcon size={14} />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
