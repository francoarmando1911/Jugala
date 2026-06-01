import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Verificar que sea admin
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser || (currentUser as unknown as { role: string }).role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Stats generales
  const [
    totalUsers,
    usersOnboarded,
    totalMatches,
    openMatches,
    fullMatches,
    playedMatches,
    totalParticipations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { onboarded: true } }),
    prisma.match.count(),
    prisma.match.count({ where: { status: "OPEN" } }),
    prisma.match.count({ where: { status: "FULL" } }),
    prisma.match.count({ where: { status: "PLAYED" } }),
    prisma.participation.count({ where: { status: "CONFIRMED" } }),
  ]);

  // Usuarios recientes
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      zone: true,
      onboarded: true,
      role: true,
      createdAt: true,
      profiles: { select: { sport: true, level: true } },
    },
  });

  // Partidos recientes
  const recentMatches = await prisma.match.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      organizer: { select: { name: true } },
      participants: { where: { status: "CONFIRMED" } },
    },
  });

  // Deportes más jugados
  const sportCounts = await prisma.profile.groupBy({
    by: ["sport"],
    _count: { sport: true },
    orderBy: { _count: { sport: "desc" } },
  });

  const sportLabels: Record<string, string> = {
    TENNIS: "🎾 Tenis",
    PADEL: "🏓 Pádel",
    FOOTBALL: "⚽ Fútbol",
  };

  const statusColors: Record<string, string> = {
    OPEN: "text-green-500",
    FULL: "text-yellow-500",
    PLAYED: "text-muted-foreground",
    CANCELLED: "text-red-500",
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Panel de administración</h1>
          <p className="text-muted-foreground">Métricas generales de Jugala</p>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalUsers}</p>
              <p className="text-xs text-muted-foreground">Usuarios</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{usersOnboarded}</p>
              <p className="text-xs text-muted-foreground">Con perfil</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalMatches}</p>
              <p className="text-xs text-muted-foreground">Partidos total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-500">{openMatches}</p>
              <p className="text-xs text-muted-foreground">Abiertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-yellow-500">{fullMatches}</p>
              <p className="text-xs text-muted-foreground">Completos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{playedMatches}</p>
              <p className="text-xs text-muted-foreground">Jugados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{totalParticipations}</p>
              <p className="text-xs text-muted-foreground">Inscripciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Deportes populares */}
        {sportCounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deportes más elegidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {sportCounts.map((sc) => (
                  <div key={sc.sport} className="text-center">
                    <p className="text-2xl font-bold">{sc._count.sport}</p>
                    <p className="text-sm text-muted-foreground">
                      {sportLabels[sc.sport] || sc.sport}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Usuarios recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Últimos usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {user.name}
                        {user.role === "ADMIN" && (
                          <span className="ml-2 text-xs text-primary">ADMIN</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {user.zone && (
                        <p className="text-xs text-muted-foreground">
                          📍 {user.zone}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <span
                        className={`text-xs ${
                          user.onboarded ? "text-green-500" : "text-yellow-500"
                        }`}
                      >
                        {user.onboarded ? "Completo" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partidos recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Últimos partidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {sportLabels[match.sport]} {match.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        📍 {match.location} · por {match.organizer.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(match.date).toLocaleDateString("es-AR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium ${statusColors[match.status]}`}>
                        {match.status}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        👥 {match.participants.length}/{match.maxPlayers}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}