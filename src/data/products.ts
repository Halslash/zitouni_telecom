export type Category =
  | 'smartphones'
  | 'laptops'
  | 'tablets'
  | 'gaming'
  | 'accessories';

export interface ProductColor {
  name: string;
  hex: string;
}

/**
 * A product carries only what the shop actually knows about it.
 * Everything beyond the six required fields is optional, so the
 * same template serves a fully documented flagship and a single
 * cable described by a name, a price and a picture.
 */
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  image: string;
  tagline?: string;
  colors?: ProductColor[];
  variants?: ProductVariant[];
  highlights?: string[];
  specs?: Record<string, string>;
  featured?: boolean;
}

export interface ProductVariant {
  name: string;
  price: number;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  intro: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'smartphones',
    name: 'Téléphones',
    description: 'Flagships, milieu de gamme et mobiles essentiels.',
    intro:
      'Comparez les derniers modèles Samsung, Xiaomi et autres marques. Chaque fiche présente les caractéristiques essentielles, le prix et les options disponibles pour choisir sans mauvaise surprise.',
  },
  {
    id: 'laptops',
    name: 'Ordinateurs',
    description: 'Portables, création et stations de travail.',
    intro:
      'Des ultraportables aux machines de création, sélectionnez un ordinateur adapté à votre usage : étude, bureautique, montage, développement ou jeu.',
  },
  {
    id: 'tablets',
    name: 'Tablettes',
    description: 'Lire, dessiner, travailler et se divertir.',
    intro:
      'Des tablettes pensées pour la lecture, le dessin, la prise de notes et le divertissement. Les accessoires compatibles sont indiqués sur chaque fiche.',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Consoles et équipements pour jouer sans compromis.',
    intro:
      'Consoles nouvelle génération et équipements gaming sélectionnés pour leur performance. Retrouvez les capacités, la capacité de stockage et les compatibilités.',
  },
  {
    id: 'accessories',
    name: 'Accessoires',
    description: 'Charge, protection et objets du quotidien.',
    intro:
      'Les essentiels qui complètent votre équipement : câbles, charge et protection. Des fiches courtes, sans information superflue.',
  },
];

export const CATEGORY_PATHS: Record<Category, string> = {
  smartphones: '/telephones',
  laptops: '/ordinateurs',
  tablets: '/tablettes',
  gaming: '/gaming',
  accessories: '/accessoires',
};

export const CATEGORY_SLUGS: Record<Category, string> = {
  smartphones: 'smartphones',
  laptops: 'laptops',
  tablets: 'tablets',
  gaming: 'gaming',
  accessories: 'accessories',
};

/**
 * Reading order used by cross-catalogue navigation: phones first, then
 * computers, tablets, gaming and accessories. Kept next to the data so the
 * home strip, category cards and any future catalogue surface agree.
 */
export const DISCOVERY_CATEGORY_ORDER: Category[] = [
  'smartphones',
  'laptops',
  'tablets',
  'gaming',
  'accessories',
];

export const products: Product[] = [
  {
    id: 'galaxy-s25-ultra',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 279_900,
    image: '/images/galaxy-s25-ultra.jpg',
    tagline:
      'Le flagship Android, taillé pour durer : un grand écran, un capteur photo plus net, un S Pen toujours prêt.',
    colors: [
      { name: 'Titane noir', hex: '#3b3a3c' },
      { name: 'Titane gris', hex: '#8b8a8c' },
      { name: 'Titane bleu', hex: '#5f7186' },
    ],
    variants: [
      { name: '256 Go', price: 279_900 },
      { name: '512 Go', price: 309_900 },
      { name: '1 To', price: 349_900 },
    ],
    highlights: [
      'Écran 6,9" AMOLED 120 Hz',
      'Photo 200 Mpx, zoom 5×',
      'S Pen intégré',
      'Autonomie 5 000 mAh',
    ],
    specs: {
      Écran: '6,9" Dynamic AMOLED 2X, 120 Hz',
      Processeur: 'Snapdragon 8 Elite',
      'Appareil photo': '200 Mpx + 50 Mpx + 10 Mpx',
      Stockage: '256 Go à 1 To',
      Batterie: '5 000 mAh',
      Système: 'Android 15 / One UI 7',
    },
    featured: true,
  },
  {
    id: 'dell-xps-14',
    name: 'XPS 14',
    brand: 'Dell',
    category: 'laptops',
    price: 249_900,
    image: '/images/dell-xps-14.jpg',
    tagline:
      'La puissance créative, sans prendre de place. Un châssis aluminium, un écran OLED et de la mémoire pour les gros projets.',
    colors: [
      { name: 'Graphite', hex: '#44464b' },
      { name: 'Argent', hex: '#c9c6c0' },
    ],
    variants: [
      { name: '16 Go / 512 Go', price: 249_900 },
      { name: '32 Go / 1 To', price: 299_900 },
    ],
    highlights: [
      'Écran 14,5" OLED 3K',
      '32 Go de mémoire',
      'SSD 1 To',
      'Châssis aluminium 1,7 kg',
    ],
    specs: {
      Écran: '14,5" OLED 3K, 120 Hz',
      Processeur: 'Intel Core Ultra 7',
      Mémoire: '16 Go ou 32 Go',
      Stockage: '512 Go ou 1 To SSD',
      Autonomie: 'Jusqu’à 18 h',
      Poids: '1,7 kg',
    },
    featured: true,
  },
  {
    id: 'galaxy-tab-s10',
    name: 'Galaxy Tab S10',
    brand: 'Samsung',
    category: 'tablets',
    price: 149_900,
    image: '/images/galaxy-tab-s10.jpg',
    tagline:
      'Créer, lire et travailler, où que vous soyez. Un grand écran AMOLED et un S Pen inclus.',
    colors: [
      { name: 'Gris', hex: '#6f6f73' },
      { name: 'Argent', hex: '#d6d2cb' },
    ],
    variants: [
      { name: '128 Go', price: 149_900 },
      { name: '256 Go', price: 169_900 },
    ],
    highlights: [
      'Écran 14,6" AMOLED',
      'S Pen inclus',
      'Mode DeX sur grand écran',
      'Batterie 11 200 mAh',
    ],
    specs: {
      Écran: '14,6" AMOLED, 120 Hz',
      Processeur: 'MediaTek Dimensity 9300+',
      Stockage: '128 Go ou 256 Go',
      Batterie: '11 200 mAh',
      Connectivité: 'Wi-Fi 6E',
      Poids: '576 g',
    },
    featured: true,
  },
  {
    id: 'playstation-5-slim',
    name: 'PlayStation 5 Slim',
    brand: 'Sony',
    category: 'gaming',
    price: 119_900,
    image: '/images/playstation-5-slim.jpg',
    tagline:
      'La nouvelle génération, prête à jouer. Un SSD rapide, la 4K et une manette DualSense incluse.',
    variants: [
      { name: 'Édition standard', price: 119_900 },
      { name: 'Édition numérique', price: 104_900 },
    ],
    highlights: [
      'SSD 1 To ultra-rapide',
      '4K jusqu’à 120 Hz',
      'Manette DualSense incluse',
    ],
    specs: {
      Stockage: 'SSD 1 To',
      Résolution: '4K jusqu’à 120 Hz',
      Lecteur: 'Blu-ray Ultra HD (standard)',
      Manette: 'DualSense sans fil',
      'Sortie vidéo': 'HDMI 2.1',
      Poids: '3,2 kg',
    },
    featured: true,
  },
  {
    id: 'cable-usb-c-2m',
    name: 'Câble USB-C 2 m',
    brand: 'Anker',
    category: 'accessories',
    price: 2_900,
    image: '/images/cable-usb-c-2m.jpg',
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function getCategoryById(id: Category): CategoryInfo | undefined {
  return categories.find((category) => category.id === id);
}

/**
 * Resolves both the internal category id and the canonical storefront path.
 * `/produits/smartphones` and `/telephones` therefore land on the same page.
 */
export function getCategoryBySlug(
  slug: string | undefined
): CategoryInfo | undefined {
  if (!slug) return undefined;

  const path = slug.startsWith('/') ? slug : `/${slug}`;

  return categories.find(
    (category) =>
      category.id === slug || CATEGORY_PATHS[category.id] === path
  );
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((product) => product.category === category);
}

/**
 * Every product, grouped by the discovery category order while preserving
 * the catalogue order inside each group. Used by the home strip so the
 * ordering lives with the data rather than in a page component.
 */
export function getProductsInDiscoveryOrder(): Product[] {
  return DISCOVERY_CATEGORY_ORDER.flatMap((category) =>
    getProductsByCategory(category)
  );
}

export function getCategoryCount(category: Category): number {
  return getProductsByCategory(category).length;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function getGamingProducts(): Product[] {
  return getProductsByCategory('gaming');
}

export function getLaptopProducts(): Product[] {
  return getProductsByCategory('laptops');
}

export function getVariantPrice(
  product: Product,
  variantName?: string
): number {
  if (!variantName) return product.price;
  return (
    product.variants?.find((variant) => variant.name === variantName)?.price ??
    product.price
  );
}

/**
 * Same-category references first, then the rest of the catalogue.
 * Every product page keeps a "to discover" rail, even the smallest
 * one-product category.
 */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (candidate) =>
      candidate.category === product.category && candidate.id !== product.id
  );
  const rest = products.filter(
    (candidate) =>
      candidate.category !== product.category && candidate.id !== product.id
  );

  return [...sameCategory, ...rest].slice(0, limit);
}

/**
 * Short, scannable line for commerce cards. Falls back to the first
 * two specs, then to the category, so a minimal product never shows
 * an empty slot.
 */
export function getProductHighlight(product: Product): string {
  if (product.highlights && product.highlights.length > 0) {
    return product.highlights[0];
  }

  const specs = product.specs ? Object.values(product.specs) : [];
  if (specs.length > 0) return specs.slice(0, 2).join(' · ');

  return getCategoryById(product.category)?.name ?? product.brand;
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function searchProducts(query: string): Product[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return products;

  return products.filter((product) => {
    const category = getCategoryById(product.category);
    const haystack = normalize(
      [
        product.name,
        product.brand,
        product.tagline ?? '',
        ...(product.highlights ?? []),
        category?.name ?? '',
        ...Object.values(product.specs ?? {}),
      ].join(' ')
    );
    return terms.every((term) => haystack.includes(term));
  });
}
