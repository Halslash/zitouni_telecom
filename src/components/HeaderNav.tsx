import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from './AppLink';
import { CATEGORY_PATHS, categories } from '../data/products';
import type { Category } from '../data/products';
import NavFlyout, { NAV_FLYOUT_ID } from './NavFlyout';
import './HeaderNav.css';

export default function HeaderNav() {
  const [activeFlyout, setActiveFlyout] = useState<Category | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<number | null>(null);
  const location = useLocation();

  /* Sliding active indicator: one element gliding between items,
     transform only. */
  const placeIndicator = useCallback(() => {
    const wrapper = wrapperRef.current;
    const indicator = indicatorRef.current;
    if (!wrapper || !indicator) return;
    const wrapRect = wrapper.getBoundingClientRect();
    const target = Object.entries(CATEGORY_PATHS).find(([, path]) =>
      location.pathname.startsWith(path)
    );
    const trigger = target ? triggerRefs.current[target[0]] : null;
    if (!trigger) {
      indicator.style.setProperty('--indicator-opacity', '0');
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const x = rect.left - wrapRect.left + rect.width / 2;
    indicator.style.setProperty(
      'transform',
      `translate(-50%, 0) translateX(${x.toFixed(1)}px)`
    );
    indicator.style.setProperty('--indicator-opacity', '1');
  }, [location.pathname]);

  useLayoutEffect(() => {
    placeIndicator();
  }, [placeIndicator, activeFlyout]);

  useEffect(() => {
    const onResize = () => placeIndicator();
    window.addEventListener('resize', onResize, { passive: true });
    const fontReady = document.fonts?.ready.then(() => placeIndicator());
    return () => {
      window.removeEventListener('resize', onResize);
      fontReady?.catch(() => {});
    };
  }, [placeIndicator]);

  const clearClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = window.setTimeout(() => setActiveFlyout(null), 280);
  };

  const openWithIntent = (cat: Category) => {
    clearClose();
    setActiveFlyout(cat);
  };

  useEffect(() => {
    if (!activeFlyout) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      const trigger = triggerRefs.current[activeFlyout];
      setActiveFlyout(null);
      trigger?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeFlyout]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    []
  );

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (wrapperRef.current?.contains(event.relatedTarget as Node | null)) return;
    scheduleClose();
  };

  return (
    <div
      ref={wrapperRef}
      className="header-nav-wrapper"
      onMouseEnter={clearClose}
      onMouseLeave={scheduleClose}
      onFocus={clearClose}
      onBlur={handleBlur}
    >
      <nav className="site-nav" aria-label="Navigation">
        <ul className="primary-nav">
          {categories.map((category) => (
            <li key={category.id}>
              <NavLink
                ref={(node) => {
                  triggerRefs.current[category.id] = node;
                }}
                to={CATEGORY_PATHS[category.id]}
                className={({ isActive }) =>
                  `primary-nav__link${isActive ? ' is-active' : ''}${
                    activeFlyout === category.id ? ' is-flyout-active' : ''
                  }`
                }
                viewTransition
                onMouseEnter={() => openWithIntent(category.id)}
                onFocus={() => openWithIntent(category.id)}
                aria-expanded={activeFlyout === category.id}
                aria-controls={NAV_FLYOUT_ID}
                aria-haspopup="true"
              >
                {category.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <span ref={indicatorRef} className="primary-nav__indicator" aria-hidden="true" />
      </nav>
      <NavFlyout
        activeCategory={activeFlyout}
        onOpen={(cat) => {
          if (cat === null) {
            scheduleClose();
          } else {
            openWithIntent(cat);
          }
        }}
      />
    </div>
  );
}
