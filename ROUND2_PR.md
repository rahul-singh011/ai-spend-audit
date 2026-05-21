## What this PR does

Adds a "Re-audit on Pricing Change" system to SpendLens. When AI tool 
prices change, users who previously ran an audit are automatically 
notified by email with a link to see exactly what changed and how it 
affects their recommendations.

## Why

A one-time audit becomes misleading the moment pricing changes. Cursor 
raised prices in 2024, Claude added new tiers, Copilot restructured 
plans. A stale audit is worse than no audit — it gives false confidence. 
This feature makes SpendLens a living tool, not a snapshot.

## How it works

User submits audit
→ pricing snapshot saved alongside audit result in Supabase
→ user email captured upfront (optional, for notifications)

Daily GitHub Actions cron → POST /api/detect-changes
→ fetches all audits with email + pricing snapshot
→ compares stored snapshot vs current OFFICIAL_PRICING
→ if any price moved: re-runs audit with new pricing
→ saves diff to pricing_change_logs table
→ sends email via Resend with what changed + link to diff view

User clicks link → /audit/[id]/diff
→ shows old vs new recommendations side by side
→ highlights savings delta
→ CTA to re-run audit with current prices

New files:
- `app/api/detect-changes/route.ts` — detection + email logic
- `app/audit/[id]/diff/page.tsx` — diff view UI
- `.github/workflows/detect-changes.yml` — daily cron schedule

Modified files:
- `app/api/audit/route.ts` — saves pricing_snapshot + user_email
- `components/form/SpendForm.tsx` — email field added to form
- `lib/auditEngine.ts` — exported OFFICIAL_PRICING for reuse

New Supabase columns:
- `audits.pricing_snapshot` — jsonb, pricing at audit time
- `audits.user_email` — text, for notifications
- `pricing_change_logs` — new table, stores diffs + email status

## What I cut

- **Unsubscribe links in emails** — the value/effort ratio in 36h 
  didn't justify it. Resend handles bounces. Would add in week 2.
- **Admin dashboard** — bonus feature, skipped to ship core 4 features 
  working end-to-end first.
- **"What changed in AI tooling this week" public page** — good growth 
  surface but needs a frontend page + cron + public data model. Too 
  much scope for 36h.
- **Deduplication of emails** — if detect-changes runs twice, a user 
  could get two emails. Added email_sent flag to pricing_change_logs 
  to prevent this, but didn't add a check before sending. Would fix next.

## How to test it manually

1. Submit an audit at the live URL with your email
2. Check Supabase → audits → confirm pricing_snapshot and user_email saved
3. Temporarily change a price in lib/auditEngine.ts (e.g. cursor pro: 20 → 25)
4. POST /api/detect-changes
5. Check Supabase → pricing_change_logs → new row with email_sent: true
6. Visit /audit/[id]/diff with the audit ID → see diff view
7. Revert the price change

Or trigger via curl:
```bash
curl -X POST https://ai-spend-audit-nno9-git-round-2-6d179f-rahul-singh011s-projects.vercel.app/api/detect-changes
```

## What's tested

The existing 5 audit engine tests still pass — no regression.

I didn't write new automated tests for the detect-changes endpoint 
in this PR due to time pressure. What I'd test first:
- detect-changes correctly identifies changed prices
- detect-changes skips audits without email or snapshot
- email_sent flag prevents duplicate emails
- diff page renders correctly when no changes exist

## Open questions / risks

- **Resend free tier** limits sending to verified addresses only. 
  In production this needs a verified domain. The email code is 
  correct — it's a platform restriction not a code bug.
- **detect-changes runs on all audits every time** — at scale this 
  needs pagination. For now it's fine for the volume we have.
- **No rate limiting on /api/detect-changes** — anyone can trigger 
  it. Should add a secret header check before production use.