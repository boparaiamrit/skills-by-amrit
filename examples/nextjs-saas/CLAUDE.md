# Acme SaaS — Next.js 14 + Supabase + Stripe + Tailwind

> Multi-tenant SaaS platform with subscription billing, team management, and real-time dashboards.

## Skills Integration

This project uses [skills-by-amrit](https://github.com/amrit/skills-by-amrit). Skills are installed in `.claude/skills/` and activate automatically.

**Required workflows:**
- Run `/audit` before opening any PR — catches RLS gaps, missing auth checks, Stripe webhook holes
- Run `/plan` before any feature spanning 3+ files — no cowboy coding
- Run `/verify` after implementing any plan — confirms every acceptance criterion
- Run `/debug` for any failing test — follow the scientific method, not println
- Run `/security-scan` on any route that touches payments or user data
- Run `/deep-audit` quarterly on `src/app/api/` and `src/lib/supabase/`

## Critical Rules

### Security — Violations Are Blockers

1. **Never bypass Row-Level Security.** Every Supabase query MUST go through the authenticated client. No `supabase.admin` outside of `src/lib/server/admin.ts`.
2. **Never trust client-side prices.** Stripe Checkout sessions MUST pull prices from `stripe.prices.retrieve()`, never from request bodies.
3. **Never expose service role key.** The `SUPABASE_SERVICE_ROLE_KEY` is server-only. If it appears in any `'use client'` file, that is a critical severity finding.
4. **Always verify webhook signatures.** Every Stripe webhook handler MUST call `stripe.webhooks.constructEvent()` before processing.

### Data Integrity

5. **Use Server Actions for mutations.** No raw `fetch('/api/...')` from client components — use `'use server'` actions in `src/app/actions/`.
6. **Never skip Zod validation.** Every Server Action and API route MUST validate input with schemas from `src/lib/validations/`.

## BAD vs GOOD

```tsx
// BAD: Client-side price — attacker can modify the request
async function checkout(priceFromUI: number) {
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price_data: { unit_amount: priceFromUI }, quantity: 1 }],
  });
}

// GOOD: Server-side price lookup — single source of truth
async function checkout(priceId: string) {
  const price = await stripe.prices.retrieve(priceId);
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: price.id, quantity: 1 }],
  });
}
```

```tsx
// BAD: Bypassing RLS with admin client in an API route
import { adminClient } from '@/lib/supabase/admin';
export async function GET() {
  const { data } = await adminClient.from('invoices').select('*');
}

// GOOD: Authenticated client respects RLS policies
import { createServerClient } from '@/lib/supabase/server';
export async function GET() {
  const supabase = await createServerClient();
  const { data } = await supabase.from('invoices').select('*');
}
```

## Project Structure

```
src/
  app/
    (auth)/           # Login, signup, password reset
    (dashboard)/      # Authenticated app shell
    api/webhooks/     # Stripe + Supabase webhooks
    actions/          # Server Actions (mutations)
  components/
    ui/               # Shadcn/Tailwind primitives
    features/         # Domain-specific composites
  lib/
    supabase/         # Client factories (browser, server, admin)
    stripe/           # Stripe helpers, price constants
    validations/      # Zod schemas shared between client and server
supabase/
  migrations/         # SQL migrations (never edit deployed ones)
  seed.sql            # Dev seed data
```

## Testing

- **Unit/Integration:** Vitest — `pnpm test` runs `vitest run`
- **E2E:** Playwright — `pnpm test:e2e` runs against local Supabase + Stripe CLI
- **Before any PR:** `pnpm lint && pnpm test && pnpm test:e2e`
- Use `/verify` after test runs to confirm coverage thresholds (80% statements, 90% on `lib/`)

## Environment Variables

```bash
# .env.local — NEVER commit this file
NEXT_PUBLIC_SUPABASE_URL=        # Safe: public anon URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Safe: public anon key (RLS enforced)
SUPABASE_SERVICE_ROLE_KEY=       # DANGER: server-only, bypasses RLS
STRIPE_SECRET_KEY=               # DANGER: server-only
STRIPE_WEBHOOK_SECRET=           # DANGER: server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # Safe: public
```

## Conventions

- **Commits:** Conventional commits enforced — `feat:`, `fix:`, `chore:`. Use `/commit` to generate.
- **Branches:** `feat/`, `fix/`, `chore/` prefixes. Always branch from `main`.
- **PRs:** Must pass CI (lint + test + e2e + type-check). Run `/audit` locally first.
- **Database changes:** Always create a migration with `supabase migration new <name>`. Never modify production data manually.
- **Components:** Server Components by default. Add `'use client'` only when you need interactivity.
- **Styling:** Tailwind utility classes only. No inline styles. No CSS modules.
