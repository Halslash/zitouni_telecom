import { useEffect, useId, useState } from 'react';
import { MinusIcon, PlusIcon } from './Icons';
import './QuantityStepper.css';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  size = 'md',
}: QuantityStepperProps) {
  const inputId = useId();
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    const parsed = Number.parseInt(draft, 10);
    const next = Number.isFinite(parsed) ? clamp(parsed, min, max) : min;
    setDraft(String(next));
    onChange(next);
  };

  return (
    <div className={`quantity quantity--${size}`}>
      <button
        type="button"
        className="quantity__button"
        onClick={() => onChange(clamp(value - 1, min, max))}
        disabled={value <= min}
        aria-label={`Diminuer la quantité pour ${label}`}
      >
        <MinusIcon size={15} />
      </button>

      <label htmlFor={inputId} className="visually-hidden">
        Quantité pour {label}
      </label>
      <input
        id={inputId}
        className="quantity__input"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        aria-label={`Quantité pour ${label}`}
      />

      <button
        type="button"
        className="quantity__button"
        onClick={() => onChange(clamp(value + 1, min, max))}
        disabled={value >= max}
        aria-label={`Augmenter la quantité pour ${label}`}
      >
        <PlusIcon size={15} />
      </button>
    </div>
  );
}
