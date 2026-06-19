/** Route-level streaming fallback (§9) — shown during client navigations / data-less Suspense. */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}
