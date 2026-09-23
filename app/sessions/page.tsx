"use client";
import { useEffect, useState } from "react";
import SessionForm from "../api/components/SessionForm";
import RSVPButtons from "../api/components/RSVPButtons";

type Session = {
  id: string | number;
  title: string;
  scheduled: string | Date;
  group?: {
    name: string;
  };
  attendeeCount?: number;
  myRsvp?: string | null;
};

type Group = { id: string; name: string };

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    const [sessionsResponse, groupsResponse] = await Promise.all([fetch("/api/sessions"), fetch("/api/groups")]);
    const sessionData = await sessionsResponse.json();
    const groupData = await groupsResponse.json();
    if (!sessionsResponse.ok || !groupsResponse.ok) setError("Could not load your study data.");
    else { setSessions(sessionData); setGroups(groupData); }
    setLoading(false);
  }

  useEffect(() => {
    async function loadInitialData() {
      const [sessionsResponse, groupsResponse] = await Promise.all([fetch("/api/sessions"), fetch("/api/groups")]);
      const sessionData = await sessionsResponse.json();
      const groupData = await groupsResponse.json();
      if (!sessionsResponse.ok || !groupsResponse.ok) setError("Could not load your study data.");
      else { setSessions(sessionData); setGroups(groupData); }
      setLoading(false);
    }
    loadInitialData();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 md:px-10">
      <div className="mb-8 max-w-2xl"><p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#e35d3f]">Make time for it</p><h1 className="text-4xl font-black tracking-tight">Study sessions</h1><p className="mt-3 text-[#68736f]">Turn good intentions into a time and place your group can show up for.</p></div>
      <SessionForm groups={groups} onCreated={loadData} />
      {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="mt-8 text-[#68736f]">Loading sessions...</p> : <ul className="mt-8 space-y-3">
        {sessions.map((s) => (
          <li key={s.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#dfe5df] bg-white p-5 md:flex-row md:items-center">
            <div><p className="text-xs font-bold uppercase tracking-wider text-[#e35d3f]">{s.group?.name ?? "Study session"}</p><h2 className="mt-1 text-lg font-black">{s.title}</h2><p className="mt-1 text-sm text-[#68736f]">{new Date(s.scheduled).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p></div><div className="flex flex-col items-start gap-2 md:items-end"><p className="text-sm text-[#68736f]"><strong className="text-[#17211f]">{s.attendeeCount ?? 0}</strong> going</p><RSVPButtons sessionId={String(s.id)} currentStatus={s.myRsvp} onUpdated={loadData} /></div>
          </li>
        ))}
        {sessions.length === 0 && <li className="rounded-2xl border border-dashed border-[#cbd5ce] p-10 text-center text-[#68736f]">No sessions scheduled yet.</li>}
      </ul>}
    </main>
  );
}
