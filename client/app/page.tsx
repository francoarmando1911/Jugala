import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { AddToHome } from "@/components/sections/add-to-home";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  /* Conteos reales de la plataforma para las estadísticas del hero */
  const [playerCount, matchCount] = await Promise.all([
    prisma.user.count(),
    prisma.match.count(),
  ]);

  return (
    <main>
      <Hero playerCount={playerCount} matchCount={matchCount} />
      <Features />
      <AddToHome />
    </main>
  );
}