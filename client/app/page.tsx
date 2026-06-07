import { auth } from "@/lib/auth";
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

  return (
    <main>
      <Hero />
      <Features />
      <AddToHome />
    </main>
  );
}