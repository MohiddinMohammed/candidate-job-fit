# Candidate Job Fit

Production-ready MVP for an AI-powered job matching platform built with Next.js App Router and TypeScript. Users can upload resumes, refine parsed profile data, define job preferences, discover ranked jobs from provider sources, track application status, and generate tailored application materials.

## Project overview

The app helps users:

1. Upload a PDF or DOCX resume (or paste resume text)
2. Parse resume content into an editable candidate profile
3. Configure job preferences and hard filters
4. Discover opportunities across provider-based job sources
5. Review transparent match scores with rationale and skill gaps
6. Track application status and notes
7. Generate tailored resume and cover letter drafts

Landing page hero copy: **"Find jobs that actually match your resume."**

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Zod
- React Hook Form
- TanStack Query
- Vitest

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` (or update `.env`) and set values:

```bash
OPENAI_API_KEY=
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=
DATABASE_URL=postgresql://user:password@localhost:5432/candidate_job_fit?schema=public
```

`OPENAI_API_KEY`, `GOOGLE_SEARCH_API_KEY`, and `GOOGLE_SEARCH_ENGINE_ID` are optional. The app works with deterministic/mock behavior when not set.

### 3) Generate Prisma client

```bash
npm run prisma:generate
```

### 4) (Optional) run migrations and seed demo data

```bash
npm run prisma:migrate
npm run seed
```

If no database is configured, the app still runs using local in-memory state for demo flow.

### 5) Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

- Development: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Type check: `npm run typecheck`
- Format: `npm run format`
- Test: `npm run test`
- Prisma generate: `npm run prisma:generate`
- Prisma migrate: `npm run prisma:migrate`
- Seed data: `npm run seed`

## Architecture overview

### UI

- `src/app/page.tsx`: Landing page
- `src/app/dashboard/page.tsx`: Main dashboard
- `src/app/jobs/[jobId]/page.tsx`: Job details view

### API routes

- `POST /api/bootstrap`: initialize demo state
- `POST /api/resume`: resume upload + parsing + profile update
- `POST /api/profile`: save profile edits
- `POST /api/preferences`: save preference edits
- `POST /api/jobs/discover`: trigger provider discovery and ranking
- `POST /api/jobs/manual`: add manual job entry
- `POST /api/jobs/:jobId/application`: update application status/notes
- `POST /api/jobs/:jobId/documents`: generate resume/cover letter draft
- `GET /api/dashboard`: fetch dashboard with filters/sort
- `POST /api/delete-data`: local data deletion placeholder

### Domain services

- `src/lib/resume-parser.ts`: file validation, extraction, deterministic parsing
- `src/lib/matching.ts`: hybrid scoring engine + filter/sort
- `src/lib/job-providers.ts`: provider abstraction
- `src/lib/ai-service.ts`: mock + optional OpenAI service abstraction
- `src/lib/store.ts`: local state orchestration and dashboard assembly

### Job source provider architecture

```ts
interface JobSourceProvider {
  search(profile, preferences): Promise<JobResult[]>;
}
```

Implemented providers:

- `MockJobProvider`
- `SearchResultProvider` (placeholder for official search APIs)
- `ManualJobProvider`

## Compliance and safe behavior

- LinkedIn scraping/automation is intentionally **not implemented**
- No robot/captcha/auth/paywall bypass behavior
- Apply action always opens original job URL in a new tab
- Restricted pages can be analyzed via user-pasted job description
- Generated documents include review disclaimer:
  - _"Review before sending. The system should not invent experience or qualifications."_

## Privacy and security basics

- PDF/DOCX type checks and file size limit enforcement
- Resume text sanitation before parsing
- No client-side API key exposure
- Privacy note in UI for sensitive resume data
- Data deletion endpoint placeholder for user-controlled cleanup

## Tests

Vitest coverage currently includes:

- Resume parsing fallback logic
- Job matching score behavior
- Preference filtering and sorting
- Application status update flow
- Generated document creation flow

Run:

```bash
npm run test
```

## Future roadmap

- Official Google Programmable Search API integration
- Official job board integrations
- Embeddings-based semantic matching
- Authentication and multi-user accounts
- Subscription billing
- Email alerts and saved search notifications
- Browser extension for user-approved job capture
- Recruiter/employer portal
- Application success analytics
