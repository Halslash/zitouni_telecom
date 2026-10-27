import type { ComponentType } from 'react';
import { Link } from './AppLink';
import {
  CATEGORY_PATHS,
  getCategoryCount,
  type Category,
  type CategoryInfo,
} from '../data/products';
import {
  ArrowUpRightIcon,
  GamepadIcon,
  HeadphonesIcon,
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  type IconProps,
} from './Icons';
import './CategoryCard.css';

const CATEGORY_ICONS: Record<Category, ComponentType<IconProps>> = {
  smartphones: SmartphoneIcon,
  laptops: LaptopIcon,
  tablets: TabletIcon,
  gaming: GamepadIcon,
  accessories: HeadphonesIcon,
};

interface CategoryCardProps {
  category: CategoryInfo;
  index: number;
  size?: 'feature' | 'wide' | 'compact';
  className?: string;
}

export default function CategoryCard({
  category,
  index,
  size = 'compact',
  className,
}: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category.id];
  const count = getCategoryCount(category.id);

  return (
    <Link
      to={CATEGORY_PATHS[category.id]}
      className={`category-card category-card--${category.id} category-card--${size}${
        className ? ` ${className}` : ''
      }`}
      aria-label={`${category.name} — ${count} référence${
        count > 1 ? 's' : ''
      }`}
      viewTransition
    >
      <span className="category-card__glow" aria-hidden="true" />
      <span className="category-card__glyph" aria-hidden="true">
        <Icon size={210} strokeWidth={0.85} />
      </span>

      <div className="category-card__body">
        <div className="category-card__topline">
          <span className="category-card__index">
            Collection {String(index + 1).padStart(2, '0')}
          </span>
          <span className="category-card__count">
            {count} référence{count > 1 ? 's' : ''}
          </span>
        </div>

        <div className="category-card__copy">
          <h3 className="category-card__name">{category.name}</h3>
          <p className="category-card__description">{category.description}</p>
        </div>

        <span className="category-card__cta">
          Explorer
          <ArrowUpRightIcon size={16} />
        </span>
      </div>
    </Link>
  );
}
