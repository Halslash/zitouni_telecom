import type { Product } from '../data/products';
import { getDiscountPercent } from '../data/products';

const priceFormatter = new Intl.NumberFormat('fr-DZ', {
  style: 'currency',
  currency: 'DZD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('fr-DZ', {
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDiscount(product: Product): string | null {
  const percent = getDiscountPercent(product);
  if (percent === null) return null;
  return `−${percent}\u00a0%`;
}

export function formatProductCount(count: number): string {
  return `${count} produit${count > 1 ? 's' : ''}`;
}

export function formatItemCount(count: number): string {
  return `${count} article${count > 1 ? 's' : ''}`;
}

export interface StockState {
  label: string;
  modifier: '' | 'availability--low' | 'availability--out';
}

export function getStockState(product: Product): StockState {
  if (!product.inStock) {
    return { label: 'Épuisé', modifier: 'availability--out' };
  }

  if (product.stockCount !== undefined && product.stockCount < 5) {
    return {
      label: `Plus que ${product.stockCount} en stock`,
      modifier: 'availability--low',
    };
  }

  return { label: 'En stock', modifier: '' };
}
