"use client";
import { useState } from "react";

export default function GroupForm() {
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/groups", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setName("");
    window.location.reload(); // refresh groups list
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Group name"
        className="border px-2 py-1 rounded"
      />
      <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded">
        Create
      </button>
    </form>
  );
}
