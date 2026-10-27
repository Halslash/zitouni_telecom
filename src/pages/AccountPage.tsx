import { Link } from '../components/AppLink';
import { WilayaSelector } from '../components/WilayaSelector';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useWilaya } from '../context/WilayaContext';
import { getDeliveryEstimate } from '../data/wilayas';
import { formatItemCount } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  ChevronRightIcon,
  HeartIcon,
  InfoIcon,
  PackageIcon,
  ShieldCheckIcon,
  SupportIcon,
  TruckIcon,
} from '../components/Icons';
import './AccountPage.css';

const FUTURE_FEATURES = [
  {
    icon: PackageIcon,
    title: 'Suivi de commande',
    copy: 'Retrouvez chaque commande, son statut et son numéro de suivi au même endroit.',
  },
  {
    icon: TruckIcon,
    title: 'Adresses enregistrées',
    copy: 'Enregistrez vos adresses de livraison pour commander plus vite la prochaine fois.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garanties et retours',
    copy: 'Consultez les garanties actives et lancer une demande de retour en quelques clics.',
  },
];

export default function AccountPage() {
  usePageTitle('Mon compte');

  const { state } = useCart();
  const wishlist = useWishlist();
  const { wilaya } = useWilaya();
  const estimate = getDeliveryEstimate(wilaya);

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="account-page">
      <section className="page-hero account-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">Mon compte</span>
          </nav>

          <span className="eyebrow">Espace client</span>
          <h1 className="page-hero__title">Mon compte</h1>
          <p className="page-hero__desc">
            Vos favoris, votre panier et votre wilaya de livraison restent
            accessibles sans inscription. Les comptes clients arriveront avec la
            mise en service de la boutique.
          </p>
        </div>
      </section>

      <section className="section account-body">
        <div className="container account-layout">
          <div className="account-main">
            <div className="account-banner" role="note">
              <span className="account-banner__icon" aria-hidden="true">
                <InfoIcon size={19} />
              </span>
              <div>
                <h2>Pas encore de compte, et c'est volontaire</h2>
                <p>
                  Ce prototype ne propose ni inscription, ni connexion. Aucun
                  mot de passe n'est demandé et aucune donnée personnelle n'est
                  collectée. Vous pouvez déjà préparer votre sélection et
                  vérifier les délais de livraison.
                </p>
                <Link to="/aide#contact" className="section-link">
                  Poser une question
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
            </div>

            <section
              className="account-panel"
              aria-labelledby="account-preferences-title"
            >
              <div className="account-panel__head">
                <div>
                  <span className="eyebrow eyebrow--plain">
                    Sur cet appareil
                  </span>
                  <h2 id="account-preferences-title">
                    Vos préférences locales
                  </h2>
                </div>
                <span className="badge badge--soft">Sans inscription</span>
              </div>

              <p className="account-panel__intro">
                Ces informations sont mémorisées dans votre navigateur
                uniquement. Elles nous permettent d'estimer la livraison et de
                conserver votre panier entre deux visites.
              </p>

              <div className="account-prefs">
                <WilayaSelector
                  variant="field"
                  label="Wilaya de livraison"
                />

                <dl className="account-stats">
                  <div>
                    <dt>Favoris</dt>
                    <dd>{wishlist.count}</dd>
                  </div>
                  <div>
                    <dt>Panier</dt>
                    <dd>{itemCount}</dd>
                  </div>
                  <div>
                    <dt>Délai</dt>
                    <dd className="account-stats__text">{estimate.label}</dd>
                  </div>
                </dl>
              </div>

              <p className="account-panel__delivery">
                <TruckIcon size={15} />
                {wilaya.name} · {estimate.zoneLabel} — livraison estimée sous{' '}
                {estimate.label}.
              </p>

              <p className="demo-note">
                <InfoIcon size={14} />
                Vous pouvez effacer ces données à tout moment en vidant votre
                panier et vos favoris, ou via les réglages de votre navigateur.
              </p>
            </section>

            <section
              className="account-panel"
              aria-labelledby="account-future-title"
            >
              <div className="account-panel__head">
                <div>
                  <span className="eyebrow eyebrow--plain">Prochainement</span>
                  <h2 id="account-future-title">
                    Ce que votre compte apportera
                  </h2>
                </div>
              </div>

              <ul className="account-future">
                {FUTURE_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.title}>
                      <span className="account-future__icon">
                        <Icon size={18} />
                      </span>
                      <div>
                        <h3>{feature.title}</h3>
                        <p>{feature.copy}</p>
                      </div>
                      <span className="badge badge--neutral">À venir</span>
                    </li>
                  );
                })}
              </ul>

              <p className="demo-note">
                <InfoIcon size={14} />
                Ces fonctionnalités nécessitent un serveur et une base de
                données. Ils ne font pas partie de cette version de
                démonstration.
              </p>
            </section>
          </div>

          <aside className="account-side">
            <div className="account-side__card">
              <h2>Accès rapides</h2>
              <ul className="account-links">
                <li>
                  <Link to="/favoris">
                    <HeartIcon size={16} />
                    <span>Mes favoris</span>
                    <span className="account-links__count">
                      {wishlist.count}
                    </span>
                    <ChevronRightIcon size={15} />
                  </Link>
                </li>
                <li>
                  <Link to="/panier">
                    <PackageIcon size={16} />
                    <span>Mon panier</span>
                    <span className="account-links__count">{itemCount}</span>
                    <ChevronRightIcon size={15} />
                  </Link>
                </li>
                <li>
                  <Link to="/aide#livraison">
                    <TruckIcon size={16} />
                    <span>Livraison &amp; délais</span>
                    <ChevronRightIcon size={15} />
                  </Link>
                </li>
                <li>
                  <Link to="/aide#garantie">
                    <ShieldCheckIcon size={16} />
                    <span>Garantie &amp; retours</span>
                    <ChevronRightIcon size={15} />
                  </Link>
                </li>
              </ul>
              <p className="account-side__caption">
                {formatItemCount(itemCount)} dans votre panier
              </p>
            </div>

            <div className="account-side__card account-side__card--dark on-dark">
              <span className="eyebrow">Conseil avant achat</span>
              <h2>Un doute sur un modèle ?</h2>
              <p>
                Expliquez votre usage et votre budget : nous vous aidons à
                choisir sans vous pousser vers l'option la plus chère.
              </p>
              <Link to="/aide#contact" className="btn btn--light btn--sm">
                <SupportIcon size={15} />
                Nous écrire
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
