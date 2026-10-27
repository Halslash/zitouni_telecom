import { Link } from './AppLink';
import { ArrowRightIcon } from './Icons';
import Reveal from './Reveal';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: {
    to: string;
    label: string;
  };
  id?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  link,
  id,
}: SectionHeaderProps) {
  return (
    <Reveal className="section-head">
      <div className="section-head__copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>

      {link && (
        <Link to={link.to} className="section-link" viewTransition>
          {link.label}
          <ArrowRightIcon size={16} />
        </Link>
      )}
    </Reveal>
  );
}
