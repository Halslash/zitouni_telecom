import { useRef, useState } from 'react';
import { NavLink } from './AppLink';
import { CATEGORY_PATHS, categories } from '../data/products';
import type { Category } from '../data/products';
import NavFlyout from './NavFlyout';
import './HeaderNav.css';

export default function HeaderNav() {
  const [activeFlyout, setActiveFlyout] = useState<Category | null>(null);
  const closeTimer = useRef<number | null>(null);

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

  return (
    <div
      className="header-nav-wrapper"
      onMouseEnter={clearClose}
      onMouseLeave={scheduleClose}
    >
      <nav className="site-nav" aria-label="Navigation">
        <ul className="primary-nav">
          {categories.map((category) => (
            <li key={category.id}>
              <NavLink
                to={CATEGORY_PATHS[category.id]}
                className={({ isActive }) =>
                  `primary-nav__link${isActive ? ' is-active' : ''}`
                }
                viewTransition
                onMouseEnter={() => openWithIntent(category.id)}
                onFocus={() => openWithIntent(category.id)}
                onBlur={() => scheduleClose()}
                aria-expanded={activeFlyout === category.id}
                aria-haspopup="menu"
              >
                {category.name}
              </NavLink>
            </li>
          ))}
        </ul>
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
