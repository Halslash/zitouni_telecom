import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link, NavLink } from './AppLink';
import { AnimatePresence, m } from 'motion/react';
import {
  useMotionTokens,
  useShouldReduceMotion,
} from '@animate-ui/react/utils/motion';
import { CATEGORY_PATHS, categories } from '../data/products';
import { formatNumber } from '../lib/format';
import { cinematicEase } from '../lib/motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BrandLockup from './BrandLockup';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { WilayaSelector } from './WilayaSelector';
import { trapTabKey } from '../lib/focusTrap';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from './Icons';
import './Header.css';

function SearchForm({
  className,
  autoFocus = false,
  onSubmitted,
  viewTransition = true,
  searchLabel = 'Recherche boutique',
}: {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
  viewTransition?: boolean;
  searchLabel?: string;
}) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (autoFocus) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
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
      aria-label={searchLabel}
      onSubmit={handleSubmit}
    >
      <SearchIcon size={18} className="header-search__icon" />
      <label htmlFor={inputId} className="visually-hidden">
        Rechercher un produit
      </label>
      <input
        ref={inputRef}
        id={inputId}
        className="header-search__input"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher un produit, une marque…"
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
  const { spring, transition } = useMotionTokens();
  const reduceMotion = useShouldReduceMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const scrollSentinelRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const hasMounted = useRef(false);
  const drawerTitleId = useId();
  const drawerOffset = reduceMotion ? '0%' : '100%';
  const searchOffset = reduceMotion ? 0 : -8;
  const drawerTransition = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.4, ease: cinematicEase };
  const drawerExit = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.3, ease: cinematicEase };

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    const sentinel = scrollSentinelRef.current;
    if (!sentinel) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      const handleScroll = () => setScrolled(window.scrollY > 12);
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => setScrolled(!entries[0]?.isIntersecting),
      { threshold: 0, rootMargin: '-12px 0px 0px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
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
      /* A wilaya dialog can sit above the drawer; leave Escape/Tab to it. */
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
      /* Keep the leaving drawer out of the tab order while it animates out. */
      drawerRef.current?.setAttribute('inert', '');
      previouslyFocused?.focus?.();
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <p className="utility-bar__promise">
            <span className="utility-bar__dot" aria-hidden="true" />
            Livraison dans les 58 wilayas
            <span className="utility-bar__sep" aria-hidden="true" />
            Paiement à la livraison
          </p>

          <div className="utility-bar__actions">
            <WilayaSelector />
            <Link to="/aide" className="utility-bar__link" viewTransition>
              Aide &amp; services
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={scrollSentinelRef}
        className="header-sentinel"
        aria-hidden="true"
      />

      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container site-header__main">
          <BrandLockup />

          <nav className="site-nav" aria-label="Catégories">
            <ul className="primary-nav">
              {categories.map((category) => (
                <li key={category.id}>
                  <NavLink
                    to={CATEGORY_PATHS[category.id]}
                    className={({ isActive }) =>
                      `primary-nav__link${isActive ? ' is-active' : ''}`
                    }
                    viewTransition
                  >
                    {category.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <button
              ref={searchToggleRef}
              type="button"
              className="header-icon-btn header-icon-btn--search"
              onClick={() => setSearchOpen((open) => !open)}
              aria-expanded={searchOpen}
              aria-controls="header-search-panel"
              aria-label={
                searchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'
              }
            >
              <SearchIcon size={20} />
            </button>

            <Link
              to="/compte"
              className="header-icon-btn header-icon-btn--account"
              aria-label="Mon compte"
              viewTransition
            >
              <UserIcon size={20} />
            </Link>

            <Link
              to="/favoris"
              className="header-icon-btn header-icon-btn--wishlist"
              aria-label="Mes favoris"
              viewTransition
            >
              <span className="header-icon-btn__icon">
                <HeartIcon size={20} />
                {wishlist.count > 0 && (
                  <m.span
                    key={wishlist.count}
                    className="count-badge header-icon-btn__badge"
                    initial={
                      hasMounted.current
                        ? {
                            opacity: 0.5,
                            scale: reduceMotion ? 1 : 0.72,
                          }
                        : false
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    transition={spring.pop}
                    aria-hidden="true"
                  >
                    {formatNumber(wishlist.count)}
                  </m.span>
                )}
              </span>
            </Link>

            <Link
              to="/panier"
              className="header-cart"
              aria-label={`Panier, ${itemCount} article${itemCount > 1 ? 's' : ''}`}
              viewTransition
            >
              <ShoppingBagIcon size={20} />
              <span className="header-cart__label">Panier</span>
              <m.span
                key={itemCount}
                className="header-cart__count"
                initial={
                  hasMounted.current
                    ? {
                        opacity: 0.5,
                        scale: reduceMotion ? 1 : 0.72,
                      }
                    : false
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={spring.pop}
                aria-hidden="true"
              >
                {formatNumber(itemCount)}
              </m.span>
            </Link>

            <button
              type="button"
              className="header-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-label="Ouvrir le menu"
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <m.div
              id="header-search-panel"
              className="site-header__search-panel"
              initial={{ opacity: 0, y: searchOffset }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: searchOffset,
                transition: reduceMotion
                  ? { duration: 0.12 }
                  : { duration: 0.24, ease: cinematicEase },
              }}
              transition={
                reduceMotion
                  ? { duration: 0.12 }
                  : { duration: 0.34, ease: cinematicEase }
              }
            >
              <div className="container">
                <SearchForm
                  autoFocus
                  searchLabel="Recherche boutique"
                  onSubmitted={() => setSearchOpen(false)}
                />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <m.div
              key="mobile-menu"
              className="menu-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition.fade}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setMobileOpen(false);
              }}
            >
              <m.div
                ref={drawerRef}
                className="menu-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={drawerTitleId}
                initial={{ x: drawerOffset }}
                animate={{ x: 0 }}
                exit={{ x: drawerOffset, transition: drawerExit }}
                transition={drawerTransition}
              >
              <div className="menu-drawer__head">
                <BrandLockup
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  viewTransition={false}
                />
                <button
                  ref={closeRef}
                  type="button"
                  className="icon-btn"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <CloseIcon size={20} />
                </button>
              </div>

              <h2 id={drawerTitleId} className="visually-hidden">
                Menu de navigation
              </h2>

              <div className="menu-drawer__search">
                <SearchForm
                  searchLabel="Recherche dans le menu"
                  viewTransition={false}
                  onSubmitted={() => setMobileOpen(false)}
                />
              </div>

              <nav className="menu-drawer__nav" aria-label="Navigation mobile">
                <p className="menu-drawer__label">Boutique</p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={CATEGORY_PATHS[category.id]}
                    className="menu-drawer__link"
                    viewTransition={false}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{category.name}</span>
                    <ChevronRightIcon size={17} />
                  </Link>
                ))}
              </nav>

              <nav className="menu-drawer__nav" aria-label="Mon espace">
                <p className="menu-drawer__label">Mon espace</p>
                <Link
                  to="/favoris"
                  className="menu-drawer__link"
                  viewTransition={false}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Favoris</span>
                  {wishlist.count > 0 && (
                    <span className="menu-drawer__count">{wishlist.count}</span>
                  )}
                </Link>
                <Link
                  to="/panier"
                  className="menu-drawer__link"
                  viewTransition={false}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Panier</span>
                  <span className="menu-drawer__count">{itemCount}</span>
                </Link>
                <Link
                  to="/compte"
                  className="menu-drawer__link"
                  viewTransition={false}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Mon compte</span>
                  <ChevronRightIcon size={17} />
                </Link>
                <Link
                  to="/aide"
                  className="menu-drawer__link"
                  viewTransition={false}
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Aide &amp; services</span>
                  <ArrowRightIcon size={17} />
                </Link>
              </nav>

              <div className="menu-drawer__delivery">
                <WilayaSelector variant="field" label="Livraison vers" />
                <p className="menu-drawer__note">
                  Livraison à domicile ou en point relais, dans les 58 wilayas.
                </p>
              </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
