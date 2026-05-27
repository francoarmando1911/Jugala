"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/partidos", label: "Partidos" },
  { href: "/jugadores", label: "Jugadores" },
  { href: "/como-funciona", label: "Cómo funciona" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            J
          </div>
          <span className="font-semibold text-lg tracking-tight">Jugala</span>
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
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/registro">Empezar</Link>
            </Button>
          </div>

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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}