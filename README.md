# Assessment Management System

**Next.js (App Router) + TypeScript + Tailwind + Puppeteer (EJS templates)**
A configuration-driven PDF report generator that reads assessment records from a local `data/data.ts` file and produces PDF reports per `session_id`. Includes a simple file-based authentication system and secured API + page protection via cookies and middleware.

## Features

- Configuration-driven reports
  - Add/modify assessment types only by editing `config/assessments.json` and adding a template in `/templates` if needed.
  - Field mapping supports dot paths, array index, and find-by (`exercises[id=235]`) patterns.
- PDF generation using EJS templates + Puppeteer.
- Simple authentication (signup/login), JWT issuance, and **httpOnly cookie** set on login.
- Server-side API protection via JWT verification; client-side route protection via `middleware.ts`.
- No external database required — all sample data lives in `data/data.ts`.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- On Linux, Puppeteer may require additional packages:
  ```bash
  sudo apt update
  sudo apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxss1 libgbm-dev
  ```

---

## Setup (download & run)

1. Clone or copy the project into a folder `assessment-system`.

2. Create `.env.local` in project root:

   ```
   JWT_SECRET=replace_this_with_a_strong_random_secret
   NODE_ENV=development
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start dev server:

   ```bash
   npm run dev
   ```

5. Open browser: `http://localhost:3000`

---

## Usage

1. Go to `/signup` — create an account.
2. Log in at `/login`. On successful login the server sets an `httpOnly` cookie named `token`.
3. Navigate to `/generate`, enter a `session_id` (e.g. `session_001` or `session_002`) and click **Generate PDF**.
4. Generated PDFs are saved to `generated-reports/<session_id>-<assessment_id>.pdf`.

---

## How the configuration works

`/config/assessments.json` defines one entry per `assessment_id`. Example:

```json
{
  "as_hr_02": {
    "title": "Health & Fitness Report",
    "template": "as_hr_02.ejs",
    "sections": [
      {
        "id": "body_composition",
        "title": "Body Composition",
        "fields": [
          {
            "label": "BMI",
            "path": "bodyCompositionData.BMI",
            "classify": "bmi"
          }
        ]
      }
    ]
  }
}
```

Rules:

- `path` is a dot-delimited path into the record.
- Arrays: `exercises[0].setList[0].time`.
- Find by property: `exercises[id=235].setList[0].time`.
- `classify` references a name in `config/classifications.json` to transform a numeric value into a label.

Add a new assessment type:

1. Add entries to `data/data.ts` (new record with `assessment_id`).
2. Add a config entry in `config/assessments.json`.
3. Optionally add a template in `/templates` (if omitted, a default template is used).

---

## Security: protecting routes & APIs

- `middleware.ts` (included in the project) checks for the presence of `token` cookie for protected client routes and redirects to `/login` if missing.
- API routes such as `/api/generate-report` verify JWT server-side using `lib/auth.ts` — unauthorized requests receive `401`.
- On login, server sets cookie:
  ```ts
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  ```

---

## Testing

- Use provided sample records in `data/data.ts`:
  - `session_001` → `assessment_id: as_hr_02`
  - `session_002` → `assessment_id: as_card_01`
- Use the UI at `/generate` or `curl`:
  ```bash
  curl -X POST http://localhost:3000/api/generate-report \
    -H "Content-Type: application/json" \
    -d '{"session_id":"session_001"}'
  ```

---

## Extending the system

- Add new classifiers in `config/classifications.json`.
- Add more templates per assessment type under `/templates`.
- Replace file-based user store with a database (Postgres/MySQL) and update auth endpoints.
- Add email-based password recovery and verification.

---

Thank you
