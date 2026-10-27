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

export function formatProductCount(count: number): string {
  return `${count} produit${count > 1 ? 's' : ''}`;
}

export function formatItemCount(count: number): string {
  return `${count} article${count > 1 ? 's' : ''}`;
}
