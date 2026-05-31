import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sportLabels: Record<string, string> = {
  TENNIS: "🎾 Tenis",
  PADEL: "🏓 Pádel",
  FOOTBALL: "⚽ Fútbol",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Abierto", color: "text-green-500" },
  FULL: { label: "Completo", color: "text-yellow-500" },
  PLAYED: { label: "Jugado", color: "text-muted-foreground" },
  CANCELLED: { label: "Cancelado", color: "text-red-500" },
};

export default async function PartidosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const matches = await prisma.match.findMany({
    where: {
      date: { gte: new Date() },
      status: { in: ["OPEN", "FULL"] },
    },
    include: {
      organizer: { select: { name: true } },
      participants: { where: { status: "CONFIRMED" } },
    },
    orderBy: { date: "asc" },
    take: 20,
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Partidos disponibles</h1>
          <Link href="/partidos/crear">
            <Button>+ Crear partido</Button>
          </Link>
        </div>

        {matches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay partidos próximos. ¡Sé el primero en crear uno!
              </p>
              <Link href="/partidos/crear">
                <Button className="mt-4">Crear partido</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => {
              const spotsLeft = match.maxPlayers - match.participants.length;
              const status = statusLabels[match.status];
              const dateFormatted = new Date(match.date).toLocaleDateString(
                "es-AR",
                { weekday: "short", day: "numeric", month: "short" }
              );
              const timeFormatted = new Date(match.date).toLocaleTimeString(
                "es-AR",
                { hour: "2-digit", minute: "2-digit" }
              );

              return (
                <Link key={match.id} href={`/partidos/${match.id}`}>
                  <Card className="transition-colors hover:bg-muted/50 cursor-pointer mb-3">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {sportLabels[match.sport]}
                            </span>
                            <span
                              className={`text-xs font-medium ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <p className="font-semibold">{match.title}</p>
                          <p className="text-sm text-muted-foreground">
                            📅 {dateFormatted} · 🕐 {timeFormatted}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📍 {match.location}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p>
                            👥 {match.participants.length}/{match.maxPlayers}
                          </p>
                          {spotsLeft > 0 && match.status === "OPEN" && (
                            <p className="text-xs text-muted-foreground">
                              {spotsLeft} {spotsLeft === 1 ? "lugar" : "lugares"}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}