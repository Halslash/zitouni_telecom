PART 1 DONE: src/styles/tokens.css, src/styles/fonts.css, index.html, src/components/Stage.tsx, src/components/Stage.css (pnpm add/remove @fontsource/instrument-serif, woff2 copied to public/fonts)
PART 2 DONE: src/components/Header.tsx, Header.css, HeaderNav.tsx, HeaderNav.css, NavFlyout.tsx, NavFlyout.css (new: SearchPalette.tsx/.css, MiniCart.tsx/.css); styles/global.css scroll-padding
PART 1 DONE: src/components/LavaBackground.tsx (WebGL1 metaball shader, adaptive quality, CSS/static fallback), LavaBackground.css
PART 2 DONE: src/styles/tokens.css (Inter-only roles, glass/elevation), src/styles/global.css (focus ring, selection, pill buttons, typography), src/components/Layout.tsx (magnetic primary), src/lib/format.ts (fr typography + DA), Stage.tsx/.css, ProductCard.css
PART 3 DONE: src/components/Header.tsx/.css, HeaderNav.tsx/.css, NavFlyout.tsx/.css, SearchPalette.tsx/.css, MiniCart.tsx/.css (island header + progress, sliding indicator, flyout preview, command palette, mini-cart, drawer accordion)
PART 4 DONE: src/pages/HomePage.tsx/.css (hero+hotspots, brands, bento, rail, pinned story, spotlight, delivery), src/components/Footer.tsx/.css (cropped wordmark)
PART 5 DONE: src/pages/ProductDetailPage.tsx/.css (sticky stage, availability, bands, specs accordion, related rail, mobile buy bar), src/components/CartToast.tsx/.css, src/lib/morph.ts, src/components/Layout.tsx + global.css (morph), ProductCard/DeviceStrip/NavFlyout morph sources, src/pages/CartPage.tsx/.css
PART 6 DONE: src/components/LineReveal.tsx/.css, src/lib/perf.ts, Layout.tsx (perf guard), Stage.tsx/.css (sheen, tilt guard, perf removals), LavaBackground.tsx (blob degradation), Footer.css + CartToast.css (44px targets), styles/global.css (page-hero scrim, morph, reveal 800ms), tokens.css (--t-reveal 800ms), Reveal.tsx (22px), pages: HomePage/ProductDetailPage/CartPage/AccountPage/HelpPage/WishlistPage/CategoryPage/ProductsPage

## Audit (this session)
| Item | Status |
|---|---|
| Lava WebGL shader / pointer / scroll / intro / adaptive / reduced-static / CSS fallback | DONE |
| Stage, LineReveal, MiniCart, CartToast, SearchPalette wired | DONE |
| morph.ts imported and used | PARTIAL (Layout only; verify PDP shared element) |
| perf.ts used | DONE |
| Header island, progress line, sliding indicator | DONE |
| Cart badge bump | MISSING |
| Home hero/hotspots, brands, bento, rail, spotlight, delivery/wilaya, footer wordmark | DONE |
| Product sticky stage | DONE |
| Add-to-cart flight | MISSING |
| Cart sticky summary | DONE |
| Transparent body + scrims | DONE |
Audit correction: morph.ts is wired (Layout marks source, global.css names destination stage); add-to-cart flight exists in ProductDetailPage. Badge bump added.
PART 3 DONE: src/components/Header.css (count badge bump on keyed remount + reduced-motion guard)

NEXT: none — Phase 9 audit complete, tsc/test/build green.
