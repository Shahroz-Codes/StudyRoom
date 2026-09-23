"use client";
import { useState } from "react";

type GroupOption = { id: string; name: string };

export default function SessionForm({ groups, onCreated }: { groups: GroupOption[]; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedGroupId = groupId || groups[0]?.id || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scheduled, groupId: selectedGroupId }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error ?? "Could not schedule session.");
      else { setTitle(""); setScheduled(""); onCreated(); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dfe5df] bg-white p-4">
      <label className="mb-2 block text-sm font-bold">Schedule a focus session</label>
      <div className="grid gap-2 md:grid-cols-[1.5fr_1fr_1fr_auto]">
      <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Session title" className="rounded-xl border border-[#dfe5df] px-3 py-2 outline-none focus:border-[#e35d3f]" />
      <input required type="datetime-local" value={scheduled} onChange={e => setScheduled(e.target.value)} className="rounded-xl border border-[#dfe5df] px-3 py-2 outline-none focus:border-[#e35d3f]" />
      <select required value={selectedGroupId} onChange={e => setGroupId(e.target.value)} className="rounded-xl border border-[#dfe5df] px-3 py-2 outline-none focus:border-[#e35d3f]">
        <option value="">Choose group</option>
        {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
      </select>
      <button disabled={loading || groups.length === 0} type="submit" className="rounded-xl bg-[#e35d3f] px-4 py-2 font-bold text-white hover:bg-[#bd402a] disabled:opacity-50">{loading ? "Saving..." : "Schedule"}</button>
      </div>
      {groups.length === 0 && <p className="mt-2 text-sm text-[#68736f]">Create a group first to schedule a session.</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
