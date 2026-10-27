import {
  createBrowserRouter,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import { CATEGORY_PATHS } from './data/products';
import { MotionProvider } from './lib/motion';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { WilayaProvider } from './context/WilayaContext';

function App() {
  return (
    <MotionProvider>
      <WilayaProvider>
        <CartProvider>
          <WishlistProvider>
            <ErrorBoundary>
              <Layout>
                <Outlet />
              </Layout>
            </ErrorBoundary>
          </WishlistProvider>
        </CartProvider>
      </WilayaProvider>
    </MotionProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },

      { path: 'produits', element: <ProductsPage /> },
      ...Object.values(CATEGORY_PATHS).map((path) => ({
        path: path.replace(/^\//, ''),
        element: <ProductsPage />,
      })),
      { path: 'promotions', element: <Navigate to="/produits" replace /> },

      { path: 'produit/:id', element: <ProductDetailPage /> },
      { path: 'panier', element: <CartPage /> },
      { path: 'favoris', element: <WishlistPage /> },
      { path: 'compte', element: <AccountPage /> },
      { path: 'aide', element: <HelpPage /> },

      // Legacy catalogue URLs are redirected inside ProductsPage.
      { path: 'produits/:category', element: <ProductsPage /> },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
