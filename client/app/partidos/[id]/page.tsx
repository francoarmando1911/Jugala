import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, ChevronLeft, Users } from "lucide-react";
import { SportTile, LevelPill, Avatar } from "@/components/sport-icon";
import { MatchActions } from "./match-actions";
import { MatchChat } from "@/components/match-chat";

const B = {
  bg: "#0B0D08", card: "#181B11", line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.055)", lime: "#B6F23B", limeDim: "rgba(182,242,59,0.14)",
  text: "#F5F6F1", dim: "rgba(255,255,255,0.56)", faint: "rgba(255,255,255,0.40)",
  ghost: "rgba(255,255,255,0.28)",
};

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Abierto", color: B.lime, bg: "rgba(182,242,59,0.14)" },
  FULL: { label: "Completo", color: "#E9D24B", bg: "rgba(233,210,75,0.14)" },
  PLAYED: { label: "Jugado", color: B.faint, bg: "rgba(255,255,255,0.06)" },
  CANCELLED: { label: "Cancelado", color: "#FF6B6B", bg: "rgba(255,107,107,0.14)" },
};

export default async function PartidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

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
  if (!match) notFound();

  const isOrganizer = match.organizerId === session.user.id;
  const isParticipant = match.participants.some(p => p.userId === session.user.id);
  const spotsLeft = match.maxPlayers - match.participants.length;

  const dateFormatted = new Date(match.date).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long",
  });
  const timeFormatted = new Date(match.date).toLocaleTimeString("es-AR", {
    hour: "2-digit", minute: "2-digit",
  });

  const status = statusLabels[match.status];
  const slots = Array.from({ length: match.maxPlayers });

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        {/* Back */}
        <Link
          href="/partidos"
          className="inline-flex items-center gap-1 text-sm font-medium mb-5 transition-colors hover:opacity-80"
          style={{ color: B.dim }}
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </Link>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.line2}` }}>
          {/* Header */}
          <div className="p-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <SportTile sport={match.sport} size={50} />
              <span
                className="text-xs font-semibold rounded-full px-3 py-1"
                style={{ background: status.bg, color: status.color }}
              >
                {status.label}
              </span>
            </div>
            <h1
              className="text-[22px] font-extrabold tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
            >
              {match.title}
            </h1>
            {match.description && (
              <p className="text-sm mt-2 leading-relaxed" style={{ color: B.dim }}>
                {match.description}
              </p>
            )}
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Info rows */}
          <div className="p-5 space-y-3.5">
            {[
              { icon: CalendarDays, text: dateFormatted, iconColor: B.lime },
              { icon: Clock, text: timeFormatted, iconColor: B.lime },
              { icon: MapPin, text: match.location, iconColor: B.lime },
              { icon: Users, text: `${match.participants.length}/${match.maxPlayers} jugadores${spotsLeft > 0 && match.status === "OPEN" ? ` · faltan ${spotsLeft}` : ""}`, iconColor: B.lime },
            ].map(({ icon: Icon, text, iconColor }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm" style={{ color: B.text }}>
                <Icon className="h-4 w-4 shrink-0" style={{ color: iconColor }} />
                <span className="capitalize">{text}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Player slots */}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: B.faint }}>
              Jugadores
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {slots.map((_, i) => {
                const participant = match.participants[i];
                if (participant) {
                  const isYou = participant.userId === session.user.id;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-[14px] p-3"
                      style={{
                        background: isYou ? B.limeDim : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isYou ? "rgba(182,242,59,0.3)" : B.line2}`,
                      }}
                    >
                      <Avatar name={participant.user.name || "U"} size={36} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: B.text }}>
                          {participant.user.name}
                          {isYou && <span style={{ color: B.lime }}> (vos)</span>}
                        </p>
                        {participant.userId === match.organizerId && (
                          <p className="text-[11px]" style={{ color: B.lime }}>Organizador</p>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 rounded-[14px] p-3"
                    style={{ border: `1.5px dashed ${B.ghost}` }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full"
                      style={{ width: 36, height: 36, border: `1.5px dashed ${B.ghost}` }}
                    >
                      <span className="text-lg" style={{ color: B.ghost }}>+</span>
                    </div>
                    <span className="text-sm" style={{ color: B.faint }}>Libre</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Actions */}
          <div className="p-5">
            <MatchActions
              matchId={match.id}
              matchTitle={match.title}
              matchSport={{ TENNIS: "🎾 Tenis", PADEL: "🏓 Pádel", FOOTBALL: "⚽ Fútbol" }[match.sport] ?? match.sport}
              matchDate={dateFormatted}
              matchLocation={match.location}
              isOrganizer={isOrganizer}
              isParticipant={isParticipant}
              status={match.status}
              spotsLeft={spotsLeft}
            />
          </div>
        </div>

        {/* Chat */}
        {isParticipant && (
          <div className="mt-4">
            <MatchChat matchId={match.id} currentUserId={session.user.id} />
          </div>
        )}
      </div>
    </div>
  );
}
