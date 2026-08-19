import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { SportTile, AvatarStack } from "@/components/sport-icon";
import { B } from "@/lib/design-tokens";

/** @description Configuración de cada tab con label, color y query param */
const TABS = [
  { key: "proximos", label: "Próximos", color: B.lime },
  { key: "jugados", label: "Jugados", color: B.blue },
  { key: "organizados", label: "Organizados", color: B.orange },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * @description Página de historial de partidos del usuario.
 * Muestra 3 tabs: Próximos, Jugados y Organizados.
 * El tab activo se controla vía query param ?tab=
 */
export default async function HistorialPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const params = await searchParams;
  const activeTab: TabKey = TABS.some((t) => t.key === params.tab)
    ? (params.tab as TabKey)
    : "proximos";

  const now = new Date();

  /* Obtener partidos según el tab activo */
  let matches;
  if (activeTab === "proximos") {
    matches = await prisma.match.findMany({
      where: {
        date: { gte: now },
        participants: { some: { userId: session.user.id, status: "CONFIRMED" } },
      },
      include: {
        organizer: { select: { name: true } },
        participants: {
          where: { status: "CONFIRMED" },
          include: { user: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: "asc" },
    });
  } else if (activeTab === "jugados") {
    matches = await prisma.match.findMany({
      where: {
        date: { lt: now },
        participants: { some: { userId: session.user.id, status: "CONFIRMED" } },
      },
      include: {
        organizer: { select: { name: true } },
        participants: {
          where: { status: "CONFIRMED" },
          include: { user: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: "desc" },
    });
  } else {
    matches = await prisma.match.findMany({
      where: { organizerId: session.user.id },
      include: {
        organizer: { select: { name: true } },
        participants: {
          where: { status: "CONFIRMED" },
          include: { user: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  const activeConfig = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Volver al dashboard */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium mb-5 transition-colors hover:opacity-80"
          style={{ color: B.dim }}
        >
          <ChevronLeft className="h-4 w-4" /> Dashboard
        </Link>

        <h1
          className="text-2xl font-extrabold tracking-tight mb-5"
          style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
        >
          Mis partidos
        </h1>

        {/* Selector de tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <Link
                key={tab.key}
                href={`/partidos/historial?tab=${tab.key}`}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isActive ? `color-mix(in srgb, ${tab.color} 16%, transparent)` : B.card,
                  border: `1.5px solid ${isActive ? tab.color : B.line2}`,
                  color: isActive ? tab.color : B.dim,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Lista de partidos */}
        {matches.length === 0 ? (
          <div
            className="rounded-2xl py-16 text-center"
            style={{ background: B.card, border: `1px solid ${B.line2}` }}
          >
            <p className="text-sm mb-2" style={{ color: B.faint }}>
              {activeTab === "proximos" && "No tenés partidos próximos"}
              {activeTab === "jugados" && "Todavía no jugaste ningún partido"}
              {activeTab === "organizados" && "No organizaste ningún partido aún"}
            </p>
            <Link
              href="/partidos"
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: B.lime }}
            >
              Buscar partidos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs" style={{ color: B.faint }}>
              {matches.length} {matches.length === 1 ? "partido" : "partidos"}
            </p>
            {matches.map((match) => {
              const spotsLeft = match.maxPlayers - match.participants.length;
              const playerNames = match.participants.map((p) => p.user.name || "Anon");
              const isPast = new Date(match.date) < now;
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
                    style={{
                      background: B.card,
                      border: `1px solid ${B.line2}`,
                      opacity: isPast && activeTab !== "organizados" ? 0.7 : 1,
                    }}
                  >
                    {/* Info del partido */}
                    <div className="flex items-center gap-3 mb-3">
                      <SportTile sport={match.sport} size={46} />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[15.5px] font-bold tracking-tight truncate"
                          style={{ color: B.text }}
                        >
                          {match.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs" style={{ color: B.dim }}>
                            <CalendarDays className="h-3 w-3" style={{ color: activeConfig.color }} />
                            {dateStr} {timeStr}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: B.dim }}>
                            <MapPin className="h-3 w-3" style={{ color: activeConfig.color }} />
                            {match.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, background: B.line2 }} />

                    {/* Participantes y estado */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2.5">
                        {playerNames.length > 0 && (
                          <AvatarStack names={playerNames.slice(0, 3)} size={26} />
                        )}
                        <span className="flex items-center gap-1 text-xs" style={{ color: B.faint }}>
                          <Users className="h-3 w-3" />
                          {match.participants.length}/{match.maxPlayers}
                        </span>
                      </div>
                      {/* Badge de estado */}
                      {isPast ? (
                        <span
                          className="text-[12px] font-semibold rounded-full px-3 py-1"
                          style={{ background: "rgba(255,255,255,0.06)", color: B.faint }}
                        >
                          Jugado
                        </span>
                      ) : match.status === "OPEN" && spotsLeft > 0 ? (
                        <span
                          className="text-[12px] font-semibold rounded-full px-3 py-1"
                          style={{ background: B.limeDim, color: B.lime }}
                        >
                          {spotsLeft === 1 ? "Falta 1" : `Faltan ${spotsLeft}`}
                        </span>
                      ) : (
                        <span
                          className="text-[12px] font-semibold rounded-full px-3 py-1"
                          style={{ background: "rgba(233,210,75,0.14)", color: B.warn }}
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
        )}
      </div>
    </div>
  );
}
