"use client";
import { useEffect, useState } from "react";
import GroupForm from "../api/components/GroupFrom";

interface Group {
  id: string | number;
  name: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadGroups() {
    setLoading(true);
    const response = await fetch("/api/groups");
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not load groups.");
    else setGroups(data);
    setLoading(false);
  }

  useEffect(() => {
    async function loadInitialGroups() {
      const response = await fetch("/api/groups");
      const data = await response.json();
      if (!response.ok) setError(data.error ?? "Could not load groups.");
      else setGroups(data);
      setLoading(false);
    }
    loadInitialGroups();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 md:px-10">
      <div className="mb-8 max-w-2xl"><p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#e35d3f]">Your circle</p><h1 className="text-4xl font-black tracking-tight">Study groups</h1><p className="mt-3 text-[#68736f]">Groups keep your people, sessions, and shared momentum in one place.</p></div>
      <GroupForm onCreated={loadGroups} />
      {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? <p className="mt-8 text-[#68736f]">Loading groups...</p> : groups.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-[#cbd5ce] p-10 text-center"><p className="font-bold">No groups yet</p><p className="mt-1 text-sm text-[#68736f]">Create your first group above.</p></div> : <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <li key={g.id} className="rounded-2xl border border-[#dfe5df] bg-white p-5"><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-black">{g.name}</h2><span className="rounded-full bg-[#dcefe6] px-3 py-1 text-xs font-bold text-[#32624c]">Active</span></div><div className="mt-6 flex gap-5 text-sm text-[#68736f]"><span><strong className="text-[#17211f]">{(g as Group & { _count?: { members: number } })._count?.members ?? 1}</strong> members</span><span><strong className="text-[#17211f]">{(g as Group & { _count?: { sessions: number } })._count?.sessions ?? 0}</strong> sessions</span></div></li>
        ))}
      </ul>}
    </main>
  );
}
