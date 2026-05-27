import Link from "next/link";
import { ArrowRight, MapPin, Trophy, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow effect de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-3xl opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge superior */}
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-xs font-medium tracking-wide"
          >
            🎾 Tenis · Pádel · Fútbol
          </Badge>

          {/* Título */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Encontrá con quién{" "}
            <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
              jugar
            </span>
            .
          </h1>

          {/* Subtítulo */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Conectate con jugadores de tu nivel, en tu zona y en tus horarios.
            Sumate a partidos abiertos o creá los tuyos en menos de un minuto.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Button size="lg" asChild className="group">
              <Link href="/registro">
                Empezar gratis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/partidos">Ver partidos cerca</Link>
            </Button>
          </div>

          {/* Stats / proof */}
          <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-12 pt-8 border-t border-border/40 w-full max-w-2xl">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold tabular-nums">+1.2k</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Jugadores
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold tabular-nums">450</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Partidos
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold tabular-nums">30+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Zonas
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}