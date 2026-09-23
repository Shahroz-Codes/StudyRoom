import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const sessionSchema = z.object({
  title: z.string().trim().min(2).max(120),
  scheduled: z.coerce.date(),
  groupId: z.string().min(1),
});

// GET: list sessions for groups user is in
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.session.findMany({
    where: { group: { members: { some: { id: userId } } } },
    include: {
      group: true,
      host: { select: { id: true, name: true, email: true } },
      rsvps: { select: { userId: true, status: true } },
    },
    orderBy: { scheduled: "asc" },
  });

  return NextResponse.json(sessions.map((item) => ({
    ...item,
    rsvps: undefined,
    attendeeCount: item.rsvps.filter((rsvp) => rsvp.status === "GOING").length,
    myRsvp: item.rsvps.find((rsvp) => rsvp.userId === userId)?.status ?? null,
  })));
}

// POST: create new session
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = sessionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a title, date, and group." }, { status: 400 });
  }

  const group = await prisma.group.findFirst({
    where: { id: parsed.data.groupId, members: { some: { id: userId } } },
    select: { id: true },
  });
  if (!group) return NextResponse.json({ error: "You are not a member of that group." }, { status: 403 });

  const newSession = await prisma.session.create({
    data: {
      title: parsed.data.title,
      scheduled: parsed.data.scheduled,
      groupId: group.id,
      hostId: userId,
    },
    include: { group: true, host: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(newSession);
}
