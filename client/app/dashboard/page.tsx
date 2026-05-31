import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profiles: true },
  });

  if (!user?.onboarded) {
    redirect("/perfil/completar");
  }

  const sportLabels: Record<string, string> = {
    TENNIS: "🎾 Tenis",
    PADEL: "🏓 Pádel",
    FOOTBALL: "⚽ Fútbol",
  };

  const levelLabels: Record<string, string> = {
    BEGINNER: "Principiante",
    INTERMEDIATE: "Intermedio",
    ADVANCED: "Avanzado",
    COMPETITIVE: "Competitivo",
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold">¡Bienvenido, {user.name}!</h1>
        <p className="text-muted-foreground">{user.email}</p>

        {user.bio && (
          <p className="italic text-muted-foreground">&quot;{user.bio}&quot;</p>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold">Tus deportes:</p>
          {user.profiles.map((profile: { id: string; sport: string; level: string }) => (
            <span
              key={profile.id}
              className="inline-block mr-2 rounded-full bg-primary/10 px-3 py-1 text-sm"
            >
              {sportLabels[profile.sport]} · {levelLabels[profile.level]}
            </span>
          ))}
        </div>

        {user.zone && (
          <p className="text-sm text-muted-foreground">📍 {user.zone}</p>
        )}
      </div>
    </div>
  );
}