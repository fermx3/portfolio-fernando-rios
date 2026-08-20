"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectImage } from "@/types/project";

interface ProjectGalleryProps {
  images: ProjectImage[];
  title: string;
}

interface NormalizedImage {
  src: string;
  type: "mobile" | "web";
  alt?: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const t = useTranslations("projects");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Plain strings default to "web"; objects declare their own orientation.
  const items = useMemo<NormalizedImage[]>(
    () =>
      images.map((img) =>
        typeof img === "string"
          ? { src: img, type: "web" }
          : { src: img.src, type: img.type ?? "web", alt: img.alt }
      ),
    [images]
  );

  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);

  const goTo = useCallback(
    (index: number) => {
      setOpenIndex((current) =>
        current === null ? current : (index + items.length) % items.length
      );
    },
    [items.length]
  );

  const prev = useCallback(() => {
    setOpenIndex((current) =>
      current === null ? current : (current - 1 + items.length) % items.length
    );
  }, [items.length]);

  const next = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : (current + 1) % items.length));
  }, [items.length]);

  // Keyboard navigation + body scroll lock while the lightbox is open
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, prev, next]);

  if (!items.length) return null;

  const hasMultiple = items.length > 1;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight mb-4">{t("project.gallery")}</h2>

      <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            className={`group relative overflow-hidden rounded-lg border border-border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              item.type === "mobile" ? "aspect-[9/16]" : "aspect-video"
            }`}
            aria-label={t("project.galleryImageLabel", {
              current: index + 1,
              total: items.length,
            })}
          >
            <ImageWithPlaceholder
              src={item.src}
              alt={item.alt ?? `${title} — ${index + 1}`}
              placeholderSeed={item.src}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t("project.gallery")}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("project.galleryClose")}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-6 w-6" />
            </button>

            {hasMultiple && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label={t("project.galleryPrevious")}
                className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={openIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative h-[80vh] w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageWithPlaceholder
                  key={items[openIndex].src}
                  src={items[openIndex].src}
                  alt={items[openIndex].alt ?? `${title} — ${openIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  placeholderClassName="rounded-lg bg-white/5"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {hasMultiple && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label={t("project.galleryNext")}
                className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}

            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {items.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goTo(index);
                    }}
                    aria-label={t("project.galleryImageLabel", {
                      current: index + 1,
                      total: items.length,
                    })}
                    className={`h-2 rounded-full transition-all ${
                      index === openIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
