"use client";
import { useEffect, useState } from "react";
import RSVPButtons from "../api/components/RSVPButtons";

type Session = {
  id: string;
  title: string;
  scheduled: string;
  group?: {
    name: string;
  };
  attendeeCount?: number;
  myRsvp?: "GOING" | "NOT_GOING" | "MAYBE" | null;
};

export default function RSVPPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSessions() {
    setLoading(true);
    const response = await fetch("/api/sessions");
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not load sessions.");
    else setSessions(data);
    setLoading(false);
  }

  useEffect(() => {
    async function loadInitialSessions() {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      if (!response.ok) setError(data.error ?? "Could not load sessions.");
      else setSessions(data);
      setLoading(false);
    }
    loadInitialSessions();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 md:px-10">
      <div className="mb-8 max-w-2xl"><p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#e35d3f]">Show up together</p><h1 className="text-4xl font-black tracking-tight">Your attendance</h1><p className="mt-3 text-[#68736f]">Let your group know where you stand. You can change your answer any time.</p></div>
      {error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="text-[#68736f]">Loading sessions...</p> : <ul className="space-y-4">
        {sessions.map((s) => (
          <li key={s.id} className="rounded-2xl border border-[#dfe5df] bg-white p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><p className="text-xs font-bold uppercase tracking-wider text-[#e35d3f]">{s.group?.name}</p><h2 className="mt-1 text-xl font-black">{s.title}</h2><p className="mt-1 text-sm text-[#68736f]">{new Date(s.scheduled).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })} · {s.attendeeCount ?? 0} going</p></div><RSVPButtons sessionId={s.id} currentStatus={s.myRsvp} onUpdated={loadSessions} /></div>
          </li>
        ))}
        {sessions.length === 0 && <li className="rounded-2xl border border-dashed border-[#cbd5ce] p-10 text-center text-[#68736f]">There are no sessions to RSVP to.</li>}
      </ul>}
    </main>
  );
}
