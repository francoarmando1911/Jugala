import Link from "next/link";

/** @description Pie de página global — oculto en mobile donde se usa el BottomNav */
export function Footer() {
  return (
    <footer className="hidden md:block border-t border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Jugala — Encontrá con quién jugar.
        </p>
      </div>
    </footer>
  );
}