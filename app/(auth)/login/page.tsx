"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) setMessage("We could not sign you in with those details.");
      else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setMessage("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f6f7f2] px-5 py-10 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[#dfe5df] bg-white shadow-[0_24px_70px_rgba(23,33,31,0.1)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between bg-[#17211f] p-8 text-white md:p-10">
          <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5a18b]">StudyRoom</p><h1 className="mt-10 text-4xl font-black tracking-tight md:text-5xl">Make space for focused work.</h1><p className="mt-5 max-w-sm leading-7 text-[#b9c5bf]">Your groups, plans, and study momentum in one calm place.</p></div>
          <p className="mt-12 text-sm text-[#b9c5bf]">A little structure makes showing up easier.</p>
        </div>
        <div className="p-8 md:p-12"><p className="text-sm font-bold uppercase tracking-widest text-[#e35d3f]">Welcome back</p><h2 className="mt-3 text-3xl font-black tracking-tight">Sign in to your room</h2><p className="mt-3 text-sm leading-6 text-[#68736f]">Pick up where you left off with your study groups.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-bold">Email<input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-xl border border-[#cbd5ce] px-4 py-3 outline-none transition focus:border-[#e35d3f] focus:ring-4 focus:ring-[#e35d3f]/10" placeholder="you@example.com" /></label>
            <label className="block text-sm font-bold">Password<div className="relative mt-2"><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-[#cbd5ce] px-4 py-3 pr-20 outline-none transition focus:border-[#e35d3f] focus:ring-4 focus:ring-[#e35d3f]/10" placeholder="Your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#68736f] hover:text-[#e35d3f]">{showPassword ? "Hide" : "Show"}</button></div></label>
            {message && <p role="alert" className="rounded-xl bg-[#fff0ec] px-4 py-3 text-sm text-[#a83b28]">{message}</p>}
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-[#e35d3f] px-4 py-3 font-bold text-white transition hover:bg-[#bd402a] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="mt-8 text-center text-sm text-[#68736f]">New to StudyRoom? <Link href="/signup" className="font-bold text-[#e35d3f] hover:underline">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
