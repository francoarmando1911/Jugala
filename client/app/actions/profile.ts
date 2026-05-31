"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type ProfileInput = {
  bio: string;
  zone: string;
  sports: {
    sport: "TENNIS" | "PADEL" | "FOOTBALL";
    level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPETITIVE";
  }[];
  availability: Record<string, boolean>;
};

export async function saveProfile(input: ProfileInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Actualizar datos generales del usuario
  await prisma.user.update({
    where: { id: userId },
    data: {
      bio: input.bio,
      zone: input.zone,
      availability: JSON.stringify(input.availability),
      onboarded: true,
    },
  });

  // Borrar perfiles anteriores y crear los nuevos
  await prisma.profile.deleteMany({
    where: { userId },
  });

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