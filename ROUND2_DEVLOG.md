## 2026-05-20 11:00 — Start

Read Round 2 assignment carefully. Building "Re-audit on Pricing Change" 
feature. Plan first, build second.

Plan:
1. Add pricing_snapshot column to audits table in Supabase
2. Create /api/detect-changes endpoint
3. Set up GitHub Actions schedule to call it
4. Build diff view page at /audit/[id]/diff
5. Send notification emails via Resend
6. Write ROUND2_PR.md and ROUND2_REFLECTION.md

Biggest risk: diff view UI and email sending in 36 hours.
Cutting if needed: bonus features (unsubscribe, admin dashboard).


## 2026-05-20 15:00 — Database setup
Added pricing_snapshot and user_email columns to audits table.
Created pricing_change_logs table in Supabase.

## 2026-05-20 16:00 — Pricing snapshot working
Updated /api/audit to save pricing snapshot at audit time.
Added email field to the form. Verified in Supabase — both
columns saving correctly.

## 2026-05-20 17:30 — Detect changes endpoint
Built /api/detect-changes. Hit a bug — was comparing
storedToolPricing to itself instead of currentToolPricing.
Classic copy-paste bug. Fixed by reading carefully.

## 2026-05-20 19:00 — Detection working
Tested with simulated price change (cursor pro 20→22).
Found 2 stale audits correctly.

## 2026-05-20 20:00 — Email notifications
Added Resend email sending to detect-changes endpoint.
Email code runs correctly — pricing_change_logs shows
email_sent: true. Resend free tier limits delivery to
verified addresses only — documented this limitation.

## 2026-05-20 23:22 — Diff view page
Building /audit/[id]/diff page now.
Deadline: tomorrow 10pm. On track.
Plan for tomorrow: finish diff view, GitHub Actions schedule,
ROUND2_PR.md, ROUND2_REFLECTION.md, deploy.

## 2026-05-21 09:00 — Day 2 start

All 4 features working. Today: deploy, docs, submit.

## 2026-05-21 10:00 — Deployed to preview URL

Preview URL working:
https://ai-spend-audit-nno9-git-round-2-6d179f-rahul-singh011s-projects.vercel.app
Disabled Vercel deployment protection for preview URLs.
Tested detect-changes on live URL — working correctly.

## 2026-05-21 12:00 — Docs complete

ROUND2_PR.md, ROUND2_REFLECTION.md written.
Reverting cursor pro price to $20 after testing.

