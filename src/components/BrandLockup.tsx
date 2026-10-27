import { Link } from './AppLink';
import './BrandLockup.css';

interface BrandLockupProps {
  inverse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDescriptor?: boolean;
  onClick?: () => void;
  viewTransition?: boolean;
}

export default function BrandLockup({
  inverse = false,
  size = 'md',
  showDescriptor = true,
  onClick,
  viewTransition = true,
}: BrandLockupProps) {
  return (
    <Link
      to="/"
      className={`brand-lockup brand-lockup--${size}${
        inverse ? ' brand-lockup--inverse' : ''
      }`}
      aria-label="Zitouni Telecom — Accueil"
      onClick={onClick}
      viewTransition={viewTransition}
    >
      <span className="brand-lockup__mark">
        <img
          src="/brand/zitouni-mark-160.jpg"
          alt=""
          width="44"
          height="44"
          loading="eager"
        />
      </span>
      <span className="brand-lockup__type" aria-hidden="true">
        <span className="brand-lockup__name">Zitouni</span>{' '}
        <span className="brand-lockup__descriptor">
          {showDescriptor ? 'Telecom' : 'Électronique'}
        </span>
      </span>
    </Link>
  );
}
