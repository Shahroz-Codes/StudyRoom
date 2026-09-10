"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-red-600 text-white px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">StudyRoom</Link>
      <div className="space-x-4">
        {!session ? (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Signup</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/groups" className="hover:underline">Groups</Link>
            <Link href="/sessions" className="hover:underline">Sessions</Link>
            <button
              onClick={() => signOut()}
              className="bg-white text-red-600 px-3 py-1 rounded hover:bg-red-100"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
