import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, User, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SportBadge } from "@/components/sport-badge";
import { MatchActions } from "./match-actions";
import { MatchChat } from "@/components/match-chat";
import { BackButton } from "@/components/back-button";

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Abierto", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  FULL: { label: "Completo", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  PLAYED: { label: "Jugado", color: "text-muted-foreground bg-muted" },
  CANCELLED: { label: "Cancelado", color: "text-red-500 bg-red-500/10" },
};

export default async function PartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, name: true } },
      participants: {
        where: { status: "CONFIRMED" },
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!match) {
    notFound();
  }

  const isOrganizer = match.organizerId === session.user.id;
  const isParticipant = match.participants.some(
    (p) => p.userId === session.user.id
  );
  const spotsLeft = match.maxPlayers - match.participants.length;

  const dateFormatted = new Date(match.date).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const timeFormatted = new Date(match.date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const status = statusLabels[match.status];

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-lg space-y-4">
        <BackButton fallback="/partidos" />

        {/* Match info */}
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <SportBadge sport={match.sport} size="md" />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <CardTitle className="text-2xl leading-tight">
              {match.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {match.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {match.description}
              </p>
            )}

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="capitalize">{dateFormatted}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{timeFormatted}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{match.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Organizador: {match.organizer.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  {match.participants.length}/{match.maxPlayers} jugadores
                  {spotsLeft > 0 && match.status === "OPEN" && (
                    <span className="text-muted-foreground">
                      {" "}· {spotsLeft} {spotsLeft === 1 ? "lugar" : "lugares"}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Jugadores anotados
              </p>
              <div className="space-y-1.5">
                {match.participants.map((p) => {
                  const initial = (p.user.name ?? "U")[0].toUpperCase();
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2 text-sm"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {initial}
                      </div>
                      <span className="font-medium">{p.user.name}</span>
                      {p.userId === match.organizerId && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                          Organizador
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <MatchActions
              matchId={match.id}
              matchTitle={match.title}
              matchSport={
                { TENNIS: "🎾 Tenis", PADEL: "🏓 Pádel", FOOTBALL: "⚽ Fútbol" }[
                  match.sport
                ] ?? match.sport
              }
              matchDate={dateFormatted}
              matchLocation={match.location}
              isOrganizer={isOrganizer}
              isParticipant={isParticipant}
              status={match.status}
              spotsLeft={spotsLeft}
            />
          </CardContent>
        </Card>

        {/* Chat — solo para participantes */}
        {isParticipant && (
          <MatchChat matchId={match.id} currentUserId={session.user.id} />
        )}
      </div>
    </div>
  );
}
