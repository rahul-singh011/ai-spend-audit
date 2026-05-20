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