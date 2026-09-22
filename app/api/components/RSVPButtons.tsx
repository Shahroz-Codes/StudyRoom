"use client";
import { useState } from "react";

export default function RSVPButtons({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleRSVP(status: "GOING" | "NOT_GOING" | "MAYBE") {
    setLoading(true);
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, status }),
    });
    setLoading(false);
    window.location.reload(); // refresh page to show updated RSVP
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        disabled={loading}
        onClick={() => handleRSVP("GOING")}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Going
      </button>
      <button
        disabled={loading}
        onClick={() => handleRSVP("NOT_GOING")}
        className="bg-gray-600 text-white px-3 py-1 rounded"
      >
        Not Going
      </button>
      <button
        disabled={loading}
        onClick={() => handleRSVP("MAYBE")}
        className="bg-yellow-600 text-white px-3 py-1 rounded"
      >
        Maybe
      </button>
    </div>
  );
}
