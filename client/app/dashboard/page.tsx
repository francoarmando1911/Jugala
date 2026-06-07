import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Search, CalendarDays, MapPin } from "lucide-react";
import { SportBadge } from "@/components/sport-badge";
import { SportTile, LevelPill, Avatar, AvatarStack } from "@/components/sport-icon";

const B = {
  bg: "#0B0D08", card: "#181B11", line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.055)", lime: "#B6F23B", blue: "#5B9BFF",
  orange: "#E9885B", text: "#F5F6F1", dim: "rgba(255,255,255,0.56)",
  faint: "rgba(255,255,255,0.40)", limeDim: "rgba(182,242,59,0.14)",
};

const levelLabels: Record<string, string> = {
  BEGINNER: "Principiante", INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado", COMPETITIVE: "Competitivo",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profiles: true },
  });
  if (!user?.onboarded) redirect("/perfil/completar");

  const isAdmin = (user as unknown as { role: string }).role === "ADMIN";

  const myUpcoming = await prisma.match.findMany({
    where: {
      date: { gte: new Date() },
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
    take: 5,
  });

  const totalPlayed = await prisma.participation.count({
    where: { userId: session.user.id, status: "CONFIRMED", match: { date: { lt: new Date() } } },
  });

  const totalOrganized = await prisma.match.count({
    where: { organizerId: session.user.id },
  });

  const availability = user.availability
    ? (JSON.parse(user.availability) as Record<string, boolean>)
    : {};
  const activeDays = Object.entries(availability)
    .filter(([, v]) => v)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

  const firstName = user.name?.split(" ")[0] || "Jugador";

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div />
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin" className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: B.card, border: `1px solid ${B.line}`, color: B.dim }}>
                Admin
              </Link>
            )}
            <Avatar name={user.name || "U"} size={36} image={user.image} />
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-5">
          <h1
            className="text-[30px] font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
          >
            Hola, {firstName}
          </h1>
          <p className="text-sm mt-1" style={{ color: B.dim }}>
            ¿Listo para jugar hoy?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-5">
          <Link
            href="/partidos/crear"
            className="flex-1 flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-sm font-bold transition-all hover:brightness-110"
            style={{ background: B.lime, color: "#0B0D08" }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Crear partido
          </Link>
          <Link
            href="/partidos"
            className="flex-1 flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-sm font-semibold transition-colors hover:bg-white/10"
            style={{ border: `1px solid ${B.line}`, color: B.text }}
          >
            <Search className="h-4 w-4" />
            Ver partidos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[
            { n: myUpcoming.length, label: "Próximos", color: B.lime },
            { n: totalPlayed, label: "Jugados", color: B.blue },
            { n: totalOrganized, label: "Organizados", color: B.orange },
          ].map(({ n, label, color }) => (
            <div
              key={label}
              className="rounded-2xl p-3.5"
              style={{ background: B.card, border: `1px solid ${B.line2}` }}
            >
              <div
                className="text-[26px] font-extrabold leading-none"
                style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color }}
              >
                {n}
              </div>
              <div className="text-[11.5px] mt-1.5" style={{ color: B.faint }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming matches */}
        <div className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[17px] font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
            >
              Tus próximos partidos
            </h2>
            <Link href="/partidos" className="text-xs font-semibold" style={{ color: B.lime }}>
              Ver todos
            </Link>
          </div>

          {myUpcoming.length === 0 ? (
            <div
              className="rounded-2xl py-12 text-center"
              style={{ background: B.card, border: `1px solid ${B.line2}` }}
            >
              <p className="text-sm mb-3" style={{ color: B.faint }}>
                No tenés partidos próximos
              </p>
              <Link
                href="/partidos"
                className="inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: B.lime }}
              >
                <Search className="h-3.5 w-3.5" /> Buscar partidos
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myUpcoming.map((match) => {
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
                      <div style={{ height: 1, background: B.line2 }} />
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarStack names={playerNames.slice(0, 3)} size={26} />
                          {spotsLeft > 0 && (
                            <span className="text-xs" style={{ color: B.faint }}>
                              {spotsLeft === 1 ? "falta 1" : `faltan ${spotsLeft}`}
                            </span>
                          )}
                        </div>
                        {match.status === "OPEN" && spotsLeft > 0 && (
                          <span
                            className="text-[13px] font-bold rounded-full px-4 py-2"
                            style={{ background: B.lime, color: "#0B0D08" }}
                          >
                            Unirme
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

        {/* Profile summary */}
        <div
          className="rounded-2xl p-4"
          style={{ background: B.card, border: `1px solid ${B.line2}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[17px] font-extrabold tracking-tight"
              style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
            >
              Mi perfil
            </h2>
            <Link href="/perfil/editar" className="text-xs font-semibold" style={{ color: B.lime }}>
              Editar
            </Link>
          </div>

          {user.bio && (
            <p className="text-sm italic mb-3" style={{ color: B.dim }}>
              &quot;{user.bio}&quot;
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {user.profiles.map((profile: { id: string; sport: string; level: string }) => (
              <SportBadge key={profile.id} sport={profile.sport} level={profile.level} />
            ))}
          </div>

          {user.zone && (
            <div className="flex items-center gap-1.5 text-sm mb-2" style={{ color: B.dim }}>
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: B.lime }} />
              {user.zone}
            </div>
          )}

          {activeDays.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeDays.map((day) => (
                <span
                  key={day}
                  className="rounded-md px-2 py-0.5 text-xs"
                  style={{ background: B.limeDim, color: B.lime }}
                >
                  {day}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
