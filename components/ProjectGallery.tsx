import Image from "next/image";
import { galleryImages } from "@/lib/gallery";

type GalleryItem = {
  key: string;
  title: string;
  caption: string;
};

type ProjectGalleryProps = {
  items: GalleryItem[];
};

const layoutClasses = {
  featured:
    "col-span-2 row-span-2 min-h-[280px] md:min-h-[460px]",
  standard: "col-span-1 min-h-[200px] md:min-h-[220px]",
  wide: "col-span-2 min-h-[200px] md:min-h-[240px]",
} as const;

export function ProjectGallery({ items }: ProjectGalleryProps) {
  const itemMap = Object.fromEntries(items.map((item) => [item.key, item]));

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {galleryImages.map((image) => {
        const item = itemMap[image.key];
        if (!item) return null;

        return (
          <figure
            key={image.key}
            className={`group relative overflow-hidden border border-border bg-surface ${layoutClasses[image.layout]}`}
          >
            <Image
              src={image.src}
              alt={item.title}
              fill
              sizes={
                image.layout === "featured"
                  ? "(max-width: 768px) 100vw, 50vw"
                  : image.layout === "wide"
                    ? "(max-width: 768px) 100vw, 50vw"
                    : "(max-width: 768px) 50vw, 25vw"
              }
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-accent">
                {item.caption}
              </p>
              <p className="mt-1 font-display text-lg font-medium text-text md:text-xl">
                {item.title}
              </p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
