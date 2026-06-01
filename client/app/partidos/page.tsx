import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MatchFilters } from "./match-filters";

const sportLabels: Record<string, string> = {
  TENNIS: "🎾 Tenis",
  PADEL: "🏓 Pádel",
  FOOTBALL: "⚽ Fútbol",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Abierto", color: "text-green-500" },
  FULL: { label: "Completo", color: "text-yellow-500" },
};

export default async function PartidosPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; location?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;

  // Marcar partidos vencidos como PLAYED automáticamente
  await prisma.match.updateMany({
    where: {
      date: { lt: new Date() },
      status: { in: ["OPEN", "FULL"] },
    },
    data: { status: "PLAYED" },
  });

  // Construir filtros dinámicos
  const where: Record<string, unknown> = {
    date: { gte: new Date() },
    status: { in: ["OPEN", "FULL"] },
  };

  if (params.sport && params.sport !== "ALL") {
    where.sport = params.sport;
  }

  if (params.location) {
    where.location = {
      contains: params.location,
      mode: "insensitive",
    };
  }

  const matches = await prisma.match.findMany({
    where,
    include: {
      organizer: { select: { name: true } },
      participants: { where: { status: "CONFIRMED" } },
    },
    orderBy: { date: "asc" },
    take: 50,
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

        {/* Filtros */}
        <MatchFilters
          currentSport={params.sport || "ALL"}
          currentLocation={params.location || ""}
        />

        {matches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No hay partidos que coincidan con tu búsqueda.
              </p>
              <Link href="/partidos/crear">
                <Button className="mt-4">Crear partido</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {matches.length} {matches.length === 1 ? "partido encontrado" : "partidos encontrados"}
            </p>
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
                            {status && (
                              <span
                                className={`text-xs font-medium ${status.color}`}
                              >
                                {status.label}
                              </span>
                            )}
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