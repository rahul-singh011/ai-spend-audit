## Day 1 — 2026-05-07

**Hours worked:** 2  
**What I did:** Project setup, folder structure, all markdown files created, types defined  
**What I learned:** Next.js App Router structure, TypeScript basic types  
**Blockers / what I'm stuck on:** Nothing yet  
**Plan for tomorrow:** Build the spend input form UI

## Day 2 — 2026-05-08

**Hours worked:** 3  
**What I did:** Built the complete audit engine with rules for overpaying detection, team plan overkill, and cross-tool recommendations. Wrote 5 Jest tests — 1 failed first due to wrong test data assumption (engine was correct, test was wrong). Fixed and all 5 pass.  
**What I learned:** How to write Jest tests, how to think about audit logic defensibly, difference between a bug in code vs a bug in the test  
**Blockers / what I'm stuck on:** Need to set up Supabase next  
**Plan for tomorrow:** API route, Supabase setup, results page

## Day 3 — 2026-05-09

**Hours worked:** 4  
**What I did:** Set up Supabase database with audits and leads tables, configured row-level security policies, created Supabase client helper, built POST /api/audit route, connected form to API, debugged multiple Supabase errors (typo in column name, RLS policy conflicts, null constraint issue). API now saves audits successfully and redirects to /audit/[id].  
**What I learned:** How Next.js API routes work, how Supabase RLS policies work, how to debug database errors by reading error codes, difference between database schema errors and code errors  
**Blockers / what I'm stuck on:** Results page not built yet — getting 404 on /audit/[id]  
**Plan for tomorrow:** Build results page, add Anthropic AI summary, start lead capture modal

## Day 4 — 2026-05-10

**Hours worked:** 4  
**What I did:** Built results page with per-tool breakdown and savings hero. Integrated AI summary — first tried Anthropic API (no credits), switched to Groq free tier. Hit deprecated model error (llama3-8b-8192), fixed by switching to llama-3.3-70b-versatile. AI summary now generates personalized paragraphs with fallback template if API fails.  
**What I learned:** How to handle API failures gracefully with fallback, how to debug model deprecation errors, how Next.js 16 changed params to a Promise
**Blockers / what I'm stuck on:** Need to add lead capture and email sending next 
**Plan for tomorrow:** Lead capture modal, Resend email, shareable URL OG tags, CI workflow, deploy to Vercel

## Day 5 — 2026-05-11

**Hours worked:** 7  
**What I did:** Build Lead capture modal, Resend email, shareable URL OG tags and Fixed all lint errors, set up GitHub Actions CI, deployed to Vercel. Debugged 6+ build errors including missing types folder, typo in recommendations, null check in audit engine. Site is now live at https://ai-spend-audit-nno9.vercel.app.
**What I learned:** How Vercel auto-deploys from GitHub, how TypeScript is stricter in production builds than development, how to fix CI workflow for pnpm
**Blockers / what I'm stuck on:** User interviews pending — waiting for friends to reply
**Plan for tomorrow:** Complete all markdown docs, README screenshots

## Day 6 — 2026-05-12

**Hours worked:** 7  
**What I did:** Completed all markdown documentation — GTM, ECONOMICS, REFLECTION, METRICS, LANDING_COPY, ARCHITECTURE, README, USER_INTERVIEWS. Fixed hydration error caused by localStorage mismatch between server and client render — solved with isMounted pattern. Improved Lighthouse accessibility from 81 to 98 by fixing form labels and contrast. Added smooth scroll on CTA buttons. Optimized Next.js config for better performance. Took screenshots for README. Final review of all files before submission.  
**What I learned:** Hydration errors happen when server-rendered HTML doesn't match client — localStorage data causes this because server doesn't have access to it. The isMounted pattern solves this cleanly. Also learned that Lighthouse scores vary on localhost — always test on the live deployed URL.  
**Blockers / what I'm stuck on:** Nothing — all MVP features working, all docs complete, CI green, deployed on Vercel.  
**Plan for tomorrow:** Submit the Google Form with GitHub repo URL and live Vercel URL.

## Day 7 — 2025-05-13

**Hours worked:** 2  
**What I did:** Final submission day. Fixed lint error in SpendForm — 
removed isMounted pattern and replaced with suppressHydrationWarning. 
Ran all 5 tests — all passing. Ran lint — no errors. Tested full user 
flow on live Vercel URL: form → audit → results → email capture → 
shareable link. All working. Reviewed all 12 markdown files. 
Submitted Google Form with GitHub repo and live URL.  
**What I learned:** Shipping a complete product in 7 days is very 
different from tutorials. The hardest parts were not the code — 
they were decisions, documentation, and talking to real users. 
I underestimated how long markdown docs would take.  
**Blockers / what I'm stuck on:** None — submission complete.  
**Plan for tomorrow:** Wait for Round 2 results within 3 working days.