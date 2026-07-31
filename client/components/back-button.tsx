"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * @description Botón de volver atrás. Usa el historial del navegador si hay páginas previas,
 * o redirige a la ruta de fallback (por defecto /dashboard).
 * @param fallback - Ruta a la que redirigir si no hay historial previo
 */
export function BackButton({ fallback = "/dashboard" }: { fallback?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
      className="mb-4"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Volver
    </Button>
  );
}