import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; // Assuming utils exists, if not I will adjust

/**
 * LazyImage Component
 * 
 * A wrapper around the native <img> tag that provides:
 * 1. Native lazy loading via loading="lazy"
 * 2. Visual skeleton/placeholder while loading
 * 3. Smooth fade-in animation once loaded
 * 4. Error handling fallback
 * 
 * Usage:
 * <LazyImage src="/path/to/img" alt="Description" className="w-full h-full" />
 */
export function LazyImage({
    src,
    alt,
    className,
    aspectRatio, // Optional: "16/9", "4/3", etc. to prevent CLS if height not known
    objectFit = "cover",
    ...props
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);

    // Optional: Intersection Observer for legacy support or triggering animations
    // Since we rely on native loading="lazy", this is purely for the visual state
    useEffect(() => {
        setIsLoaded(false);
        setError(false);
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setError(true);
    };

    return (
        <div
            className={cn("relative overflow-hidden bg-gray-100", className)}
            style={aspectRatio ? { aspectRatio } : undefined}
        >
            {/* Skeleton / Loading State */}
            {!isLoaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                    {/* Optional: Add an icon or logo here */}
                </div>
            )}

            {/* Actual Image */}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                    "w-full h-full transition-opacity duration-700 ease-in-out will-change-opacity",
                    objectFit === "contain" ? "object-contain" : "object-cover",
                    // While loading, opacity 0. Once loaded, opacity 100.
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                {...props}
            />

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                    Failed to load image
                </div>
            )}
        </div>
    );
}
