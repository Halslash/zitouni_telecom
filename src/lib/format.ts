const numberFormatter = new Intl.NumberFormat('fr-DZ', {
  maximumFractionDigits: 0,
});

/**
 * French typography for UI copy: non-breaking spaces before ; : ! ? and
 * inside guillemets, typographic apostrophes and ellipsis. Content strings
 * stay readable in source and are normalised once at render.
 */
export function fr(text: string): string {
  return text
    .replace(/ ?([;:!?])/g, '\u00A0$1')
    .replace(/« /g, '«\u00A0')
    .replace(/ »/g, '\u00A0»')
    .replace(/'/g, '\u2019')
    .replace(/\.\.\./g, '\u2026');
}

export function formatPrice(price: number): string {
  return `${numberFormatter.format(price)}\u00A0DA`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatProductCount(count: number): string {
  return `${count}\u00A0produit${count > 1 ? 's' : ''}`;
}

export function formatItemCount(count: number): string {
  return `${count}\u00A0article${count > 1 ? 's' : ''}`;
}
