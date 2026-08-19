import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { SportTile, LevelPill, AvatarStack } from "@/components/sport-icon";
import { MatchFilters } from "./match-filters";
import { formatMatchLocationShort, parseZoneText } from "@/lib/argentina-provincias";

/** @description Paleta de colores del sistema de diseño */
const B = {
  bg: "#0B0D08", card: "#181B11", line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.055)", lime: "#B6F23B", limeDim: "rgba(182,242,59,0.14)", text: "#F5F6F1",
  dim: "rgba(255,255,255,0.56)", faint: "rgba(255,255,255,0.40)",
};

/**
 * @description Página de listado de partidos con filtros por deporte y localidad.
 * Muestra partidos abiertos y completos ordenados por fecha ascendente.
 * Por defecto filtra por la localidad del perfil del usuario; puede verse
 * todas las zonas o cambiar a otra localidad desde los filtros.
 * Redirige a login si no hay sesión activa.
 */
export default async function PartidosPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; provincia?: string; localidad?: string; allZones?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const params = await searchParams;
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { zone: true } });
  const myZone = user?.zone ? parseZoneText(user.zone) : null;

  /* Si no hay filtros explícitos en la URL, usar la zona del perfil como default */
  const showingAllZones = params.allZones === "1";
  const activeProvincia = params.provincia ?? (showingAllZones ? undefined : myZone?.provinciaNombre);
  const activeLocalidad = params.localidad ?? (showingAllZones ? undefined : myZone?.localidad);

  /* Construir filtros de búsqueda según los query params */
  const where: Record<string, unknown> = {
    date: { gte: new Date() },
    status: { in: ["OPEN", "FULL"] },
  };
  if (params.sport && params.sport !== "ALL") where.sport = params.sport;
  if (activeProvincia) where.provincia = activeProvincia;
  if (activeLocalidad) where.localidad = activeLocalidad;

  const matches = await prisma.match.findMany({
    where,
    include: {
      organizer: { select: { name: true } },
      participants: {
        where: { status: "CONFIRMED" },
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { date: "asc" },
    take: 50,
  });

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Encabezado de la página */}
        <div className="mb-4">
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
          >
            Partidos cerca
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="h-3.5 w-3.5" style={{ color: B.lime }} />
            <span className="text-[13px]" style={{ color: B.dim }}>
              {activeLocalidad ? `Mostrando partidos en ${activeLocalidad}` : "Mostrando partidos en todas las zonas"}
            </span>
          </div>
        </div>

        {/* Filtros de deporte y localidad */}
        <MatchFilters
          currentSport={params.sport || "ALL"}
          activeLocalidad={activeLocalidad}
          activeProvincia={activeProvincia}
          myZone={myZone}
          showingAllZones={showingAllZones}
        />

        {/* Resultados de búsqueda */}
        {matches.length === 0 ? (
          <div
            className="rounded-2xl py-16 text-center mt-4"
            style={{ background: B.card, border: `1px solid ${B.line2}` }}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Search className="h-6 w-6" style={{ color: B.faint }} />
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: B.text }}>
              Sin resultados
            </p>
            <p className="text-sm mb-4" style={{ color: B.faint }}>
              No hay partidos con esos filtros
            </p>
            <Link
              href="/partidos/crear"
              className="inline-flex items-center gap-1.5 text-sm font-bold rounded-full px-5 py-2.5"
              style={{ background: B.lime, color: "#0B0D08" }}
            >
              Crear partido
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-xs mb-3" style={{ color: B.faint }}>
              {matches.length} {matches.length === 1 ? "partido" : "partidos"}
            </p>
            <div className="flex flex-col gap-3">
              {matches.map((match) => {
                const spotsLeft = match.maxPlayers - match.participants.length;
                const playerNames = match.participants.map(p => p.user.name || "Anon");
                const isAlreadyIn = match.participants.some(p => p.userId === session.user.id);
                const dateStr = new Date(match.date).toLocaleDateString("es-AR", {
                  weekday: "short", day: "numeric", month: "short",
                });
                const timeStr = new Date(match.date).toLocaleTimeString("es-AR", {
                  hour: "2-digit", minute: "2-digit",
                });

                return (
                  <Link key={match.id} href={`/partidos/${match.id}`}>
                    <div
                      className="rounded-2xl p-3.5 transition-all hover:brightness-110 cursor-pointer"
                      style={{ background: B.card, border: `1px solid ${B.line2}` }}
                    >
                      {/* Fila superior: deporte, título, fecha, nivel */}
                      <div className="flex items-center gap-3 mb-3">
                        <SportTile sport={match.sport} size={46} />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[15.5px] font-bold tracking-tight truncate"
                            style={{ color: B.text }}
                          >
                            {match.title}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: B.dim }}>
                            {dateStr} {timeStr} · {formatMatchLocationShort(match)}
                          </p>
                        </div>
                        <LevelPill level="INTERMEDIATE" sport={match.sport} />
                      </div>
                      {/* Separador */}
                      <div style={{ height: 1, background: B.line2 }} />
                      {/* Fila inferior: participantes y acción */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2.5">
                          {playerNames.length > 0 && (
                            <AvatarStack names={playerNames.slice(0, 3)} size={26} />
                          )}
                          <span className="text-xs" style={{ color: B.faint }}>
                            {spotsLeft > 0
                              ? spotsLeft === 1 ? "falta 1" : `faltan ${spotsLeft}`
                              : "Completo"}
                          </span>
                        </div>
                        {match.status === "OPEN" && spotsLeft > 0 && !isAlreadyIn && (
                          <span
                            className="text-[13px] font-bold rounded-full px-4 py-2"
                            style={{ background: B.lime, color: "#0B0D08" }}
                          >
                            Unirme
                          </span>
                        )}
                        {match.status === "OPEN" && spotsLeft > 0 && isAlreadyIn && (
                          <span
                            className="text-[11px] font-semibold rounded-full px-4 py-2"
                            style={{ background: B.limeDim, color: B.lime }}
                          >
                            Ya estás anotado
                          </span>
                        )}
                        {match.status === "FULL" && (
                          <span
                            className="text-[13px] font-semibold rounded-full px-4 py-2"
                            style={{ background: "rgba(255,255,255,0.06)", color: B.dim }}
                          >
                            Completo
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}