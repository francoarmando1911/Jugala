"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/partidos", label: "Partidos", icon: Search },
  { href: "/partidos/crear", label: "Crear", icon: Plus, isAction: true },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/perfil/editar", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  if (!session) return null;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/perfil/editar") return pathname.startsWith("/perfil");
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Spacer so content doesn't hide behind the bar */}
      <div className="h-28 md:hidden" />

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ paddingBottom: "20px" }}
      >
        {/* Liquid glass container */}
        <div
          className="mx-3 mb-10 rounded-2xl border border-white/[0.08]"
          style={{
            background: "linear-gradient(135deg, rgba(24,27,17,0.82) 0%, rgba(11,13,8,0.92) 100%)",
            backdropFilter: "blur(40px) saturate(1.8)",
            WebkitBackdropFilter: "blur(40px) saturate(1.8)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.06), inset 0 -0.5px 0 rgba(0,0,0,0.3)",
          }}
        >
          {/* Top edge highlight */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.1) 50%, transparent 90%)",
            }}
          />

          <div className="flex items-center justify-around px-2 py-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

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
                        background: "#B6F23B",
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
                  {/* Active glow background */}
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
                        color: active ? "#B6F23B" : "rgba(255,255,255,0.4)",
                        filter: active ? "drop-shadow(0 0 6px rgba(182,242,59,0.4))" : "none",
                      }}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                  </div>

                  <span
                    className="text-[10px] font-medium transition-all duration-300 relative z-10"
                    style={{
                      color: active ? "#B6F23B" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {item.label}
                  </span>

                  {/* Active dot indicator */}
                  {active && (
                    <div
                      className="absolute -bottom-0.5 w-1 h-1 rounded-full transition-all duration-500"
                      style={{
                        background: "#B6F23B",
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
