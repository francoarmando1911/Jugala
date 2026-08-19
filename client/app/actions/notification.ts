"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { headers } from "next/headers";

/** @description Ventana en horas para avisar que un partido confirmado se acerca */
const UPCOMING_WINDOW_HOURS = 3;
/** @description Ventana en minutos para avisar que un partido está por comenzar */
const STARTING_SOON_WINDOW_MINUTES = 30;

/**
 * @description Devuelve las últimas notificaciones del usuario autenticado,
 * junto con el conteo de no leídas.
 */
export async function getNotifications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { notifications: [], unreadCount: 0 };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { match: { select: { id: true, title: true, sport: true } } },
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ]);

  return { notifications, unreadCount };
}

/**
 * @description Marca una notificación puntual como leída.
 * Verifica que pertenezca al usuario autenticado antes de actualizarla.
 * @param notificationId - ID de la notificación a marcar
 */
export async function markNotificationRead(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autenticado" };

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });

  return { success: true };
}

/**
 * @description Marca todas las notificaciones del usuario autenticado como leídas.
 */
export async function markAllNotificationsRead() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "No autenticado" };

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  return { success: true };
}

/**
 * @description Genera (si corresponde) notificaciones in-app para los partidos
 * confirmados del usuario autenticado: aviso de partido próximo (dentro de
 * {@link UPCOMING_WINDOW_HOURS} horas) y de partido por comenzar (dentro de
 * {@link STARTING_SOON_WINDOW_MINUTES} minutos). Es idempotente gracias al
 * constraint único `[userId, matchId, type]`, por lo que puede llamarse
 * periódicamente desde el cliente sin duplicar avisos.
 * Dispara un evento Pusher `notification:new` por cada notificación creada.
 */
export async function generateUpcomingMatchNotifications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { created: 0 };

  const now = new Date();
  const upcomingLimit = new Date(now.getTime() + UPCOMING_WINDOW_HOURS * 60 * 60 * 1000);
  const startingSoonLimit = new Date(now.getTime() + STARTING_SOON_WINDOW_MINUTES * 60 * 1000);

  const matches = await prisma.match.findMany({
    where: {
      status: { in: ["OPEN", "FULL"] },
      date: { gte: now, lte: upcomingLimit },
      participants: { some: { userId: session.user.id, status: "CONFIRMED" } },
    },
    select: { id: true, title: true, sport: true, date: true },
  });

  if (matches.length === 0) return { created: 0 };

  let created = 0;

  for (const match of matches) {
    const isStartingSoon = match.date <= startingSoonLimit;
    const type = isStartingSoon ? "MATCH_STARTING_SOON" : "MATCH_UPCOMING";
    const minutesLeft = Math.max(1, Math.round((match.date.getTime() - now.getTime()) / 60000));

    const title = isStartingSoon ? "¡Tu partido está por comenzar!" : "Tenés un partido próximo";
    const body = isStartingSoon
      ? `"${match.title}" arranca en ${minutesLeft} min.`
      : `"${match.title}" es hoy a las ${match.date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}.`;

    try {
      const notification = await prisma.notification.create({
        data: { userId: session.user.id, matchId: match.id, type, title, body },
        include: { match: { select: { id: true, title: true, sport: true } } },
      });

      created += 1;

      await pusherServer.trigger(`user-${session.user.id}`, "notification:new", notification);
    } catch {
      // El constraint único [userId, matchId, type] ya rechazó una notificación duplicada; se ignora.
    }
  }

  return { created };
}
