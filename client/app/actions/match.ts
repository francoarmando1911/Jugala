"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/** @description Datos de entrada para crear un partido */
type CreateMatchInput = {
  sport: "TENNIS" | "PADEL" | "FOOTBALL";
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: number;
};

/**
 * @description Crea un nuevo partido y agrega al organizador como primer participante.
 * Redirige a la página del partido creado.
 * @param input - Datos del partido (deporte, título, fecha, hora, ubicación, cupos)
 */
export async function createMatch(input: CreateMatchInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const dateTime = new Date(`${input.date}T${input.time}`);

  if (dateTime <= new Date()) {
    return { error: "La fecha debe ser en el futuro." };
  }

  const match = await prisma.match.create({
    data: {
      sport: input.sport,
      title: input.title,
      description: input.description || null,
      date: dateTime,
      location: input.location,
      maxPlayers: input.maxPlayers,
      organizerId: session.user.id,
      participants: {
        create: {
          userId: session.user.id,
          status: "CONFIRMED",
        },
      },
    },
  });

  redirect(`/partidos/${match.id}`);
}

/**
 * @description Permite a un usuario unirse a un partido abierto.
 * Valida que el partido exista, esté abierto, no esté lleno y que el usuario no esté ya anotado.
 * Cambia el estado a FULL si se completan los cupos.
 * @param matchId - ID del partido al que unirse
 */
export async function joinMatch(matchId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { participants: true },
  });

  if (!match) {
    return { error: "Partido no encontrado." };
  }

  if (match.status !== "OPEN") {
    return { error: "Este partido ya no acepta jugadores." };
  }

  const alreadyJoined = match.participants.some(
    (p) => p.userId === session.user.id && p.status === "CONFIRMED"
  );

  if (alreadyJoined) {
    return { error: "Ya estás anotado en este partido." };
  }

  const confirmedCount = match.participants.filter(
    (p) => p.status === "CONFIRMED"
  ).length;

  if (confirmedCount >= match.maxPlayers) {
    return { error: "El partido está completo." };
  }

  await prisma.participation.create({
    data: {
      matchId,
      userId: session.user.id,
      status: "CONFIRMED",
    },
  });

  /* Si se completaron los cupos, cambiar estado a FULL */
  if (confirmedCount + 1 >= match.maxPlayers) {
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "FULL" },
    });
  }

  revalidatePath(`/partidos/${matchId}`);
  return { success: true };
}

/**
 * @description Permite a un usuario abandonar un partido.
 * El organizador no puede abandonar su propio partido.
 * Cambia el estado de FULL a OPEN si se libera un cupo.
 * @param matchId - ID del partido a abandonar
 */
export async function leaveMatch(matchId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { participants: true },
  });

  if (!match) {
    return { error: "Partido no encontrado." };
  }

  if (match.organizerId === session.user.id) {
    return { error: "El organizador no puede abandonar el partido." };
  }

  await prisma.participation.deleteMany({
    where: {
      matchId,
      userId: session.user.id,
    },
  });

  /* Si estaba lleno, volver a abrir el partido */
  if (match.status === "FULL") {
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "OPEN" },
    });
  }

  revalidatePath(`/partidos/${matchId}`);
  return { success: true };
}

/**
 * @description Elimina un partido. Solo el organizador puede hacerlo.
 * Redirige a la lista de partidos tras la eliminación.
 * @param matchId - ID del partido a eliminar
 */
export async function deleteMatch(matchId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match) {
    return { error: "Partido no encontrado." };
  }

  if (match.organizerId !== session.user.id) {
    return { error: "Solo el organizador puede eliminar el partido." };
  }

  await prisma.match.delete({
    where: { id: matchId },
  });

  redirect("/partidos");
}