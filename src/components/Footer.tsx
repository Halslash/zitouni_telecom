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

          <p className="site-footer__statement">
            Téléphonie, informatique et accessoires choisis avec soin,
            conseillés en magasin à Alger.
          </p>
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
                <Link to="/aide#livraison" viewTransition>
                  Livraison
                </Link>
              </li>
              <li>
                <Link to="/aide#paiement" viewTransition>
                  Paiement
                </Link>
              </li>
              <li>
                <Link to="/aide#garantie" viewTransition>
                  Garantie &amp; retours
                </Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__column">
            <p className="site-footer__heading">Mon espace</p>
            <ul className="site-footer__list">
              <li>
                <Link to="/compte" viewTransition>
                  Compte
                </Link>
              </li>
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
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            © {new Date().getFullYear()} Zitouni Telecom
          </p>
          <p className="site-footer__services">
            Livraison dans les 58 wilayas · Paiement à la livraison
          </p>
        </div>
      </div>

      {/* Oversized wordmark, deliberately cropped by the footer edge. */}
      <div className="site-footer__wordmark" aria-hidden="true">
        Zitouni
      </div>
    </footer>
  );
}
