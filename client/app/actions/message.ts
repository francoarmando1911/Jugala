"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { headers } from "next/headers";

export async function sendMessage({
  matchId,
  content,
}: {
  matchId: string;
  content: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "No autenticado." };
  }

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 500) {
    return { error: "El mensaje debe tener entre 1 y 500 caracteres." };
  }

  // Verify user is a participant
  const participation = await prisma.participation.findUnique({
    where: {
      matchId_userId: {
        matchId,
        userId: session.user.id,
      },
    },
  });

  if (!participation || participation.status !== "CONFIRMED") {
    return { error: "Solo los participantes pueden enviar mensajes." };
  }

  const message = await prisma.message.create({
    data: {
      content: trimmed,
      matchId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  // Trigger realtime event
  await pusherServer.trigger(`match-${matchId}`, "new-message", {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    user: message.user,
  });

  return { success: true };
}
