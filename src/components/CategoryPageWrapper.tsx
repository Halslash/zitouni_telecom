import { useParams } from 'react-router-dom';
import DeviceStrip from './DeviceStrip';
import ProductsPage from '../pages/ProductsPage';
import { getProductsByCategory, type Category } from '../data/products';

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
      {cat && (
        <div className="container">
          <DeviceStrip
            products={getProductsByCategory(cat)}
            label="Produits de la catégorie"
            context="category"
          />
        </div>
      )}
      <ProductsPage />
    </>
  );
}
