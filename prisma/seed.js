import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.rSVP.deleteMany();
  await prisma.session.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      password,
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya",
      email: "priya@example.com",
      password,
    },
  });

  const systemsGroup = await prisma.group.create({
    data: {
      name: "Distributed Systems Study Group",
      members: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: priya.id }],
      },
    },
  });

  const frontendGroup = await prisma.group.create({
    data: {
      name: "Frontend Architecture Lab",
      members: { connect: [{ id: alice.id }, { id: priya.id }] },
    },
  });

  const systemsSession = await prisma.session.create({
    data: {
      title: "Parallel Programming Basics",
      scheduled: new Date("2026-09-25T10:00:00Z"),
      group: { connect: { id: systemsGroup.id } },
      host: { connect: { id: alice.id } },
    },
  });

  const frontendSession = await prisma.session.create({
    data: {
      title: "Designing resilient loading states",
      scheduled: new Date("2026-09-27T15:30:00Z"),
      group: { connect: { id: frontendGroup.id } },
      host: { connect: { id: priya.id } },
    },
  });

  await prisma.rSVP.create({
    data: {
      status: "GOING",
      user: { connect: { id: bob.id } },
      session: { connect: { id: systemsSession.id } },
    },
  });
  await prisma.rSVP.create({
    data: {
      status: "MAYBE",
      user: { connect: { id: alice.id } },
      session: { connect: { id: frontendSession.id } },
    },
  });

  console.log("Seed data created successfully.");
  console.log("Demo accounts: alice@example.com, bob@example.com, priya@example.com");
  console.log("Password for each account: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
