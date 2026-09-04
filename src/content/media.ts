export const media = {
  hero: {
    desktop: "/media/lemark/processed/desktop/hero-v2-desktop.mp4",
    mobile: "/media/lemark/processed/mobile/hero-v2-mobile.mp4",
    posterDesktop: "/media/lemark/processed/posters/hero-v2-desktop.webp",
    posterMobile: "/media/lemark/processed/posters/hero-v2-mobile.webp",
    duration: 17.208333,
  },
  scenes: Array.from({ length: 9 }, (_, index) => {
    const names = ["raw-layers", "decor", "press", "product", "furniture", "facade", "clean-room", "transport", "final-hero"];
    const scene = String(index + 1).padStart(2, "0");
    return `/media/lemark/processed/thumbnails/scene-${scene}-${names[index]}.webp`;
  }),
} as const;
