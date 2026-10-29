import { Link } from './AppLink';
import type { CategoryInfo } from '../data/products';
import { CATEGORY_PATHS } from '../data/products';
import { ChevronRightIcon } from './Icons';
import ProductImage from './ProductImage';
import { getProductsByCategory } from '../data/products';
import './CategoryCard.css';

interface CategoryCardProps {
  category: CategoryInfo;
  size?: 'feature' | 'wide' | 'compact';
  className?: string;
}

export default function CategoryCard({
  category,
  size = 'wide',
  className = '',
}: CategoryCardProps) {
  const products = getProductsByCategory(category.id);
  const product = products[0];

  return (
    <Link
      to={CATEGORY_PATHS[category.id]}
      className={`category-card category-card--${size} ${className}`.trim()}
      viewTransition
      aria-label={`Explorer ${category.name}`}
    >
      <div className="category-card__media">
        {product ? (
          <ProductImage
            src={product.image}
            alt=""
            category={product.category}
            view={1}
          />
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
      <div className="category-card__content">
        <div>
          <h3 className="category-card__title">{category.name}</h3>
          <p className="category-card__subtitle">{category.description}</p>
        </div>
        <span className="category-card__link">
          Explorer
          <ChevronRightIcon size={14} />
        </span>
      </div>
    </Link>
  );
}
