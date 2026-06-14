export const galleryImages = [
  {
    src: "/images/gallery/moody-lounge.jpg",
    key: "lounge",
    layout: "featured",
  },
  {
    src: "/images/gallery/modern-interior.jpg",
    key: "interior",
    layout: "standard",
  },
  {
    src: "/images/gallery/pendant-lighting.jpg",
    key: "lighting",
    layout: "standard",
  },
  {
    src: "/images/gallery/restaurant-ambient.jpg",
    key: "commercial",
    layout: "wide",
  },
] as const;

export const haFeatureImage = "/images/gallery/living-dark.jpg";

export type GalleryImageKey = (typeof galleryImages)[number]["key"];
