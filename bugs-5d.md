---
# Bugs 5d - Diagnosis

## 1) Flyout disappears when moving into panel
- Current implementation: NavFlyout rendered separately; mouseenter/mouseleave on trigger and panel are independent. Gap between header/nav and panel, and close timer not shared across region. Also on blur/focus may close.
- Root cause: hover region not unified (bar + panel). Need wrapper with shared hover state, close delay cancelled on panel enter, padding bridge if gap exists.

## 2) Carousel issues
- Transform-based track, overflow clipping, no native scroll-snap with proper alignment to container, images may not render/position correctly.
- Need native horizontal scroller with scroll-snap, first slide aligned to gutter/container, peek of next tile.

## 3) Header hamburger at desktop
- Current CSS shows .header-icon-btn--menu visible; need to hide at >=1120px and ensure nav centered.
