"use client";
import { useEffect, useState } from "react";
import RSVPButtons from "../components/RSVPButtons";

type Session = {
  id: string;
  title: string;
  scheduled: string;
  group?: {
    name: string;
  };
};

export default function RSVPPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">RSVP to Sessions</h1>
      <ul className="mt-4 space-y-4">
        {sessions.map((s) => (
          <li key={s.id} className="border p-4 rounded">
            <h2 className="font-semibold">{s.title}</h2>
            <p>{new Date(s.scheduled).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Group: {s.group?.name}</p>
            <RSVPButtons sessionId={s.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
