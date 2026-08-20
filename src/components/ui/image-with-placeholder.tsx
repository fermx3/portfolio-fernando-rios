"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";
import { cn, generatePlaceholderGradient } from "@/lib/utils";

interface ImageWithPlaceholderProps extends ImageProps {
  /**
   * Seed for the tinted placeholder — pass the project title so the colour is
   * stable across renders and identical on the server and the client. Omit it
   * to get the plain neutral cover, which is what reads well over a dark
   * backdrop like the lightbox.
   */
  placeholderSeed?: string;
  placeholderClassName?: string;
}

/**
 * `next/image` with a placeholder that holds the frame while the file travels.
 *
 * The placeholder sits *on top* of the image and fades out, rather than sitting
 * behind it and fading the image in. That ordering matters: fading the image in
 * would mean merging `transition-opacity` into the caller's className, and
 * tailwind-merge treats every `transition-*` utility as one group — it would
 * drop the `transition-transform` the cards rely on for their hover zoom.
 *
 * The caller supplies the positioned container; both layers are absolute.
 *
 * An image that fails to load keeps its cover on purpose: the tint is exactly
 * the fallback the cards already show for a project with no `coverImage`, which
 * reads better than a broken-image icon.
 */
export function ImageWithPlaceholder({
  placeholderSeed,
  placeholderClassName,
  alt,
  ...props
}: ImageWithPlaceholderProps) {
  const [loaded, setLoaded] = useState(false);

  // Revealing on `next/image`'s onLoad alone is not safe enough here: the cover
  // is stretched over the image, so a load event React never hears leaves the
  // frame covered forever — worse than showing no placeholder at all. Checking
  // `img.complete` catches the image that finished before hydration, and the
  // native listener catches the rest, without going through React's synthetic
  // event or Next's internal load bookkeeping.
  //
  // This runs as a ref callback rather than an effect so it attaches the moment
  // the element is committed, with no window in between where a load could slip
  // through unheard. React 19 runs the returned function as the cleanup.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    setLoaded(false);
    const reveal = () => setLoaded(true);
    img.addEventListener("load", reveal);
    return () => img.removeEventListener("load", reveal);
  }, []);

  return (
    <>
      {/* `alt` is destructured rather than spread so jsx-a11y can see it. */}
      <Image {...props} alt={alt} ref={imgRef} />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-muted transition-opacity duration-500 motion-reduce:transition-none",
          loaded ? "opacity-0" : "opacity-100",
          placeholderClassName
        )}
      >
        {placeholderSeed && (
          <div
            className="h-full w-full opacity-20"
            style={{ backgroundImage: generatePlaceholderGradient(placeholderSeed) }}
          />
        )}
      </div>
    </>
  );
}
