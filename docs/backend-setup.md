# Backend setup status

This branch is a development-only work area. The production website on `main` remains unchanged.

## Current scaffold

- `api/health.js` is a minimal Vercel serverless health endpoint.
- The endpoint accepts GET only and returns no configuration, credentials, or customer data.
- No payment webhook, database write, email delivery, traveler form, or admin endpoint is implemented yet.
- No passport or date-of-birth data should be entered during development.

## Required before preview deployment

1. Create a separate Supabase staging project. The current Supabase project contains the manually created `public.applications` table and must be treated as production.
2. Add the staging project's URL and server-only secret key to Vercel Preview environment variables. Do not reuse production database credentials in Preview.
3. Confirm the intended application and traveler data fields, staff access policy, retention period, and deletion workflow.
4. Add and review database migrations, indexes, constraints, and restrictive Row Level Security policies.
5. Implement Stripe webhook signature verification and idempotency before creating paid applications.
6. Implement hashed, high-entropy, expiring customer access tokens. Never store raw access tokens.
7. Add transactional email only after the sender domain and Resend account are configured. Emails must not contain passport details.
8. Test using Stripe test mode and synthetic data only.

## Security boundaries

- Never expose Supabase secret keys, Stripe secret keys, or email API keys in browser code.
- Never place passport data, dates of birth, or other sensitive traveler details in logs, analytics, email, or URLs.
- Do not accept document uploads.
- Do not enable public access to traveler records.
- Do not deploy this work to Production or merge it into `main` without explicit approval and completion of the security and privacy launch gates.
