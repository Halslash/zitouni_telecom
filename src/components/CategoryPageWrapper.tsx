import { useParams } from 'react-router-dom';
import CategoryStrip from './CategoryStrip';
import ProductsPage from '../pages/ProductsPage';
import type { Category } from '../data/products';

const slugToCategory: Record<string, Category> = {
  telephones: 'smartphones',
  ordinateurs: 'laptops',
  tablettes: 'tablets',
  gaming: 'gaming',
  accessoires: 'accessories',
};

export default function CategoryPageWrapper() {
  const { category } = useParams<{ category: string }>();
  const cat = category ? slugToCategory[category] : undefined;

  return (
    <>
      {cat && <CategoryStrip category={cat} />}
      <ProductsPage />
    </>
  );
}
