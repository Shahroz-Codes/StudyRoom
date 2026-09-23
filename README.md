# StudyRoom

StudyRoom is a full-stack study-group workspace for organizing people, planning focused sessions, and making attendance visible. It is designed as a compact production-style application rather than a static CRUD demo: authentication, authorization, relational data integrity, validation, loading states, empty states, and failure handling are all part of the implementation.

The project demonstrates how a modern TypeScript application can model a relationship-heavy product with Next.js, Auth.js, Prisma, and PostgreSQL.

## Product Overview

StudyRoom supports this workflow:

1. A user creates an account or signs in with credentials.
2. The user creates or belongs to study groups.
3. Group members schedule focused study sessions.
4. Members respond with `GOING`, `MAYBE`, or `NOT_GOING`.
5. The dashboard summarizes groups, upcoming sessions, and attendance commitments.

The public About page at `/about` provides a visual technical overview of the architecture and data model.

## Features

- Credentials-based signup and login
- Auth.js JWT sessions
- Protected application pages and API route handlers
- Dashboard with group, session, and attendance summaries
- Group creation with membership-aware access
- Session scheduling with group membership authorization
- RSVP creation and updates without duplicate records
- RSVP counts and current-user attendance state
- Zod validation at API boundaries
- Password hashing with `bcryptjs`
- PostgreSQL relational schema managed through Prisma
- Repeatable demo database seed
- Loading, empty, API-error, and network-error states
- Responsive UI for desktop and mobile layouts
- Public recruiter-oriented project overview page

## Technology Stack

<p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=20232A" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
</p>
<p align="center">
    <img src="https://img.shields.io/badge/Auth.js-v5-000000?style=for-the-badge" alt="Auth.js v5" />
    <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma 5" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
</p>
<p align="center">
    <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 20 or newer" />
    <img src="https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint 9" />
    <img src="https://img.shields.io/badge/npm-package_manager-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" />
</p>

| Layer | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 16 | App Router, layouts, Route Handlers, and Proxy |
| Language | TypeScript | Typed UI components, API code, and application contracts |
| UI | React 19 | Client-side forms, session-aware navigation, and interactive state |
| Styling | Tailwind CSS 4 | Responsive styling and the application visual system |
| Authentication | Auth.js / `next-auth` v5 beta | Credentials provider, JWT sessions, and protected routes |
| ORM | Prisma 5 | Type-safe PostgreSQL queries and relationship mapping |
| Database | PostgreSQL | Users, groups, sessions, memberships, and RSVP persistence |
| Validation | Zod | Runtime validation for request bodies and credentials |
| Password security | bcryptjs | One-way password hashing before persistence |
| Tooling | ESLint, TypeScript, npm | Static analysis, type checking, builds, and dependency management |

## Architecture

The project uses the Next.js App Router exclusively for application routes.

```text
StudyRoom/
├── app/
│   ├── (auth)/login/             Login page
│   ├── (auth)/signup/            Signup page
│   ├── about/                    Public technical overview
│   ├── dashboard/                Authenticated overview
│   ├── groups/                   Group management UI
│   ├── sessions/                 Session scheduling UI
│   ├── rsvp/                     Attendance management UI
│   ├── api/
│   │   ├── auth/[...nextauth]/   Auth.js Route Handler
│   │   ├── groups/               Group GET and POST endpoints
│   │   ├── sessions/             Session GET and POST endpoints
│   │   ├── rsvp/                 RSVP POST endpoint
│   │   └── signup/               Account creation endpoint
│   ├── api/components/           Shared client forms and navigation
│   └── layout.tsx                Root layout and providers
├── auth.ts                       Auth.js configuration and exports
├── lib/
│   ├── authLogic.ts              Signup and credential validation logic
│   └── prisma.ts                 Prisma client singleton
├── prisma/
│   ├── schema.prisma             PostgreSQL data model
│   ├── seed.js                   Demo data seed
│   └── migrations/               Database migration history
└── proxy.ts                      Protected route proxy
```

### Request flow

```text
Browser UI
    ↓ fetch / Auth.js client methods
Next.js Route Handler
    ↓ auth() + Zod validation + authorization checks
Prisma Client
    ↓ typed query
PostgreSQL
```

Server-side authorization is performed close to the data access boundary. A signed-in user is not automatically allowed to access every group or session: group membership is checked before session creation, session reads, and RSVP writes.

## Data Model

The domain is intentionally relational because the important behavior depends on relationships and constraints.

```text
User ── many-to-many ── Group
 │                       │
 │                       └── one-to-many ── Session
 │                                             │
 └──────────── one-to-many ──────────────── RSVP
                                               │
                         Session ─────────────┘
```

### Models

- `User`: credential account, group memberships, hosted sessions, and RSVPs.
- `Group`: study circle with many members and scheduled sessions.
- `Session`: scheduled focus event with an optional group and host.
- `RSVP`: a user's attendance status for one session.

The `RSVP` model has a composite unique constraint on `(userId, sessionId)`. This is important because the same user should have one current attendance decision per session. The API uses an upsert so changing an RSVP updates the existing record instead of creating duplicates.

PostgreSQL is a natural fit for this domain because it provides foreign keys, many-to-many join-table behavior, unique constraints, transactional writes, and reliable querying across related records. Prisma exposes those relationships through typed application code while PostgreSQL remains the final integrity boundary.

## API Surface

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` / `POST` | `/api/auth/[...nextauth]` | Auth.js session and credential actions | Public auth flow |
| `POST` | `/api/signup` | Validate and create a user account | Public |
| `GET` | `/api/groups` | List groups for the current user | Authenticated |
| `POST` | `/api/groups` | Create a group and add the creator as a member | Authenticated |
| `GET` | `/api/sessions` | List sessions visible to the current user's groups | Authenticated |
| `POST` | `/api/sessions` | Schedule a session for a group the user belongs to | Authenticated |
| `POST` | `/api/rsvp` | Create or update attendance for a visible session | Authenticated |

All mutating endpoints validate request bodies before database writes. Protected endpoints reject missing sessions, missing user IDs, and unauthorized group/session access.

## Security and Engineering Practices

- Passwords are hashed with `bcryptjs`; plaintext passwords are never stored.
- Auth.js provides encrypted JWT-backed sessions.
- `AUTH_SECRET` is supplied through the environment rather than committed in source code.
- Route handlers call `auth()` before accessing protected data.
- Group membership is checked before exposing sessions or accepting RSVP writes.
- Zod schemas reject malformed names, credentials, dates, group IDs, and RSVP values.
- Prisma relations and PostgreSQL constraints protect referential integrity.
- The RSVP composite unique constraint prevents duplicate attendance records.
- Signup responses return a safe user projection rather than a password hash.
- UI mutations expose loading and failure states instead of silently failing.

## Local Setup

### Requirements

- Node.js 20 or newer
- npm
- PostgreSQL running locally or a hosted PostgreSQL connection string

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` or update `.env`:

```env
DATABASE_URL=""
AUTH_SECRET="replace-with-a-long-random-secret"
```

Generate a secret with:

```bash
npx auth secret
```

Do not commit real credentials or production secrets.

### 3. Apply the database schema

For an existing migration history:

```bash
npx prisma migrate deploy
npx prisma generate
```

For local schema development:

```bash
npx prisma migrate dev
```

### 4. Seed demo data

```bash
npx prisma db seed
```

The seed resets the development data and creates users, groups, sessions, and RSVP records. Run it only against a development database.

### 5. Start the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

The seed creates three accounts with the same development password:

| Name | Email | Password |
| --- | --- | --- |
| Alice | `alice@example.com` | `password123` |
| Bob | `bob@example.com` | `password123` |
| Priya | `priya@example.com` | `password123` |

Use these accounts to test different group memberships, session visibility, and RSVP behavior.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after building |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Run TypeScript validation |
| `npx prisma db seed` | Reset and load development demo data |
| `npx prisma studio` | Inspect database records through Prisma Studio |

## Testing the Main Workflow

1. Sign in with one of the seeded accounts.
2. Open **Groups** and create a new study group.
3. Open **Sessions**, select that group, and schedule a future session.
4. Open **RSVP** or use the RSVP controls on **Sessions**.
5. Change the attendance status and confirm the count updates.
6. Sign in as another seeded user to compare group visibility and attendance behavior.

## Current Scope and Next Steps

The current implementation focuses on the core study-group workflow. Natural next additions include:

- Member invitations and join requests
- Group detail pages with member management
- Session editing and cancellation
- Calendar export and reminders
- Automated unit, integration, and end-to-end tests
- Production observability with Web Vitals and server metrics
- Role-based permissions for group owners and moderators
- CI checks and a deployed preview environment

These are deliberately listed as future work rather than presented as implemented functionality.

## Project Notes

- The application uses the Next.js App Router and `route.ts` handlers; it does not use a `pages/` directory.
- Next.js 16 names the request interception file `proxy.ts`.
- Auth.js v5 is currently consumed through the `next-auth` package.
- The project includes generated Prisma client output under `app/generated/prisma`; regenerate it after schema changes.
