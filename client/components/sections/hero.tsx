import Link from "next/link";
import { ArrowRight, MapPin, Trophy, Users } from "lucide-react";

const B = { ink: "#0B0D08", lime: "#B6F23B", paper: "#FAFAF6" };

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(182,242,59,0.13), transparent 60%), ${B.ink}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            🎾 Tenis · Pádel · Fútbol
          </div>

          {/* Título */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-archivo), Archivo, sans-serif",
              color: B.paper,
            }}
          >
            Encontrá con quién{" "}
            <span style={{ color: B.lime }}>jugar</span>.
          </h1>

          {/* Subtítulo */}
          <p
            className="mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Conectate con jugadores de tu nivel, en tu zona y en tus horarios.
            Sumate a partidos abiertos o creá los tuyos en menos de un minuto.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/registro"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-all hover:brightness-110"
              style={{ background: B.lime, color: B.ink }}
            >
              Empezar gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/partidos"
              className="inline-flex items-center rounded-full px-7 py-3 text-base font-semibold transition-colors hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: B.paper,
              }}
            >
              Ver partidos cerca
            </Link>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-8 sm:gap-12 pt-8 w-full max-w-2xl"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { icon: Users, value: "+1.2k", label: "Jugadores" },
              { icon: Trophy, value: "450", label: "Partidos" },
              { icon: MapPin, value: "30+", label: "Zonas" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon
                  className="h-5 w-5"
                  style={{ color: B.lime }}
                />
                <div
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: B.paper }}
                >
                  {value}
                </div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
