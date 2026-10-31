import { useEffect, useRef } from 'react';
import './LavaBackground.css';

export default function LavaBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as any).connection?.saveData;
    const nav: any = navigator;
    const lowEnd = (nav.hardwareConcurrency || 8) <= 4 && (nav.deviceMemory || 8) <= 4;

    if (reduceMotion || saveData || lowEnd) {
      rootRef.current?.classList.add('lava-bg--static');
      return;
    }

    const onVisibility = () => {
      if (document.hidden) {
        rootRef.current?.classList.add('lava-bg--paused');
      } else {
        rootRef.current?.classList.remove('lava-bg--paused');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        document.documentElement.style.setProperty('--lava-scroll', String(y * 0.02));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={rootRef} className="lava-bg" aria-hidden="true">
      <div className="lava-bg__base" />
      <div className="lava-bg__vignette" />
      <div className="lava-bg__breath" />
      <div className="lava-bg__blobs">
        <span className="lava-blob lava-blob--1" />
        <span className="lava-blob lava-blob--2" />
        <span className="lava-blob lava-blob--3" />
        <span className="lava-blob lava-blob--4" />
        <span className="lava-blob lava-blob--5" />
      </div>
      <svg className="lava-bg__noise" width="0" height="0" aria-hidden="true">
        <filter id="lava-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="lava-bg__grain" />
    </div>
  );
}
