"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-[#dfe5df] bg-white px-5 py-4 md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
        <Link href="/" className="text-xl font-black tracking-tight text-[#e35d3f]">StudyRoom<span className="text-[#17211f]">.</span></Link>
      <div className="flex items-center gap-4 text-sm font-semibold text-[#68736f]">
        <Link href="/about" className="hidden hover:text-[#e35d3f] sm:inline">About</Link>
        {!session ? (
          <>
            <Link href="/login" className="hover:text-[#e35d3f]">Login</Link>
            <Link href="/signup" className="rounded-full bg-[#e35d3f] px-4 py-2 text-white hover:bg-[#bd402a]">Get started</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/about" className="hidden hover:underline sm:inline">About</Link>
            <Link href="/groups" className="hover:underline">Groups</Link>
            <Link href="/sessions" className="hover:underline">Sessions</Link>
            <Link href="/rsvp" className="hover:underline">RSVP</Link>
            <span className="hidden border-l border-[#dfe5df] pl-4 text-[#17211f] md:inline">{session.user?.name ?? session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="rounded-full border border-[#dfe5df] px-3 py-1.5 text-[#17211f] hover:border-[#e35d3f] hover:text-[#e35d3f]"
            >
              Logout
            </button>
          </>
        )}
      </div>
      </div>
    </nav>
  );
}
