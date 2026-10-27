import { Link } from '../components/AppLink';
import { WilayaSelector } from '../components/WilayaSelector';
import { useWilaya } from '../context/WilayaContext';
import {
  DELIVERY_ZONES,
  WILAYAS,
  getDeliveryEstimate,
  type DeliveryZone,
} from '../data/wilayas';
import { usePageTitle } from '../lib/usePageTitle';
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CreditCardIcon,
  HeadphonesIcon,
  InfoIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  SupportIcon,
  TruckIcon,
} from '../components/Icons';
import './HelpPage.css';

const TOC_ITEMS = [
  { id: 'livraison', label: 'Livraison' },
  { id: 'paiement', label: 'Paiement' },
  { id: 'garantie', label: 'Garantie & retours' },
  { id: 'faq', label: 'Questions fréquentes' },
  { id: 'contact', label: 'Nous contacter' },
  { id: 'apropos', label: 'Notre approche' },
];

const ZONE_ORDER: DeliveryZone[] = ['north', 'highlands', 'south'];

const ZONE_NOTES: Record<DeliveryZone, string> = {
  north: 'Littoral et grandes villes du nord.',
  highlands: 'Hauts plateaux et villes intérieures.',
  south: 'Grand Sud et wilayas sahariennes.',
};

const DELIVERY_STEPS = [
  {
    title: 'Commande confirmée',
    copy: "Nous vérifions la disponibilité et préparons le colis avec son accessoire d'origine.",
  },
  {
    title: 'Expédition suivie',
    copy: 'Le colis est remis au transporteur avec un numéro de suivi communiqué par message.',
  },
  {
    title: 'Réception et contrôle',
    copy: 'Vous ouvrez le colis devant le livreur et réglez uniquement après vérification.',
  },
];

const WARRANTY_ITEMS = [
  {
    icon: ShieldCheckIcon,
    title: 'Garantie constructeur',
    copy: '24 mois sur les produits neufs, selon les conditions du fabricant. La facture fait foi.',
  },
  {
    icon: PackageIcon,
    title: 'Retour sous 7 jours',
    copy: "Produit non ouvert, complet et dans son emballage d'origine. Les frais de retour sont indiqués avant l'envoi.",
  },
  {
    icon: SupportIcon,
    title: 'SAV en Algérie',
    copy: 'Diagnostic et prise en charge localement, sans renvoi à l’étranger pour les marques couvertes.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Livrez-vous dans les 58 wilayas ?',
    answer:
      'Oui. La livraison est assurée à domicile ou en point relais dans les 58 wilayas. Le délai indicatif dépend de votre zone : 24 à 48 h au nord, 48 à 72 h sur les hauts plateaux et 72 à 96 h dans le Grand Sud.',
  },
  {
    question: 'Puis-je payer en espèces à la réception ?',
    answer:
      "Le paiement à la livraison est le mode prévu pour la mise en service : vous réglez au livreur, après avoir vérifié le colis. Aucun numéro de carte n'est demandé sur ce prototype et aucun paiement n'y est traité.",
  },
  {
    question: 'Les produits sont-ils neufs et authentiques ?',
    answer:
      "Oui. Chaque produit est neuf, scellé et accompagné de sa garantie constructeur. Les fiches indiquent la marque, les caractéristiques et la disponibilité, sans note ni avis inventés.",
  },
  {
    question: 'Comment suivre ma commande ?',
    answer:
      "Le suivi de commande n'est pas encore disponible dans cette démonstration : aucune commande réelle n'est créée. Il arrivera avec l'espace client et la mise en service du paiement.",
  },
  {
    question: 'Puis-je modifier ou annuler ma commande ?',
    answer:
      "Tant que le colis n'a pas été remis au transporteur, une modification reste possible. Écrivez-nous avec votre numéro de commande dès que possible ; nous confirmons la prise en compte par retour de message.",
  },
  {
    question: 'Les prix affichés sont-ils définitifs ?',
    answer:
      'Les prix sont affichés en dinars algériens (DZD), toutes taxes comprises. Les frais de livraison s’ajoutent selon la wilaya et le mode choisi ; ils sont confirmés avant la validation de la commande.',
  },
];

export default function HelpPage() {
  usePageTitle('Aide & services');

  const { wilaya } = useWilaya();
  const estimate = getDeliveryEstimate(wilaya);

  return (
    <div className="help-page">
      <section className="page-hero help-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d'Ariane">
            <Link to="/">Accueil</Link>
            <span className="breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">Aide &amp; services</span>
          </nav>

          <span className="eyebrow">Aide &amp; services</span>
          <h1 className="page-hero__title">Acheter en toute confiance</h1>
          <p className="page-hero__desc">
            Livraison, paiement, garantie et retours : voici comment nous
            travaillons, sans petites lignes ni promesses floues.
          </p>

          <div className="page-hero__meta">
            <span>
              <MapPinIcon size={15} />
              58 wilayas desservies
            </span>
            <span>
              <TruckIcon size={15} />
              Livraison sous 24 à 96 h
            </span>
            <span>
              <ShieldCheckIcon size={15} />
              Garantie officielle 24 mois
            </span>
          </div>
        </div>
      </section>

      <section className="section help-body">
        <div className="container help-layout">
          <aside className="help-aside">
            <div className="help-toc">
              <p className="help-toc__title">Sommaire</p>
              <nav aria-label="Sommaire de l'aide">
                <ul>
                  {TOC_ITEMS.map((item, index) => (
                    <li key={item.id}>
                      <Link to={`#${item.id}`} viewTransition={false}>
                        <span className="help-toc__index" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="help-aside__card">
              <span className="help-aside__icon">
                <HeadphonesIcon size={19} />
              </span>
              <h2>Une question précise ?</h2>
              <p>
                Écrivez-nous avec le modèle qui vous intéresse : nous répondons
                sous 24 h ouvrées.
              </p>
              <a
                href="mailto:contact@zitouni-telecom.dz"
                className="btn btn--outline btn--sm btn--block"
              >
                Écrire un message
              </a>
            </div>
          </aside>

          <div className="help-content">
            <section
              id="livraison"
              className="help-section"
              aria-labelledby="help-livraison-title"
            >
              <header className="help-section__head">
                <span className="help-section__index" aria-hidden="true">
                  01
                </span>
                <div>
                  <h2 id="help-livraison-title">Livraison</h2>
                  <p>
                    Nous expédions partout en Algérie, à domicile ou en point
                    relais. Le délai dépend de votre zone, pas du montant de la
                    commande.
                  </p>
                </div>
              </header>

              <div className="help-delivery">
                <WilayaSelector variant="field" label="Estimer vers" />
                <div className="help-delivery__estimate">
                  <span className="help-delivery__label">
                    Votre estimation
                  </span>
                  <strong>{wilaya.name}</strong>
                  <span className="help-delivery__line">
                    <TruckIcon size={15} />
                    {estimate.zoneLabel} · sous {estimate.label}
                  </span>
                </div>
              </div>

              <div className="help-table-wrap">
                <table className="help-table">
                  <caption className="visually-hidden">
                    Délais de livraison indicatifs par zone
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Zone</th>
                      <th scope="col">Wilayas</th>
                      <th scope="col">Délai indicatif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ZONE_ORDER.map((zone) => {
                      const meta = DELIVERY_ZONES[zone];
                      const count = WILAYAS.filter(
                        (item) => item.zone === zone
                      ).length;
                      return (
                        <tr key={zone}>
                          <th scope="row">
                            <span className="help-table__zone">
                              {meta.label}
                            </span>
                            <span className="help-table__note">
                              {ZONE_NOTES[zone]}
                            </span>
                          </th>
                          <td>{count}</td>
                          <td>
                            {meta.minDays * 24}–{meta.maxDays * 24}&nbsp;h
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ol className="help-steps">
                {DELIVERY_STEPS.map((step, index) => (
                  <li key={step.title}>
                    <span className="help-steps__num" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </li>
                ))}
              </ol>

              <p className="demo-note">
                <InfoIcon size={14} />
                Les frais de livraison sont calculés selon la wilaya et le mode
                choisi. Ils sont confirmés avant la validation finale de la
                commande.
              </p>
            </section>

            <section
              id="paiement"
              className="help-section"
              aria-labelledby="help-paiement-title"
            >
              <header className="help-section__head">
                <span className="help-section__index" aria-hidden="true">
                  02
                </span>
                <div>
                  <h2 id="help-paiement-title">Paiement</h2>
                  <p>
                    Un principe simple : vous ne payez qu'une fois le produit
                    reçu et vérifié. Aucune carte n'est demandée sur ce
                    prototype.
                  </p>
                </div>
              </header>

              <div className="help-options">
                <article className="help-option">
                  <span className="help-option__icon">
                    <TruckIcon size={19} />
                  </span>
                  <div>
                    <span className="badge badge--success">Mode prévu</span>
                    <h3>Paiement à la livraison</h3>
                    <p>
                      Vous réglez en espèces au livreur, après ouverture du
                      colis et vérification du contenu. La facture est remise
                      avec le produit.
                    </p>
                  </div>
                </article>

                <article className="help-option">
                  <span className="help-option__icon">
                    <CreditCardIcon size={19} />
                  </span>
                  <div>
                    <span className="badge badge--neutral">À venir</span>
                    <h3>Paiement en ligne</h3>
                    <p>
                      Le paiement par carte sera activé avec la boutique
                      complète. Il nécessitera une passerelle bancaire sécurisée
                      et ne sera jamais stocké sur nos serveurs.
                    </p>
                  </div>
                </article>
              </div>

              <div className="help-check">
                <h3>Bon à savoir</h3>
                <ul>
                  <li>
                    <CheckIcon size={15} />
                    Aucun acompte n'est demandé à la commande.
                  </li>
                  <li>
                    <CheckIcon size={15} />
                    Le colis peut être ouvert devant le livreur.
                  </li>
                  <li>
                    <CheckIcon size={15} />
                    Un refus de conformité ne donne lieu à aucun paiement.
                  </li>
                </ul>
              </div>

              <p className="demo-note">
                <InfoIcon size={14} />
                Prototype de démonstration : le bouton « Passer la commande »
                n'effectue aucun paiement et ne crée aucune réservation.
              </p>
            </section>

            <section
              id="garantie"
              className="help-section"
              aria-labelledby="help-garantie-title"
            >
              <header className="help-section__head">
                <span className="help-section__index" aria-hidden="true">
                  03
                </span>
                <div>
                  <h2 id="help-garantie-title">Garantie &amp; retours</h2>
                  <p>
                    Chaque produit est neuf et couvert. Si quelque chose ne va
                    pas, nous cherchons d'abord la solution la plus simple.
                  </p>
                </div>
              </header>

              <div className="help-warranty">
                {WARRANTY_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="help-warranty__card">
                      <span className="help-warranty__icon">
                        <Icon size={19} />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </article>
                  );
                })}
              </div>

              <div className="help-procedure">
                <h3>Signaler un problème</h3>
                <ol>
                  <li>
                    <span>1</span>
                    Écrivez-nous avec le numéro de commande et une description
                    du problème.
                  </li>
                  <li>
                    <span>2</span>
                    Nous confirmons l'éligibilité et organisons le diagnostic au
                    centre agréé le plus proche.
                  </li>
                  <li>
                    <span>3</span>
                    Réparation, échange ou remboursement selon le diagnostic et
                    la garantie applicable.
                  </li>
                </ol>
                <p>
                  Les dommages accidentels, l'usure normale et les interventions
                  hors réseau ne sont pas couverts.
                </p>
              </div>
            </section>

            <section
              id="faq"
              className="help-section"
              aria-labelledby="help-faq-title"
            >
              <header className="help-section__head">
                <span className="help-section__index" aria-hidden="true">
                  04
                </span>
                <div>
                  <h2 id="help-faq-title">Questions fréquentes</h2>
                  <p>
                    Les réponses aux questions que l'on nous pose le plus
                    souvent avant une commande.
                  </p>
                </div>
              </header>

              <div className="help-faq">
                {FAQ_ITEMS.map((item) => (
                  <details key={item.question} className="help-faq__item">
                    <summary>
                      <span>{item.question}</span>
                      <ChevronDownIcon
                        size={18}
                        className="help-faq__chevron"
                      />
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section
              id="contact"
              className="help-section"
              aria-labelledby="help-contact-title"
            >
              <header className="help-section__head">
                <span className="help-section__index" aria-hidden="true">
                  05
                </span>
                <div>
                  <h2 id="help-contact-title">Nous contacter</h2>
                  <p>
                    Une vraie personne lit les messages. Décrivez votre besoin,
                    votre budget et la wilaya de livraison pour une réponse
                    utile du premier coup.
                  </p>
                </div>
              </header>

              <div className="help-contact">
                <div className="help-contact__main">
                  <span className="eyebrow">Conseil &amp; service client</span>
                  <h3>Écrivez-nous, nous répondons.</h3>
                  <p>
                    Disponible du samedi au jeudi, de 9 h à 18 h. Réponse sous
                    24 h ouvrées, hors jours fériés.
                  </p>
                  <div className="help-contact__actions">
                    <a
                      href="mailto:contact@zitouni-telecom.dz"
                      className="btn btn--light"
                    >
                      contact@zitouni-telecom.dz
                      <ArrowRightIcon size={16} />
                    </a>
                    <Link to="/aide#faq" className="btn btn--outline-light">
                      Consulter la FAQ
                    </Link>
                  </div>
                </div>

                <ul className="help-contact__details">
                  <li>
                    <HeadphonesIcon size={17} />
                    <div>
                      <strong>Conseil avant achat</strong>
                      <span>Choix du modèle, compatibilité, budget.</span>
                    </div>
                  </li>
                  <li>
                    <TruckIcon size={17} />
                    <div>
                      <strong>Suivi de livraison</strong>
                      <span>Délais, adresse, point relais.</span>
                    </div>
                  </li>
                  <li>
                    <ShieldCheckIcon size={17} />
                    <div>
                      <strong>Garantie &amp; retours</strong>
                      <span>Diagnostic, échange, remboursement.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </section>

            <section
              id="apropos"
              className="help-section"
              aria-labelledby="help-apropos-title"
            >
              <header className="help-section__head">
                <span className="help-section__index" aria-hidden="true">
                  06
                </span>
                <div>
                  <h2 id="help-apropos-title">Notre approche</h2>
                  <p>
                    Une sélection resserrée, des fiches lisibles et un
                    accompagnement humain : la technologie doit rester simple à
                    comprendre.
                  </p>
                </div>
              </header>

              <div className="help-about">
                <div className="help-about__copy">
                  <p>
                    Zitouni Telecom est une maison algérienne dédiée à
                    l'électronique du quotidien. Nous choisissons les modèles
                    pour ce qu'ils apportent réellement — autonomie, robustesse,
                    facilité de réparation — plutôt que pour remplir un
                    catalogue.
                  </p>
                  <p>
                    Notre identité reprend les tons profonds du logo : un vin
                    profond, un fuchsia vif et un violet discret. La même
                    exigence s'applique à la boutique : des prix lisibles, des
                    informations vérifiables et aucune fausse urgence.
                  </p>
                  <Link to="/produits" className="section-link">
                    Explorer la sélection
                    <ArrowRightIcon size={15} />
                  </Link>
                </div>

                <ul className="help-about__values">
                  <li>
                    <span>Transparence</span>
                    Prix en dinars, disponibilité réelle et caractéristiques
                    complètes.
                  </li>
                  <li>
                    <span>Sélection</span>
                    Peu de références, mais des modèles que nous assumons.
                  </li>
                  <li>
                    <span>Proximité</span>
                    Un service client joignable, en français et en arabe.
                  </li>
                </ul>
              </div>

              <p className="demo-note">
                <InfoIcon size={14} />
                Ce site est un prototype de démonstration. Les produits, prix et
                engagements de service y sont présentés à titre d'illustration.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
