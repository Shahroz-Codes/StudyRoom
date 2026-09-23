"use client";
import { useState } from "react";

export default function RSVPButtons({ sessionId, currentStatus, onUpdated }: { sessionId: string; currentStatus?: string | null; onUpdated: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRSVP(status: "GOING" | "NOT_GOING" | "MAYBE") {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status }),
      });
      if (!response.ok) { const data = await response.json(); setError(data.error ?? "Could not save RSVP."); }
      else onUpdated();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div><div className="flex flex-wrap gap-2">
      <button
        disabled={loading}
        onClick={() => handleRSVP("GOING")}
        className={`rounded-full px-3 py-1.5 text-sm font-bold ${currentStatus === "GOING" ? "bg-[#32624c] text-white" : "border border-[#dfe5df] text-[#32624c]"}`}
      >
        Going
      </button>
      <button
        disabled={loading}
        onClick={() => handleRSVP("NOT_GOING")}
        className={`rounded-full px-3 py-1.5 text-sm font-bold ${currentStatus === "NOT_GOING" ? "bg-[#17211f] text-white" : "border border-[#dfe5df] text-[#68736f]"}`}
      >
        Not Going
      </button>
      <button
        disabled={loading}
        onClick={() => handleRSVP("MAYBE")}
        className={`rounded-full px-3 py-1.5 text-sm font-bold ${currentStatus === "MAYBE" ? "bg-[#c58a28] text-white" : "border border-[#dfe5df] text-[#c58a28]"}`}
      >
        Maybe
      </button>
    </div>{error && <p className="mt-2 text-xs text-red-600">{error}</p>}</div>
  );
}
