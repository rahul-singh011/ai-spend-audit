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