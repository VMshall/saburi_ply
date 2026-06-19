import type { ResponsiveImage } from "@/data/types";

/**
 * Breadcrumb/banner strip (server). Ported from client/components/PageHeader.jsx — note the
 * original's title-overlay text + Breadcrumb list are commented out, so this renders only the
 * responsive background image + dark overlay (or a gradient fallback when no banner is set).
 * The banner image now comes from the data layer (`bannerImage`) instead of a title→image map.
 */
export function PageHeader({ bannerImage }: { bannerImage?: ResponsiveImage }) {
  return (
    <div className="relative isolate flex items-center h-[220px] sm:h-[280px] md:h-[340px] lg:h-[420px] 2xl:h-[450px]">
      {/* P6 LCP: preload the banner per breakpoint so it isn't discovered late. These media
          queries mirror the md/lg display breakpoints of the art-directed <img> variants below,
          so exactly the one that will render is preloaded. Server-rendered per page, so each
          route preloads its own banner. (The banner stays an art-directed <picture>-style set —
          next/image can't art-direct, and it's the LCP, so manual preload is the right lever.) */}
      {bannerImage && (
        <>
          <link rel="preload" as="image" href={bannerImage.mobile} media="(max-width: 767px)" fetchPriority="high" />
          <link rel="preload" as="image" href={bannerImage.tablet} media="(min-width: 768px) and (max-width: 1023px)" fetchPriority="high" />
          <link rel="preload" as="image" href={bannerImage.desktop} media="(min-width: 1024px)" fetchPriority="high" />
        </>
      )}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-none">
        {bannerImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerImage.mobile} alt="" aria-hidden="true" className="md:hidden absolute inset-0 h-full w-full object-cover transition-opacity duration-700" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerImage.tablet} alt="" aria-hidden="true" className="hidden md:block lg:hidden absolute inset-0 h-full w-full object-cover transition-opacity duration-700" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bannerImage.desktop} alt="" aria-hidden="true" className="hidden lg:block absolute inset-0 h-full w-full object-cover transition-opacity duration-700" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-white/6 blur-2xl" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute right-6 top-8 h-3 w-3 rounded-full bg-white/40" />
            <div className="absolute right-14 top-12 h-2.5 w-2.5 rounded-full bg-white/30" />
          </>
        )}
      </div>
    </div>
  );
}
