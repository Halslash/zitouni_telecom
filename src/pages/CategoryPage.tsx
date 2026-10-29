import { useParams } from 'react-router-dom';
import { getCategoryBySlug, getProductsByCategory, CATEGORY_PATHS } from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import { Link } from '../components/AppLink';
import ProductImage from '../components/ProductImage';
import Carousel from '../components/Carousel';
import './CategoryPage.css';

export default function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const category = getCategoryBySlug(categorySlug);
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
                  <ProductImage src={product.image} alt="" category={product.category} view={1} />
                </div>
                <div className="category-strip-page__label">{product.name}</div>
                {product.featured && <span className="category-strip-page__tag">Nouveau</span>}
              </Link>
            ))}
          </div>
        </section>

        <section className="category-page__carousel" aria-label="Sélection de la catégorie">
          <Carousel />
        </section>
      </div>
    </main>
  );
}
