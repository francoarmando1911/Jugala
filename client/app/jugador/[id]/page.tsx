import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, CalendarDays, Trophy, Star, Pencil } from "lucide-react";
import { Avatar } from "@/components/sport-icon";
import { SportBadge } from "@/components/sport-badge";
import { B } from "@/lib/design-tokens";

/** @description Mapeo de días internos a etiquetas en español */
const dayLabels: Record<string, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo",
};

/**
 * @description Página de perfil público de un jugador.
 * Muestra foto, nombre, bio, deportes con nivel, zona, disponibilidad
 * y estadísticas de partidos. Si es el perfil propio, muestra botón de editar.
 */
export default async function JugadorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { profiles: true },
  });

  if (!user || !user.onboarded) notFound();

  /* Verificar si es el perfil del usuario actual */
  const session = await auth.api.getSession({ headers: await headers() });
  const isOwn = session?.user.id === user.id;

  /* Estadísticas del jugador */
  const now = new Date();
  const [totalPlayed, totalOrganized, upcomingCount] = await Promise.all([
    prisma.participation.count({
      where: { userId: id, status: "CONFIRMED", match: { date: { lt: now } } },
    }),
    prisma.match.count({
      where: { organizerId: id },
    }),
    prisma.participation.count({
      where: { userId: id, status: "CONFIRMED", match: { date: { gte: now } } },
    }),
  ]);

  /* Parsear disponibilidad semanal */
  const availability = user.availability
    ? (JSON.parse(user.availability) as Record<string, boolean>)
    : {};
  const activeDays = Object.entries(availability)
    .filter(([, v]) => v)
    .map(([day]) => day);

  /* Fecha de registro formateada */
  const memberSince = new Date(user.createdAt).toLocaleDateString("es-AR", {
    month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        {/* Volver */}
        <Link
          href="/partidos"
          className="inline-flex items-center gap-1 text-sm font-medium mb-6 transition-colors hover:opacity-80"
          style={{ color: B.dim }}
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </Link>

        {/* Tarjeta principal del perfil */}
        <div className="rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.line2}` }}>
          {/* Encabezado: avatar, nombre, bio */}
          <div className="flex flex-col items-center pt-8 pb-5 px-5">
            <Avatar name={user.name} size={88} image={user.image} />
            <h1
              className="text-[22px] font-extrabold tracking-tight mt-4"
              style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
            >
              {user.name}
            </h1>
            {user.bio && (
              <p className="text-sm text-center mt-2 max-w-xs leading-relaxed" style={{ color: B.dim }}>
                &quot;{user.bio}&quot;
              </p>
            )}
            {isOwn && (
              <Link
                href="/perfil/editar"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold rounded-full px-4 py-1.5 transition-all hover:brightness-110"
                style={{ background: B.limeDim, color: B.lime }}
              >
                <Pencil className="h-3 w-3" />
                Editar perfil
              </Link>
            )}
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Deportes y niveles */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.faint }}>
              Deportes
            </p>
            <div className="flex flex-wrap gap-2">
              {user.profiles.map((profile) => (
                <SportBadge
                  key={profile.id}
                  sport={profile.sport}
                  level={profile.level}
                  size="md"
                />
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Zona y disponibilidad */}
          <div className="px-5 py-4 space-y-3">
            {user.zone && (
              <div className="flex items-center gap-2 text-sm" style={{ color: B.text }}>
                <MapPin className="h-4 w-4 shrink-0" style={{ color: B.lime }} />
                {user.zone}
              </div>
            )}
            {activeDays.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-sm mb-2" style={{ color: B.text }}>
                  <CalendarDays className="h-4 w-4 shrink-0" style={{ color: B.lime }} />
                  Disponibilidad
                </div>
                <div className="flex flex-wrap gap-1.5 ml-6">
                  {activeDays.map((day) => (
                    <span
                      key={day}
                      className="rounded-md px-2.5 py-1 text-xs font-medium"
                      style={{ background: B.limeDim, color: B.lime }}
                    >
                      {dayLabels[day] || day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Estadísticas */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.faint }}>
              Estadísticas
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { n: upcomingCount, label: "Próximos", color: B.lime, icon: CalendarDays },
                { n: totalPlayed, label: "Jugados", color: B.blue, icon: Trophy },
                { n: totalOrganized, label: "Organizados", color: B.orange, icon: Star },
              ].map(({ n, label, color, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${B.line2}` }}
                >
                  <Icon className="h-4 w-4 mx-auto mb-1.5" style={{ color }} />
                  <div
                    className="text-xl font-extrabold leading-none"
                    style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color }}
                  >
                    {n}
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: B.faint }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Miembro desde */}
          <div className="px-5 py-3">
            <p className="text-xs text-center" style={{ color: B.faint }}>
              En Jugala desde {memberSince}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
