import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sportLabels: Record<string, string> = {
  TENNIS: "🎾 Tenis",
  PADEL: "🏓 Pádel",
  FOOTBALL: "⚽ Fútbol",
};

const levelLabels: Record<string, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
  COMPETITIVE: "Competitivo",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Abierto", color: "text-green-500" },
  FULL: { label: "Completo", color: "text-yellow-500" },
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

  const myUpcoming = await prisma.match.findMany({
    where: {
      date: { gte: new Date() },
      participants: {
        some: {
          userId: session.user.id,
          status: "CONFIRMED",
        },
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
        some: {
          userId: session.user.id,
          status: "CONFIRMED",
        },
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

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Hola, {user.name} 👋</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/partidos/crear">
              <Button>+ Crear partido</Button>
            </Link>
            <Link href="/partidos">
              <Button variant="outline">Ver partidos</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{myUpcoming.length}</p>
              <p className="text-sm text-muted-foreground">Próximos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalPlayed}</p>
              <p className="text-sm text-muted-foreground">Jugados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalOrganized}</p>
              <p className="text-sm text-muted-foreground">Organizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{user.profiles.length}</p>
              <p className="text-sm text-muted-foreground">Deportes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Próximos partidos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mis próximos partidos</CardTitle>
            </CardHeader>
            <CardContent>
              {myUpcoming.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">
                    No tenés partidos próximos.
                  </p>
                  <Link href="/partidos">
                    <Button variant="link" className="mt-2">
                      Buscar partidos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myUpcoming.map((match) => {
                    const status = statusLabels[match.status];
                    return (
                      <Link key={match.id} href={`/partidos/${match.id}`}>
                        <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer mb-2">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">
                              {sportLabels[match.sport]} {match.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
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
                          <div className="text-right">
                            <span className={`text-xs font-medium ${status.color}`}>
                              {status.label}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              👥 {match.participants.length}/{match.maxPlayers}
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mi perfil</CardTitle>
                <Link href="/perfil/completar">
                  <Button variant="ghost" size="sm">
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

              <div className="space-y-1">
                <p className="text-sm font-semibold">Deportes:</p>
                <div className="flex flex-wrap gap-2">
                  {user.profiles.map(
                    (profile: { id: string; sport: string; level: string }) => (
                      <span
                        key={profile.id}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs"
                      >
                        {sportLabels[profile.sport]} ·{" "}
                        {levelLabels[profile.level]}
                      </span>
                    )
                  )}
                </div>
              </div>

              {user.zone && (
                <p className="text-sm">📍 {user.zone}</p>
              )}

              {activeDays.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Disponibilidad:</p>
                  <p className="text-sm text-muted-foreground">
                    {activeDays.join(", ")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historial */}
        {myPast.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {myPast.map((match) => (
                  <Link key={match.id} href={`/partidos/${match.id}`}>
                    <div className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer mb-2">
                      <p className="text-sm">
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