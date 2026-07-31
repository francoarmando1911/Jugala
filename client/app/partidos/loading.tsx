import { Skeleton } from "@/components/ui/skeleton-loader";

/** @description Skeleton de carga para la lista de partidos */
export default function PartidosLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#0B0D08" }}>
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 space-y-6">
        {/* Título */}
        <Skeleton className="h-9 w-40" />

        {/* Filtros de deporte */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        {/* Tarjetas de partidos */}
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </main>
    </div>
  );
}