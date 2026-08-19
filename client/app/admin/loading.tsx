import { Skeleton } from "@/components/ui/skeleton-loader";

/** @description Skeleton de carga para la página de administración */
export default function AdminLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--jg-bg)" }}>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
        {/* Título */}
        <Skeleton className="h-9 w-48" />

        {/* Grilla de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Usuarios recientes */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>

        {/* Partidos recientes */}
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