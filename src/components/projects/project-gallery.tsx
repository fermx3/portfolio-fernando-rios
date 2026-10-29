"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProjectImage } from "@/types/project";

interface ProjectGalleryProps {
  images: ProjectImage[];
  title: string;
  /** Anchor for the page's table of contents. */
  id?: string;
}

interface NormalizedImage {
  src: string;
  type: "mobile" | "web";
  alt?: string;
}

export function ProjectGallery({ images, title, id }: ProjectGalleryProps) {
  const t = useTranslations("projects");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Plain strings default to "web"; objects declare their own orientation.
  // Web shots come first so the lightbox walks the images in the order the two
  // grids show them.
  const items = useMemo<NormalizedImage[]>(() => {
    const normalized: NormalizedImage[] = images.map((img) =>
      typeof img === "string"
        ? { src: img, type: "web" }
        : { src: img.src, type: img.type ?? "web", alt: img.alt }
    );
    return [
      ...normalized.filter((item) => item.type === "web"),
      ...normalized.filter((item) => item.type === "mobile"),
    ];
  }, [images]);

  const isOpen = openIndex !== null;
  const dialogRef = useRef<HTMLDialogElement>(null);
  // The image stays rendered while the dialog fades out after closing.
  const [shownIndex, setShownIndex] = useState(0);
  if (openIndex !== null && openIndex !== shownIndex) setShownIndex(openIndex);

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

  // A native modal <dialog>: focus is trapped and Escape closes it (onClose
  // below). Arrows still need a listener, plus the page scroll lock.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, prev, next]);

  if (!items.length) return null;

  const hasMultiple = items.length > 1;

  return (
    // A full row of the page's Bento grid; each shot is its own module.
    <section id={id} className="reveal col-span-2 scroll-mt-24 lg:col-span-4">
      <h2 className="sr-only">{t("project.gallery")}</h2>

      {/* One grid per orientation: mixing 16:9 and 9:16 tiles leaves ragged rows. */}
      <div className="space-y-3">
        {(["web", "mobile"] as const).map((type) => {
          const group = items
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => item.type === type);
          if (!group.length) return null;

          return (
            <div
              key={type}
              className={
                type === "mobile"
                  ? `grid grid-cols-2 gap-3 ${group.length > 3 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`
                  : "grid grid-cols-1 gap-3 sm:grid-cols-2"
              }
            >
              {group.map(({ item, index }, position) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  // An odd count would strand the last desktop shot; the first one spans instead.
                  className={`group relative overflow-hidden rounded-module bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    type === "mobile" ? "aspect-[9/16]" : "aspect-video"
                  } ${type === "web" && position === 0 && group.length % 2 === 1 ? "sm:col-span-2" : ""}`}
                  aria-label={t("project.galleryImageLabel", {
                    current: index + 1,
                    total: items.length,
                  })}
                >
                  <ImageWithPlaceholder
                    src={item.src}
                    alt={item.alt ?? `${title}, ${index + 1}`}
                    placeholderSeed={item.src}
                    fill
                    sizes={
                      type === "mobile"
                        ? "(max-width: 640px) 50vw, 25vw"
                        : "(max-width: 640px) 100vw, 50vw"
                    }
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-3 rounded-full bg-card/90 px-2.5 py-1 font-mono text-xs text-card-foreground"
                  >
                    {index + 1} / {items.length}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={close}
        aria-label={t("project.gallery")}
        className="dialog-fade lightbox fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-center justify-center bg-transparent p-4 open:flex"
      >
        <button
          type="button"
          onClick={close}
          aria-label={t("project.galleryClose")}
          className="press absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
            className="press absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        {/* Keyed by index, so each new image replays the fade-in. */}
        <div
          key={shownIndex}
          className="lightbox-image relative h-[80vh] w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ImageWithPlaceholder
            key={items[shownIndex].src}
            src={items[shownIndex].src}
            alt={items[shownIndex].alt ?? `${title}, ${shownIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            placeholderClassName="rounded-lg bg-white/5"
            priority={isOpen}
          />
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label={t("project.galleryNext")}
            className="press absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
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
                  index === shownIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </dialog>
    </section>
  );
}
