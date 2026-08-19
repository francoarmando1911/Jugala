import Link from "next/link";
import { ArrowRight, MapPin, Trophy, Users } from "lucide-react";
import { B } from "@/lib/design-tokens";

/**
 * @description Formatea un conteo real de la plataforma para mostrar en el hero.
 * Números grandes se abrevian en miles (ej: 1.234 -> "1.2k"). El prefijo "+"
 * indica que el valor mostrado es un redondeo hacia abajo del conteo real.
 * @param n - Conteo exacto
 */
function formatStat(n: number): string {
  if (n < 1000) return String(n);
  const rounded = Math.floor(n / 100) / 10;
  const display = `${rounded}k`;
  return n > rounded * 1000 ? `+${display}` : display;
}

/**
 * @description Sección hero de la landing page.
 * Incluye badge de deportes, título principal, subtítulo,
 * botones de acción (CTA) y estadísticas reales de la plataforma.
 * @param playerCount - Cantidad de usuarios registrados
 * @param matchCount - Cantidad de partidos creados
 */
export function Hero({ playerCount, matchCount }: { playerCount: number; matchCount: number }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(182,242,59,0.13), transparent 60%), ${B.bg}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge de deportes */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
            style={{
              background: `color-mix(in srgb, ${B.text} 8%, transparent)`,
              border: `1px solid color-mix(in srgb, ${B.text} 14%, transparent)`,
              color: B.dim,
            }}
          >
            🎾 Tenis · Pádel · Fútbol
          </div>

          {/* Título principal */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-archivo), Archivo, sans-serif",
              color: B.text,
            }}
          >
            Encontrá con quién{" "}
            <span style={{ color: B.lime }}>jugar</span>.
          </h1>

          {/* Subtítulo */}
          <p
            className="mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed"
            style={{ color: B.dim }}
          >
            Conectate con jugadores de tu nivel, en tu zona y en tus horarios.
            Sumate a partidos abiertos o creá los tuyos en menos de un minuto.
          </p>

          {/* Botones de acción */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/registro"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-semibold transition-all hover:brightness-110"
              style={{ background: B.limeSolid, color: "#0B0D08" }}
            >
              Empezar gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/partidos"
              className="inline-flex items-center rounded-full px-7 py-3 text-base font-semibold transition-colors hover:bg-white/10"
              style={{
                border: `1.5px solid color-mix(in srgb, ${B.text} 22%, transparent)`,
                color: B.text,
              }}
            >
              Ver partidos cerca
            </Link>
          </div>

          {/* Estadísticas de la plataforma */}
          <div
            className="mt-16 grid grid-cols-3 gap-8 sm:gap-12 pt-8 w-full max-w-2xl"
            style={{ borderTop: `1px solid ${B.line}` }}
          >
            {[
              { icon: Users, value: formatStat(playerCount), label: "Jugadores" },
              { icon: Trophy, value: formatStat(matchCount), label: "Partidos" },
              { icon: MapPin, value: "30+", label: "Zonas" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon
                  className="h-5 w-5"
                  style={{ color: B.lime }}
                />
                <div
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: B.text }}
                >
                  {value}
                </div>
                <div
                  className="text-xs uppercase tracking-wide"
                  style={{ color: B.faint }}
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
