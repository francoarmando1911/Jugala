import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchActions } from "./match-actions";
import Link from "next/link";
import { BackButton } from "@/components/back-button";

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
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-sm">{sportLabels[match.sport]}</span>
            <span className={`text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>
          <CardTitle className="text-2xl">{match.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {match.description && (
            <p className="text-muted-foreground">{match.description}</p>
          )}

          <div className="space-y-2 text-sm">
            <p>📅 {dateFormatted}</p>
            <p>🕐 {timeFormatted}</p>
            <p>📍 {match.location}</p>
            <p>👤 Organizador: {match.organizer.name}</p>
            <p>
              👥 {match.participants.length}/{match.maxPlayers} jugadores
              {spotsLeft > 0 && match.status === "OPEN" && (
                <span className="text-muted-foreground">
                  {" "}· {spotsLeft} {spotsLeft === 1 ? "lugar" : "lugares"}
                </span>
              )}
            </p>
          </div>

          {/* Lista de jugadores */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Jugadores anotados:</p>
            <div className="space-y-1">
              {match.participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                >
                  <span className="font-medium">{p.user.name}</span>
                  {p.userId === match.organizerId && (
                    <span className="text-xs text-muted-foreground">
                      (organizador)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <MatchActions
            matchId={match.id}
            matchTitle={match.title}
            matchSport={sportLabels[match.sport]}
            matchDate={dateFormatted}
            matchLocation={match.location}
            isOrganizer={isOrganizer}
            isParticipant={isParticipant}
            status={match.status}
            spotsLeft={spotsLeft}
          />
          <BackButton fallback="/dashboard" />
        </CardContent>
      </Card>
    </div>
  );
}