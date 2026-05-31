import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          ¡Bienvenido, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Tu cuenta está funcionando. Esto va a ser el dashboard de Jugala.
        </p>
        <p className="text-sm text-muted-foreground">
          {session.user.email}
        </p>
      </div>
    </div>
  );
}