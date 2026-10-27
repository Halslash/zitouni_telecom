import type { ReactNode } from 'react';
import { Link } from '../components/AppLink';
import CategoryCard from '../components/CategoryCard';
import FeaturedStory from '../components/FeaturedStory';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import { WilayaSelector } from '../components/WilayaSelector';
import { useWilaya } from '../context/WilayaContext';
import {
  categories,
  getFeaturedProducts,
  getGamingProducts,
  getLaptopProducts,
  getProductsByCategory,
  type Category,
} from '../data/products';
import { DELIVERY_ZONES, getDeliveryEstimate } from '../data/wilayas';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  MapPinIcon,
} from '../components/Icons';
import './HomePage.css';

const CATEGORY_SIZES: Record<
  Category,
  'feature' | 'wide' | 'compact'
> = {
  smartphones: 'feature',
  laptops: 'wide',
  gaming: 'wide',
  tablets: 'compact',
  accessories: 'compact',
};

function BandHead({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  id: string;
}) {
  return (
    <Reveal className="home-band__head">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </Reveal>
  );
}

export default function HomePage() {
  usePageTitle();
  const { wilaya } = useWilaya();
  const estimate = getDeliveryEstimate(wilaya);
  const featuredProducts = getFeaturedProducts(4);
  const laptopFeature = getLaptopProducts()[0];
  const gamingFeature = getGamingProducts()[0];
  const essentialProduct = getProductsByCategory('accessories')[0];

  return (
    <>
      <Hero />

      <section
        id="categories"
        className="home-band home-band--deep home-categories on-dark"
        aria-labelledby="categories-title"
      >
        <div className="container">
          <BandHead
            id="categories-title"
            eyebrow="Rayons"
            title="Tout l'univers tech, rangé avec soin."
            description="Cinq familles de produits, une même exigence."
          />

          <Reveal className="home-categories__grid" stagger>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                size={CATEGORY_SIZES[category.id]}
                className={`home-categories__tile home-categories__tile--${category.id}`}
              />
            ))}
          </Reveal>

          <div className="home-band__foot">
            <Link to="/produits" className="home-band__link" viewTransition>
              Toute la boutique
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-band home-band--light home-featured"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <BandHead
            id="featured-title"
            eyebrow="Sélection de la rédaction"
            title="La sélection du moment."
            description="Des références retenues pour leur usage, leur fiabilité et la justesse de leur prix."
          />

          <Reveal
            className="product-grid home-featured__grid"
            stagger
           
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>

          <div className="home-band__foot">
            <Link to="/produits" className="home-band__link" viewTransition>
              Tout comparer
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FeaturedStory />

      <section
        className="home-band home-band--light home-editorial"
        aria-labelledby="computers-title"
      >
        <div className="container home-feature">
          <BandHead
            id="computers-title"
            eyebrow="Ordinateurs"
            title="Une machine pour chaque ambition."
            description="De l'ultraportable pour les études à la station de création."
          />

          {laptopFeature && (
            <Reveal className="home-feature__media">
              <Link
                to={`/produit/${laptopFeature.id}`}
                className="home-feature__link"
                aria-label={`Découvrir ${laptopFeature.name}`}
                viewTransition
              >
                <ProductImage
                  src={laptopFeature.image}
                  alt={laptopFeature.name}
                  category={laptopFeature.category}
                  view={1}
                />
              </Link>
            </Reveal>
          )}

          <div className="home-band__foot">
            <Link to="/ordinateurs" className="home-band__link" viewTransition>
              Explorer les ordinateurs
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-band home-band--deep home-gaming on-dark"
        aria-labelledby="gaming-title"
      >
        <div className="container home-feature">
          <BandHead
            id="gaming-title"
            eyebrow="Gaming"
            title="De la puissance, encore de la puissance."
            description="Consoles nouvelle génération, choisies pour tenir la distance."
          />

          {gamingFeature && (
            <Reveal
              className="home-feature__media home-feature__media--wide"
             
            >
              <Link
                to={`/produit/${gamingFeature.id}`}
                className="home-feature__link"
                aria-label={`Découvrir ${gamingFeature.name}`}
                viewTransition
              >
                <ProductImage
                  src={gamingFeature.image}
                  alt={gamingFeature.name}
                  category={gamingFeature.category}
                />
              </Link>
            </Reveal>
          )}

          <div className="home-band__foot">
            <Link to="/gaming" className="home-band__link" viewTransition>
              Tout le gaming
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-band home-band--light home-promo"
        aria-labelledby="essential-title"
      >
        <div className="container home-feature">
          <BandHead
            id="essential-title"
            eyebrow="L'essentiel"
            title="Parfois, le nécessaire suffit."
            description="Un nom, un prix, un visuel : la fiche produit s'adapte à chaque référence, sans section superflue."
          />

          {essentialProduct && (
            <Reveal
              className="home-feature__media home-feature__media--portrait"
             
            >
              <Link
                to={`/produit/${essentialProduct.id}`}
                className="home-feature__link"
                aria-label={`Découvrir ${essentialProduct.name}`}
                viewTransition
              >
                <ProductImage
                  src={essentialProduct.image}
                  alt={essentialProduct.name}
                  category={essentialProduct.category}
                />
              </Link>
            </Reveal>
          )}

          <div className="home-band__foot">
            <Link to="/accessoires" className="home-band__link" viewTransition>
              Voir tous les accessoires
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-band home-band--deep home-delivery on-dark"
        aria-labelledby="delivery-title"
      >
        <div className="container">
          <BandHead
            id="delivery-title"
            eyebrow="Livraison"
            title="Livré chez vous, partout en Algérie."
            description="Choisissez votre wilaya : le délai estimé s'ajuste automatiquement."
          />

          <Reveal className="home-delivery__panel">
            <div className="home-delivery__zones">
              <span className="home-delivery__label">Zones desservies</span>
              <ul>
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
                  className="home-band__link home-band__link--sm"
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
