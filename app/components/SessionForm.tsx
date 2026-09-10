"use client";
import { useState } from "react";

export default function SessionForm() {
  const [title, setTitle] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [groupId, setGroupId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/sessions", {
      method: "POST",
      body: JSON.stringify({ title, scheduled, groupId }),
    });
    setTitle(""); setScheduled(""); setGroupId("");
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Session title" className="border px-2 py-1 rounded" />
      <input type="datetime-local" value={scheduled} onChange={e => setScheduled(e.target.value)} className="border px-2 py-1 rounded" />
      <input value={groupId} onChange={e => setGroupId(e.target.value)} placeholder="Group ID" className="border px-2 py-1 rounded" />
      <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded">Schedule</button>
    </form>
  );
}
