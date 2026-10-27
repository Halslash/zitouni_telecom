import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import { getProductById, type Product } from '../data/products';

export interface ProductVariant {
  storage?: string;
  color?: string;
}

export interface CartItem {
  lineId: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | {
      type: 'ADD';
      product: Product;
      quantity: number;
      variant?: ProductVariant;
    }
  | { type: 'REMOVE'; lineId: string }
  | { type: 'UPDATE_QUANTITY'; lineId: string; quantity: number }
  | { type: 'CLEAR' };

interface CartContextValue {
  state: CartState;
  add: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  remove: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineIdFor(productId: string, variant?: ProductVariant): string {
  if (!variant?.storage && !variant?.color) return productId;
  return `${productId}::${variant.storage ?? ''}::${variant.color ?? ''}`;
}

function stockLimit(product: Product): number {
  return typeof product.stockCount === 'number' &&
    Number.isFinite(product.stockCount)
    ? Math.max(0, Math.floor(product.stockCount))
    : 99;
}

function sanitizeVariant(
  product: Product,
  value: unknown
): ProductVariant | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const storage =
    typeof raw.storage === 'string' &&
    (!product.storageOptions || product.storageOptions.includes(raw.storage))
      ? raw.storage
      : undefined;
  const color =
    typeof raw.color === 'string' &&
    (!product.colors || product.colors.some((option) => option.name === raw.color))
      ? raw.color
      : undefined;

  return storage || color ? { storage, color } : undefined;
}

function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  const items = new Map<string, CartItem>();

  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue;

    const candidate = entry as {
      product?: { id?: unknown };
      quantity?: unknown;
      variant?: unknown;
    };
    const productId = candidate.product?.id;
    if (typeof productId !== 'string') continue;

    // Rehydrate from the catalogue so storage cannot inject stale prices,
    // deleted products, or arbitrary product shapes.
    const product = getProductById(productId);
    if (!product || !product.inStock) continue;

    const max = stockLimit(product);
    const quantity = Math.floor(Number(candidate.quantity));
    if (max === 0 || !Number.isFinite(quantity) || quantity <= 0) continue;

    const variant = sanitizeVariant(product, candidate.variant);
    const lineId = lineIdFor(product.id, variant);
    const existing = items.get(lineId);

    items.set(lineId, {
      lineId,
      product,
      quantity: Math.min(max, (existing?.quantity ?? 0) + quantity),
      variant,
    });
  }

  return [...items.values()];
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      if (!action.product.inStock) return state;

      const variant = sanitizeVariant(action.product, action.variant);
      const lineId = lineIdFor(action.product.id, variant);
      const max = stockLimit(action.product);
      if (max === 0) return state;

      const requested = Math.floor(Number(action.quantity));
      const quantityToAdd = Number.isFinite(requested)
        ? Math.max(1, requested)
        : 1;
      const existingIndex = state.items.findIndex(
        (item) => item.lineId === lineId
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: Math.min(max, item.quantity + quantityToAdd),
              }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            lineId,
            product: action.product,
            quantity: Math.min(max, quantityToAdd),
            variant,
          },
        ];
      }

      return { items: newItems, total: calculateTotal(newItems) };
    }

    case 'REMOVE': {
      const newItems = state.items.filter(
        (item) => item.lineId !== action.lineId
      );
      return { items: newItems, total: calculateTotal(newItems) };
    }

    case 'UPDATE_QUANTITY': {
      const current = state.items.find(
        (item) => item.lineId === action.lineId
      );

      const requested = Math.floor(Number(action.quantity));

      if (!current || !Number.isFinite(requested) || requested <= 0) {
        const newItems = state.items.filter(
          (item) => item.lineId !== action.lineId
        );
        return { items: newItems, total: calculateTotal(newItems) };
      }

      const max = stockLimit(current.product);
      const quantity = Math.min(max, requested);

      const newItems =
        quantity <= 0
          ? state.items.filter((item) => item.lineId !== action.lineId)
          : state.items.map((item) =>
              item.lineId === action.lineId ? { ...item, quantity } : item
            );

      return { items: newItems, total: calculateTotal(newItems) };
    }

    case 'CLEAR':
      return { items: [], total: 0 };

    default:
      return state;
  }
}

const STORAGE_KEY = 'zitouni-cart';

function initCart(): CartState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { items: [], total: 0 };
    const items = sanitizeCart(JSON.parse(saved));
    return { items, total: calculateTotal(items) };
  } catch {
    // Corrupted storage should never block the storefront.
    return { items: [], total: 0 };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }, [state.items]);

  const add = (
    product: Product,
    quantity = 1,
    variant?: ProductVariant
  ) => dispatch({ type: 'ADD', product, quantity, variant });

  const remove = (lineId: string) => dispatch({ type: 'REMOVE', lineId });

  const updateQuantity = (lineId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', lineId, quantity });

  const clear = () => dispatch({ type: 'CLEAR' });

  return (
    <CartContext.Provider
      value={{ state, add, remove, updateQuantity, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
