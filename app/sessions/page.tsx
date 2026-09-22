"use client";
import { useEffect, useState } from "react";
import SessionForm from "../api/components/SessionForm";

type Session = {
  id: string | number;
  title: string;
  scheduled: string | Date;
  group?: {
    name: string;
  };
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Sessions</h1>
      <SessionForm />
      <ul className="mt-4">
        {sessions.map((s) => (
          <li key={s.id} className="border p-2 rounded">
            {s.title} — {new Date(s.scheduled).toLocaleString()} (Group: {s.group?.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
