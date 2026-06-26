import { Skeleton } from "@/components/ui/skeleton-loader";

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#0B0D08" }}>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
        {/* Title */}
        <Skeleton className="h-9 w-48" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Recent users */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>

        {/* Recent matches */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-44" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </main>
    </div>
  );
}
