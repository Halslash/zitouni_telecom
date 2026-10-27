import type { ComponentType } from 'react';
import { Link } from '../components/AppLink';
import CategoryCard from '../components/CategoryCard';
import FeaturedStory from '../components/FeaturedStory';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { WilayaSelector } from '../components/WilayaSelector';
import { useWilaya } from '../context/WilayaContext';
import {
  categories,
  getGamingProducts,
  getLaptopProducts,
  getSaleProducts,
  products,
  type Category,
  type Product,
} from '../data/products';
import { DELIVERY_ZONES, getDeliveryEstimate } from '../data/wilayas';
import { formatPrice } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CreditCardIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SupportIcon,
  TruckIcon,
  type IconProps,
} from '../components/Icons';
import './HomePage.css';

const FEATURED_IDS = [
  'iphone-16-pro-max',
  'macbook-pro-16-m4',
  'samsung-galaxy-s25-ultra',
  'ps5-pro',
];

const FEATURED_PRODUCTS = FEATURED_IDS.map((id) =>
  products.find((product) => product.id === id)
).filter((product): product is Product => Boolean(product));

const CATEGORY_SIZES: Record<
  Category,
  'feature' | 'wide' | 'compact'
> = {
  smartphones: 'feature',
  laptops: 'compact',
  tablets: 'wide',
  gaming: 'wide',
  accessories: 'compact',
};

interface Service {
  icon: ComponentType<IconProps>;
  title: string;
  copy: string;
}

const SERVICES: Service[] = [
  {
    icon: TruckIcon,
    title: 'Livraison en 58 wilayas',
    copy: 'À domicile ou en point relais, sous 24 à 72 h.',
  },
  {
    icon: CreditCardIcon,
    title: 'Paiement à la livraison',
    copy: 'Réglez à la réception, après vérification du colis.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Garantie officielle',
    copy: 'Produits neufs, scellés et couverts 24 mois.',
  },
  {
    icon: SupportIcon,
    title: 'Conseil avant achat',
    copy: 'Une équipe qui compare avec vous, sans précipitation.',
  },
];

export default function HomePage() {
  usePageTitle();
  const { wilaya } = useWilaya();
  const estimate = getDeliveryEstimate(wilaya);
  const promoProducts = getSaleProducts().slice(0, 2);
  const laptopProducts = getLaptopProducts();
  const gamingProducts = getGamingProducts();
  const laptopFeature = laptopProducts.find(
    (product) => product.id === 'macbook-pro-16-m4'
  );

  return (
    <>
      <Hero />

      <section className="home-services" aria-labelledby="services-title">
        <div className="container">
          <h2 id="services-title" className="visually-hidden">
            Nos engagements
          </h2>
          <Reveal
            as="ul"
            className="home-services__grid"
            stagger
            distance={18}
          >
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <li key={service.title} className="home-services__item">
                  <span className="home-services__icon" aria-hidden="true">
                    <Icon size={21} strokeWidth={1.65} />
                  </span>
                  <div className="home-services__copy">
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                  </div>
                </li>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section
        id="categories"
        className="section home-categories"
        aria-labelledby="categories-title"
      >
        <div className="container">
          <SectionHeader
            id="categories-title"
            eyebrow="Rayons"
            title="Tout l'univers tech, rangé avec soin."
            description="Cinq familles de produits, une même exigence : des références utiles, disponibles et expliquées simplement."
            link={{ to: '/produits', label: 'Toute la boutique' }}
          />

          <Reveal className="home-categories__grid" stagger distance={24}>
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                size={CATEGORY_SIZES[category.id]}
                className={`home-categories__tile home-categories__tile--${category.id}`}
              />
            ))}
          </Reveal>
        </div>
      </section>

      <FeaturedStory />

      <section
        className="section section--surface home-featured"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <SectionHeader
            id="featured-title"
            eyebrow="Sélection de la rédaction"
            title="Quatre références qui méritent le détour."
            description="Des produits retenus pour leur fiabilité, leur usage au quotidien et la justesse de leur prix."
            link={{ to: '/produits', label: 'Tout comparer' }}
          />

          <Reveal
            className="product-grid home-featured__grid"
            stagger
            distance={20}
          >
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="home-promo on-dark"
        aria-labelledby="promo-title"
      >
        <div className="container">
          <div className="home-promo__panel">
            <Reveal className="home-promo__copy" distance={22}>
              <span className="eyebrow">Offres de la semaine</span>
              <h2 id="promo-title" className="home-promo__title">
                Les prix baissent.
                <br />
                <span>Pas les standards.</span>
              </h2>
              <p className="home-promo__lead">
                Des remises réelles sur des produits neufs et garantis.
                Les quantités sont limitées, pas les précautions.
              </p>

              <ul className="home-promo__points">
                <li>
                  <CheckIcon size={15} />
                  Produits scellés, garantie constructeur
                </li>
                <li>
                  <CheckIcon size={15} />
                  Prix affichés en dinars, sans surprise
                </li>
                <li>
                  <CheckIcon size={15} />
                  Stock mis à jour sur chaque fiche
                </li>
              </ul>

              <Link
                to="/promotions"
                className="btn btn--light"
                viewTransition
              >
                Voir toutes les promotions
                <ArrowRightIcon size={16} />
              </Link>
            </Reveal>

            <Reveal
              className="home-promo__products"
              stagger
              distance={22}
            >
              {promoProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  tone="dark"
                />
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section
        className="section home-editorial"
        aria-labelledby="computers-title"
      >
        <div className="container">
          <Reveal className="home-editorial__inner" stagger distance={24}>
            {laptopFeature && (
              <Link
                to={`/produit/${laptopFeature.id}`}
                className="home-editorial__visual"
                aria-label={`Découvrir ${laptopFeature.name}`}
                viewTransition
              >
                <div className="home-editorial__frame">
                  <span className="home-editorial__tag">
                    Station de travail
                  </span>
                  <ProductImage
                    src={laptopFeature.image}
                    alt={laptopFeature.name}
                    category={laptopFeature.category}
                    view={1}
                  />
                </div>

                <div className="home-editorial__caption">
                  <span className="home-editorial__brand">
                    {laptopFeature.brand}
                  </span>
                  <strong className="home-editorial__name">
                    {laptopFeature.name}
                  </strong>
                  <span className="home-editorial__price">
                    {formatPrice(laptopFeature.price)}
                  </span>
                </div>

                <span className="home-editorial__go" aria-hidden="true">
                  <ArrowUpRightIcon size={19} />
                </span>
              </Link>
            )}

            <div className="home-editorial__copy">
              <span className="eyebrow">Ordinateurs</span>
              <h2 id="computers-title">
                Une machine pour chaque ambition.
              </h2>
              <p>
                De l'ultraportable pour les études à la station de création
                capable de monter en 4K. Nous partons de votre usage, pas de
                la fiche technique.
              </p>

              <ul className="home-editorial__list">
                <li>
                  <span className="home-editorial__check" aria-hidden="true">
                    <CheckIcon size={13} />
                  </span>
                  <div>
                    <strong>Étudier et travailler</strong>
                    <p>Autonomie, légèreté et écrans confortables.</p>
                  </div>
                </li>
                <li>
                  <span className="home-editorial__check" aria-hidden="true">
                    <CheckIcon size={13} />
                  </span>
                  <div>
                    <strong>Créer sans ralentir</strong>
                    <p>Puissance graphique et stockage pour les gros projets.</p>
                  </div>
                </li>
                <li>
                  <span className="home-editorial__check" aria-hidden="true">
                    <CheckIcon size={13} />
                  </span>
                  <div>
                    <strong>Jouer sans compromis</strong>
                    <p>Écrans rapides, refroidissement et GPU dédiés.</p>
                  </div>
                </li>
              </ul>

              <div className="home-editorial__actions">
                <Link
                  to="/ordinateurs"
                  className="btn btn--primary"
                  viewTransition
                >
                  Explorer les ordinateurs
                  <ArrowRightIcon size={16} />
                </Link>
                <span className="home-editorial__count">
                  {laptopProducts.length} configurations disponibles
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="section section--wine home-gaming on-dark"
        aria-labelledby="gaming-title"
      >
        <div className="container">
          <SectionHeader
            id="gaming-title"
            eyebrow="Gaming"
            title="De la puissance, encore de la puissance."
            description="Consoles nouvelle génération et équipements choisis pour tenir la distance, manette en main."
            link={{ to: '/gaming', label: 'Tout le gaming' }}
          />

          <Reveal
            className="product-grid product-grid--3 home-gaming__grid"
            stagger
            distance={20}
          >
            {gamingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                tone="dark"
              />
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="section home-delivery"
        aria-labelledby="delivery-title"
      >
        <div className="container">
          <Reveal className="home-delivery__panel" distance={22}>
            <div className="home-delivery__copy">
              <span className="eyebrow">Livraison</span>
              <h2 id="delivery-title">
                Livré chez vous, partout en Algérie.
              </h2>
              <p>
                Choisissez votre wilaya : le délai estimé s'ajuste
                automatiquement. Aucune adresse n'est demandée à cette étape.
              </p>

              <ul className="home-delivery__zones">
                {Object.values(DELIVERY_ZONES).map((zone) => (
                  <li key={zone.label}>
                    <span>{zone.label}</span>
                    <strong>
                      {zone.minDays * 24}–{zone.maxDays * 24} h
                    </strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="home-delivery__card">
              <WilayaSelector variant="field" label="Livraison vers" />

              <dl className="home-delivery__estimate">
                <div>
                  <dt>Zone</dt>
                  <dd>{estimate.zoneLabel}</dd>
                </div>
                <div>
                  <dt>Délai estimé</dt>
                  <dd>{estimate.label}</dd>
                </div>
                <div>
                  <dt>Frais de livraison</dt>
                  <dd>Confirmés à la commande</dd>
                </div>
              </dl>

              <div className="home-delivery__foot">
                <span className="home-delivery__wilaya">
                  <MapPinIcon size={15} />
                  {wilaya.code} · {wilaya.name}
                </span>
                <Link
                  to="/aide#livraison"
                  className="section-link"
                  viewTransition
                >
                  Détails de livraison
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
