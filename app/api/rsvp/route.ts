import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, status } = await req.json();
  const userId = (session.user as { id: string }).id;

  const existingRsvp = await prisma.rSVP.findFirst({
    where: { userId, sessionId },
  });

  const rsvp = existingRsvp
    ? await prisma.rSVP.update({
        where: { id: existingRsvp.id },
        data: { status },
      })
    : await prisma.rSVP.create({
        data: { userId, sessionId, status },
      });

  return NextResponse.json(rsvp);
}
