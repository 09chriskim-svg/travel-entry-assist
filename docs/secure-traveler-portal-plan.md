# Secure Traveler Portal — Implementation Plan

Status: planning only. This document does not enable passport-data collection and does not change the production site.

## Confirmed product decisions
- Keep the current public website and Stripe checkout intact.
- Build the traveler portal separately from the public inquiry form.
- Do not accept passport scans, photos, or other document uploads.
- Give each paid customer a unique access link; no customer password/account is required.
- Do not put passport details or other sensitive traveler data in email.
- Do not collect real passport information until the backend, storage, access controls, privacy terms, and tests are complete.

## Current repository baseline
- The production site is a static `index.html` with an inquiry form and a Stripe Payment Link.
- There are currently no application API routes or backend files in the repository.
- The existing inquiry form is not suitable for passport or date-of-birth data.
- Work is isolated on `feature/secure-traveler-portal`; production branch `main` is not being changed.

## Proposed architecture (provider choices still pending)
1. **Payment confirmation:** Stripe webhook verifies the event signature and confirms a completed/paid checkout before creating an application. Never trust a browser redirect as proof of payment.
2. **Application service:** Vercel server-side API routes create and manage application records.
3. **Database:** Managed PostgreSQL with TLS, encryption at rest, restricted credentials, backups, and deletion controls. Select provider before implementation.
4. **Customer access:** Generate a cryptographically random, single-purpose access token. Store only a hash; enforce expiry, revocation, rate limiting, and one-time or controlled reuse rules. Seven-day expiry is a proposed default and must be confirmed.
5. **Email:** Send only the secure access URL, reference number, and non-sensitive instructions through a transactional email provider. Provider and sender-domain setup remain pending.
6. **Admin access:** Protected staff-only dashboard with least-privilege access and audit events.
7. **Data minimization:** Collect only fields necessary for the service. No uploads. Avoid sensitive data in logs, analytics, URLs beyond the opaque token, or support emails.
8. **Privacy lifecycle:** Publish clear privacy/terms notices, retention period, deletion process, support contact, and incident response before launch.

## Initial workflow
1. Customer chooses traveler quantity and pays through the existing Stripe checkout.
2. Stripe sends a signed webhook to the backend.
3. Backend verifies payment, records the order and traveler quantity, and creates an application reference.
4. Backend generates a secure access link and emails it to the customer.
5. Customer enters the necessary traveler and trip details over HTTPS.
6. Customer reviews and submits; the portal confirms receipt and displays a reference number.
7. Authorized staff review the application in the protected admin area.

## Security and launch gates
- Webhook signature verification and idempotency.
- Authorization checks on every application read/write.
- Token entropy, hashing, expiry, revocation, and rate limits tested.
- CSRF protections where applicable; strict input validation and output encoding.
- Secrets only in encrypted server-side environment variables; never in browser code or Git.
- No passport values in logs, email, URLs, analytics, or error messages.
- Database access restricted to server-side code; backups and deletion tested.
- Privacy notice, terms, retention/deletion policy, and customer support details reviewed.
- End-to-end tests using Stripe test mode and synthetic traveler data only.
- Production deployment only after explicit approval.

## Decisions needed before implementation
- Database provider: managed PostgreSQL option.
- Transactional email provider and sender address/domain.
- Exact traveler fields and whether one paid checkout creates one application containing multiple travelers.
- Confirm access-link expiry and whether a link can be reused until submission.
- Staff/admin identities and access policy.
- Data retention duration and deletion request process.
