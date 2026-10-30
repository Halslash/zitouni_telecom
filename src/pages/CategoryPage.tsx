import { useLocation, useParams } from 'react-router-dom';
import { getCategoryBySlug, getProductsByCategory } from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import DeviceStrip from '../components/DeviceStrip';
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

        <DeviceStrip
          products={products}
          label={`Produits ${category.name}`}
          context="category"
        />

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
