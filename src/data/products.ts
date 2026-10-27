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

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  stockCount?: number;
  badge?: 'new' | 'sale' | 'bestseller';
  rating: number;
  reviewCount: number;
  colors?: ProductColor[];
  storageOptions?: string[];
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
      'Comparez les derniers modèles Apple, Samsung et Xiaomi. Chaque fiche présente les caractéristiques essentielles, le prix et la disponibilité pour choisir sans mauvaise surprise.',
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
      'Tablettes iPad et Galaxy Tab pensées pour la lecture, le dessin, la prise de notes et le divertissement. Les accessoires compatibles sont indiqués sur chaque fiche.',
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
    description: 'Audio, charge, protection et objets connectés.',
    intro:
      'Les accessoires qui complètent votre équipement : audio sans fil, batteries externes, montres connectées et solutions de charge du quotidien.',
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

export const products: Product[] = [
  /* ------------------------------- Téléphones ------------------------------- */
  {
    id: 'iphone-16-pro-max',
    name: 'iPhone 16 Pro Max',
    brand: 'Apple',
    category: 'smartphones',
    price: 299900,
    image: '/images/iphone-16-pro-max.jpg',
    images: [
      '/images/iphone-16-pro-max.jpg',
      '/images/iphone-16-pro-max-2.jpg',
      '/images/iphone-16-pro-max-3.jpg',
    ],
    description:
      "L'iPhone le plus avancé avec la puce A18 Pro, un système photo Pro de 48 Mpx et un écran Super Retina XDR de 6,9 pouces.",
    specs: {
      Écran: '6,9" Super Retina XDR OLED',
      Processeur: 'A18 Pro',
      Stockage: '256 Go',
      'Appareil photo': '48 Mpx + 12 Mpx + 12 Mpx',
      Batterie: "Jusqu'à 33 h de lecture vidéo",
      Système: 'iOS 18',
    },
    inStock: true,
    stockCount: 12,
    badge: 'new',
    rating: 4.8,
    reviewCount: 156,
    colors: [
      { name: 'Titane naturel', hex: '#b9b0a7' },
      { name: 'Titane désert', hex: '#c8ae8e' },
      { name: 'Titane noir', hex: '#3f3b3c' },
      { name: 'Titane blanc', hex: '#e8e4df' },
    ],
    storageOptions: ['256 Go', '512 Go', '1 To'],
  },
  {
    id: 'samsung-galaxy-s25-ultra',
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 279900,
    originalPrice: 319900,
    image: '/images/galaxy-s25-ultra.jpg',
    images: [
      '/images/galaxy-s25-ultra.jpg',
      '/images/galaxy-s25-ultra-2.jpg',
    ],
    description:
      'Le smartphone Android haut de gamme avec Galaxy AI, S Pen intégré et écran Dynamic AMOLED 2X de 6,9 pouces.',
    specs: {
      Écran: '6,9" Dynamic AMOLED 2X',
      Processeur: 'Snapdragon 8 Gen 4',
      Stockage: '256 Go',
      'Appareil photo': '200 Mpx + 50 Mpx + 10 Mpx + 12 Mpx',
      Batterie: '5 000 mAh',
      Système: 'Android 15 / One UI 7',
    },
    inStock: true,
    stockCount: 8,
    badge: 'sale',
    rating: 4.7,
    reviewCount: 89,
    colors: [
      { name: 'Titane noir', hex: '#3b3a3c' },
      { name: 'Titane gris', hex: '#8b8a8c' },
      { name: 'Titane bleu', hex: '#8b9aa8' },
      { name: 'Titane blanc', hex: '#e6e3de' },
    ],
    storageOptions: ['256 Go', '512 Go', '1 To'],
  },
  {
    id: 'xiaomi-15-pro',
    name: 'Xiaomi 15 Pro',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 189900,
    image: '/images/xiaomi-15-pro.jpg',
    images: ['/images/xiaomi-15-pro.jpg'],
    description:
      'Smartphone premium avec charge rapide 120 W, écran LTPO AMOLED et système photo signé Leica.',
    specs: {
      Écran: '6,73" LTPO AMOLED',
      Processeur: 'Snapdragon 8 Gen 3',
      Stockage: '256 Go',
      'Appareil photo': '50 Mpx Leica triple',
      Batterie: '5 000 mAh',
      Système: 'Android 14 / HyperOS',
    },
    inStock: true,
    stockCount: 15,
    rating: 4.5,
    reviewCount: 67,
    colors: [
      { name: 'Noir', hex: '#2f2f31' },
      { name: 'Blanc', hex: '#e9e6e0' },
      { name: 'Vert', hex: '#6f7f6a' },
    ],
    storageOptions: ['256 Go', '512 Go'],
  },

  /* ------------------------------- Ordinateurs ------------------------------ */
  {
    id: 'macbook-pro-16-m4',
    name: 'MacBook Pro 16" M4 Pro',
    brand: 'Apple',
    category: 'laptops',
    price: 549900,
    image: '/images/macbook-pro-16-m4.jpg',
    images: [
      '/images/macbook-pro-16-m4.jpg',
      '/images/macbook-pro-16-m4-2.jpg',
    ],
    description:
      "Le MacBook Pro le plus puissant avec puce M4 Pro, écran Liquid Retina XDR et jusqu'à 22 heures d'autonomie.",
    specs: {
      Écran: '16,2" Liquid Retina XDR',
      Processeur: 'Apple M4 Pro',
      RAM: '18 Go',
      Stockage: '512 Go SSD',
      Batterie: "Jusqu'à 22 h",
      Système: 'macOS Sequoia',
    },
    inStock: true,
    stockCount: 6,
    badge: 'new',
    rating: 4.9,
    reviewCount: 234,
    colors: [
      { name: 'Noir sidéral', hex: '#3a3a3c' },
      { name: 'Argent', hex: '#d9d9d6' },
    ],
    storageOptions: ['512 Go SSD', '1 To SSD'],
  },
  {
    id: 'asus-rog-strix-g16',
    name: 'ROG Strix G16',
    brand: 'ASUS',
    category: 'laptops',
    price: 389900,
    originalPrice: 429900,
    image: '/images/rog-strix-g16.jpg',
    images: ['/images/rog-strix-g16.jpg'],
    description:
      'PC portable gaming avec RTX 4070, écran 165 Hz et clavier mécanique optique.',
    specs: {
      Écran: '16" QHD+ 165 Hz IPS',
      Processeur: 'Intel Core i9-14900HX',
      RAM: '32 Go DDR5',
      Stockage: '1 To SSD NVMe',
      GPU: 'RTX 4070 8 Go',
      Système: 'Windows 11',
    },
    inStock: true,
    stockCount: 4,
    badge: 'sale',
    rating: 4.6,
    reviewCount: 78,
    colors: [{ name: 'Noir éclipse', hex: '#26262a' }],
    storageOptions: ['1 To SSD', '2 To SSD'],
  },
  {
    id: 'dell-xps-15',
    name: 'Dell XPS 15',
    brand: 'Dell',
    category: 'laptops',
    price: 349900,
    image: '/images/dell-xps-15.jpg',
    images: ['/images/dell-xps-15.jpg'],
    description:
      "Ultraportable premium avec écran OLED 3.5K, châssis en aluminium usiné et performances Intel Core Ultra.",
    specs: {
      Écran: '15,6" OLED 3.5K',
      Processeur: 'Intel Core Ultra 9 185H',
      RAM: '32 Go LPDDR5X',
      Stockage: '1 To SSD',
      GPU: 'RTX 4060',
      Système: 'Windows 11 Pro',
    },
    inStock: true,
    stockCount: 9,
    rating: 4.7,
    reviewCount: 145,
    colors: [
      { name: 'Graphite', hex: '#4a4b4d' },
      { name: 'Platine', hex: '#cfcbc4' },
    ],
    storageOptions: ['512 Go SSD', '1 To SSD'],
  },

  /* -------------------------------- Tablettes ------------------------------- */
  {
    id: 'ipad-pro-13-m4',
    name: 'iPad Pro 13" M4',
    brand: 'Apple',
    category: 'tablets',
    price: 399900,
    image: '/images/ipad-pro-13-m4.jpg',
    images: ['/images/ipad-pro-13-m4.jpg'],
    description:
      "Tablette professionnelle avec puce M4, écran Ultra Retina Tandem OLED et compatibilité Apple Pencil Pro.",
    specs: {
      Écran: '13" Ultra Retina Tandem OLED',
      Processeur: 'Apple M4',
      Stockage: '256 Go',
      'Appareil photo': '12 Mpx + LiDAR',
      Batterie: "Jusqu'à 10 h",
      Système: 'iPadOS 18',
    },
    inStock: true,
    stockCount: 11,
    badge: 'new',
    rating: 4.8,
    reviewCount: 89,
    colors: [
      { name: 'Noir sidéral', hex: '#3c3c3e' },
      { name: 'Argent', hex: '#dad9d5' },
    ],
    storageOptions: ['256 Go', '512 Go', '1 To'],
  },
  {
    id: 'samsung-galaxy-tab-s10-ultra',
    name: 'Galaxy Tab S10 Ultra',
    brand: 'Samsung',
    category: 'tablets',
    price: 349900,
    originalPrice: 379900,
    image: '/images/tab-s10-ultra.jpg',
    images: ['/images/tab-s10-ultra.jpg'],
    description:
      'Tablette Android grand format avec écran Dynamic AMOLED 2X de 14,6 pouces, S Pen inclus et Galaxy AI.',
    specs: {
      Écran: '14,6" Dynamic AMOLED 2X',
      Processeur: 'Snapdragon 8 Gen 3',
      Stockage: '256 Go',
      'Appareil photo': '13 Mpx + 8 Mpx',
      Batterie: '11 200 mAh',
      Système: 'Android 15',
    },
    inStock: true,
    stockCount: 5,
    badge: 'sale',
    rating: 4.6,
    reviewCount: 45,
    colors: [{ name: 'Gris titane', hex: '#8a8884' }],
    storageOptions: ['256 Go', '512 Go'],
  },

  /* --------------------------------- Gaming --------------------------------- */
  {
    id: 'ps5-pro',
    name: 'PlayStation 5 Pro',
    brand: 'Sony',
    category: 'gaming',
    price: 249900,
    image: '/images/ps5-pro.jpg',
    images: ['/images/ps5-pro.jpg'],
    description:
      'Console next-gen avec GPU avancé, ray tracing amélioré et 2 To de stockage SSD.',
    specs: {
      Processeur: 'AMD Zen 2 personnalisé',
      GPU: '10,28 TFLOPS (Pro Enhanced)',
      Stockage: '2 To SSD',
      Sortie: '4K 120 Hz / 8K',
      Lecteur: 'Sans lecteur disque',
      Couleur: 'Blanc',
    },
    inStock: true,
    stockCount: 3,
    badge: 'new',
    rating: 4.9,
    reviewCount: 567,
    colors: [{ name: 'Blanc', hex: '#ebe9e3' }],
    storageOptions: ['2 To SSD'],
  },
  {
    id: 'xbox-series-x-2tb',
    name: 'Xbox Series X 2 To',
    brand: 'Microsoft',
    category: 'gaming',
    price: 229900,
    image: '/images/xbox-series-x.jpg',
    images: ['/images/xbox-series-x.jpg'],
    description:
      'Console puissante avec 2 To SSD, Quick Resume et compatibilité Xbox Game Pass Ultimate.',
    specs: {
      Processeur: 'AMD Zen 2 personnalisé 8 cœurs',
      GPU: '12 TFLOPS RDNA 2',
      Stockage: '2 To SSD NVMe',
      Sortie: '4K 120 Hz / 8K',
      Lecteur: '4K UHD Blu-ray',
      Couleur: 'Noir',
    },
    inStock: true,
    stockCount: 7,
    rating: 4.8,
    reviewCount: 423,
    colors: [{ name: 'Noir', hex: '#252527' }],
    storageOptions: ['2 To SSD'],
  },
  {
    id: 'nintendo-switch-2',
    name: 'Nintendo Switch 2',
    brand: 'Nintendo',
    category: 'gaming',
    price: 149900,
    originalPrice: 179900,
    image: '/images/switch-2.jpg',
    images: ['/images/switch-2.jpg'],
    description:
      'Console hybride nouvelle génération avec écran OLED 7 pouces, dock 4K et rétrocompatibilité.',
    specs: {
      Écran: '7" OLED 1080p',
      Stockage: '256 Go',
      Sortie: '1080p portable / 4K dock',
      Batterie: '4,5 à 9 h',
      Contrôleurs: 'Joy-Con 2',
      Couleur: 'Noir / Blanc',
    },
    inStock: true,
    stockCount: 18,
    badge: 'bestseller',
    rating: 4.7,
    reviewCount: 892,
    colors: [{ name: 'Noir', hex: '#2b2b2d' }],
    storageOptions: ['256 Go'],
  },

  /* ------------------------------- Accessoires ------------------------------ */
  {
    id: 'airpods-pro-3',
    name: 'AirPods Pro 3',
    brand: 'Apple',
    category: 'accessories',
    price: 69900,
    image: '/images/airpods-pro-3.jpg',
    images: ['/images/airpods-pro-3.jpg'],
    description:
      "Écouteurs sans fil avec réduction de bruit adaptative, audio spatial et étui de charge avec écran.",
    specs: {
      'Réduction de bruit': 'Adaptative + Transparence',
      'Audio spatial': 'Oui, avec suivi de tête',
      Autonomie: '6 h + 30 h avec étui',
      Connectivité: 'Bluetooth 5.3',
      Résistance: 'IP54',
      Charge: 'USB-C / MagSafe',
    },
    inStock: true,
    stockCount: 45,
    badge: 'new',
    rating: 4.8,
    reviewCount: 234,
    colors: [{ name: 'Blanc', hex: '#f2f0ec' }],
  },
  {
    id: 'samsung-galaxy-watch-7',
    name: 'Galaxy Watch 7',
    brand: 'Samsung',
    category: 'accessories',
    price: 89900,
    originalPrice: 99900,
    image: '/images/galaxy-watch-7.jpg',
    images: ['/images/galaxy-watch-7.jpg'],
    description:
      'Montre connectée avec capteur bioactif, Galaxy AI et autonomie prolongée.',
    specs: {
      Écran: '1,5" Super AMOLED',
      Processeur: 'Exynos W1000',
      Stockage: '32 Go',
      Batterie: '590 mAh',
      Résistance: '5ATM + IP68',
      Système: 'Wear OS 5',
    },
    inStock: true,
    stockCount: 22,
    badge: 'sale',
    rating: 4.5,
    reviewCount: 123,
    colors: [
      { name: 'Argent', hex: '#d4d2cd' },
      { name: 'Noir', hex: '#2d2d2f' },
    ],
  },
  {
    id: 'anker-powercore-26800',
    name: 'Anker PowerCore 26800',
    brand: 'Anker',
    category: 'accessories',
    price: 19900,
    image: '/images/anker-powercore.jpg',
    images: ['/images/anker-powercore.jpg'],
    description:
      'Batterie externe 26 800 mAh avec Power Delivery 45 W, trois ports USB et charge rapide.',
    specs: {
      Capacité: '26 800 mAh',
      'Puissance max': '45 W PD',
      Ports: '2x USB-C + 1x USB-A',
      Recharge: 'Environ 3,5 h',
      Indicateur: 'LED',
      Poids: '495 g',
    },
    inStock: true,
    stockCount: 67,
    rating: 4.7,
    reviewCount: 456,
    colors: [{ name: 'Noir', hex: '#2a2a2c' }],
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

export function getCategoryCount(category: Category): number {
  return getProductsByCategory(category).length;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products
    .filter((product) => product.badge === 'new' || product.badge === 'sale')
    .slice(0, limit);
}

export function getSaleProducts(): Product[] {
  return products.filter((product) => product.originalPrice !== undefined);
}

export function getGamingProducts(): Product[] {
  return getProductsByCategory('gaming');
}

export function getLaptopProducts(): Product[] {
  return getProductsByCategory('laptops');
}

export function getBestsellers(limit = 4): Product[] {
  return [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.id !== product.id
    )
    .slice(0, limit);
}

export function getDiscountPercent(product: Product): number | null {
  if (!product.originalPrice) return null;
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

/**
 * Short, scannable specification line for commerce cards.
 * Keeps the data layer as the source of truth — no duplicated marketing copy.
 */
export function getProductHighlight(product: Product): string {
  const preferredKeys: Record<Category, string[]> = {
    smartphones: ['Stockage', 'Processeur'],
    laptops: ['RAM', 'Stockage'],
    tablets: ['Stockage', 'Processeur'],
    gaming: ['Stockage', 'Sortie'],
    accessories: ['Autonomie', 'Capacité', 'Connectivité', 'Résistance', 'Écran'],
  };

  const values = preferredKeys[product.category]
    .map((key) => product.specs[key])
    .filter((value): value is string => Boolean(value))
    .slice(0, 2);

  if (values.length > 0) return values.join(' · ');

  return Object.values(product.specs).slice(0, 2).join(' · ');
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
        product.description,
        category?.name ?? '',
        ...Object.values(product.specs),
      ].join(' ')
    );
    return terms.every((term) => haystack.includes(term));
  });
}
