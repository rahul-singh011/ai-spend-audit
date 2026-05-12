# Metrics

## North Star Metric

**Qualified leads captured per week**

Why: SpendLens exists to generate leads for Credex. A "qualified
lead" is someone who completed an audit showing >$100/month in
savings AND submitted their email. This metric directly measures
whether the tool is achieving its business purpose. It's better
than "audits completed" because completion without email capture
has no business value, and better than "emails captured" because
an email from someone with $0 savings has low conversion potential.

## 3 Input Metrics That Drive the North Star

**1. Audit completion rate**
(Audits submitted / Homepage visitors)
Target: >25%
Why: If people land but don't complete the form, the copy or
UX is broken. This is the top of the funnel.

**2. High-savings rate**
(Audits showing >$100/mo savings / Total audits completed)
Target: >40%
Why: Only high-savings audits convert to qualified leads.
If this is low, either the pricing data is wrong or we're
attracting already-optimal spenders.

**3. Email capture rate on high-savings audits**
(Emails captured / Audits showing >$100/mo savings)
Target: >30%
Why: This measures whether the value proposition is
compelling enough for high-savings users to share their email.

## What I'd Instrument First

1. **Funnel events in Posthog or Mixpanel:**
   - page_viewed (home)
   - tool_added (which tool)
   - audit_submitted
   - results_viewed
   - email_captured
   - share_link_copied

2. **Supabase query:** weekly count of leads where
   audit.total_monthly_savings > 100

3. **Vercel Analytics:** which pages get traffic and
   where users drop off

## What Number Triggers a Pivot Decision

If after 500 audit completions:
- Email capture rate < 5% → the value shown is not
  compelling enough, redesign the results page
- High-savings rate < 15% → our pricing data or audit
  logic is wrong, audit the engine
- Zero consultation bookings after 50 qualified leads →
  the Credex CTA is not working, redesign the handoff

The pivot trigger is not a single number but a pattern:
low capture + low savings rate + zero bookings = the core
value proposition is broken and needs rethinking before
more distribution.