"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";

const publicLinks = [{ href: "/como-funciona", label: "Cómo funciona" }];

const authLinks = [
  { href: "/partidos", label: "Partidos" },
  { href: "/partidos/crear", label: "Crear partido" },
  { href: "/dashboard", label: "Mi perfil" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    setOpen(false);
  };

  const navLinks = session ? authLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a0f0d] dark:bg-[#a3e635]">
            <span
              className="text-[17px] leading-none text-[#a3e635] dark:text-[#0a0f0d]"
              style={{
                fontFamily: "var(--font-archivo), 'Archivo', sans-serif",
                fontWeight: 800,
                fontStyle: "italic",
              }}
            >
              J
            </span>
          </div>
          <span
            className="text-lg tracking-tight text-foreground"
            style={{
              fontFamily: "var(--font-archivo), 'Archivo', sans-serif",
              fontWeight: 800,
              fontStyle: "italic",
            }}
          >
            jugala
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
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

          {/* Mobile toggle */}
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background animate-in slide-in-from-top-2 duration-200">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
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
