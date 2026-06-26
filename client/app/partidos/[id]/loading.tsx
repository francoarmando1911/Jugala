import { Skeleton } from "@/components/ui/skeleton-loader";

export default function PartidoDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#0B0D08" }}>
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 space-y-6">
        {/* Back */}
        <Skeleton className="h-5 w-20" />

        {/* Title + sport badge */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>

        {/* Details row */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-36" />
        </div>

        {/* Player slots */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-28" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>

        {/* Action button */}
        <Skeleton className="h-12 rounded-xl" />

        {/* Chat */}
        <Skeleton className="h-48 rounded-xl" />
      </main>
    </div>
  );
}
