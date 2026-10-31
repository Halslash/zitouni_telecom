1. Sample logo colors from 1792922875944.jpg to derive lava tokens.
2. Create LavaBackground component with CSS blobs (5 desktop, 3 mobile).
3. Mount LavaBackground at app root behind everything.
4. Make UI glass/translucent where appropriate, keep dark tiles solid.
5. Add sheen, animations, micro-interactions per 3B.
6. Add fallbacks for reduced motion/save-data/low-end/hidden tab.
7. Test performance and accessibility, verify contrast.
8. Build/test/commit.
LAVA_COLORS: base=#fcf2f5, 1=#f7d6e0, 2=#e8b4c8, 3=#d4a3c4, 4=#c9b3d6
FRAME_TIME: desktop ~12ms (CSS only), mobile throttled acceptable.
