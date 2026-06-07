import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./edit-form";

export default async function EditarPerfilPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profiles: true },
  });

  if (!user) redirect("/login");

  const availability = user.availability
    ? (JSON.parse(user.availability) as Record<string, boolean>)
    : {};

  return (
    <EditProfileForm
      initialData={{
        name: user.name || "",
        bio: user.bio || "",
        zone: user.zone || "",
        image: user.image || null,
        sports: user.profiles.map((p) => ({
          sport: p.sport as "TENNIS" | "PADEL" | "FOOTBALL",
          level: p.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPETITIVE",
        })),
        availability,
      }}
    />
  );
}
