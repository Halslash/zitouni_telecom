import { Link } from '../components/AppLink';
import {
  CATEGORY_PATHS,
  categories,
  getCategoryCount,
} from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  SupportIcon,
} from '../components/Icons';
import './NotFoundPage.css';

export default function NotFoundPage() {
  usePageTitle('Page introuvable');

  return (
    <div className="not-found-page">
      <section className="not-found on-dark" aria-labelledby="not-found-title">
        <div className="not-found__texture" aria-hidden="true" />

        <div className="container not-found__inner">
          <div className="not-found__copy">
            <span className="not-found__code" aria-hidden="true">
              404
            </span>
            <span className="eyebrow">Page introuvable</span>
            <h1 id="not-found-title">Cette page a changé de rayon.</h1>
            <p className="not-found__desc">
              Le lien est peut-être obsolète, ou l'adresse contient une petite
              erreur. Le catalogue, lui, est toujours à portée de main.
            </p>

            <div className="not-found__actions">
              <Link to="/" className="btn btn--light btn--lg">
                Retour à l'accueil
                <ArrowRightIcon size={17} />
              </Link>
              <Link
                to="/produits"
                className="btn btn--outline-light btn--lg"
              >
                Parcourir la boutique
              </Link>
            </div>
          </div>

          <div className="not-found__panel">
            <h2>Continuer par catégorie</h2>
            <ul className="not-found__links">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={CATEGORY_PATHS[category.id]}>
                    <span>{category.name}</span>
                    <span className="not-found__count">
                      {getCategoryCount(category.id)}
                    </span>
                    <ChevronRightIcon size={16} />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="not-found__help">
              <SupportIcon size={17} />
              <p>
                Besoin d'un coup de main ?{' '}
                <Link to="/aide#contact">Contactez-nous</Link> ou consultez la{' '}
                <Link to="/aide#faq">FAQ</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
