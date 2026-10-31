import { Link } from '../components/AppLink';
import CategoryCard from '../components/CategoryCard';
import Carousel from '../components/Carousel';
import DeviceStrip from '../components/DeviceStrip';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import {
  categories,
  DISCOVERY_CATEGORY_ORDER,
  getFeaturedProducts,
  getProductsInDiscoveryOrder,
} from '../data/products';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ChevronRightIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from '../components/Icons';
import './HomePage.css';

const SERVICES = [
  {
    icon: TruckIcon,
    title: 'Livraison',
    copy: 'Dans les 58 wilayas, à domicile ou en point relais.',
  },
  {
    icon: CreditCardIcon,
    title: 'Paiement',
    copy: 'À la livraison, après vérification du colis.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garantie',
    copy: 'Constructeur 24 mois et retour sous 7 jours.',
  },
];

export default function HomePage() {
  usePageTitle();
  const featuredProducts = getFeaturedProducts(4);
  const discoveryProducts = getProductsInDiscoveryOrder();
  const orderedCategories = DISCOVERY_CATEGORY_ORDER.map((id) =>
    categories.find((category) => category.id === id)
  ).filter(Boolean) as typeof categories;

  return (
    <>
      {/* The hero titles are slide-level headings; the page keeps one stable h1. */}
      <h1 className="visually-hidden">
        Zitouni Telecom — téléphonie, informatique et accessoires à Alger
      </h1>

      <Carousel />

      <section
        className="home-discovery"
        aria-labelledby="discovery-title"
      >
        <div className="container">
          <Reveal className="home-section__head">
            <div>
              <p className="home-kicker">En vitrine</p>
              <h2 id="discovery-title">À découvrir</h2>
            </div>
            <Link to="/produits" className="text-link" viewTransition>
              Tout le catalogue
              <ChevronRightIcon size={14} />
            </Link>
          </Reveal>

          <DeviceStrip
            products={discoveryProducts}
            label="Découvrir les produits"
            context="home"
          />
        </div>
      </section>

      <section
        className="home-section home-featured"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <Reveal className="home-section__head">
            <div>
              <p className="home-kicker">Sélection</p>
              <h2 id="featured-title">Choisie pour vous</h2>
              <p className="home-section__copy">
                Une sélection courte, documentée avec les prix, les coloris et
                les caractéristiques réelles de chaque produit.
              </p>
            </div>
            <Link to="/produits" className="text-link" viewTransition>
              Voir les produits
              <ChevronRightIcon size={14} />
            </Link>
          </Reveal>

          <Reveal className="home-featured__grid" stagger>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="home-section home-categories-band"
        aria-labelledby="categories-title"
      >
        <div className="container">
          <Reveal className="home-section__head">
            <div>
              <p className="home-kicker">Rayons</p>
              <h2 id="categories-title">Trouver votre prochain produit</h2>
              <p className="home-section__copy">
                Cinq univers, une même exigence de choix et de conseil.
              </p>
            </div>
            <Link to="/produits" className="text-link" viewTransition>
              Tous les produits
              <ChevronRightIcon size={14} />
            </Link>
          </Reveal>

          <Reveal className="home-categories__grid" stagger>
            {orderedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                className={`home-categories__item home-categories__item--${category.id}`}
              />
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="home-services"
        aria-labelledby="services-title"
      >
        <div className="container home-services__inner">
          <Reveal className="home-services__intro">
            <p className="home-kicker home-kicker--light">La boutique</p>
            <h2 id="services-title">Commander en confiance</h2>
            <p>
              Des informations claires, un paiement à la réception et une
              garantie constructeur sur chaque produit.
            </p>
            <Link
              to="/aide"
              className="text-link text-link--light"
              viewTransition
            >
              Livraison, paiement et garantie
              <ChevronRightIcon size={14} />
            </Link>
          </Reveal>

          <Reveal className="home-services__list" stagger>
            {SERVICES.map((service) => {
              const ServiceIcon = service.icon;
              return (
                <div key={service.title} className="home-service">
                  <span className="home-service__icon">
                    <ServiceIcon size={20} strokeWidth={1.6} />
                  </span>
                  <span className="home-service__copy">
                    <span className="home-service__title">{service.title}</span>
                    <span className="home-service__text">{service.copy}</span>
                  </span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>
    </>
  );
}
