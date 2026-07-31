import { Skeleton } from "@/components/ui/skeleton-loader";

/** @description Skeleton de carga para la página del dashboard */
export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#0B0D08" }}>
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 space-y-8">
        {/* Saludo */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-40" />
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>

        {/* Fila de estadísticas */}
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>

        {/* Próximos partidos */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 rounded-xl" />
        </div>

        {/* Sección de perfil */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
          <Skeleton className="h-5 w-44" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </div>
      </main>
    </div>
  );
}