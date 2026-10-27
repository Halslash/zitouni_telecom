import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useWilaya } from '../context/WilayaContext';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';
import { lockAppInert, unlockAppInert } from '../lib/appInert';
import { trapTabKey } from '../lib/focusTrap';
import {
  DELIVERY_ZONES,
  filterWilayas,
  getDeliveryEstimate,
} from '../data/wilayas';
import {
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  MapPinIcon,
  SearchIcon,
} from './Icons';
import './WilayaSelector.css';

interface WilayaSelectorProps {
  variant?: 'compact' | 'field';
  label?: string;
  className?: string;
}

export function WilayaSelector({
  variant = 'compact',
  label = 'Livraison vers',
  className,
}: WilayaSelectorProps) {
  const { wilaya, setWilaya } = useWilaya();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const groupName = useId();

  const results = useMemo(() => filterWilayas(query), [query]);
  const estimate = getDeliveryEstimate(wilaya);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const underlay = document.querySelector<HTMLElement>('.menu-drawer');
    const underlayWasInert = underlay?.hasAttribute('inert') ?? false;
    underlay?.setAttribute('inert', '');
    lockBodyScroll();
    lockAppInert();

    const focusTimer = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 30);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      trapTabKey(event, dialogRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
      unlockAppInert();
      if (underlay && !underlayWasInert) underlay.removeAttribute('inert');
      previouslyFocused?.focus?.();
    };
  }, [open]);

  const chooseWilaya = (code: string) => {
    const next = filterWilayas('').find((item) => item.code === code);
    if (next) {
      setWilaya(next);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`wilaya-selector wilaya-selector--${variant}${
          className ? ` ${className}` : ''
        }`}
        onClick={() => {
          setQuery('');
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label} ${wilaya.name}. Choisir une wilaya de livraison`}
      >
        <span className="wilaya-selector__icon" aria-hidden="true">
          <MapPinIcon size={15} />
        </span>
        <span className="wilaya-selector__text">
          <span className="wilaya-selector__label">{label}</span>{' '}
          <span className="wilaya-selector__value">{wilaya.name}</span>
        </span>
        <ChevronDownIcon size={14} className="wilaya-selector__chevron" />
      </button>

      {open &&
        createPortal(
          <div
            className="wilaya-modal"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div
              ref={dialogRef}
              className="wilaya-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
            >
              <div className="wilaya-dialog__head">
                <div>
                  <h2 id={titleId} className="wilaya-dialog__title">
                    Choisir votre wilaya
                  </h2>
                  <p id={descriptionId} className="wilaya-dialog__desc">
                    58 wilayas desservies. Sélectionnez votre zone de livraison.
                  </p>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer la sélection de wilaya"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              <div className="wilaya-dialog__search">
                <SearchIcon size={17} className="wilaya-dialog__search-icon" />
                <label htmlFor={`${groupName}-search`} className="visually-hidden">
                  Rechercher une wilaya
                </label>
                <input
                  ref={searchRef}
                  id={`${groupName}-search`}
                  className="input wilaya-dialog__input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher par nom ou code…"
                  autoComplete="off"
                />
              </div>

              <p className="wilaya-dialog__count" aria-live="polite">
                {results.length} wilaya{results.length > 1 ? 's' : ''} trouvée
                {results.length > 1 ? 's' : ''}
              </p>

              <div
                className="wilaya-list"
                role="radiogroup"
                aria-label="Wilayas disponibles"
              >
                {results.map((item) => {
                  const isSelected = item.code === wilaya.code;
                  return (
                    <label
                      key={item.code}
                      className={`wilaya-option${
                        isSelected ? ' wilaya-option--selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={groupName}
                        value={item.code}
                        checked={isSelected}
                        onChange={() => chooseWilaya(item.code)}
                        className="wilaya-option__radio"
                      />
                      <span className="wilaya-option__code" aria-hidden="true">
                        {item.code}
                      </span>
                      <span className="wilaya-option__name">{item.name}</span>
                      <span className="wilaya-option__zone">
                        {DELIVERY_ZONES[item.zone].label}
                      </span>
                      <CheckIcon
                        size={16}
                        className="wilaya-option__check"
                      />
                    </label>
                  );
                })}

                {results.length === 0 && (
                  <p className="wilaya-list__empty">
                    Aucune wilaya ne correspond à « {query} ».
                  </p>
                )}
              </div>

              <div className="wilaya-dialog__foot">
                <span>
                  {wilaya.name} · {estimate.zoneLabel} — estimation{' '}
                  {estimate.label}
                </span>
                <span>Frais calculés à la commande</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
