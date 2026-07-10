# Functional Requirements Document (FRD)

Project: 中華民國競技飛鏢總會官方網站  
Version: 1.0  
Source plan: 競技飛鏢總會_網站建置計畫書_v11_AB代管方案比較版  
Target launch: 2026 年 10 月中

## 1. Purpose

This document defines the functional requirements for the CTDF official website across five development workstreams:

1. Development environment and demo
2. Frontend MVP
3. Supabase database
4. Admin management
5. Production readiness

The website must support hard darts and electronic darts through one unified platform.

These five workstreams map to the four calendar stages in the v11 project plan. The plan uses four time-based stages; this FRD uses five workstreams so implementation, verification, and ownership can be tracked more clearly.

| FRD workstream | Related v11 calendar stage |
|---|---|
| Development environment and demo | Stage 1: July decision and foundation preparation |
| Frontend MVP | Stage 1-2: July foundation and August core frontend/backend development |
| Supabase database | Stage 1-3: July schema, August core data, September content/data preparation |
| Admin management | Stage 1-2: July backend foundation and August core admin workflows |
| Production readiness | Stage 4: October validation, training, DNS, and official launch |

## 2. User Roles

| Role | Description | Key Needs |
|---|---|---|
| Public visitor | General public, parents, schools, media, partner organizations | Read announcements, events, rankings, downloads, contact information |
| Member | Registered CTDF member or player | Login, update profile, view relevant records |
| Player | Public player profile subject | Show profile, points, results, event history where approved |
| Secretary admin | CTDF administrative user | Manage members, pages, files, notices |
| Event admin | Competition operations user | Manage events, results, rankings, players |
| Content editor | News and content maintainer | Draft, publish, schedule, and archive content |
| Ranking admin | Ranking and score maintainer | Import/update rankings, points, youth rankings |
| Super admin | Full system owner | Manage roles, feature flags, settings, audit logs |
| Read-only admin | Internal reviewer | View backend data without editing |

## 3. Phase 1: Development Environment and Demo

### 3.1 Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FRD-1.1 | Create a GitHub repository for the website project. | Must | Repository contains README, source files, and basic docs. |
| FRD-1.2 | Deploy a demo website to Vercel Free. | Must | A `*.vercel.app` URL is available for review. |
| FRD-1.3 | Provide a static homepage demo using non-sensitive placeholder data. | Must | Demo can be opened on desktop and mobile. |
| FRD-1.4 | Keep demo independent of official member data. | Must | No real member personal data appears in demo. |
| FRD-1.5 | Document deployment and review workflow. | Should | README explains GitHub to Vercel flow. |

### 3.2 Phase Output

- Public demo URL for internal review
- GitHub project structure
- README and requirement documents

## 4. Phase 2: Frontend MVP

### 4.1 Global Layout

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FRD-2.1 | Provide header, footer, desktop navigation, and mobile navigation. | Must | All MVP pages are reachable from navigation. |
| FRD-2.2 | Support Mobile First responsive layout. | Must | Layout works at 360, 390, 430, 768, 1024, 1280, and 1440px widths. |
| FRD-2.3 | Provide clear CTDF branding area. | Must | Logo/name area is visible in first viewport. |
| FRD-2.4 | Provide bilingual-ready structure. | Should | Routes and content model do not block future English content. |

### 4.2 Public Pages

| ID | Page / Feature | Requirement | Priority |
|---|---|---|---|
| FRD-2.5 | Home | Show pinned announcement, latest news, upcoming events, ranking summary, quick links. | Must |
| FRD-2.6 | News list | Show news list with category, date, pagination/filtering. | Must |
| FRD-2.7 | News detail | Show title, date, category, image, content, share metadata. | Must |
| FRD-2.8 | Events list | Show event name, date, location, type, registration status. | Must |
| FRD-2.9 | Event detail | Show event info, venue, rules/downloads, registration link, results link. | Must |
| FRD-2.10 | Results | Show result announcements and top placements. | Must |
| FRD-2.11 | Rankings | Show overall ranking and youth ranking with filters. | Must |
| FRD-2.12 | Players | Show player list, profile page, and search/filter by name, region, type, group. | Must |
| FRD-2.13 | About | Show association intro, organization, rules, contact, privacy policy. | Must |
| FRD-2.14 | Downloads | Show application forms and competition rules by category/year. | Must |
| FRD-2.15 | Fair Play | Show anti-doping and fair competition policy/resource links. | Must |
| FRD-2.16 | Media Center | Photos, videos, media reports. | Later |
| FRD-2.17 | Citizens Sports Games section | Support promotion/advocacy content and evidence downloads. | Later |

### 4.3 Phase Output

- Browsable frontend MVP
- Placeholder content for review
- Mobile navigation and responsive layouts

## 5. Phase 3: Supabase Database

### 5.1 Data Requirements

| ID | Entity | Requirement | Priority |
|---|---|---|---|
| FRD-3.1 | `news` | Store announcement/news title, slug, category, body, status, publish date, pinned flag. | Must |
| FRD-3.2 | `events` | Store event name, date, venue, type, group, status, registration URL, attachments. | Must |
| FRD-3.3 | `event_results` | Store event result records and result attachment references. | Must |
| FRD-3.4 | `rankings` | Store ranking type, group, player, points, date, hard/electronic type. | Must |
| FRD-3.5 | `players` | Store public player profile, region, type, group, photo, visibility. | Must |
| FRD-3.6 | `members` / `profiles` | Store member profile and account metadata. | Must |
| FRD-3.7 | `documents` | Store downloadable file metadata and storage path. | Must |
| FRD-3.8 | `media_items` | Store photo/video/media report metadata and source URL. | Later |
| FRD-3.9 | `feature_flags` | Control enabled/disabled frontend modules. | Must |
| FRD-3.10 | `admin_roles` / `admin_permissions` | Store role and permission matrix. | Must |
| FRD-3.11 | `audit_logs` | Store admin create/update/delete/publish actions. | Must |

### 5.2 Storage Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FRD-3.12 | Store PDF/Word/Excel downloads in Supabase Storage. | Must | Download metadata maps to storage files. |
| FRD-3.13 | Store public images only after rights confirmation. | Must | Image records include rights/status field. |
| FRD-3.14 | Use YouTube links for video instead of storing large videos. | Should | Media model supports embedded video URL. |

### 5.3 Phase Output

- Supabase schema
- Test seed data
- Frontend pages connected to Supabase test data

## 6. Phase 4: Admin Management

### 6.1 Authentication and Roles

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FRD-4.1 | Admin login via Supabase Auth. | Must | Unauthorized users cannot access `/admin`. |
| FRD-4.2 | Role-based permissions. | Must | Roles can view/edit only allowed modules. |
| FRD-4.3 | Super admin can manage feature flags and roles. | Must | Super admin can update settings. |
| FRD-4.4 | Read-only users cannot mutate data. | Must | Write actions are blocked. |

### 6.2 Admin Modules

| ID | Module | Requirement | Priority |
|---|---|---|---|
| FRD-4.5 | Dashboard | Show pending member applications, recent events, draft content, system reminders. | Must |
| FRD-4.6 | News admin | Create, edit, publish, pin, schedule, unpublish news. | Must |
| FRD-4.7 | Pages admin | Edit static pages: about, rules, privacy, contact. | Must |
| FRD-4.8 | Events admin | Create/edit events, upload rules, manage registration and result links. | Must |
| FRD-4.9 | Rankings admin | Import or update ranking records. | Must |
| FRD-4.10 | Players admin | Manage player profile visibility, photos, group/type fields. | Must |
| FRD-4.11 | Members admin | Review, suspend, restore, export member list. | Must |
| FRD-4.12 | Downloads admin | Upload, categorize, publish, archive files. | Must |
| FRD-4.13 | Media admin | Manage photo albums, videos, media reports. | Later |
| FRD-4.14 | Settings | Manage logo, site name, contact, social links, SEO metadata. | Must |
| FRD-4.15 | Audit logs | Record admin actions. | Must |

### 6.3 Content Status Workflow

All managed content should support these statuses where applicable:

- Draft
- Pending review
- Published
- Scheduled
- Unpublished
- Archived

### 6.4 Phase Output

- Usable admin backend
- Role and permission controls
- Audit logs for major admin actions

## 7. Phase 5: Production Readiness

### 7.1 Launch Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FRD-5.1 | Bind official domain `ctdf.org.tw`. | Must | Root and `www` open the production website. |
| FRD-5.2 | Configure HTTPS/SSL. | Must | Browser shows secure connection. |
| FRD-5.3 | Confirm Supabase RLS rules. | Must | Unauthorized reads/writes are blocked. |
| FRD-5.4 | Confirm backup/export process. | Must | Database and files can be backed up/restored/exported. |
| FRD-5.5 | Complete privacy and personal data notices. | Must | Registration/contact pages show required notices. |
| FRD-5.6 | Complete SEO metadata and sitemap. | Should | Search engine metadata is available. |
| FRD-5.7 | Complete cross-device QA. | Must | No critical layout break at target widths. |
| FRD-5.8 | Train admin users. | Must | Admin users can perform routine updates. |

### 7.2 Phase Output

- Production website
- Admin training completed
- DNS/SSL/backup/security checklist completed

## 8. Out of Scope for MVP

- Real-time scoring
- Online payment for membership fees
- Automated Facebook synchronization
- Full bilingual site
- Advanced statistics dashboards
- Native mobile app

## 9. Open Decisions

- Whether official production hosting uses A plan or B plan.
- Whether Supabase Pro starts at production launch or during trial operation.
- Who owns DNS and payment authority.
- Which media assets are legally cleared for public use.
- Final ranking rules and import format.
