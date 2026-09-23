import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const groupSchema = z.object({ name: z.string().trim().min(2).max(80) });

// GET: list groups for logged-in user
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await prisma.group.findMany({
    where: { members: { some: { id: userId } } },
    include: {
      _count: { select: { members: true, sessions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(groups);
}

// POST: create new group
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = groupSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Group name must be 2-80 characters." }, { status: 400 });
  }

  const group = await prisma.group.create({
    data: {
      name: parsed.data.name,
      members: { connect: { id: userId } },
    },
    include: { _count: { select: { members: true, sessions: true } } },
  });

  return NextResponse.json(group);
}
