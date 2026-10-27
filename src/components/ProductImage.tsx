import { useEffect, useId, useState, type ReactNode } from 'react';
import type { Category } from '../data/products';
import './ProductImage.css';

const CATEGORY_LABELS: Record<Category, string> = {
  smartphones: 'Téléphones',
  laptops: 'Ordinateurs',
  tablets: 'Tablettes',
  gaming: 'Gaming',
  accessories: 'Accessoires',
};

const ACCENTS: Record<
  Category,
  { from: string; to: string; edge: string; pale: string }
> = {
  smartphones: {
    from: '#e0448d',
    to: '#4d2475',
    edge: '#f6c2da',
    pale: '#fbe4f0',
  },
  laptops: {
    from: '#7b45a8',
    to: '#240812',
    edge: '#dcc9ed',
    pale: '#f0e9f7',
  },
  tablets: {
    from: '#b4135e',
    to: '#451023',
    edge: '#f6c2da',
    pale: '#fcf5f8',
  },
  gaming: {
    from: '#cc1e71',
    to: '#340b1b',
    edge: '#ee7caf',
    pale: '#fbe8ed',
  },
  accessories: {
    from: '#8b2450',
    to: '#241920',
    edge: '#e7c9d6',
    pale: '#f8f4f6',
  },
};

interface ArtIds {
  frame: string;
  screen: string;
  glow: string;
  shadow: string;
  glass: string;
  screenClip: string;
}

interface ScreenRect {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
}

function useArtIds(uid: string): ArtIds {
  return {
    frame: `zt-frame-${uid}`,
    screen: `zt-screen-${uid}`,
    glow: `zt-glow-${uid}`,
    shadow: `zt-shadow-${uid}`,
    glass: `zt-glass-${uid}`,
    screenClip: `zt-screen-clip-${uid}`,
  };
}

function ArtDefs({
  ids,
  accent,
  screen,
}: {
  ids: ArtIds;
  accent: { from: string; to: string; edge: string; pale: string };
  screen: ScreenRect;
}) {
  return (
    <defs>
      <linearGradient id={ids.frame} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f4efed" />
        <stop offset="0.28" stopColor="#bfb6b6" />
        <stop offset="0.5" stopColor="#efe9e7" />
        <stop offset="0.72" stopColor="#9c9296" />
        <stop offset="1" stopColor="#ded5d5" />
      </linearGradient>
      <linearGradient id={ids.screen} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor={accent.from} />
        <stop offset="0.48" stopColor={accent.to} />
        <stop offset="1" stopColor="#150b12" />
      </linearGradient>
      <radialGradient id={ids.glow} cx="0.5" cy="0.45" r="0.55">
        <stop offset="0" stopColor={accent.from} stopOpacity="0.65" />
        <stop offset="0.55" stopColor={accent.from} stopOpacity="0.16" />
        <stop offset="1" stopColor={accent.from} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ids.glass} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.34" />
        <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <filter
        id={ids.shadow}
        x="-40%"
        y="-40%"
        width="180%"
        height="190%"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="0"
          dy="12"
          stdDeviation="11"
          floodColor="#240812"
          floodOpacity="0.26"
        />
      </filter>
      <clipPath id={ids.screenClip}>
        <rect
          x={screen.x}
          y={screen.y}
          width={screen.width}
          height={screen.height}
          rx={screen.radius}
        />
      </clipPath>
    </defs>
  );
}

function ScreenWallpaper({
  ids,
  screen,
}: {
  ids: ArtIds;
  screen: ScreenRect;
}) {
  const cx = screen.x + screen.width / 2;
  const cy = screen.y + screen.height / 2;
  const unit = Math.min(screen.width, screen.height);

  return (
    <>
      <rect
        x={screen.x}
        y={screen.y}
        width={screen.width}
        height={screen.height}
        fill={`url(#${ids.screen})`}
      />
      <ellipse
        cx={cx + screen.width * 0.2}
        cy={cy - screen.height * 0.12}
        rx={screen.width * 0.72}
        ry={screen.height * 0.54}
        fill={`url(#${ids.glow})`}
      />
      <circle
        cx={screen.x + screen.width * 0.22}
        cy={screen.y + screen.height * 0.76}
        r={unit * 0.34}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.14"
        strokeWidth="1"
      />
      <circle
        cx={screen.x + screen.width * 0.22}
        cy={screen.y + screen.height * 0.76}
        r={unit * 0.24}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
      <text
        x={cx}
        y={screen.y + screen.height * 0.64}
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.13"
        fontFamily="Sora, sans-serif"
        fontSize={unit * 0.54}
        fontWeight="700"
        letterSpacing={-unit * 0.04}
      >
        Z
      </text>
    </>
  );
}

const PHONE_SCREEN: ScreenRect = {
  x: 117,
  y: 41,
  width: 86,
  height: 198,
  radius: 18,
};
const TABLET_SCREEN: ScreenRect = {
  x: 88,
  y: 59,
  width: 138,
  height: 184,
  radius: 9,
};
const LAPTOP_SCREEN: ScreenRect = {
  x: 70,
  y: 58,
  width: 180,
  height: 112,
  radius: 4,
};

type ArtIdsAccent = { from: string; to: string; edge: string; pale: string };

function PhoneArt({ ids, accent }: { ids: ArtIds; accent: ArtIdsAccent }) {
  return (
    <>
      <ellipse
        cx="160"
        cy="268"
        rx="72"
        ry="8"
        fill="#240812"
        opacity="0.16"
      />
      <g filter={`url(#${ids.shadow})`}>
        <rect
          x="111"
          y="35"
          width="98"
          height="210"
          rx="23"
          fill={`url(#${ids.frame})`}
          stroke="#7f7377"
          strokeWidth="0.7"
        />
        <rect
          x="117"
          y="41"
          width="86"
          height="198"
          rx="18"
          fill="#160c12"
        />
        <g clipPath={`url(#${ids.screenClip})`}>
          <ScreenWallpaper ids={ids} screen={PHONE_SCREEN} />
          <ellipse
            cx="148"
            cy="150"
            rx="102"
            ry="100"
            fill="none"
            stroke={accent.edge}
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <rect
            x="140"
            y="50"
            width="40"
            height="11"
            rx="5.5"
            fill="#0b0709"
          />
          <rect
            x="145"
            y="54"
            width="20"
            height="3"
            rx="1.5"
            fill="#3a2d34"
            opacity="0.7"
          />
          <rect
            x="142"
            y="231"
            width="36"
            height="2.5"
            rx="1.25"
            fill="#ffffff"
            opacity="0.42"
          />
          <path
            d="M117 41 L203 41 L203 118 C168 154 134 143 117 110 Z"
            fill={`url(#${ids.glass})`}
          />
        </g>
        <rect
          x="208"
          y="92"
          width="2.6"
          height="30"
          rx="1.3"
          fill="#a89da1"
        />
        <rect
          x="208"
          y="131"
          width="2.6"
          height="44"
          rx="1.3"
          fill="#a89da1"
        />
        <rect
          x="110"
          y="88"
          width="2.6"
          height="24"
          rx="1.3"
          fill="#a89da1"
        />
      </g>
      <path
        d="M236 78c11 6 16 15 16 27"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </>
  );
}

function TabletArt({ ids, accent }: { ids: ArtIds; accent: ArtIdsAccent }) {
  return (
    <>
      <ellipse
        cx="157"
        cy="262"
        rx="92"
        ry="9"
        fill="#240812"
        opacity="0.16"
      />
      <g filter={`url(#${ids.shadow})`}>
        <rect
          x="82"
          y="53"
          width="150"
          height="196"
          rx="15"
          fill={`url(#${ids.frame})`}
          stroke="#7f7377"
          strokeWidth="0.7"
        />
        <rect
          x="88"
          y="59"
          width="138"
          height="184"
          rx="9"
          fill="#160c12"
        />
        <g clipPath={`url(#${ids.screenClip})`}>
          <ScreenWallpaper ids={ids} screen={TABLET_SCREEN} />
          <ellipse
            cx="158"
            cy="158"
            rx="121"
            ry="80"
            fill="none"
            stroke={accent.edge}
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <circle cx="157" cy="69" r="2.2" fill="#4d2475" />
          <path
            d="M88 59 L226 59 L226 132 C185 169 133 152 88 112 Z"
            fill={`url(#${ids.glass})`}
          />
        </g>
      </g>
      <g filter={`url(#${ids.shadow})`}>
        <rect
          x="241"
          y="82"
          width="7"
          height="124"
          rx="3.5"
          fill={`url(#${ids.frame})`}
          stroke="#7f7377"
          strokeWidth="0.5"
        />
        <path d="M241 206 L248 206 L245.5 219 Z" fill="#9c9296" />
        <rect
          x="242.5"
          y="88"
          width="1"
          height="110"
          rx="0.5"
          fill="#ffffff"
          opacity="0.55"
        />
      </g>
    </>
  );
}

function LaptopArt({ ids, accent }: { ids: ArtIds; accent: ArtIdsAccent }) {
  return (
    <>
      <ellipse
        cx="160"
        cy="240"
        rx="114"
        ry="10"
        fill="#240812"
        opacity="0.17"
      />
      <g filter={`url(#${ids.shadow})`}>
        <rect
          x="64"
          y="52"
          width="192"
          height="128"
          rx="9"
          fill={`url(#${ids.frame})`}
          stroke="#7f7377"
          strokeWidth="0.7"
        />
        <rect
          x="70"
          y="58"
          width="180"
          height="112"
          rx="4"
          fill="#160c12"
        />
        <g clipPath={`url(#${ids.screenClip})`}>
          <ScreenWallpaper ids={ids} screen={LAPTOP_SCREEN} />
          <ellipse
            cx="160"
            cy="154"
            rx="152"
            ry="62"
            fill="none"
            stroke={accent.edge}
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <path
            d="M70 58 L250 58 L250 122 C198 160 128 141 70 108 Z"
            fill={`url(#${ids.glass})`}
          />
        </g>
        <circle cx="160" cy="54" r="1.4" fill="#6f6368" />
        <path
          d="M48 192 L272 192 L286 213 Q288 219 280 219 L40 219 Q32 219 34 213 Z"
          fill={`url(#${ids.frame})`}
          stroke="#8c8185"
          strokeWidth="0.6"
        />
        <path
          d="M58 196 L262 196 L266 202 L54 202 Z"
          fill="#2b1b23"
          opacity="0.48"
        />
        {[0, 1, 2, 3].map((row) => (
          <rect
            key={row}
            x={92 + row * 2}
            y={181 + row * 4}
            width={136 - row * 4}
            height="1.1"
            rx="0.55"
            fill="#5d4a53"
            opacity="0.55"
          />
        ))}
        <rect
          x="146"
          y="204"
          width="28"
          height="9"
          rx="1.6"
          fill="#6f6368"
          opacity="0.38"
        />
      </g>
      <path
        d="M64 172 L256 172"
        stroke="#ffffff"
        strokeOpacity="0.2"
        strokeWidth="0.8"
      />
    </>
  );
}

function GamingArt({ ids, accent }: { ids: ArtIds; accent: ArtIdsAccent }) {
  return (
    <>
      <ellipse
        cx="160"
        cy="270"
        rx="70"
        ry="9"
        fill="#240812"
        opacity="0.2"
      />
      <g filter={`url(#${ids.shadow})`}>
        <path
          d="M132 49 C112 59 102 82 105 108 L105 216 C105 237 120 251 138 253 L138 62 C138 54 136 49 132 49 Z"
          fill="#f4efed"
          stroke="#cfc4c4"
          strokeWidth="0.6"
        />
        <path
          d="M188 49 C208 59 218 82 215 108 L215 216 C215 237 200 251 182 253 L182 62 C182 54 184 49 188 49 Z"
          fill="#f4efed"
          stroke="#cfc4c4"
          strokeWidth="0.6"
        />
        <rect
          x="132"
          y="44"
          width="56"
          height="214"
          rx="14"
          fill="#1a0e15"
          stroke="#3a2733"
          strokeWidth="0.8"
        />
        <rect
          x="140"
          y="68"
          width="4"
          height="150"
          rx="2"
          fill={accent.from}
          opacity="0.95"
        />
        <rect
          x="140"
          y="68"
          width="4"
          height="150"
          rx="2"
          fill={accent.edge}
          opacity="0.45"
        />
        <rect
          x="176"
          y="68"
          width="2"
          height="150"
          rx="1"
          fill="#ffffff"
          opacity="0.16"
        />
        <text
          x="165"
          y="128"
          textAnchor="middle"
          fill="#ffffff"
          fillOpacity="0.18"
          fontFamily="Sora, sans-serif"
          fontSize="22"
          fontWeight="700"
        >
          Z
        </text>
        <rect
          x="122"
          y="255"
          width="76"
          height="5"
          rx="2.5"
          fill="#2b1b23"
        />
        <path
          d="M105 82 C105 126 105 170 105 214"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="1.1"
        />
      </g>
      <g
        transform="rotate(-14 233 224)"
        filter={`url(#${ids.shadow})`}
        opacity="0.97"
      >
        <path
          d="M210 212 C216 201 229 198 240 201 C249 197 260 202 262 212 L265 232 C266 241 258 246 251 240 L244 231 L230 231 L223 240 C216 246 208 241 209 232 Z"
          fill="#241920"
          stroke="#4c3742"
          strokeWidth="0.7"
        />
        <circle cx="228" cy="216" r="5" fill="#3a2733" />
        <circle cx="247" cy="218" r="4" fill="#3a2733" />
        <circle cx="228" cy="216" r="1.8" fill={accent.edge} opacity="0.9" />
        <circle cx="247" cy="218" r="1.4" fill={accent.from} opacity="0.9" />
      </g>
    </>
  );
}

function AccessoriesArt({
  ids,
  accent,
}: {
  ids: ArtIds;
  accent: ArtIdsAccent;
}) {
  return (
    <>
      <ellipse
        cx="160"
        cy="260"
        rx="86"
        ry="9"
        fill="#240812"
        opacity="0.17"
      />
      <g filter={`url(#${ids.shadow})`}>
        <path
          d="M98 168 C98 88 122 64 160 64 C198 64 222 88 222 168"
          fill="none"
          stroke={`url(#${ids.frame})`}
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M110 168 C110 100 126 79 160 79 C194 79 210 100 210 168"
          fill="none"
          stroke={accent.to}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.48"
        />
        <rect x="95" y="146" width="26" height="58" rx="12" fill="#241920" />
        <rect x="199" y="146" width="26" height="58" rx="12" fill="#241920" />
        <rect
          x="102"
          y="154"
          width="12"
          height="42"
          rx="6"
          fill={`url(#${ids.frame})`}
        />
        <rect
          x="206"
          y="154"
          width="12"
          height="42"
          rx="6"
          fill={`url(#${ids.frame})`}
        />
        <rect
          x="76"
          y="168"
          width="48"
          height="71"
          rx="20"
          fill="#291a22"
          stroke="#4f3945"
          strokeWidth="0.7"
        />
        <rect
          x="196"
          y="168"
          width="48"
          height="71"
          rx="20"
          fill="#291a22"
          stroke="#4f3945"
          strokeWidth="0.7"
        />
        <ellipse
          cx="100"
          cy="203"
          rx="15"
          ry="24"
          fill="#1c1117"
          stroke={accent.to}
          strokeOpacity="0.5"
          strokeWidth="0.8"
        />
        <ellipse
          cx="220"
          cy="203"
          rx="15"
          ry="24"
          fill="#1c1117"
          stroke={accent.to}
          strokeOpacity="0.5"
          strokeWidth="0.8"
        />
        <ellipse cx="100" cy="203" rx="8" ry="16" fill={accent.from} opacity="0.22" />
        <ellipse cx="220" cy="203" rx="8" ry="16" fill={accent.from} opacity="0.22" />
        <path
          d="M100 170 C89 184 88 222 100 236"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
      </g>
      <g transform="translate(232 236)" filter={`url(#${ids.shadow})`}>
        <rect
          x="0"
          y="0"
          width="44"
          height="30"
          rx="10"
          fill="#f4efed"
          stroke="#cfc4c4"
          strokeWidth="0.6"
        />
        <rect x="7" y="7" width="30" height="2" rx="1" fill="#9c9296" opacity="0.7" />
        <circle cx="22" cy="20" r="2.4" fill={accent.from} opacity="0.75" />
      </g>
    </>
  );
}

function DeviceArt({
  category,
  view,
}: {
  category: Category;
  view: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = useArtIds(uid);
  const accent = ACCENTS[category];

  let content: ReactNode;
  let screen = PHONE_SCREEN;

  switch (category) {
    case 'smartphones':
      content = <PhoneArt ids={ids} accent={accent} />;
      break;
    case 'laptops':
      screen = LAPTOP_SCREEN;
      content = <LaptopArt ids={ids} accent={accent} />;
      break;
    case 'tablets':
      screen = TABLET_SCREEN;
      content = <TabletArt ids={ids} accent={accent} />;
      break;
    case 'gaming':
      content = <GamingArt ids={ids} accent={accent} />;
      break;
    case 'accessories':
      content = <AccessoriesArt ids={ids} accent={accent} />;
      break;
  }

  return (
    <svg
      className={`product-art product-art--view-${view % 3}`}
      viewBox="0 0 320 320"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <ArtDefs ids={ids} accent={accent} screen={screen} />
      {content}
    </svg>
  );
}

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: Category;
  className?: string;
  priority?: boolean;
  /** Selects one of three framings for gallery thumbnails. */
  view?: number;
}

/**
 * One intentional product-visual system for the whole storefront.
 * Real photography is layered on top when it loads; otherwise the
 * branded technical illustration remains visible. No broken images,
 * no empty boxes, no per-product placeholder sprawl.
 */
export default function ProductImage({
  src,
  alt,
  category = 'accessories',
  className,
  priority = false,
  view = 0,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  const decorative = alt.trim().length === 0;

  return (
    <div
      className={`product-visual product-visual--${category}${
        className ? ` ${className}` : ''
      }`}
      data-category={category}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `${alt} — visuel de démonstration`}
      aria-hidden={decorative || undefined}
    >
      <span className="product-visual__watermark" aria-hidden="true">
        Z
      </span>
      <span className="product-visual__rings" aria-hidden="true" />
      <span className="product-visual__category" aria-hidden="true">
        {CATEGORY_LABELS[category]}
      </span>
      <span className="product-visual__art" aria-hidden="true">
        <DeviceArt category={category} view={view} />
      </span>
      <span className="product-visual__meta" aria-hidden="true">
        <span>Zitouni</span>
        <span>Édition 2026</span>
      </span>

      {src && !failed && (
        <img
          src={src}
          alt=""
          className={`product-visual__photo${loaded ? ' is-loaded' : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
