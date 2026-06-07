import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { SportTile, LevelPill, AvatarStack } from "@/components/sport-icon";
import { MatchFilters } from "./match-filters";

const B = {
  bg: "#0B0D08", card: "#181B11", line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.055)", lime: "#B6F23B", text: "#F5F6F1",
  dim: "rgba(255,255,255,0.56)", faint: "rgba(255,255,255,0.40)",
};

export default async function PartidosPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; location?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const params = await searchParams;

  const where: Record<string, unknown> = {
    date: { gte: new Date() },
    status: { in: ["OPEN", "FULL"] },
  };
  if (params.sport && params.sport !== "ALL") where.sport = params.sport;
  if (params.location) {
    where.location = { contains: params.location, mode: "insensitive" };
  }

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
        {/* Header */}
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
              Buscá partidos en tu zona
            </span>
          </div>
        </div>

        {/* Filters */}
        <MatchFilters
          currentSport={params.sport || "ALL"}
          currentLocation={params.location || ""}
        />

        {/* Results */}
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
                      {/* Top row */}
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
                            {dateStr} {timeStr} · {match.location}
                          </p>
                        </div>
                        <LevelPill level="INTERMEDIATE" sport={match.sport} />
                      </div>
                      {/* Divider */}
                      <div style={{ height: 1, background: B.line2 }} />
                      {/* Bottom row */}
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
                        {match.status === "OPEN" && spotsLeft > 0 && (
                          <span
                            className="text-[13px] font-bold rounded-full px-4 py-2"
                            style={{ background: B.lime, color: "#0B0D08" }}
                          >
                            Unirme
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
