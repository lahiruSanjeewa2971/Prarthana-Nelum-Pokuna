# Prarthana Nelum Pokuna – Hotel

Comprehensive, trackable project task breakdown aligned with the proposed architecture and current workspace. Assumptions: PostgreSQL is locally installed and DB setup/migrations are already completed.

## Milestones
- [ ] M1: Public site MVP (landing, about, gallery, location, contact)
- [ ] M2: Booking flow (form, API, persistence)
- [ ] M3: Admin dashboard (login, bookings management, hotel content)
- [ ] M4: Email notifications (admin + customer)
- [ ] M5: Content management (hotel info)
- [ ] M6: QA, Accessibility, SEO
- [ ] M7: Deployment & Ops

## Frontend (App Router)
- [ ] Landing page at `app/page.tsx`: hero, features, CTA to booking
- [ ] About page at `app/about/page.tsx`: hotel story and overview
- [ ] Gallery page at `app/gallery/page.tsx`: responsive grid, lightbox
- [ ] Location map page at `app/location/page.tsx`: embedded map + directions
- [ ] Contact page at `app/contact/page.tsx`: contact details and form (non-booking)
- [ ] Booking page at `app/booking/page.tsx`:
  - [ ] Form fields: name, email, phone, function type, date, start/end time, notes
  - [ ] Client-side validation + accessible form semantics
  - [ ] Submit to `POST /api/bookings`; show success/error states
  - [ ] Date/time slot UX (disabled past dates, basic slot checks)
- [ ] Shared UI components: header, footer, layout, toasts, form inputs

## Backend (Route Handlers)
- [ ] `app/api/bookings/route.ts` (POST):
  - [ ] Validate payload (zod or similar)
  - [ ] Persist booking with status = `PENDING` via `prisma`
  - [ ] Trigger admin email notification
  - [ ] Return created booking (safe response shape)
- [ ] `app/api/bookings/[id]/route.ts` (PATCH):
  - [ ] Admin-only: accept/reject + optional `adminNote`
  - [ ] Update status; trigger customer notification email
  - [ ] Return updated booking
- [ ] `app/api/admin/login/route.ts` (POST):
  - [ ] Validate credentials; check `Admin` table
  - [ ] Issue session (httpOnly cookie) or JWT (short-lived)
  - [ ] Return auth state
- [ ] `app/api/hotel/route.ts` (GET/PUT):
  - [ ] Public GET hotel info
  - [ ] Admin PUT to update basic content fields

## Services Layer (Business Logic)
- [ ] `src/services/booking.service.ts`:
  - [ ] Create booking (validation, normalization)
  - [ ] Update status + note (accept/reject)
  - [ ] List upcoming bookings (date filter)
- [ ] `src/services/hotel.service.ts`:
  - [ ] Read/update hotel info
- [ ] `src/services/email.service.ts`:
  - [ ] Send admin notification (new booking)
  - [ ] Send customer notification (accepted/rejected)
  - [ ] Retry/robust handling (basic)

## Lib & Utilities
- [ ] `src/lib/db.ts`: Prisma client singleton (Next.js-friendly, non-edge runtime)
- [ ] `src/lib/mail.ts`: Nodemailer transporter using `SMTP_*` env vars
- [ ] `src/lib/constants.ts`: `BookingStatus`, function types list, app constants
- [ ] Date/time helpers: slot validation, formatting

## Admin UI
- [ ] `app/admin/login/page.tsx`:
  - [ ] Login form; handle response; store session
- [ ] `app/admin/dashboard/page.tsx`:
  - [ ] Overview metrics: upcoming bookings count, recent activity
- [ ] `app/admin/bookings/page.tsx`:
  - [ ] List + filter bookings (status/date)
  - [ ] Accept/reject actions inline; add `adminNote`
  - [ ] Detail drawer/modal for full booking info
- [ ] `app/admin/hotel/page.tsx`:
  - [ ] Edit hotel info (name, description, address, phone, email, map link)

## Database (Prisma/PostgreSQL)
- [x] Local PostgreSQL install
- [x] Prisma models and migrations applied (Booking, Admin, Hotel)
- [x] Optional: seed script to create initial `Admin` + `Hotel` row
- [ ] Indexes/tuning (later): event_date, status for queries

## Authentication & Authorization
- [ ] Admin-only auth:
  - [ ] Password hashing (bcrypt)
  - [ ] Session cookie (httpOnly, secure in prod)
  - [ ] Guard admin pages & API routes
- [ ] Logout and session invalidation

## Email (Nodemailer + SMTP)
- [ ] Env config: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- [ ] Transport setup in `src/lib/mail.ts`
- [ ] Templates:
  - [ ] Admin: new booking notification (summary + link)
  - [ ] Customer: booking accepted (details + confirmation)
- [ ] Customer: booking rejected (polite note + admin message)
- [ ] Error handling & basic retries/logging

## Validation & Error Handling
- [ ] Shared schema with zod/yup for booking payloads
- [ ] API error responses (consistent shape)
- [ ] Client-side feedback (inline errors, toasts)

## QA, Accessibility, SEO
- [ ] Accessibility checks (labels, semantics, keyboard, contrast)
- [ ] Responsive layout across mobile/tablet/desktop
- [ ] Performance checks (images, caching)
- [ ] SEO meta, Open Graph, sitemap, robots.txt
- [ ] Basic analytics (optional)

## Testing
- [ ] Unit tests: services (booking, email, hotel)
- [ ] Integration tests: route handlers (bookings, admin login)
- [ ] E2E (optional): booking submission → admin action → email

## Configuration & Environments
- [ ] `.env` with `DATABASE_URL` and `SMTP_*` (development)
- [ ] Production env vars configured (hosting provider)
- [ ] Ensure Prisma runs on Node runtime; avoid Edge for Prisma routes
- [ ] `postinstall` script: `prisma generate`

## Deployment & Ops
- [ ] Build & run instructions (README update)
- [ ] Database migration strategy (deploy using `prisma migrate deploy`)
- [ ] Health checks; error logging (server side)
- [ ] Backup/restore notes for Postgres (optional)

## Documentation
- [ ] Update `README.md` with setup, run, and environment instructions
- [ ] Add architecture overview and ADRs (optional)

---

### Notes
- Payment is out of scope for v1.
- Focus on clean separation: UI ↔ services ↔ Prisma ↔ email.
- Keep admin features minimal but robust: auth, bookings moderation, hotel content.