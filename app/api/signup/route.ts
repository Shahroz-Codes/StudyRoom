import { NextResponse } from "next/server";
import { signupUser } from "@/lib/authLogic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await signupUser(body);
    return NextResponse.json({
      message: "Signup successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
