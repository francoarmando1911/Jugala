import { Skeleton } from "@/components/ui/skeleton-loader";

/** @description Skeleton de carga para la página de edición de perfil */
export default function EditarPerfilLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--jg-bg)" }}>
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 space-y-6">
        {/* Volver */}
        <Skeleton className="h-5 w-20" />

        {/* Título */}
        <Skeleton className="h-9 w-44" />

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Selector de deportes */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>

        {/* Selectores de nivel */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Zona de juego */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Disponibilidad */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        {/* Botón de guardar */}
        <Skeleton className="h-12 rounded-xl" />
      </main>
    </div>
  );
}