import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const rsvpSchema = z.object({
  sessionId: z.string().min(1),
  status: z.enum(["GOING", "NOT_GOING", "MAYBE"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = rsvpSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid RSVP." }, { status: 400 });
  const userId = (session.user as { id: string }).id;

  const studySession = await prisma.session.findFirst({
    where: { id: parsed.data.sessionId, group: { members: { some: { id: userId } } } },
    select: { id: true },
  });
  if (!studySession) return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const rsvp = await prisma.rSVP.upsert({
    where: { userId_sessionId: { userId, sessionId: parsed.data.sessionId } },
    update: { status: parsed.data.status },
    create: { userId, sessionId: parsed.data.sessionId, status: parsed.data.status },
  });

  return NextResponse.json(rsvp);
}
