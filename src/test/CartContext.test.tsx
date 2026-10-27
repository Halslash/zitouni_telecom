import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import type { Product } from '../data/products';

const mockProduct: Product = {
  id: 'test-product',
  name: 'Test Product',
  brand: 'TestBrand',
  category: 'smartphones',
  price: 50000,
  image: '/test.jpg',
  images: ['/test.jpg'],
  description: 'A test product',
  specs: {},
  inStock: true,
  rating: 4.5,
  reviewCount: 10,
};

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  it('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it('adds product to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct);
    });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].product.id).toBe('test-product');
    expect(result.current.state.items[0].quantity).toBe(1);
    expect(result.current.state.total).toBe(50000);
  });

  it('increments quantity when adding same product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct);
      result.current.add(mockProduct);
    });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].quantity).toBe(2);
    expect(result.current.state.total).toBe(100000);
  });

  it('removes product from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct);
    });

    expect(result.current.state.items).toHaveLength(1);

    act(() => {
      result.current.remove('test-product');
    });

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it('updates quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('test-product', 5);
    });

    expect(result.current.state.items[0].quantity).toBe(5);
    expect(result.current.state.total).toBe(250000);
  });

  it('removes item when quantity set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('test-product', 0);
    });

    expect(result.current.state.items).toHaveLength(0);
  });

  it('clears cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct);
      result.current.add(mockProduct);
    });

    expect(result.current.state.items).toHaveLength(1);

    act(() => {
      result.current.clear();
    });

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it('keeps variants as separate lines', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct, 1, {
        storage: '256 Go',
        color: 'Noir',
      });
      result.current.add(mockProduct, 1, {
        storage: '512 Go',
        color: 'Noir',
      });
      result.current.add(mockProduct);
    });

    expect(result.current.state.items).toHaveLength(3);
    expect(result.current.state.total).toBe(150000);

    const firstVariant = result.current.state.items.find(
      (item) => item.variant?.storage === '256 Go'
    );
    expect(firstVariant?.lineId).toBe('test-product::256 Go::Noir');

    act(() => {
      result.current.remove(firstVariant!.lineId);
    });

    expect(result.current.state.items).toHaveLength(2);
  });

  it('clamps quantities to stock', () => {
    const limitedProduct: Product = { ...mockProduct, stockCount: 2 };
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(limitedProduct, 5);
    });

    expect(result.current.state.items[0].quantity).toBe(2);
    expect(result.current.state.total).toBe(100000);

    act(() => {
      result.current.add(limitedProduct, 1);
    });

    act(() => {
      result.current.updateQuantity('test-product', 99);
    });

    expect(result.current.state.items[0].quantity).toBe(2);
  });

  it('sanitizes persisted cart data and rehydrates the catalogue', () => {
    localStorage.setItem(
      'zitouni-cart',
      JSON.stringify([
        {
          product: {
            id: 'iphone-16-pro-max',
            name: 'Injected name',
            price: 1,
          },
          quantity: '2',
        },
        {
          product: { id: 'iphone-16-pro-max' },
          quantity: 2,
        },
        { product: { id: 'missing-product' }, quantity: 1 },
        { product: {}, quantity: 1 },
        'junk',
      ])
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].lineId).toBe('iphone-16-pro-max');
    expect(result.current.state.items[0].product.name).toBe('iPhone 16 Pro Max');
    expect(result.current.state.items[0].product.price).toBe(299900);
    expect(result.current.state.items[0].quantity).toBe(4);
    expect(result.current.state.total).toBe(1199600);
  });

  it('drops invalid persisted variants and clamps stock', () => {
    localStorage.setItem(
      'zitouni-cart',
      JSON.stringify([
        {
          product: { id: 'iphone-16-pro-max' },
          quantity: 99,
          variant: { storage: '512 Go', color: 'Titane noir' },
        },
        {
          product: { id: 'iphone-16-pro-max' },
          quantity: 1,
          variant: { storage: '1 To', color: 'Injected colour' },
        },
      ])
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.state.items).toHaveLength(2);
    expect(result.current.state.items[0].quantity).toBe(12);
    expect(result.current.state.items[0].variant).toEqual({
      storage: '512 Go',
      color: 'Titane noir',
    });
    expect(result.current.state.items[1].variant).toEqual({
      storage: '1 To',
      color: undefined,
    });
  });
});
