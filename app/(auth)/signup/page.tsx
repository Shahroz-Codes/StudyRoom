"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) router.push("/login");
      else setMessage(data.error || "Could not create your account.");
    } catch {
      setMessage("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f6f7f2] px-5 py-10 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[#dfe5df] bg-white shadow-[0_24px_70px_rgba(23,33,31,0.1)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 p-8 md:order-1 md:p-12"><p className="text-sm font-bold uppercase tracking-widest text-[#e35d3f]">Start together</p><h1 className="mt-3 text-3xl font-black tracking-tight">Create your study room</h1><p className="mt-3 text-sm leading-6 text-[#68736f]">Bring your people together and make time for the work that matters.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-bold">Name <span className="font-normal text-[#68736f]">(optional)</span><input type="text" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-xl border border-[#cbd5ce] px-4 py-3 outline-none transition focus:border-[#e35d3f] focus:ring-4 focus:ring-[#e35d3f]/10" placeholder="What should we call you?" /></label>
            <label className="block text-sm font-bold">Email<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl border border-[#cbd5ce] px-4 py-3 outline-none transition focus:border-[#e35d3f] focus:ring-4 focus:ring-[#e35d3f]/10" placeholder="you@example.com" /></label>
            <label className="block text-sm font-bold">Password<div className="relative mt-2"><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-[#cbd5ce] px-4 py-3 pr-20 outline-none transition focus:border-[#e35d3f] focus:ring-4 focus:ring-[#e35d3f]/10" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#68736f] hover:text-[#e35d3f]">{showPassword ? "Hide" : "Show"}</button></div></label>
            {message && <p role="alert" className="rounded-xl bg-[#fff0ec] px-4 py-3 text-sm text-[#a83b28]">{message}</p>}
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-[#e35d3f] px-4 py-3 font-bold text-white transition hover:bg-[#bd402a] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button>
          </form>
          <p className="mt-8 text-center text-sm text-[#68736f]">Already have an account? <Link href="/login" className="font-bold text-[#e35d3f] hover:underline">Sign in</Link></p>
        </div>
        <div className="order-1 flex flex-col justify-between bg-[#dcefe6] p-8 md:order-2 md:p-10"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#32624c]">StudyRoom</p><h2 className="mt-10 text-4xl font-black tracking-tight text-[#17211f]">Progress feels lighter when it is shared.</h2><p className="mt-5 leading-7 text-[#4d695b]">Schedule focused sessions, see who is showing up, and keep your next step close.</p></div><div className="mt-12 rounded-2xl border border-[#b8d8c7] bg-white/60 p-4 text-sm font-bold text-[#32624c]">Your next focused hour starts here.</div></div>
      </div>
    </div>
  );
}
