import { useLocation, useParams } from 'react-router-dom';
import { getCategoryBySlug, getProductsByCategory } from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import { Link } from '../components/AppLink';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import './CategoryPage.css';

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { pathname } = useLocation();
  const category = getCategoryBySlug(categorySlug ?? pathname);
  usePageTitle(category?.name);

  if (!category) {
    return null;
  }

  const products = getProductsByCategory(category.id);

  return (
    <section className="category-page" aria-labelledby="category-title">
      <div className="container">
        <header className="category-page__header">
          <h1 id="category-title" className="category-page__title">
            {category.name}
          </h1>
        </header>

        <section className="category-strip-page" aria-label={`Produits ${category.name}`}>
          <div className="category-strip-page__track">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/produit/${product.id}`}
                className="category-strip-page__item"
                viewTransition
              >
                <div className="category-strip-page__thumb">
                  <ProductImage
                    src={product.image}
                    alt=""
                    category={product.category}
                    view={1}
                    variant="bare"
                  />
                </div>
                <div className="category-strip-page__label">{product.name}</div>
                {product.featured && <span className="category-strip-page__tag">Nouveau</span>}
              </Link>
            ))}
          </div>
        </section>

        <section className="category-page__carousel" aria-label={`Sélection ${category.name}`}>
          <Carousel products={products} label={`Sélection ${category.name}`} />
        </section>

        <section className="category-page__lineup" aria-labelledby="category-lineup-title">
          <h2 id="category-lineup-title" className="category-page__section-title">
            La gamme
          </h2>
          <div className="category-page__list">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant="lineup" />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
