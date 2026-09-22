"use client";
import { useEffect, useState } from "react";
import GroupForm from "../api/components/GroupFrom";

interface Group {
  id: string | number;
  name: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch("/api/groups")
      .then(res => res.json())
      .then(data => setGroups(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Your Groups</h1>
      <GroupForm />
      <ul className="mt-4">
        {groups.map((g) => (
          <li key={g.id} className="border p-2 rounded">{g.name}</li>
        ))}
      </ul>
    </div>
  );
}
