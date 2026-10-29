import { Link } from './AppLink';
import BrandLockup from './BrandLockup';
import { categories, CATEGORY_PATHS } from '../data/products';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__top">
          <BrandLockup showDescriptor />
        </div>
        <div className="site-footer__grid">
          <div className="site-footer__column">
            <p className="site-footer__heading">Boutique</p>
            <ul className="site-footer__list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={CATEGORY_PATHS[category.id]} viewTransition>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="site-footer__column">
            <p className="site-footer__heading">Aide</p>
            <ul className="site-footer__list">
              <li>
                <Link to="/aide" viewTransition>
                  Aide &amp; services
                </Link>
              </li>
              <li>
                <Link to="/compte" viewTransition>
                  Compte
                </Link>
              </li>
              <li>
                <Link to="/panier" viewTransition>
                  Panier
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            © {new Date().getFullYear()} Zitouni Telecom
          </p>
        </div>
      </div>
    </footer>
  );
}
