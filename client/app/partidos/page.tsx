import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SportBadge, sportBorderColors } from "@/components/sport-badge";
import { EmptyState } from "@/components/empty-state";
import { MatchFilters } from "./match-filters";

const sportLabels: Record<string, string> = {
  TENNIS: "🎾 Tenis",
  PADEL: "🏓 Pádel",
  FOOTBALL: "⚽ Fútbol",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Abierto", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  FULL: { label: "Completo", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  PLAYED: { label: "Jugado", color: "text-muted-foreground bg-muted" },
  CANCELLED: { label: "Cancelado", color: "text-red-500 bg-red-500/10" },
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
    <div className="px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Partidos</h1>
            <p className="text-sm text-muted-foreground">
              Encontrá un partido cerca tuyo
            </p>
          </div>
          <Link href="/partidos/crear">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Crear
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <MatchFilters
          currentSport={params.sport || "ALL"}
          currentLocation={params.location || ""}
        />

        {matches.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState
                icon={<Search className="h-6 w-6" />}
                title="Sin resultados"
                description="No hay partidos que coincidan con tu búsqueda. Creá uno y esperá que se sumen."
                actionLabel="Crear partido"
                actionHref="/partidos/crear"
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <p className="text-sm text-muted-foreground">
              {matches.length}{" "}
              {matches.length === 1
                ? "partido encontrado"
                : "partidos encontrados"}
            </p>
            {matches.map((match) => {
              const spotsLeft = match.maxPlayers - match.participants.length;
              const status = statusLabels[match.status];
              const borderColor =
                sportBorderColors[match.sport] ?? "border-l-border";
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
                  <Card
                    className={`group border-l-[3px] ${borderColor} transition-all hover:shadow-md hover:border-border cursor-pointer`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <SportBadge sport={match.sport} />
                            {status && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.color}`}
                              >
                                {status.label}
                              </span>
                            )}
                          </div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {match.title}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {dateFormatted} · {timeFormatted}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {match.location}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="inline-flex items-center gap-1 text-sm">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {match.participants.length}/{match.maxPlayers}
                            </span>
                          </div>
                          {spotsLeft > 0 && match.status === "OPEN" && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {spotsLeft}{" "}
                              {spotsLeft === 1 ? "lugar" : "lugares"}
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
