import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET: list sessions for groups user is in
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.session.findMany({
    where: { group: { members: { some: { id: userId } } } },
    include: { group: true },
  });

  return NextResponse.json(sessions);
}

// POST: create new session
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, scheduled, groupId } = await req.json();

  const newSession = await prisma.session.create({
    data: {
      title,
      scheduled: new Date(scheduled),
      groupId,
      hostId: userId,
    },
  });

  return NextResponse.json(newSession);
}
