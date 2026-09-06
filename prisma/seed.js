import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Users
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      password: await bcrypt.hash("password123", 10),
    },
  });

  // Group
  const group = await prisma.group.create({
    data: {
      name: "Distributed Systems Study Group",
      members: {
        connect: [{ id: alice.id }, { id: bob.id }],
      },
    },
  });

  // Session
  const session = await prisma.session.create({
    data: {
      title: "Parallel Programming Basics",
      scheduled: new Date("2026-09-05T10:00:00Z"),
      group: { connect: { id: group.id } },
      host: { connect: { id: alice.id } },
    },
  });

  // RSVPs
  await prisma.rSVP.create({
    data: {
      status: "GOING",
      user: { connect: { id: bob.id } },
      session: { connect: { id: session.id } },
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
