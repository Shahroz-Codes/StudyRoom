"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardGroup = { id: string; name: string; _count?: { members: number; sessions: number } };
type DashboardSession = { id: string; title: string; scheduled: string; group?: { name: string }; attendeeCount?: number; myRsvp?: string | null };

export default function DashboardPage() {
  const [groups, setGroups] = useState<DashboardGroup[]>([]);
  const [sessions, setSessions] = useState<DashboardSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const [groupsResponse, sessionsResponse] = await Promise.all([fetch("/api/groups"), fetch("/api/sessions")]);
      const groupsData = await groupsResponse.json();
      const sessionsData = await sessionsResponse.json();
      if (!groupsResponse.ok || !sessionsResponse.ok) setError("Could not load your dashboard.");
      else { setGroups(groupsData); setSessions(sessionsData); }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const going = sessions.filter((session) => session.myRsvp === "GOING").length;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 md:px-10">
      <section className="overflow-hidden rounded-3xl bg-[#17211f] px-6 py-10 text-white md:px-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5a18b]">Your study room</p><div className="mt-3 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><h1 className="max-w-xl text-4xl font-black tracking-tight md:text-5xl">Make a little room for focused work.</h1><p className="mt-4 max-w-lg text-[#b9c5bf]">See what your groups are working on, choose your next session, and keep your commitments visible.</p></div><Link href="/sessions" className="w-fit rounded-full bg-[#e35d3f] px-5 py-3 font-bold hover:bg-[#f0785e]">Schedule a session</Link></div></section>
      {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="mt-8 text-[#68736f]">Loading your room...</p> : <><section className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-[#dfe5df] bg-white p-5"><p className="text-sm text-[#68736f]">Groups</p><p className="mt-2 text-3xl font-black">{groups.length}</p></div><div className="rounded-2xl border border-[#dfe5df] bg-white p-5"><p className="text-sm text-[#68736f]">Upcoming sessions</p><p className="mt-2 text-3xl font-black">{sessions.length}</p></div><div className="rounded-2xl border border-[#dfe5df] bg-white p-5"><p className="text-sm text-[#68736f]">You are going to</p><p className="mt-2 text-3xl font-black">{going}</p></div></section><section className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]"><div><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-black">Next up</h2><Link href="/rsvp" className="text-sm font-bold text-[#e35d3f]">Manage RSVPs</Link></div><div className="space-y-3">{sessions.slice(0, 4).map((session) => <article key={session.id} className="rounded-2xl border border-[#dfe5df] bg-white p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-[#e35d3f]">{session.group?.name}</p><h3 className="mt-1 font-black">{session.title}</h3><p className="mt-1 text-sm text-[#68736f]">{new Date(session.scheduled).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p></div><span className="rounded-full bg-[#dcefe6] px-3 py-1 text-xs font-bold text-[#32624c]">{session.attendeeCount ?? 0} going</span></div></article>)}{sessions.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbd5ce] p-8 text-center text-sm text-[#68736f]">No sessions yet. Start one for your group.</div>}</div></div><div><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-black">Your groups</h2><Link href="/groups" className="text-sm font-bold text-[#e35d3f]">View all</Link></div><div className="space-y-3">{groups.slice(0, 4).map((group) => <Link href="/groups" key={group.id} className="block rounded-2xl border border-[#dfe5df] bg-white p-5 hover:border-[#e35d3f]"><h3 className="font-black">{group.name}</h3><p className="mt-2 text-sm text-[#68736f]">{group._count?.members ?? 1} members · {group._count?.sessions ?? 0} sessions</p></Link>)}{groups.length === 0 && <div className="rounded-2xl border border-dashed border-[#cbd5ce] p-8 text-center text-sm text-[#68736f]">Create your first study group.</div>}</div></div></section></>}
    </main>
  );
}