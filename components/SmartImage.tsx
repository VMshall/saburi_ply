"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper that preserves the legacy LazyImage API (§8) so call sites barely change:
 * skeleton while loading, 700ms fade-in, error fallback, aspectRatio, objectFit. Adds the CLS
 * guard that next/image needs for string srcs — pass EITHER explicit `width`+`height`, OR use
 * `fill` / `aspectRatio` with a sized wrapper. `priority` marks the LCP image (the hero).
 *
 * All imagery is local (/images/*), so next.config needs no remotePatterns.
 */
export type SmartImageProps = {
  src: string;
  alt: string;
  /** Applied to the wrapper div. */
  className?: string;
  /** "16/9", "3/4" … → fill mode against a sized wrapper. */
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  /** Explicit intrinsic size (non-fill). Omit both → fill mode. */
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function SmartImage({
  src,
  alt,
  className,
  aspectRatio,
  objectFit = "cover",
  width,
  height,
  fill,
  priority,
  sizes,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const useFill = fill ?? (!!aspectRatio || !width || !height);

  const imageClassName = cn(
    "transition-opacity duration-700 ease-in-out",
    objectFit === "contain" ? "object-contain" : "object-cover",
    loaded ? "opacity-100" : "opacity-0",
  );

  return (
    <div
      className={cn("relative overflow-hidden bg-gray-100", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 bg-gray-200 animate-pulse" aria-hidden="true" />
      )}

      {!error &&
        (useFill ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes ?? "100vw"}
            priority={priority}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={imageClassName}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width!}
            height={height!}
            sizes={sizes}
            priority={priority}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={cn(imageClassName, "h-auto w-full")}
          />
        ))}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}
