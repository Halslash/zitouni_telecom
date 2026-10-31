import { Link } from './AppLink';
import {
  CATEGORY_PATHS,
  getCategoryCount,
  type CategoryInfo,
} from '../data/products';
import { ArrowRightIcon } from './Icons';
import ProductImage from './ProductImage';
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
  const count = getCategoryCount(category.id);

  return (
    <Link
      to={CATEGORY_PATHS[category.id]}
      className={`category-card category-card--${size} ${className}`.trim()}
      viewTransition
      aria-label={`Explorer ${category.name}`}
    >
      <div className="category-card__art" aria-hidden="true">
        <div className="category-card__glyph">
          <ProductImage category={category.id} alt="" variant="plate" />
        </div>
      </div>

      <div className="category-card__content">
        <span className="category-card__meta">
          {count} produit{count > 1 ? 's' : ''}
        </span>
        <h3 className="category-card__title">{category.name}</h3>
        <span className="category-card__subtitle">{category.description}</span>
        <span className="category-card__cta">
          Explorer
          <ArrowRightIcon size={14} />
        </span>
      </div>
    </Link>
  );
}
