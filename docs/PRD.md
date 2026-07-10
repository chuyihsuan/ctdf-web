# Product Requirements Document (PRD)

Project: 中華民國競技飛鏢總會官方網站  
Version: 1.0  
Source plan: 競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版  
Target launch: 2026 年 10 月中

## 1. Product Vision

Build the official digital platform for the Chinese Taipei Dart Federation (CTDF), serving as the authoritative source for announcements, events, rankings, player information, membership services, downloads, and administrative operations.

The website should improve public trust, reduce manual administrative work, and create a maintainable foundation for future international, school, youth, and Citizens Sports Games related development.

## 2. Product Goals

| Goal | Description | Success Indicator |
|---|---|---|
| Official identity | Present CTDF as the official national federation for hard and electronic darts. | Website clearly communicates CTDF name, role, contact, rules, and official domain. |
| Member service | Provide self-service information and member account foundation. | Members can login and maintain basic profile in MVP. |
| Event transparency | Publish events, rules, results, and downloads in a consistent place. | Event pages replace scattered LINE/email/manual announcements. |
| Ranking credibility | Publish ranking data in a searchable, filterable way. | Rankings are accessible by type/group and maintained through backend. |
| Admin efficiency | Let authorized admins maintain content without code changes. | Secretarial/admin users can update routine content in backend. |
| Low-maintenance launch | Use managed platforms where possible. | B plan can launch with Vercel + Supabase and limited infrastructure work. |

## 3. Target Users

### 3.1 Public Visitors

People who need official CTDF information:

- Players
- Parents
- Schools
- Media
- Government or local sports offices
- International organizations

Top needs:

- See latest announcements
- Find events and rules
- Download forms
- Check rankings and results
- Contact CTDF

### 3.2 Members and Players

Registered members and players who need:

- Account login
- Profile maintenance
- Visibility control for public profile fields
- Event/result/ranking lookup

### 3.3 CTDF Admin Users

Internal users who need:

- News and page editing
- Event/result/ranking updates
- Member review
- File upload
- Permission control
- Audit trail

## 4. Product Scope by Phase

The v11 project plan defines four calendar stages from July to mid-October 2026. This PRD organizes the same scope into five product delivery phases so the demo, frontend, database, admin, and launch-readiness work can be reviewed independently.

| PRD phase | Related v11 calendar stage |
|---|---|
| Phase 1: Development Environment and Demo | Stage 1: July decision and foundation preparation |
| Phase 2: Frontend MVP | Stage 1-2: July foundation and August core frontend/backend development |
| Phase 3: Supabase Database | Stage 1-3: July schema, August core data, September content/data preparation |
| Phase 4: Admin Management | Stage 1-2: July backend foundation and August core admin workflows |
| Phase 5: Production Readiness | Stage 4: October validation, training, DNS, and official launch |

## Phase 1: Development Environment and Demo

### Objective

Create a working demo path so stakeholders can review design and information architecture before full development.

### User Value

- President and CTDF reviewers can open a URL on mobile.
- Design direction can be reviewed without local files or ZIP downloads.
- Development workflow becomes repeatable.

### Product Requirements

| ID | Requirement | Priority |
|---|---|---|
| PRD-1.1 | Provide a public demo URL using Vercel Free or GitHub Pages. | Must |
| PRD-1.2 | Demo must not contain real personal data. | Must |
| PRD-1.3 | README must explain project purpose, architecture, deployment options, and security notes. | Must |
| PRD-1.4 | Demo should be reviewable on mobile without horizontal scrolling. | Must |

### Phase Success Metrics

- Demo URL is shared and opens successfully.
- Reviewers can identify design direction and major site sections.
- Feedback is collected before full MVP build.

## Phase 2: Frontend MVP

### Objective

Build a complete public-facing MVP that visitors can browse without login.

### User Value

- Public visitors can find CTDF official information.
- Members and players can check announcements, events, rankings, and downloads.
- CTDF can review site structure before data-driven backend is completed.

### Product Requirements

| ID | Feature | Requirement | Priority |
|---|---|---|---|
| PRD-2.1 | Home | Show key information in first screen: announcement, events, news, quick actions. | Must |
| PRD-2.2 | News | Provide list and detail views. | Must |
| PRD-2.3 | Events | Provide event list, details, rules/downloads, and result links. | Must |
| PRD-2.4 | Rankings | Provide overall and youth ranking views. | Must |
| PRD-2.5 | Players | Provide player list, search, and profile views. | Must |
| PRD-2.6 | About | Provide intro, organization, rules, contact, privacy policy. | Must |
| PRD-2.7 | Downloads | Provide application forms and competition rules. | Must |
| PRD-2.8 | Fair Play | Provide anti-doping and fair competition resources. | Must |
| PRD-2.9 | Mobile UX | All MVP pages must be mobile-first and usable on target widths. | Must |

### MVP Content Priorities

1. Latest announcement
2. Upcoming event
3. Event rules/downloads
4. Ranking summary
5. Contact and association identity
6. Member login entry point

### Phase Success Metrics

- MVP pages are browsable.
- Navigation works on desktop and mobile.
- Reviewers can validate information structure.

## Phase 3: Supabase Database

### Objective

Make website content data-driven using Supabase, while preserving security and future admin workflows.

### User Value

- Admins can eventually update content without developer help.
- Data can be reused across pages.
- Rankings/events/players become structured and searchable.

### Product Requirements

| ID | Requirement | Priority |
|---|---|---|
| PRD-3.1 | Define production-ready schema for core modules. | Must |
| PRD-3.2 | Seed test data for news, events, rankings, players, downloads. | Must |
| PRD-3.3 | Connect frontend pages to Supabase test data. | Must |
| PRD-3.4 | Use `type` or equivalent field for hard/electronic darts. | Must |
| PRD-3.5 | Prepare RLS model before production member data. | Must |
| PRD-3.6 | Support future Pro upgrade without schema rewrite. | Should |

### Data Principles

- Use structured data instead of embedding text in pages.
- Keep sensitive member data private by default.
- Public player fields must be explicitly approved.
- Files and images need rights/verification status.
- Admin actions should be auditable.

### Phase Success Metrics

- Frontend reads test data from Supabase.
- Database schema covers MVP modules.
- No real personal data is required for development testing.

## Phase 4: Admin Management

### Objective

Build the backend workflows required for CTDF staff and authorized admins to maintain the website.

### User Value

- CTDF can publish updates quickly.
- Secretarial and event users can manage their own modules.
- Role-based permissions reduce operational and privacy risk.

### Product Requirements

| ID | Module | Requirement | Priority |
|---|---|---|---|
| PRD-4.1 | Admin login | Admin users can login through Supabase Auth. | Must |
| PRD-4.2 | Roles | Admin permissions map to CTDF role types. | Must |
| PRD-4.3 | Dashboard | Show tasks, recent events, member applications, reminders. | Must |
| PRD-4.4 | News CMS | Draft, review, publish, pin, archive news. | Must |
| PRD-4.5 | Event admin | Maintain events, rules, links, results. | Must |
| PRD-4.6 | Ranking admin | Import or update ranking records. | Must |
| PRD-4.7 | Player admin | Maintain public player profile fields. | Must |
| PRD-4.8 | Member admin | Review and manage member accounts. | Must |
| PRD-4.9 | Downloads admin | Upload, categorize, publish, archive files. | Must |
| PRD-4.10 | Audit logs | Record critical create/update/delete/publish actions. | Must |

### Admin UX Principles

- Prefer simple forms and tables over complex dashboards.
- Every publishable item should have status.
- Destructive actions should require confirmation.
- Sensitive export actions should be permission controlled.
- Admin screens should be dense, clear, and operational.

### Phase Success Metrics

- Admin users can maintain core MVP content.
- Permissions prevent unauthorized edits.
- Audit logs record important actions.

## Phase 5: Production Readiness

### Objective

Prepare the website for official launch on `ctdf.org.tw`.

### User Value

- Public users can access the official website reliably.
- CTDF can operate the website with stable ownership, backup, and security practices.
- Personal data handling is safer before production use.

### Product Requirements

| ID | Requirement | Priority |
|---|---|---|
| PRD-5.1 | Confirm hosting plan: A plan or B plan. | Must |
| PRD-5.2 | Confirm Vercel Pro and Supabase Pro timing if B plan is selected. | Must |
| PRD-5.3 | Configure official domain and SSL. | Must |
| PRD-5.4 | Verify DNS manager and backup admin email. | Must |
| PRD-5.5 | Complete privacy policy and personal data notices. | Must |
| PRD-5.6 | Complete RLS and permission testing. | Must |
| PRD-5.7 | Complete backup/export/restore process. | Must |
| PRD-5.8 | Complete responsive QA. | Must |
| PRD-5.9 | Complete admin training. | Must |
| PRD-5.10 | Prepare post-launch monitoring and issue handling. | Should |

### Phase Success Metrics

- `ctdf.org.tw` and `www.ctdf.org.tw` open successfully.
- Admins are trained.
- No critical security or layout issues remain.
- Launch checklist is signed off.

## 5. Product Decisions Needed

| Decision | Owner | Target Timing |
|---|---|---|
| Final hosting plan A/B | CTDF decision maker + technical lead | Before production setup |
| Vercel account ownership | CTDF / technical lead | Before official domain binding |
| Supabase account ownership | CTDF / technical lead | Before production data entry |
| DNS manager and backup email | CTDF / domain manager | Before Vercel domain setup |
| Ranking rules and import format | Event/ranking admins | Before ranking module production |
| Member public profile fields | CTDF / legal or admin | Before member launch |
| Photo and media usage rights | CTDF / media owner | Before public media use |

## 6. Launch Recommendation

For fastest and lowest-maintenance launch, use B plan:

- Vercel Pro for production hosting
- Supabase Free during development/testing
- Supabase Pro before storing official member personal data

If CTDF requires Taiwan Fixed Network infrastructure as a strict condition, use A plan and reserve more budget and maintenance capacity.
