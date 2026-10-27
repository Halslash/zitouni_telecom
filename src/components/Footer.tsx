import { Link } from './AppLink';
import BrandLockup from './BrandLockup';
import {
  ArrowRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from './Icons';
import './Footer.css';

const BOUTIQUE_LINKS = [
  { to: '/telephones', label: 'Téléphones' },
  { to: '/ordinateurs', label: 'Ordinateurs' },
  { to: '/tablettes', label: 'Tablettes' },
  { to: '/gaming', label: 'Gaming' },
  { to: '/accessoires', label: 'Accessoires' },
];

const SERVICE_LINKS = [
  { to: '/aide#livraison', label: 'Livraison' },
  { to: '/aide#paiement', label: 'Paiement' },
  { to: '/aide#garantie', label: 'Garantie & retours' },
  { to: '/aide#faq', label: 'Questions fréquentes' },
  { to: '/aide#contact', label: 'Nous contacter' },
];

const ESPACE_LINKS = [
  { to: '/compte', label: 'Mon compte' },
  { to: '/favoris', label: 'Mes favoris' },
  { to: '/panier', label: 'Mon panier' },
  { to: '/aide#apropos', label: 'Notre approche' },
];

export default function Footer() {
  return (
    <footer className="footer on-dark">
      <span className="footer__watermark" aria-hidden="true">
        Z
      </span>

      <div className="container footer__inner">
        <div className="footer__cta">
          <div>
            <span className="eyebrow">Zitouni Telecom</span>
            <h2 className="footer__cta-title">
              Votre prochain équipement
              <br />
              commence ici.
            </h2>
          </div>

          <div className="footer__cta-actions">
            <Link
              to="/produits"
              className="btn btn--light"
              viewTransition
            >
              Explorer la boutique
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              to="/aide#contact"
              className="btn btn--outline-light"
              viewTransition
            >
              Une question ?
            </Link>
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <BrandLockup inverse size="lg" />
            <p className="footer__tagline">
              Une sélection tech exigeante pour l'Algérie. Des produits
              authentiques, des prix lisibles et un accompagnement humain.
            </p>

            <ul className="footer__promises">
              <li>
                <TruckIcon size={15} />
                Livraison 58 wilayas
              </li>
              <li>
                <ShieldCheckIcon size={15} />
                Garantie officielle
              </li>
              <li>
                <CreditCardIcon size={15} />
                Paiement à la livraison
              </li>
            </ul>

            <a
              className="footer__contact"
              href="mailto:contact@zitouni-telecom.dz"
            >
              contact@zitouni-telecom.dz
            </a>
          </div>

          <nav className="footer__links" aria-label="Boutique">
            <h3>Boutique</h3>
            <ul>
              {BOUTIQUE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} viewTransition>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__links" aria-label="Aide et services">
            <h3>Aide &amp; services</h3>
            <ul>
              {SERVICE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} viewTransition>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__links" aria-label="Mon espace">
            <h3>Mon espace</h3>
            <ul>
              {ESPACE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} viewTransition>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="demo-note footer__demo">
            <span aria-hidden="true">◆</span>
            <span>
              Prototype de démonstration — produits, prix et visuels sont
              présentés à titre d'illustration. Le paiement et le suivi de
              commande ne sont pas encore branchés.
            </span>
          </p>

          <p className="footer__copyright">
            © {new Date().getFullYear()} Zitouni Telecom. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
