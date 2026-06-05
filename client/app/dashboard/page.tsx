import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Trophy,
  Star,
  Activity,
  MapPin,
  CalendarDays,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SportBadge, sportLabels } from "@/components/sport-badge";
import { EmptyState } from "@/components/empty-state";

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Abierto", color: "text-emerald-600 dark:text-emerald-400" },
  FULL: { label: "Completo", color: "text-amber-600 dark:text-amber-400" },
  PLAYED: { label: "Jugado", color: "text-muted-foreground" },
  CANCELLED: { label: "Cancelado", color: "text-red-500" },
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profiles: true },
  });

  if (!user?.onboarded) {
    redirect("/perfil/completar");
  }

  const isAdmin = (user as unknown as { role: string }).role === "ADMIN";

  const myUpcoming = await prisma.match.findMany({
    where: {
      date: { gte: new Date() },
      participants: {
        some: { userId: session.user.id, status: "CONFIRMED" },
      },
    },
    include: {
      organizer: { select: { name: true } },
      participants: { where: { status: "CONFIRMED" } },
    },
    orderBy: { date: "asc" },
    take: 5,
  });

  const myPast = await prisma.match.findMany({
    where: {
      date: { lt: new Date() },
      participants: {
        some: { userId: session.user.id, status: "CONFIRMED" },
      },
    },
    orderBy: { date: "desc" },
    take: 5,
  });

  const totalPlayed = await prisma.participation.count({
    where: {
      userId: session.user.id,
      status: "CONFIRMED",
      match: { date: { lt: new Date() } },
    },
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

  const initials = (user.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Hola, {user.name?.split(" ")[0]}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/partidos/crear">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Crear partido
              </Button>
            </Link>
            <Link href="/partidos">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Search className="h-4 w-4" />
                Ver partidos
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { icon: CalendarCheck, value: myUpcoming.length, label: "Próximos", accent: "text-primary" },
            { icon: Trophy, value: totalPlayed, label: "Jugados", accent: "text-emerald-600 dark:text-emerald-400" },
            { icon: Star, value: totalOrganized, label: "Organizados", accent: "text-amber-600 dark:text-amber-400" },
            { icon: Activity, value: user.profiles.length, label: "Deportes", accent: "text-sky-600 dark:text-sky-400" },
          ].map(({ icon: Icon, value, label, accent }) => (
            <Card key={label} className="relative overflow-hidden">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`rounded-lg bg-muted p-2 ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none">{value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Próximos partidos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Mis próximos partidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {myUpcoming.length === 0 ? (
                <EmptyState
                  icon={<CalendarCheck className="h-6 w-6" />}
                  title="Sin partidos"
                  description="Todavía no te anotaste a ningún partido."
                  actionLabel="Buscar partidos"
                  actionHref="/partidos"
                />
              ) : (
                <div className="space-y-2">
                  {myUpcoming.map((match) => {
                    const status = statusLabels[match.status];
                    return (
                      <Link key={match.id} href={`/partidos/${match.id}`}>
                        <div className="group flex items-center justify-between rounded-lg border border-border/60 p-3 transition-all hover:border-border hover:bg-muted/40">
                          <div className="min-w-0 space-y-0.5">
                            <p className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                              {sportLabels[match.sport]} {match.title}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarDays className="h-3 w-3 shrink-0" />
                              {new Date(match.date).toLocaleDateString("es-AR", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}{" "}
                              ·{" "}
                              {new Date(match.date).toLocaleTimeString("es-AR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="ml-3 shrink-0 text-right">
                            <span className={`text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                            <p className="mt-0.5 flex items-center justify-end gap-1 text-xs text-muted-foreground">
                              {match.participants.length}/{match.maxPlayers}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mi perfil */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Mi perfil
                </CardTitle>
                <Link href="/perfil/completar">
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Editar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.bio && (
                <p className="text-sm italic text-muted-foreground">
                  &quot;{user.bio}&quot;
                </p>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Deportes
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.profiles.map(
                    (profile: { id: string; sport: string; level: string }) => (
                      <SportBadge
                        key={profile.id}
                        sport={profile.sport}
                        level={profile.level}
                      />
                    )
                  )}
                </div>
              </div>

              {user.zone && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {user.zone}
                </div>
              )}

              {activeDays.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Disponibilidad
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDays.map((day) => (
                      <span
                        key={day}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historial */}
        {myPast.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Historial reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myPast.map((match) => (
                  <Link key={match.id} href={`/partidos/${match.id}`}>
                    <div className="group flex items-center justify-between rounded-lg border border-border/60 p-3 transition-all hover:border-border hover:bg-muted/40">
                      <p className="text-sm group-hover:text-primary transition-colors">
                        {sportLabels[match.sport]} {match.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.date).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
