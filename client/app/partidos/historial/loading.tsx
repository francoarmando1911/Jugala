import { Skeleton } from "@/components/ui/skeleton-loader";

/** @description Skeleton de carga para la página de historial de partidos */
export default function HistorialLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#0B0D08" }}>
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 space-y-6">
        {/* Volver */}
        <Skeleton className="h-5 w-24" />

        {/* Título */}
        <Skeleton className="h-9 w-40" />

        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>

        {/* Tarjetas de partidos */}
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </main>
    </div>
  );
}
