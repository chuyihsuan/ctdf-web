# System Requirements Document (SRD)

Project: 中華民國競技飛鏢總會官方網站  
Version: 1.0  
Source plan: 競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版  
Target launch: 2026 年 10 月中

## 1. System Overview

The CTDF website is planned as a modern web application with public pages, member-facing features, and an admin backend.

Recommended B plan architecture:

```text
User browser
  ↓
ctdf.org.tw / Vercel / Next.js
  ↓
Supabase API
  ↓
PostgreSQL + Auth + Storage + RLS
```

Alternative A plan architecture:

```text
User browser
  ↓
ctdf.org.tw
  ↓
Taiwan Mobile / Taiwan Fixed Network VM
  ↓
Next.js + Node.js + PostgreSQL + Nginx
```

This SRD focuses on the recommended B plan, while noting A plan differences where relevant.

The v11 project plan defines four calendar stages. This SRD uses five system workstreams that map to those stages:

| SRD workstream | Related v11 calendar stage |
|---|---|
| Development environment and demo | Stage 1: July decision and foundation preparation |
| Frontend MVP | Stage 1-2: July foundation and August core frontend/backend development |
| Supabase database | Stage 1-3: July schema, August core data, September content/data preparation |
| Admin management | Stage 1-2: July backend foundation and August core admin workflows |
| Production readiness | Stage 4: October validation, training, DNS, and official launch |

## 2. Technology Stack

| Layer | B Plan Requirement | Notes |
|---|---|---|
| Frontend framework | Next.js / React | App Router recommended. |
| Styling | CSS Modules, Tailwind, or equivalent design system | Must support Mobile First responsive layout. |
| Hosting | Vercel | Free for demo; Pro recommended for production. |
| Database | Supabase PostgreSQL | Free for dev; Pro recommended before official member data. |
| Authentication | Supabase Auth | Members and admins. |
| Authorization | Supabase Row Level Security + app-level role checks | Required before production. |
| Storage | Supabase Storage | Documents and public images. |
| Video | YouTube embed | Do not store large video files in Supabase. |
| DNS | Existing DNS manager or Cloudflare | Must support A, CNAME, TXT records. |
| Source control | GitHub | Vercel deploys from GitHub. |

## 3. Phase 1: Development Environment and Demo

### 3.1 Repository Requirements

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| SRD-1.1 | Repository must contain README and docs. | `README.md`, `docs/FRD.md`, `docs/PRD.md`, `docs/SRD.md` exist. |
| SRD-1.2 | Repository must avoid secrets. | No API keys, passwords, member personal data in repo. |
| SRD-1.3 | Demo deployment must run from GitHub to Vercel. | Push triggers deployment or manual import succeeds. |

### 3.2 Vercel Demo Requirements

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| SRD-1.4 | Vercel Free can be used for demo. | Demo URL is available. |
| SRD-1.5 | Environment variables are not required for static demo. | Demo deploys without Supabase keys. |
| SRD-1.6 | Demo must use placeholder content. | No official member personal data. |

### 3.3 Local Development Requirements

When converted to Next.js:

```bash
npm install
npm run dev
```

Expected local URL:

```text
http://localhost:3000
```

## 4. Phase 2: Frontend MVP

### 4.1 Application Structure

Recommended Next.js route structure:

```text
app/
  page.tsx
  news/
  events/
  rankings/
  players/
  about/
  downloads/
  fairplay/
  member/
  admin/
components/
lib/
styles/
```

### 4.2 Routing Requirements

| Route | Requirement |
|---|---|
| `/` | Home page |
| `/news` | News list |
| `/news/[slug]` | News detail |
| `/events` | Event list |
| `/events/calendar` | Event calendar |
| `/events/[id]` or `/events/[slug]` | Event detail |
| `/events/results` | Result announcements |
| `/rankings` | Ranking overview |
| `/rankings/youth` | Youth rankings |
| `/rankings/history` | Historical results, second-stage feature |
| `/rankings/region` | Regional rankings, second-stage feature |
| `/players` | Player list/search |
| `/players/[id]` | Player profile |
| `/about` | Association intro |
| `/about/organization` | Organization |
| `/about/rules` | Rules |
| `/about/contact` | Contact |
| `/about/privacy` | Privacy policy |
| `/downloads` | Downloads |
| `/downloads/forms` | Application forms |
| `/downloads/rules` | Competition rules |
| `/downloads/annual` | Annual reports / manuals, second-stage feature |
| `/fairplay` | Anti-doping / fair play |
| `/member/login` | Member login |
| `/member/profile` | Member profile |
| `/member/fee` | Membership fee status, second-stage feature |
| `/admin` | Admin dashboard |
| `/admin/news` | News admin |
| `/admin/pages` | Static page admin |
| `/admin/events` | Event admin |
| `/admin/rankings` | Ranking admin |
| `/admin/players` | Player admin |
| `/admin/members` | Member admin |
| `/admin/downloads` | Download admin |
| `/admin/media` | Media admin, second-stage feature |
| `/admin/settings/features` | Feature flags |
| `/admin/settings/roles` | Role settings |
| `/admin/settings/admins` | Admin account settings |
| `/admin/settings/site` | Site settings |
| `/admin/logs` | Audit logs |

### 4.3 Responsive Requirements

Target test widths:

```text
360px, 390px, 430px, 768px, 1024px, 1280px, 1440px
```

Required behavior:

- No horizontal scrolling on MVP pages.
- Ranking/event tables must use mobile-friendly cards or controlled horizontal containers.
- Tap targets should be at least 44px where practical.
- Navigation must be usable on mobile.

### 4.4 SEO Requirements

Each public page type should support:

- Title
- Description
- Open Graph title
- Open Graph description
- Open Graph image where available
- Canonical URL

Production should include:

- `sitemap.xml`
- `robots.txt`

## 5. Phase 3: Supabase Database

### 5.1 Environment Variables

Required for frontend-safe Supabase usage:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Server-only variable:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed in browser code.
- Server-only keys must not be committed to GitHub.
- Production and development projects should use separate keys.

### 5.2 Initial Tables

| Table | Purpose | Public Read | Admin Write |
|---|---|---:|---:|
| `news` | Announcements and articles | Published only | Yes |
| `events` | Event records | Published only | Yes |
| `event_results` | Results and placements | Published only | Yes |
| `rankings` | Ranking rows | Published only | Yes |
| `players` | Player public profiles | Approved only | Yes |
| `profiles` | Auth user profiles | Own/private | Controlled |
| `members` | Member admin data | No | Yes |
| `documents` | Download metadata | Published only | Yes |
| `media_items` | Photos/videos/media reports | Published only | Yes |
| `feature_flags` | Feature availability | Public subset | Super admin |
| `admin_roles` | Admin role definitions | No | Super admin |
| `admin_permissions` | Role permissions | No | Super admin |
| `audit_logs` | Admin action history | No | System insert |

### 5.3 Common Fields

For publishable tables:

```text
id
title/name
slug
status
published_at
created_at
updated_at
created_by
updated_by
```

For source-managed content:

```text
source_type
source_url
source_date
verified_status
usage_rights
publish_status
```

For hard/electronic darts:

```text
type = hard | electronic
```

### 5.4 Row Level Security

RLS must be enabled before production use.

Minimum policies:

- Public can read only published public content.
- Logged-in member can read/update own profile.
- Admin can read backend data according to role.
- Admin write actions must be permission checked.
- Member private data must never be publicly readable.

### 5.5 Storage Buckets

| Bucket | Access | Purpose |
|---|---|---|
| `public-images` | Public read | Approved public images |
| `documents` | Public or controlled read | Forms, rules, reports |
| `member-private` | Restricted | Sensitive member files if ever needed |

Production storage rules:

- Do not upload uncleared images.
- Youth photos require extra care and documented approval.
- Large videos should stay on YouTube.

## 6. Phase 4: Admin Management

### 6.1 Admin Access

Admin routes must be protected:

```text
/admin/**
```

Access logic:

1. User must be authenticated.
2. User must have admin role.
3. User must have permission for requested module/action.

### 6.2 Roles

| Role | Permissions |
|---|---|
| Super admin | All modules, roles, feature flags, settings |
| Secretary admin | Members, documents, static pages, announcements, contact info |
| Event admin | Events, results, rankings, players |
| Content editor | News, media, downloads |
| Ranking admin | Rankings and score records |
| Technical admin | Settings, backup/export, feature flags |
| Read-only | View backend data only |

### 6.3 Audit Logging

The system must log:

- Create
- Update
- Delete
- Publish
- Unpublish
- Archive
- Export
- Role/permission changes

Recommended fields:

```text
id
actor_user_id
actor_role
action
target_table
target_id
before_json
after_json
created_at
ip_address
user_agent
```

### 6.4 Admin UI Requirements

- Data tables should support search/filter where useful.
- Forms must show validation errors.
- Destructive actions require confirmation.
- Publish actions should show current status.
- Export actions must be permission gated.

## 7. Phase 5: Production Readiness

### 7.1 Vercel Requirements

Recommended production state:

- Vercel Team owned by CTDF account.
- Project connected to GitHub repository.
- Production branch set to `main`.
- Preview deployments enabled for pull requests.
- Production environment variables configured.
- Official domain configured:

```text
ctdf.org.tw
www.ctdf.org.tw
```

### 7.2 Supabase Requirements

Recommended production state:

- Supabase Organization owned by CTDF account.
- Separate production project.
- RLS enabled and tested.
- Backups confirmed.
- Storage policies confirmed.
- Service role key stored only in Vercel server-side environment variables.
- At least two CTDF-controlled admins.

### 7.3 DNS Requirements

DNS manager must be able to set:

- A record for root domain if required by Vercel.
- CNAME for `www`.
- TXT record for Vercel verification if required.
- Existing MX/email records must not be removed accidentally.

### 7.4 Security Requirements

| Requirement | Production Standard |
|---|---|
| HTTPS | Required |
| RLS | Required |
| Admin role checks | Required |
| Secret management | Environment variables only |
| Backup | Required before official data |
| Audit logs | Required for admin actions |
| Privacy policy | Required before member signup |
| Personal data notice | Required before collecting personal data |

### 7.5 Upgrade Triggers

Move from free/testing to paid/production when:

- Official domain is bound.
- Formal admin operations begin.
- Official member personal data is stored.
- Rankings/results become official public records.
- Storage or database approaches free-tier limits.
- CTDF needs stable ownership, billing, and support.

Recommended B plan production state:

```text
Vercel Pro + Supabase Pro
```

## 8. Non-Functional Requirements

### 8.1 Performance

- Public pages should load quickly on mobile.
- Images should be optimized and lazy-loaded.
- Large videos should be embedded from YouTube.
- Ranking tables should avoid excessive client-side rendering for large datasets.

### 8.2 Availability

- Vercel and Supabase managed services provide baseline availability.
- Critical content should not depend on a single admin account.
- Export/backup workflow must exist before production member data.

### 8.3 Maintainability

- Components should be reusable.
- Route naming should match sitemap.
- Schema names should be readable and documented.
- Admin workflows should be simple enough for non-technical CTDF users.

### 8.4 Privacy

- Collect only necessary member data.
- Public profile fields must be explicit and approved.
- Contact forms and signup must show personal data notice.
- Private member data must not be exposed via public API responses.

## 9. Deployment Environments

| Environment | Purpose | Suggested Setup |
|---|---|---|
| Local | Developer testing | Local Next.js + dev Supabase project |
| Preview | Stakeholder review | Vercel preview deployment |
| Staging | Pre-production QA | Optional Vercel project/branch + staging Supabase |
| Production | Official website | Vercel Pro + Supabase Pro |

## 10. Production Checklist

- [ ] CTDF-controlled Vercel account/team exists.
- [ ] CTDF-controlled Supabase organization exists.
- [ ] GitHub repository ownership confirmed.
- [ ] DNS management authority confirmed.
- [ ] Root and www domains configured.
- [ ] HTTPS active.
- [ ] Supabase RLS tested.
- [ ] Admin roles tested.
- [ ] Backups confirmed.
- [ ] Privacy policy approved.
- [ ] Member data collection notice approved.
- [ ] Responsive QA completed.
- [ ] Admin training completed.
- [ ] Launch approval recorded.
