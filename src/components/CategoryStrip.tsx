import { Link } from './AppLink';
import { getProductsByCategory } from '../data/products';
import type { Category } from '../data/products';
import ProductImage from './ProductImage';
import './CategoryStrip.css';

interface CategoryStripProps {
  category: Category;
}

export default function CategoryStrip({ category }: CategoryStripProps) {
  const products = getProductsByCategory(category);

  if (products.length === 0) return null;

  return (
    <section className="category-strip" aria-label="Produits de la catégorie">
      <div className="category-strip__track">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/produit/${product.id}`}
            className="category-strip__item"
            viewTransition
          >
            <div className="category-strip__thumb">
              <ProductImage
                src={product.image}
                alt=""
                category={product.category}
                view={1}
              />
            </div>
            <div className="category-strip__label">{product.name}</div>
            {product.featured && (
              <span className="category-strip__tag">Nouveau</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
