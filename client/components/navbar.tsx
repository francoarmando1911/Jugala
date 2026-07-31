"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";

/** @description Links visibles para usuarios no autenticados */
const publicLinks: { href: string; label: string }[] = [];

/** @description Links de navegación para usuarios autenticados */
const authLinks = [
  { href: "/partidos", label: "Partidos" },
  { href: "/partidos/crear", label: "Crear partido" },
  { href: "/perfil/editar", label: "Mi perfil" }
];

const ARCH = "var(--font-archivo), Archivo, sans-serif";
const INK = "#13150F";
const LIME = "#a3e635";

/** @description Wordmark "Jugala" con la J en lima, dash decorativo y tipografía Archivo */
function JugalaWordmark({ size = 20 }: { size?: number }) {
  const dashH = Math.max(size * 0.075, 1.5);
  const dashMt = size * 0.10;
  return (
    <div className="inline-block relative">
      <div
        style={{
          fontFamily: ARCH,
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: size,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <span className="text-[#a3e635] dark:text-[#a3e635]">J</span>
        <span className="text-foreground">ugala</span>
      </div>
      <div
        style={{
          height: dashH,
          marginTop: dashMt,
          marginLeft: size * 0.04,
          borderRadius: 99,
          background: LIME,
          clipPath: "polygon(0 0, 100% 0, 93% 100%, 0 100%)",
          transform: "skewX(-12deg)",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

/** @description Ícono squircle con la "J" de Jugala para el navbar */
function JSquircle({ size = 32 }: { size?: number }) {
  const r = size * 0.235;
  const fs = size * 0.6;
  return (
    <div
      className="flex items-center justify-center shrink-0 dark:bg-[#a3e635]"
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: INK,
      }}
    >
      <span
        className="dark:text-[#13150F]"
        style={{
          fontFamily: ARCH,
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: fs,
          lineHeight: 1,
          color: LIME,
          transform: "translateX(-2%)",
        }}
      >
        J
      </span>
    </div>
  );
}

/**
 * @description Barra de navegación superior global.
 * Incluye logo, links de navegación (desktop), toggle de tema, info de sesión
 * y menú mobile como overlay con highlight lima en la página activa.
 */
export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  /* Cerrar menú mobile al cambiar de ruta */
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /** @description Cierra sesión y redirige a la landing */
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    setOpen(false);
  };

  const navLinks = session ? authLinks : publicLinks;

  /** @description Determina si un link está activo según el pathname actual */
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — redirige al dashboard si hay sesión, o a la landing */}
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <JSquircle size={32} />
          <JugalaWordmark size={20} />
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                isActive(link.href)
                  ? "text-[#a3e635]"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acciones del lado derecho */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isPending && (
            <div className="hidden sm:flex items-center gap-2">
              {session ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {session.user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/registro">Empezar</Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Botón hamburguesa mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú mobile — overlay sobre el contenido */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full border-t border-border/40 bg-background backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 text-base font-medium transition-colors rounded-md ${
                  isActive(link.href)
                    ? "text-[#a3e635] bg-[#a3e635]/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Sesión: nombre, email y cerrar sesión / Botones de auth */}
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border/40">
              {session ? (
                <>
                  <span className="px-4 py-2 text-sm text-muted-foreground">
                    {session.user.name} · {session.user.email}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Iniciar sesión
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/registro" onClick={() => setOpen(false)}>
                      Empezar
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}