import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react';
import {
  getProductById,
  getVariantPrice,
  type Product,
} from '../data/products';

export interface ProductVariant {
  variant?: string;
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

const MAX_QUANTITY = 99;

function lineIdFor(productId: string, variant?: ProductVariant): string {
  if (!variant?.variant && !variant?.color) return productId;
  return `${productId}::${variant.variant ?? ''}::${variant.color ?? ''}`;
}

function sanitizeVariant(
  product: Product,
  value: unknown
): ProductVariant | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const raw = value as Record<string, unknown>;
  const variant =
    typeof raw.variant === 'string' &&
    (!product.variants ||
      product.variants.some((option) => option.name === raw.variant))
      ? raw.variant
      : undefined;
  const color =
    typeof raw.color === 'string' &&
    (!product.colors ||
      product.colors.some((option) => option.name === raw.color))
      ? raw.color
      : undefined;

  return variant || color ? { variant, color } : undefined;
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
    if (!product) continue;

    const quantity = Math.floor(Number(candidate.quantity));
    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const variant = sanitizeVariant(product, candidate.variant);
    const lineId = lineIdFor(product.id, variant);
    const existing = items.get(lineId);

    items.set(lineId, {
      lineId,
      product,
      quantity: Math.min(
        MAX_QUANTITY,
        (existing?.quantity ?? 0) + quantity
      ),
      variant,
    });
  }

  return [...items.values()];
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) =>
      sum +
      getVariantPrice(item.product, item.variant?.variant) * item.quantity,
    0
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const variant = sanitizeVariant(action.product, action.variant);
      const lineId = lineIdFor(action.product.id, variant);
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
                quantity: Math.min(
                  MAX_QUANTITY,
                  item.quantity + quantityToAdd
                ),
              }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            lineId,
            product: action.product,
            quantity: Math.min(MAX_QUANTITY, quantityToAdd),
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

      const quantity = Math.min(MAX_QUANTITY, requested);

      const newItems = state.items.map((item) =>
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
