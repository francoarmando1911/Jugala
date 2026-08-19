"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { B } from "@/lib/design-tokens";

/** @description Items de navegación del bottom bar con sus rutas e íconos */
const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/partidos", label: "Partidos", icon: Search },
  { href: "/partidos/crear", label: "Crear", icon: Plus, isAction: true },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/perfil/editar", label: "Perfil", icon: User },
];

/**
 * @description Barra de navegación inferior con efecto liquid glass.
 * Solo visible en mobile para usuarios logueados.
 * Incluye 5 items: Inicio, Partidos, Crear (botón elevado lima), Chat y Perfil.
 * Muestra indicador activo con glow y dot lima.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  /* Recién renderizar contenido dependiente de sesión después de montar en el cliente.
     El estado de sesión puede resolver distinto entre el render del servidor y el
     primer render del cliente (ej. sesión ya cacheada), lo que rompe la hidratación
     si el chequeo de sesión decide el árbol desde el primer render. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón estándar de detección de montaje para evitar mismatch de hidratación
    setMounted(true);
  }, []);

  if (!mounted || isPending || !session) return null;

  /** @description Determina si una ruta está activa según el pathname actual */
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/perfil/editar") return pathname.startsWith("/perfil");
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Espaciador para que el contenido no quede detrás de la barra */}
      <div className="h-28 md:hidden" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Contenedor con efecto liquid glass */}
        <div
          className="mx-0 rounded-none border-t"
          style={{
            borderColor: B.line,
            background: `linear-gradient(135deg, color-mix(in srgb, ${B.card} 82%, transparent) 0%, color-mix(in srgb, ${B.bg} 92%, transparent) 100%)`,
            backdropFilter: "blur(40px) saturate(1.8)",
            WebkitBackdropFilter: "blur(40px) saturate(1.8)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.06), inset 0 -0.5px 0 rgba(0,0,0,0.3)",
          }}
        >
          {/* Highlight del borde superior */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent 10%, color-mix(in srgb, ${B.text} 10%, transparent) 50%, transparent 90%)`,
            }}
          />

          <div className="flex items-center justify-around px-2 py-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              /* Botón central elevado para crear partido */
              if (item.isAction) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative mt-0 flex items-center justify-center"
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 active:scale-90"
                      style={{
                        background: B.limeSolid,
                        boxShadow: "0 4px 20px rgba(182,242,59,0.35), 0 2px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      <Plus className="h-6 w-6 text-[#0B0D08]" strokeWidth={2.5} />
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-300 active:scale-90"
                >
                  {/* Fondo con glow radial cuando está activo */}
                  {active && (
                    <div
                      className="absolute inset-0 rounded-xl transition-all duration-500 ease-out"
                      style={{
                        background: "radial-gradient(ellipse at center, rgba(182,242,59,0.12) 0%, transparent 70%)",
                      }}
                    />
                  )}

                  <div className="relative">
                    <Icon
                      className="h-5 w-5 transition-all duration-300"
                      style={{
                        color: active ? B.lime : B.faint,
                        filter: active ? "drop-shadow(0 0 6px rgba(182,242,59,0.4))" : "none",
                      }}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                  </div>

                  <span
                    className="text-[10px] font-medium transition-all duration-300 relative z-10"
                    style={{
                      color: active ? B.lime : B.faint,
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Indicador de punto activo */}
                  {active && (
                    <div
                      className="absolute -bottom-0.5 w-1 h-1 rounded-full transition-all duration-500"
                      style={{
                        background: B.limeSolid,
                        boxShadow: "0 0 6px rgba(182,242,59,0.6)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}