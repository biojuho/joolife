export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-7 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-48" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-200/60"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200" />
              <div className="w-4 h-4 rounded bg-gray-100" />
            </div>
            <div className="h-7 bg-gray-200 rounded w-16 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 p-6">
          <div className="h-5 bg-gray-200 rounded w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6 h-48" />
          <div className="bg-[#1A1A1A] rounded-2xl p-6 h-40" />
        </div>
      </div>
    </div>
  );
}
