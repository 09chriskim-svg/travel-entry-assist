# Secure Traveler Portal — Implementation Plan

Status: planning only. This document does not enable passport-data collection and does not change the production site.

## Confirmed product decisions
- Keep the current public website and Stripe checkout intact.
- Build the traveler portal separately from the public inquiry form.
- Use Supabase Pro (managed PostgreSQL) and Resend (transactional email), subject to account setup and security configuration.
- Do not accept passport scans, photos, or other document uploads.
- Give each paid customer a unique access link; no customer password/account is required.
- Access links expire seven days after issuance and may be reused until the application is submitted.
- Successful submission invalidates the access link.
- Do not put passport details or other sensitive traveler data in email.
- Do not collect real passport information until the backend, storage, access controls, privacy terms, and tests are complete.

## Current repository baseline
- The production site is a static `index.html` with an inquiry form and a Stripe Payment Link.
- There are currently no application API routes or backend files in the repository.
- The existing inquiry form is not suitable for passport or date-of-birth data.
- Work is isolated on `feature/secure-traveler-portal`; production branch `main` is not being changed.

## Proposed architecture
1. **Payment confirmation:** Stripe webhook verifies the event signature and confirms a completed/paid checkout before creating an application. Never trust a browser redirect as proof of payment.
2. **Application service:** Vercel server-side API routes create and manage application records.
3. **Database:** Supabase Pro PostgreSQL, configured with TLS, encryption at rest, restricted credentials, backups, row-level security (RLS), and deletion controls.
4. **Customer access:** Generate a cryptographically random, single-purpose access token. Store only a hash; enforce seven-day expiry, revocation, rate limiting, and invalidation after successful submission. Links can be reused before submission.
5. **Email:** Resend sends only the secure access URL, reference number, and non-sensitive instructions. Configure and verify the sender domain with SPF, DKIM, and DMARC.
6. **Admin access:** Protected staff-only dashboard with least-privilege access and audit events; require MFA for staff.
7. **Data minimization:** Collect only fields necessary for the service. No uploads. Avoid sensitive data in logs, analytics, URLs beyond the opaque token, or support emails.
8. **Privacy lifecycle:** Publish clear privacy/terms notices, retention period, deletion process, support contact, and incident response before launch.

## Initial workflow
1. Customer chooses traveler quantity and pays through the existing Stripe checkout.
2. Stripe sends a signed webhook to the backend.
3. Backend verifies payment, records the order and traveler quantity, and creates an application reference.
4. Backend generates a secure seven-day access link and emails it through Resend.
5. Customer enters the necessary traveler and trip details over HTTPS. The link remains usable until submission or expiry.
6. Customer reviews and submits; the portal confirms receipt, displays a reference number, and invalidates the link.
7. Authorized staff review the application in the protected admin area.

## Security and launch gates
- Webhook signature verification and idempotency.
- Authorization checks on every application read/write.
- Token entropy, hashing, seven-day expiry, reuse-before-submission, post-submission invalidation, revocation, and rate limits tested.
- CSRF protections where applicable; strict input validation and output encoding.
- Secrets only in encrypted server-side environment variables; never in browser code or Git.
- No passport values in logs, email, URLs, analytics, or error messages.
- RLS enabled and tested; database access restricted to server-side code; backups and deletion tested.
- Privacy notice, terms, retention/deletion policy, and customer support details reviewed.
- End-to-end tests using Stripe test mode and synthetic traveler data only.
- Production deployment only after explicit approval.

## Decisions still needed before implementation
- Exact traveler fields and whether one paid checkout creates one application containing multiple travelers.
- Staff/admin identities and access policy.
- Data retention duration and deletion request process.
- Final sender address (for example, a verified address on the business domain).
- Confirm the selected Supabase project region and account plan during setup.
