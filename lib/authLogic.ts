import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signupUser(data: unknown) {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  const { email, password, name } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
}

export async function validateLogin(credentials: unknown) {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(parsed.data.password, user.password);
  if (!isValid) return null;

  return user;
}
