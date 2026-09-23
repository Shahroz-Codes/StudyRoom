"use client";
import { useState } from "react";

export default function GroupForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const response = await fetch("/api/groups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not create group.");
    else { setName(""); onCreated(); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dfe5df] bg-white p-4">
      <label className="mb-2 block text-sm font-bold">Start a new group</label>
      <div className="flex flex-col gap-2 sm:flex-row">
      <input
        required
        minLength={2}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Database Systems"
        className="min-w-0 flex-1 rounded-xl border border-[#dfe5df] px-3 py-2 outline-none focus:border-[#e35d3f]"
      />
      <button disabled={loading} type="submit" className="rounded-xl bg-[#e35d3f] px-4 py-2 font-bold text-white hover:bg-[#bd402a] disabled:opacity-50">
        {loading ? "Creating..." : "Create group"}
      </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
