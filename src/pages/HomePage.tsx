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
import { ChevronRightIcon } from '../components/Icons';
import './HomePage.css';

export default function HomePage() {
  usePageTitle();
  const featuredProducts = getFeaturedProducts(6);
  const discoveryProducts = getProductsInDiscoveryOrder();
  const orderedCategories = DISCOVERY_CATEGORY_ORDER.map((id) =>
    categories.find((c) => c.id === id)
  ).filter(Boolean) as typeof categories;

  return (
    <>
      <div className="container">
        <DeviceStrip
          products={discoveryProducts}
          label="Découvrir les produits"
          context="home"
        />
      </div>

      <Carousel />

      <section
        className="home-tile home-tile--light"
        aria-labelledby="featured-title"
      >
        <div className="container">
          <Reveal className="home-tile__head">
            <h2 id="featured-title">La sélection</h2>
          </Reveal>

          <Reveal className="home-lineup" stagger>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="lineup" />
            ))}
          </Reveal>

          <div className="home-tile__foot">
            <Link to="/produits" className="text-link" viewTransition>
              Voir tout
              <ChevronRightIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="home-categories-band"
        aria-labelledby="categories-title"
      >
        <div className="container">
          <Reveal className="home-tile__head">
            <h2 id="categories-title">Catégories</h2>
            <p>Tout l'univers tech, au même endroit.</p>
          </Reveal>

          <Reveal className="home-categories-grid">
            {orderedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                className={`home-categories-grid__item home-categories-grid__item--${category.id}`}
              />
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="home-tile home-tile--dark"
        aria-labelledby="about-title"
      >
        <div className="container">
          <Reveal className="home-tile__head home-tile__head--light">
            <h2 id="about-title">Zitouni Telecom</h2>
            <p>Technologie, soin et fiabilité.</p>
          </Reveal>

          <div className="home-tile__foot">
            <Link to="/aide" className="text-link text-link--light" viewTransition>
              En savoir plus
              <ChevronRightIcon size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
