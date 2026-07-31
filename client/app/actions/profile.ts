"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** @description Datos de entrada para guardar o actualizar un perfil de jugador */
type ProfileInput = {
  bio: string;
  zone: string;
  sports: {
    sport: "TENNIS" | "PADEL" | "FOOTBALL";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPETITIVE";
  }[];
  availability: Record<string, boolean>;
};

/**
 * @description Guarda el perfil del jugador durante el onboarding inicial.
 * Actualiza bio, zona y disponibilidad, reemplaza los deportes seleccionados
 * y marca al usuario como onboarded. Redirige al dashboard.
 * @param input - Datos del perfil (bio, zona, deportes con nivel, disponibilidad)
 */
export async function saveProfile(input: ProfileInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      bio: input.bio,
      zone: input.zone,
      availability: JSON.stringify(input.availability),
      onboarded: true,
    },
  });

  /* Eliminar deportes anteriores y recrear con la nueva selección */
  await prisma.profile.deleteMany({ where: { userId } });

  if (input.sports.length > 0) {
    await prisma.profile.createMany({
      data: input.sports.map((s) => ({
        userId,
        sport: s.sport,
        level: s.level,
      })),
    });
  }

  redirect("/dashboard");
}

/**
 * @description Actualiza el perfil del jugador desde la página de edición.
 * Similar a saveProfile pero permite actualizar la foto de perfil (base64).
 * Redirige al dashboard tras guardar.
 * @param input - Datos del perfil incluyendo imagen opcional
 */
export async function updateProfile(input: ProfileInput & { image?: string | null }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  const data: Record<string, unknown> = {
    bio: input.bio,
    zone: input.zone,
    availability: JSON.stringify(input.availability),
  };

  if (input.image !== undefined) {
    data.image = input.image;
  }

  await prisma.user.update({ where: { id: userId }, data });

  /* Eliminar deportes anteriores y recrear con la nueva selección */
  await prisma.profile.deleteMany({ where: { userId } });

  if (input.sports.length > 0) {
    await prisma.profile.createMany({
      data: input.sports.map((s) => ({
        userId,
        sport: s.sport,
        level: s.level,
      })),
    });
  }

  redirect("/dashboard");
}