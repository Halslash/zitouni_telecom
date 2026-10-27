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
  colors: [{ name: 'Noir', hex: '#000000' }],
  variants: [
    { name: '128 Go', price: 50000 },
    { name: '256 Go', price: 60000 },
  ],
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

  it('keeps variants as separate lines and prices them from the catalogue', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct, 1, {
        variant: '128 Go',
        color: 'Noir',
      });
      result.current.add(mockProduct, 1, {
        variant: '256 Go',
        color: 'Noir',
      });
      result.current.add(mockProduct);
    });

    expect(result.current.state.items).toHaveLength(3);
    expect(result.current.state.total).toBe(160000);

    const firstVariant = result.current.state.items.find(
      (item) => item.variant?.variant === '128 Go'
    );
    expect(firstVariant?.lineId).toBe('test-product::128 Go::Noir');

    act(() => {
      result.current.remove(firstVariant!.lineId);
    });

    expect(result.current.state.items).toHaveLength(2);
    expect(result.current.state.total).toBe(110000);
  });

  it('caps quantities at 99', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.add(mockProduct, 120);
    });

    expect(result.current.state.items[0].quantity).toBe(99);
    expect(result.current.state.total).toBe(4950000);

    act(() => {
      result.current.updateQuantity('test-product', 200);
    });

    expect(result.current.state.items[0].quantity).toBe(99);
  });

  it('sanitizes persisted cart data and rehydrates the catalogue', () => {
    localStorage.setItem(
      'zitouni-cart',
      JSON.stringify([
        {
          product: {
            id: 'galaxy-s25-ultra',
            name: 'Injected name',
            price: 1,
          },
          quantity: '2',
        },
        {
          product: { id: 'galaxy-s25-ultra' },
          quantity: 2,
        },
        { product: { id: 'missing-product' }, quantity: 1 },
        { product: {}, quantity: 1 },
        'junk',
      ])
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].lineId).toBe('galaxy-s25-ultra');
    expect(result.current.state.items[0].product.name).toBe('Galaxy S25 Ultra');
    expect(result.current.state.items[0].product.price).toBe(279900);
    expect(result.current.state.items[0].quantity).toBe(4);
    expect(result.current.state.total).toBe(1119600);
  });

  it('drops invalid persisted variants and caps quantities', () => {
    localStorage.setItem(
      'zitouni-cart',
      JSON.stringify([
        {
          product: { id: 'galaxy-s25-ultra' },
          quantity: 150,
          variant: { variant: '512 Go', color: 'Titane noir' },
        },
        {
          product: { id: 'galaxy-s25-ultra' },
          quantity: 1,
          variant: { variant: '1 To', color: 'Injected colour' },
        },
      ])
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.state.items).toHaveLength(2);
    expect(result.current.state.items[0].quantity).toBe(99);
    expect(result.current.state.items[0].variant).toEqual({
      variant: '512 Go',
      color: 'Titane noir',
    });
    expect(result.current.state.items[1].variant).toEqual({
      variant: '1 To',
      color: undefined,
    });
    expect(result.current.state.total).toBe(31030000);
  });
});
