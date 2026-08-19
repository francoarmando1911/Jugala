import { Skeleton } from "@/components/ui/skeleton-loader";

/** @description Skeleton de carga para la página de perfil público del jugador */
export default function JugadorLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--jg-bg)" }}>
      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-8 space-y-6">
        {/* Volver */}
        <Skeleton className="h-5 w-20" />

        {/* Tarjeta de perfil */}
        <div className="rounded-2xl p-5 space-y-5" style={{ background: "#181B11" }}>
          {/* Avatar y nombre */}
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-[88px] w-[88px] rounded-full" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>

          {/* Deportes */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Zona y disponibilidad */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <div className="flex gap-1.5">
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-2.5">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>

          {/* Miembro desde */}
          <Skeleton className="h-4 w-36 mx-auto" />
        </div>
      </main>
    </div>
  );
}
