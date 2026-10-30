import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from './AppLink';
import { AnimatePresence, m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import { formatNumber } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BrandLockup from './BrandLockup';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { trapTabKey } from '../lib/focusTrap';
import {
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
} from './Icons';
import HeaderNav from './HeaderNav';
import { categories } from '../data/products';
import { CATEGORY_PATHS } from '../data/products';
import { NavLink } from './AppLink';
import './Header.css';

function SearchForm({
  className,
  autoFocus = false,
  onSubmitted,
  viewTransition = true,
}: {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  viewTransition?: boolean;
}) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (autoFocus) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    navigate(`/produits?q=${encodeURIComponent(term)}`, { viewTransition });
    setQuery('');
    onSubmitted?.();
  };

  return (
    <form
      className={`header-search${className ? ` ${className}` : ''}`}
      role="search"
      aria-label="Rechercher"
      onSubmit={handleSubmit}
    >
      <SearchIcon size={16} className="header-search__icon" />
      <label htmlFor={inputId} className="visually-hidden">
        Rechercher
      </label>
      <input
        ref={inputRef}
        id={inputId}
        className="header-search__input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher"
        autoComplete="off"
      />
      <button type="submit" className="header-search__submit">
        Rechercher
      </button>
    </form>
  );
}

export default function Header() {
  const { state } = useCart();
  const wishlist = useWishlist();
  const location = useLocation();
  const { spring } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const scrollSentinelRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
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
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!searchOpen) return;
    return () => searchToggleRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

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
      <div
        ref={scrollSentinelRef}
        className="header-sentinel"
        aria-hidden="true"
      />

      <header className="site-header site-header--slim">
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
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls="header-search-panel"
              aria-label={searchOpen ? 'Fermer la recherche' : 'Rechercher'}
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
                    transition={spring.pop}
                  >
                    {formatNumber(wishlist.count)}
                  </m.span>
                )}
              </span>
            </Link>

            <Link
              to="/panier"
              className="header-icon-btn header-icon-btn--cart"
              aria-label="Panier"
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
                    transition={spring.pop}
                  >
                    {formatNumber(itemCount)}
                  </m.span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <m.div
            id="header-search-panel"
            className="header-search-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
          >
            <div className="container header-search-panel__inner">
              <SearchForm autoFocus onSubmitted={() => setSearchOpen(false)} />
              <button
                type="button"
                className="header-search-panel__close"
                onClick={() => setSearchOpen(false)}
                aria-label="Fermer la recherche"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>

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
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: reduceMotion ? 0.12 : 0.25, ease: [0, 0, 0.5, 1] }}
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
                <nav className="mobile-drawer__nav" aria-label="Navigation mobile">
                  <ul className="mobile-nav__list">
                    {categories.map((category) => (
                      <li key={category.id}>
                        <NavLink
                          to={CATEGORY_PATHS[category.id]}
                          className={({ isActive }) =>
                            `mobile-nav__link${isActive ? ' is-active' : ''}`
                          }
                          viewTransition
                        >
                          {category.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                  <ul className="mobile-nav__list mobile-nav__list--secondary">
                    <li>
                      <Link to="/favoris" viewTransition>
                        Favoris
                      </Link>
                    </li>
                    <li>
                      <Link to="/panier" viewTransition>
                        Panier
                      </Link>
                    </li>
                    <li>
                      <Link to="/compte" viewTransition>
                        Compte
                      </Link>
                    </li>
                    <li>
                      <Link to="/aide" viewTransition>
                        Aide
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
    </>
  );
}
