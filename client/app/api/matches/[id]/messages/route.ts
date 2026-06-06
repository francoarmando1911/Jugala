import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: matchId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verify user is participant
  const participation = await prisma.participation.findUnique({
    where: {
      matchId_userId: {
        matchId,
        userId: session.user.id,
      },
    },
  });

  if (!participation || participation.status !== "CONFIRMED") {
    return NextResponse.json(
      { error: "Solo los participantes pueden ver mensajes" },
      { status: 403 }
    );
  }

  const cursor = request.nextUrl.searchParams.get("cursor");
  const take = 50;

  const messages = await prisma.message.findMany({
    where: { matchId },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
    take,
    ...(cursor
      ? { cursor: { id: cursor }, skip: 1 }
      : {}),
  });

  return NextResponse.json({ messages });
}
