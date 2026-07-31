import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * @description Componente de estado vacío reutilizable.
 * Muestra un ícono, título, descripción y opcionalmente un botón de acción.
 * Se usa cuando una lista no tiene elementos (partidos, mensajes, etc).
 * @param icon - Ícono decorativo a mostrar
 * @param title - Título del estado vacío
 * @param description - Texto descriptivo
 * @param actionLabel - Texto del botón de acción (opcional)
 * @param actionHref - Ruta del botón de acción (opcional)
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-4">
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}