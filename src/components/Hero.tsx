import { Link } from './AppLink';
import { ChevronRightIcon } from './Icons';
import Reveal from './Reveal';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <Reveal className="hero__content">
          <h1 id="hero-title" className="hero__title">
            Zitouni Telecom
          </h1>
          <p className="hero__subtitle">
            Technologie au quotidien.
          </p>
          <div className="hero__actions">
            <Link to="/produits" className="hero__cta" viewTransition>
              Découvrir
              <ChevronRightIcon size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
