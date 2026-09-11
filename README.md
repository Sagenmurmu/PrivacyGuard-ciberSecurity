# 🛡️ PrivacyGuard

### DPDP-Focused Consent & Privacy Governance Platform

PrivacyGuard is a full-stack privacy and consent management platform built to demonstrate how organizations can manage **privacy policies, consent agreements, Data Principals, consent records, privacy-right requests, and audit events** through a centralized dashboard.

The project is inspired by privacy-governance requirements under India's **Digital Personal Data Protection (DPDP) Act, 2023**.

> **Note:** PrivacyGuard is an educational/prototype implementation and should not be treated as legal advice or a production-ready compliance certification system.

---

## ✨ Features

### 📊 Compliance Dashboard

Provides a centralized overview of:

- Privacy policies
- Active consent agreements
- Registered Data Principals
- Consent records
- Opt-in / Opt-out statistics
- Recent consent activity

The dashboard includes interactive visualizations using **Recharts**.

---

### 📜 Privacy Policy Management

Create and manage privacy policies with:

- Policy name
- Policy description
- Version tracking
- Jurisdiction
- Industry sector
- Third-party data-sharing preference
- Created and updated timestamps

Policy versions automatically increment when updated.

---

### 🤝 Consent Agreement Management

Create purpose-specific consent agreements linked to privacy policies.

Each agreement can define:

- Agreement name
- Associated privacy policy
- Processing purpose
- Purpose description
- Agreement duration
- Data attributes being collected
- Agreement version
- Active/inactive status

Example data attributes:

```json
[
  {
    "name": "Email",
    "description": "Customer email address"
  },
  {
    "name": "Phone Number",
    "description": "Customer contact number"
  }
]
```

---

### 👤 Data Principal Management

Maintain a directory of individuals whose personal data is being processed.

Stored information includes:

- Name
- Email address
- Unique Data Principal ID
- Creation timestamp

PII is masked in selected management views to reduce unnecessary exposure.

Example:

```text
s*****3@gmail.com
```

---

### ✅ Consent Lifecycle Tracking

Record consent decisions for a specific Data Principal and consent agreement.

Supported consent states:

```text
Opt-in
Opt-out
```

Each consent transaction is timestamped and can be viewed through the Consent History section.

---

### 🛡️ Privacy Rights

PrivacyGuard includes workflows demonstrating Data Principal rights such as:

- Data access
- Data correction / rectification
- Data export
- Erasure request initiation

The current prototype supports access and rectification workflows directly and records privacy-right-related events in the audit system.

> Full persistent lifecycle management for privacy-right requests can be added using a dedicated `privacy_requests` table.

---

### 📑 Audit Logging

PrivacyGuard records important privacy and consent lifecycle events.

Supported audit actions include:

```text
LOGIN
CONSENT_GRANTED
CONSENT_REVOKED
DATA_ACCESS_REQUESTED
DATA_DELETION_REQUESTED
```

Audit records can contain:

- Action type
- Entity type
- Entity ID
- Consent status
- Timestamp

> The current implementation provides centralized timestamped audit logging. Cryptographic tamper-proofing or append-only storage can be added as a future enhancement.

---

## 🧭 DPDP-Aligned Feature Mapping

| Privacy Governance Area | PrivacyGuard Feature |
|---|---|
| Notice & Consent | Purpose-specific consent agreements |
| Consent Withdrawal | Opt-in / Opt-out consent tracking |
| Purpose Limitation | Agreements are linked to explicit processing purposes |
| Data Minimization | Agreements define specific data attributes |
| Right to Access | Personal-data and consent summary export |
| Right to Correction | Data Principal information can be rectified |
| Right to Erasure | Erasure request initiation and audit event |
| Accountability | Centralized audit logging |
| PII Protection | Masking/redaction of sensitive information |

> This table represents technical feature alignment only. It does not constitute legal certification of DPDP compliance.

---

# 🏗️ Architecture

```text
                         ┌───────────────────────┐
                         │      PrivacyGuard     │
                         │      Next.js App      │
                         └──────────┬────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
             ┌───────────────┐              ┌───────────────┐
             │    Auth.js    │              │   Supabase    │
             │   NextAuth    │              │  PostgreSQL   │
             └───────┬───────┘              └───────┬───────┘
                     │                              │
                     ▼                              ▼
             Supabase Auth                 Application Tables
                                                  │
                       ┌──────────────────────────┼──────────────────────────┐
                       │                          │                          │
                       ▼                          ▼                          ▼
                    Policy                    Agreement                  User
                                                  │                        │
                                                  └───────────┬────────────┘
                                                              ▼
                                                       Consent_Record
                                                              │
                                                              ▼
                                                          audit_log
```

---

# 🧰 Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Radix UI
- Lucide Icons

### Forms & Validation

- React Hook Form
- Zod

### Data Visualization

- Recharts

### Authentication

- Auth.js / NextAuth
- Credentials Provider
- Supabase Authentication

### Backend & Database

- Supabase
- PostgreSQL

### Utilities

- UUID
- Sonner
- PII masking utilities

---

# 📂 Project Structure

```text
Consent-Management/
│
├── app/
│   │
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │
│   ├── dashboard/
│   │   │
│   │   ├── overview/
│   │   │   └── Dashboard metrics and charts
│   │   │
│   │   ├── policies/
│   │   │   └── Privacy policy management
│   │   │
│   │   ├── agreement/
│   │   │   └── Consent agreement management
│   │   │
│   │   ├── users/
│   │   │   └── Data Principal management
│   │   │
│   │   ├── consent/
│   │   │   └── Consent lifecycle management
│   │   │
│   │   ├── audit/
│   │   │   └── Privacy and consent audit events
│   │   │
│   │   └── privacy-rights/
│   │       └── Data Principal rights workflows
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   └── ui/
│
├── constants/
│
├── hooks/
│
├── lib/
│   ├── audit.ts
│   ├── client.ts
│   ├── pii.ts
│   ├── searchparams.ts
│   └── utils.ts
│
├── public/
│
├── types/
│
├── auth.config.ts
├── auth.ts
├── middleware.ts
├── .env.example
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Consent-Management.git
cd Consent-Management
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create a Supabase Project

Create a project at:

```text
https://supabase.com
```

After the project is created, obtain:

```text
Project URL
Publishable / Anon Key
```

You will use them in `.env.local`.

---

# 🗄️ Database Setup

Open:

```text
Supabase Dashboard
→ SQL Editor
→ New Query
```

Run the following SQL.

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================================================
-- POLICY
-- =========================================================

CREATE TABLE IF NOT EXISTS public."Policy" (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name TEXT NOT NULL,
    policy_description TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    jurisdiction TEXT NOT NULL,
    "industrySector" TEXT NOT NULL,
    "shareData" BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);


-- =========================================================
-- DATA PRINCIPAL
-- =========================================================

CREATE TABLE IF NOT EXISTS public."User" (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);


-- =========================================================
-- AGREEMENT
-- =========================================================

CREATE TABLE IF NOT EXISTS public."Agreement" (
    agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_name TEXT NOT NULL,

    policy_id UUID NOT NULL,

    purpose TEXT NOT NULL,
    purpose_description TEXT NOT NULL,

    agreement_duration TEXT NOT NULL,

    data_attributes JSONB NOT NULL DEFAULT '[]'::jsonb,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    version TEXT NOT NULL DEFAULT '1.0',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT fk_agreement_policy
        FOREIGN KEY (policy_id)
        REFERENCES public."Policy"(policy_id)
        ON DELETE RESTRICT
);


-- =========================================================
-- CONSENT RECORD
-- =========================================================

CREATE TABLE IF NOT EXISTS public."Consent_Record" (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,
    agreement_id UUID NOT NULL,

    consent_status TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,

    CONSTRAINT fk_consent_user
        FOREIGN KEY (user_id)
        REFERENCES public."User"(user_id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_consent_agreement
        FOREIGN KEY (agreement_id)
        REFERENCES public."Agreement"(agreement_id)
        ON DELETE RESTRICT,

    CONSTRAINT valid_consent_status
        CHECK (consent_status IN ('Opt-in', 'Opt-out'))
);


-- =========================================================
-- AUDIT LOG
-- =========================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    action TEXT NOT NULL,

    entity_type TEXT,
    entity_id UUID,

    consent_status TEXT,

    actor_email TEXT,
    details TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_agreement_policy
ON public."Agreement"(policy_id);

CREATE INDEX IF NOT EXISTS idx_consent_user
ON public."Consent_Record"(user_id);

CREATE INDEX IF NOT EXISTS idx_consent_agreement
ON public."Consent_Record"(agreement_id);

CREATE INDEX IF NOT EXISTS idx_consent_created
ON public."Consent_Record"(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_created
ON public.audit_log(created_at DESC);
```

---

# ⚠️ Local Development Database Access

The current version of PrivacyGuard performs some Supabase queries and mutations directly from client-side components.

For local development, the project can be run using permissive database access.

One simple development-only configuration is:

```sql
ALTER TABLE public."Policy" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Agreement" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public."Consent_Record" DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log DISABLE ROW LEVEL SECURITY;
```

And:

```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public."Policy"
TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public."Agreement"
TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public."User"
TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public."Consent_Record"
TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.audit_log
TO anon, authenticated;
```

> ⚠️ **Security Warning**
>
> This configuration is intended only for local development and demonstrations.
>
> Before production deployment:
>
> - Enable Supabase Row Level Security
> - Create appropriate RLS policies
> - Move privileged mutations to Server Actions or API Route Handlers
> - Validate the Auth.js session server-side
> - Never expose Supabase service-role credentials to the browser

---

# 🔐 Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configure:

```env
SUPABASE_URL=https://your-project-id.supabase.co

SUPABASE_KEY=your-supabase-publishable-or-anon-key

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=your-secure-random-secret

AUTH_TRUST_HOST=true
```

---

## Generate `NEXTAUTH_SECRET`

Using OpenSSL:

```bash
openssl rand -base64 32
```

Or using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Never commit `.env.local` to GitHub.

---

# 👤 Create an Authentication User

PrivacyGuard authentication uses:

```text
Auth.js Credentials Provider
           ↓
Supabase Auth
           ↓
Email + Password authentication
```

Create a test account from:

```text
Supabase Dashboard
→ Authentication
→ Users
→ Add User
```

Example:

```text
Email:
admin@example.com

Password:
YourStrongPassword
```

For local development, confirm the test user if required.

---

# ▶️ Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Recommended Testing Flow

After signing in, test features in this order:

```text
Create Policy
     ↓
Create Agreement
     ↓
Create Data Principal
     ↓
Record Consent
     ↓
Check Consent History
     ↓
Check Audit Logs
     ↓
Test Privacy Rights
```

This order is recommended because agreements depend on policies and consent records depend on both Data Principals and agreements.

---

# 🏭 Production Build

Create an optimized Next.js build:

```bash
npm run build
```

Run the production server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

A successful build should complete:

```text
Compiled successfully
Linting and checking validity of types
Collecting page data
Generating static pages
Finalizing page optimization
```

---

# 🔒 Security Notes

The current project is suitable for:

- Local development
- Portfolio demonstration
- Academic projects
- Hackathons
- Technical interviews
- Privacy engineering demonstrations

Before production deployment, additional security work is recommended.

### Recommended Production Architecture

```text
Browser
   ↓
Auth.js Session
   ↓
Next.js Server Action / API Route
   ↓
Authorization Check
   ↓
Server-side Supabase Client
   ↓
PostgreSQL + RLS
```

Recommended improvements include:

- Enable Row Level Security
- Add role-based access control
- Move database mutations server-side
- Introduce server-only Supabase credentials where appropriate
- Add rate limiting
- Add request validation
- Add persistent privacy-right request tracking
- Add tamper-evident audit logging
- Add automated security tests

---

# 🔮 Future Improvements

Potential enhancements include:

- Persistent `privacy_requests` workflow
- Request status tracking:
  - Pending
  - In Progress
  - Fulfilled
  - Rejected
- Request SLA monitoring
- Consent withdrawal history
- Policy approval workflow
- Role-based administration
- Multi-tenant organization support
- Consent expiry notifications
- Cryptographically tamper-evident audit logs
- Advanced privacy analytics
- Automated retention policies
- RLS-based authorization
- Server-side privacy operations

---

# 📊 Core Database Relationships

```text
Policy
   │
   │ policy_id
   ▼
Agreement
   │
   │ agreement_id
   ▼
Consent_Record
   ▲
   │ user_id
   │
User


Privacy & Consent Events
          │
          ▼
      audit_log
```

---

# 🧑‍💻 Development Commands

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

Run production build:

```bash
npm start
```

Check Git status:

```bash
git status
```

---

# 📝 Example Workflow

### Step 1 — Create Policy

```text
Policy Name:
Customer Privacy Policy

Description:
Defines how customer personal data is processed.

Jurisdiction:
India

Industry Sector:
Technology
```

---

### Step 2 — Create Agreement

```text
Agreement Name:
Marketing Consent Agreement

Purpose:
Marketing Communication

Agreement Duration:
12 months
```

Example attribute:

```text
Attribute:
Email

Description:
Customer email address used for communication.
```

---

### Step 3 — Create Data Principal

```text
Name:
Sagen Murmu

Email:
sagen@example.com
```

---

### Step 4 — Record Consent

```text
User:
Rahul Kumar

Agreement:
Marketing Consent Agreement

Status:
Opt-in
```

The consent transaction will then appear in the Consent History and related dashboard metrics.

---

# ⚖️ Disclaimer

PrivacyGuard is a technical demonstration of privacy-governance concepts.

It is **not legal advice**, does not guarantee regulatory compliance, and should not be considered a substitute for professional legal, security, or privacy consultation.

Organizations deploying privacy-management software should independently review their obligations under applicable laws and regulations.

---

# 📄 License

Add the license appropriate for your repository.

For example, if using MIT:

```text
MIT License
```

---

## ⭐ Project Summary

PrivacyGuard demonstrates a complete privacy and consent management workflow:

```text
Privacy Policy
      ↓
Consent Agreement
      ↓
Data Principal
      ↓
Consent Decision
      ↓
Consent History
      ↓
Audit Event
      ↓
Privacy Rights Management
```

The project combines **Next.js, TypeScript, Supabase, Auth.js, PostgreSQL, Tailwind CSS, and modern privacy-engineering concepts** into a unified governance dashboard.