// Skeleton loading state displayed while the API call is in progress.
export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading movie insights">
      {/* Movie card skeleton */}
      <div className="rounded-2xl border border-[#2a2a30] overflow-hidden" style={{ background: "#111113" }}>
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 h-64 sm:h-72 skeleton shrink-0" />
          <div className="flex-1 p-6 space-y-4">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="skeleton h-6 w-16 rounded-full" />)}
            </div>
            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-5/6 rounded" />
              <div className="skeleton h-3 w-4/6 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment skeleton */}
      <div className="rounded-2xl border border-[#2a2a30] p-6 space-y-4" style={{ background: "#111113" }}>
        <div className="skeleton h-5 w-40 rounded" />
        <div className="flex gap-6 items-center">
          <div className="skeleton w-32 h-32 rounded-full shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="skeleton h-7 w-28 rounded-full" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-4/5 rounded" />
          </div>
        </div>
        <div className="skeleton h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}
