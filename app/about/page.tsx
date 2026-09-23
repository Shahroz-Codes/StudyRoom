import Link from "next/link";

const technologies = [
  { name: "Next.js 16", detail: "App Router, route handlers, layouts, and request proxying" },
  { name: "TypeScript", detail: "Typed UI, API contracts, authentication, and domain models" },
  { name: "React 19", detail: "Client interactions, forms, session-aware navigation, and state" },
  { name: "Auth.js", detail: "Credentials authentication, JWT sessions, protected routes, and proxy checks" },
  { name: "Prisma + PostgreSQL", detail: "Relational data access for users, groups, sessions, and RSVPs" },
  { name: "Tailwind CSS", detail: "Responsive UI styling with a small, consistent visual system" },
  { name: "Zod", detail: "Runtime validation for API payloads and authentication input" },
  { name: "bcryptjs", detail: "Secure password hashing for credential accounts" },
];

const workflows = [
  ["Accounts", "Users sign up with validated credentials, sign in through Auth.js, and receive a JWT-backed session."],
  ["Groups", "Authenticated users create study groups. Group membership controls which resources they can see and use."],
  ["Sessions", "Members schedule focused study sessions for their groups. Sessions include a host, schedule, and attendance summary."],
  ["RSVPs", "Members can mark Going, Maybe, or Not Going. RSVP records are unique per user and session and can be updated safely."],
];

const metrics = [
  ["4", "core relational models", "User, Group, Session, RSVP"],
  ["5", "API route handlers", "Auth, signup, groups, sessions, RSVP"],
  ["3", "attendance states", "Going, Maybe, Not going"],
  ["RUM", "loading time", "Ready to measure with Lighthouse or Web Vitals"],
  ["0", "duplicate RSVP pairs", "Database-enforced composite uniqueness"],
];

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 md:px-10 md:py-10">
      <section className="grid gap-7 border-b border-[#dfe5df] pb-9 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#e35d3f]">Project overview</p>
          <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">A focused workspace for studying together.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-[#68736f]">StudyRoom is a full-stack collaboration app that helps small study groups organize people, schedule focused work, and make attendance visible.</p>
        </div>
        <div className="rounded-3xl bg-[#17211f] p-6 text-white md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f5a18b]">Built to demonstrate</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[#c8d1cc]">
            <li><strong className="text-white">Product thinking:</strong> a clear workflow from group creation to attendance.</li>
            <li><strong className="text-white">Full-stack ownership:</strong> UI, API routes, auth, database schema, and seed data.</li>
            <li><strong className="text-white">Production habits:</strong> validation, authorization, typed boundaries, and graceful states.</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-3 border-b border-[#dfe5df] py-7 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map(([value, label, detail]) => (
          <article key={label} className="rounded-2xl border border-[#dfe5df] bg-white p-4">
            <p className="text-3xl font-black text-[#e35d3f]">{value}</p>
            <h2 className="mt-1 font-black">{label}</h2>
            <p className="mt-1 text-xs leading-5 text-[#68736f]">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-7 border-b border-[#dfe5df] py-9 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e35d3f]">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">One simple domain model.</h2>
          <p className="mt-4 max-w-md leading-7 text-[#68736f]">The application keeps its core concepts intentionally small, which makes the permissions and user journey easy to understand.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {workflows.map(([title, detail], index) => (
            <article key={title} className="rounded-2xl border border-[#dfe5df] bg-white p-5">
              <span className="text-sm font-black text-[#e35d3f]">0{index + 1}</span>
              <h3 className="mt-4 text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68736f]">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-[#dfe5df] py-9">
        <div className="mb-6 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e35d3f]">Technology</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">A modern TypeScript stack.</h2>
          <p className="mt-4 leading-7 text-[#68736f]">The stack is chosen to keep the application fast to develop, easy to reason about, and close to production conventions.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((technology) => (
            <article key={technology.name} className="border-l-2 border-[#e35d3f] bg-white p-4">
              <h3 className="font-black">{technology.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68736f]">{technology.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-7 border-b border-[#dfe5df] py-9 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e35d3f]">Relational design</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">A practical PostgreSQL relationship model.</h2>
          <p className="mt-4 leading-7 text-[#68736f]">PostgreSQL is a strong fit because the product is relationship-heavy. Membership, session ownership, and attendance need referential integrity, joins, unique constraints, and predictable transactional updates.</p>
          <p className="mt-3 text-sm leading-6 text-[#68736f]"><strong className="text-[#17211f]">Why this matters:</strong> a user can belong to many groups, each group can have many sessions, and each session can have many RSVP records. Prisma expresses these relationships in TypeScript while PostgreSQL enforces them at the database layer.</p>
        </div>
        <div className="rounded-3xl bg-[#17211f] p-5 text-sm text-[#d5ded8]">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#42514b] p-4"><p className="font-black text-white">User</p><p className="mt-1 text-xs text-[#aebbb3]">1 user → many RSVPs</p><p className="text-xs text-[#aebbb3]">many users ↔ many groups</p></div>
            <div className="rounded-xl border border-[#42514b] p-4"><p className="font-black text-white">Group</p><p className="mt-1 text-xs text-[#aebbb3]">1 group → many sessions</p><p className="text-xs text-[#aebbb3]">many members through join table</p></div>
            <div className="rounded-xl border border-[#42514b] p-4"><p className="font-black text-white">Session</p><p className="mt-1 text-xs text-[#aebbb3]">belongs to group and host</p><p className="text-xs text-[#aebbb3]">has many attendance records</p></div>
            <div className="rounded-xl border border-[#f0785e] bg-[#26322e] p-4"><p className="font-black text-[#f5a18b]">RSVP</p><p className="mt-1 text-xs text-[#d5ded8]">userId + sessionId is unique</p><p className="text-xs text-[#d5ded8]">upsert makes status changes safe</p></div>
          </div>
          <p className="mt-4 border-t border-[#42514b] pt-4 text-xs leading-5 text-[#aebbb3]">Implemented with Prisma relations, PostgreSQL foreign keys, and a composite unique constraint on RSVP(userId, sessionId).</p>
        </div>
      </section>

      <section className="grid gap-7 py-9 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e35d3f]">Engineering details</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Designed around reliable boundaries.</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-[#68736f]">
            <li><strong className="text-[#17211f]">Authorization:</strong> protected pages and APIs verify the authenticated user and group membership.</li>
            <li><strong className="text-[#17211f]">Validation:</strong> Zod rejects malformed names, dates, credentials, and RSVP values before database writes.</li>
            <li><strong className="text-[#17211f]">Data integrity:</strong> Prisma relations and a composite RSVP uniqueness constraint prevent duplicate attendance records.</li>
            <li><strong className="text-[#17211f]">Resilience:</strong> forms and data screens include loading, empty, API error, and network failure states.</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-[#dcefe6] p-6 md:p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#32624c]">Explore the product</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">See the workflow in action.</h2>
          <p className="mt-3 leading-7 text-[#52665c]">Create an account, start a group, schedule a session, and update your attendance from the dashboard.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-full bg-[#e35d3f] px-5 py-3 font-bold text-white hover:bg-[#bd402a]">Try StudyRoom</Link>
            <Link href="/" className="rounded-full border border-[#a8c7b5] bg-white px-5 py-3 font-bold hover:border-[#e35d3f]">Back home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}