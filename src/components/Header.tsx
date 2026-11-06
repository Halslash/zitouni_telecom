import {
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Link } from './AppLink';
import { AnimatePresence, m } from 'motion/react';
import { useShouldReduceMotion } from '@animate-ui/react/utils/motion';
import { formatNumber } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BrandLockup from './BrandLockup';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { trapTabKey } from '../lib/focusTrap';
import SearchPalette from './SearchPalette';
import MiniCart from './MiniCart';
import {
  ChevronRightIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from './Icons';
import HeaderNav from './HeaderNav';
import { categories, CATEGORY_PATHS, getProductsByCategory } from '../data/products';
import { NavLink } from './AppLink';
import './Header.css';

const DESKTOP_QUERY = '(min-width: 1120px)';

export default function Header() {
  const { state } = useCart();
  const wishlist = useWishlist();
  const location = useLocation();
  const reduceMotion = useShouldReduceMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const cartToggleRef = useRef<HTMLButtonElement>(null);
  const hasMounted = useRef(false);
  const drawerTitleId = useId();

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMiniCartOpen(false);
  }, [location.pathname, location.search]);

  /* Desktop chrome: cart opens the slide-over, not the page. */
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const apply = () => setIsDesktop(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  /* Scroll state + progress line, both written inside one rAF callback. */
  useEffect(() => {
    let frame = 0;
    let pending = false;

    const update = () => {
      pending = false;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setIsScrolled(window.scrollY > 8);
      progressRef.current?.style.setProperty(
        'transform',
        `scaleX(${progress.toFixed(4)})`
      );
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    drawerRef.current?.removeAttribute('inert');
    lockAppInert();
    lockBodyScroll();

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('.wilaya-modal')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }

      trapTabKey(event, drawerRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      unlockAppInert();
      drawerRef.current?.setAttribute('inert', '');
      previouslyFocused?.focus?.();
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`site-header site-header--island${
          isScrolled ? ' is-scrolled' : ''
        }`}
      >
        <div className="container site-header__main">
          <div className="site-header__left">
            <button
              type="button"
              className="header-icon-btn header-icon-btn--menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              <MenuIcon size={18} />
            </button>
            <BrandLockup ariaCurrent={location.pathname === '/'} />
          </div>

          <HeaderNav />

          <div className="site-header__actions">
            <button
              ref={searchToggleRef}
              type="button"
              className="header-icon-btn header-icon-btn--search"
              onClick={() => setSearchOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              aria-controls="search-palette"
              aria-label="Rechercher"
            >
              <SearchIcon size={18} />
            </button>

            <Link
              to="/favoris"
              className="header-icon-btn header-icon-btn--wishlist"
              aria-label="Favoris"
              viewTransition
            >
              <span className="header-icon-btn__icon">
                <HeartIcon size={18} />
                {wishlist.count > 0 && (
                  <m.span
                    key={wishlist.count}
                    className="count-badge header-icon-btn__badge"
                    initial={
                      hasMounted.current && !reduceMotion
                        ? { opacity: 0.5, scale: 0.8 }
                        : false
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {formatNumber(wishlist.count)}
                  </m.span>
                )}
              </span>
            </Link>

            <Link
              to="/compte"
              className="header-icon-btn header-icon-btn--account"
              aria-label="Mon compte"
              viewTransition
            >
              <span className="header-icon-btn__icon">
                <UserIcon size={18} />
              </span>
            </Link>

            {isDesktop ? (
              <button
                ref={cartToggleRef}
                type="button"
                className="header-icon-btn header-icon-btn--cart"
                onClick={() => setMiniCartOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={miniCartOpen}
                aria-controls="mini-cart"
                aria-label={
                  itemCount > 0 ? `Panier, ${itemCount} article(s)` : 'Panier'
                }
              >
                <span className="header-icon-btn__icon">
                  <ShoppingBagIcon size={18} />
                  {itemCount > 0 && (
                    <m.span
                      key={itemCount}
                      className="count-badge header-icon-btn__badge"
                      initial={
                        hasMounted.current && !reduceMotion
                          ? { opacity: 0.5, scale: 0.8 }
                          : false
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {formatNumber(itemCount)}
                    </m.span>
                  )}
                </span>
              </button>
            ) : (
              <Link
                to="/panier"
                className="header-icon-btn header-icon-btn--cart"
                aria-label={
                  itemCount > 0 ? `Panier, ${itemCount} article(s)` : 'Panier'
                }
                viewTransition
              >
                <span className="header-icon-btn__icon">
                  <ShoppingBagIcon size={18} />
                  {itemCount > 0 && (
                    <m.span
                      key={itemCount}
                      className="count-badge header-icon-btn__badge"
                      initial={
                        hasMounted.current && !reduceMotion
                          ? { opacity: 0.5, scale: 0.8 }
                          : false
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {formatNumber(itemCount)}
                    </m.span>
                  )}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Wine scroll-progress line along the island's bottom edge. */}
        <span
          ref={progressRef}
          className="site-header__progress"
          aria-hidden="true"
        />
      </header>

      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <>
              <m.div
                className="drawer-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
                onClick={() => setMobileOpen(false)}
              />
              <m.aside
                ref={drawerRef}
                id="mobile-drawer"
                className="mobile-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={drawerTitleId}
                initial={reduceMotion ? { opacity: 0, x: 0 } : { x: '-100%' }}
                animate={reduceMotion ? { opacity: 1, x: 0 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: '-100%' }}
                transition={
                  reduceMotion
                    ? { duration: 0.12 }
                    : { duration: 0.28, ease: [0.32, 0.72, 0.3, 1] }
                }
              >
                <header className="mobile-drawer__header">
                  <h2 id={drawerTitleId} className="mobile-drawer__title">
                    Menu
                  </h2>
                  <button
                    ref={closeRef}
                    type="button"
                    className="mobile-drawer__close"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Fermer le menu"
                  >
                    <CloseIcon size={18} />
                  </button>
                </header>
                <div className="mobile-drawer__search">
                  <button
                    type="button"
                    className="mobile-drawer__search-btn"
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                  >
                    <SearchIcon size={18} />
                    Rechercher un produit…
                  </button>
                </div>
                <nav className="mobile-drawer__nav" aria-label="Navigation mobile">
                  <p className="mobile-drawer__label">Boutique</p>
                  <ul className="mobile-nav__list">
                    {categories.map((category) => {
                      const categoryProducts = getProductsByCategory(
                        category.id
                      );
                      const open = openCategory === category.id;
                      return (
                        <li
                          key={category.id}
                          className="mobile-nav__item"
                          data-open={open || undefined}
                        >
                          <button
                            type="button"
                            className="mobile-nav__summary"
                            onClick={() =>
                              setOpenCategory(open ? null : category.id)
                            }
                            aria-expanded={open}
                          >
                            <span>{category.name}</span>
                            <ChevronRightIcon size={18} />
                          </button>
                          <div className="mobile-nav__sub">
                            <div className="mobile-nav__sub-inner">
                              <ul>
                                <li>
                                  <NavLink
                                    to={CATEGORY_PATHS[category.id]}
                                    viewTransition
                                    onClick={() =>
                                      setMobileOpen(false)
                                    }
                                  >
                                    Tous les{' '}
                                    {category.name.toLowerCase()}
                                  </NavLink>
                                </li>
                                {categoryProducts.map((product) => (
                                  <li key={product.id}>
                                    <NavLink
                                      to={`/produit/${product.id}`}
                                      viewTransition
                                      onClick={() =>
                                        setMobileOpen(false)
                                      }
                                    >
                                      {product.name}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mobile-drawer__label">Mon espace</p>
                  <ul className="mobile-nav__list mobile-nav__list--secondary">
                    <li>
                      <Link to="/favoris" viewTransition>
                        <span>Favoris</span>
                        <ChevronRightIcon size={16} />
                      </Link>
                    </li>
                    <li>
                      <Link to="/panier" viewTransition>
                        <span>Panier</span>
                        <ChevronRightIcon size={16} />
                      </Link>
                    </li>
                    <li>
                      <Link to="/compte" viewTransition>
                        <span>Compte</span>
                        <ChevronRightIcon size={16} />
                      </Link>
                    </li>
                    <li>
                      <Link to="/aide" viewTransition>
                        <span>Aide</span>
                        <ChevronRightIcon size={16} />
                      </Link>
                    </li>
                  </ul>
                </nav>
              </m.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        restoreFocusRef={searchToggleRef}
      />

      <MiniCart
        open={miniCartOpen}
        onClose={() => setMiniCartOpen(false)}
        restoreFocusRef={cartToggleRef}
      />
    </>
  );
}

export { DESKTOP_QUERY };
