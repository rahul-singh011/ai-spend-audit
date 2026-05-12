# Reflection

## 1. Hardest Bug

The hardest bug was the Supabase insert failing with error code
23502 — a null constraint violation on the recommendations column.

My first hypothesis was that the column type was wrong in the
database schema. I checked — it was jsonb, which should accept
any JSON including arrays. That wasn't it.

My second hypothesis was a serialization issue — maybe the array
wasn't being converted to JSON properly before insert. I added
console.log(JSON.stringify(auditResult)) and the data looked
correct. Still not it.

What worked: reading the error code (23502 = not-null constraint),
then carefully comparing every field name in the insert object
against the actual database column names character by character.

The lesson: when data exists in logs but fails in the database,
compare field names exactly. Typos in field names are invisible
to JavaScript because objects accept any key.

## 2. A Decision I Reversed

I initially planned to use the Anthropic API for the AI summary
because the assignment specifically mentioned it as preferred.
I set up the SDK, wrote the prompt, and tested it — only to get
a 400 error: "Your credit balance is too low."

I had an API key but no credits. Adding credits costs money and
I needed a free solution. I reversed the decision and switched
to Groq's free tier with llama-3.3-70b-versatile.

I documented this decision honestly in DEVLOG.md and PROMPTS.md
rather than hiding it.

## 3. What I'd Build in Week 2

**Priority 1 — Benchmark mode:**
"Your AI spend per developer is $X. Companies your size average
$Y." This requires collecting aggregate data from all audits
(anonymized) and showing users where they stand relative to
peers. This is the feature most likely to make the audit
shareable — nobody wants to just share their own data, but
they do want to share that they're in the top 20% of efficient
spenders.

**Priority 2 — PDF export:**
The shareable URL is good for online sharing but a PDF is what
gets sent to a CFO or board member. One click to download. 

**Priority 3 — Pricing alerts:**
AI tool pricing changes frequently. A simple weekly cron job
that checks official pricing pages and emails users when a
tool they audited changes price would drive re-engagement and
position SpendLens as the authoritative source on AI pricing.

## 4. How I Used AI Tools

I used Claude throughout the week primarily for debugging and
getting unstuck. When I hit errors I didn't understand, I'd
paste the error into Claude and ask what it meant. When I was
unsure about a concept like Supabase RLS policies or how
Next.js API routes work, I'd ask for an explanation.

**What I used AI for:**
- Understanding error messages (Supabase error codes,
  TypeScript build failures, hydration mismatches)
- Explaining concepts I hadn't used before (RLS)
- Getting suggestions when I was stuck on architecture decisions

**What I didn't use AI for:**
- The audit engine rules — I wrote the logic myself because
  I need to defend every decision in an interview
- The user interviews — real conversations with real people
- Final decisions on trade-offs — I took suggestions but
  made the final call myself

**One specific time AI was wrong:**
Claude suggested `llama3-8b-8192` as the Groq model. It was
already decommissioned. I caught it from the error message,
checked the Groq docs myself, and switched to
`llama-3.3-70b-versatile`. Good reminder that AI tools have
knowledge cutoffs and live documentation always wins.

**One time I caught a bad test:**
A test case assumed Cursor Pro would be cheaper than Copilot
Business for 3 seats — the math didn't actually support that.
The engine was correct, the test was wrong. I fixed the test
data after reading the failure output carefully.


**What I didn't trust it with:**
- The audit engine logic — I wrote every rule myself because
  the logic needs to be defensible and I need to be able to
  explain every decision in an interview
- The user interview notes — those are real conversations
- Final judgment on trade-offs — Claude suggests, I decide

**One specific time the AI was wrong:**
Claude suggested using `llama3-8b-8192` as the Groq model.
When I implemented it, the API returned a 400 error — that
model had been decommissioned. Claude's training data was
outdated and it didn't know about the deprecation. I caught
it by reading the error message carefully, searched the Groq
docs, and switched to `llama-3.3-70b-versatile`. This was
a good reminder that AI tools have knowledge cutoffs and
API/model availability should always be verified against
live documentation.

## 5. Self-Ratings

**Discipline: 7/10**
I committed code every day and kept the DEVLOG updated daily.
I lost half a point because I underestimated the time the
markdown docs would take and left too much for the final day.

**Code quality: 7/10**
The code is readable and the abstractions make sense. 

**Design sense: 6/10**
The UI is clean and functional but not distinctive. It uses
standard shadcn/ui components without much customization.
The results page is the strongest piece visually. I'd spend
more time on the landing page hero in week 2.

**Problem solving: 8/10**
I debugged every error systematically — forming hypotheses,
testing them, reading error codes.

**Entrepreneurial thinking: 7/10**
I conducted real user interviews, wrote defensible unit
economics, and thought carefully about distribution channels.
