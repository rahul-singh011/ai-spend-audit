# Round 2 Reflection

## 1. Most uncomfortable trade-off due to time pressure

The most uncomfortable cut was not deduplicating emails before 
sending. I added an `email_sent` flag to `pricing_change_logs` 
and mark it true after sending — but I didn't add a check before 
sending to skip audits that already have a recent log entry. This 
means if someone triggers `/api/detect-changes` twice in a row, 
the same user gets two emails about the same price change. 

I knew this was wrong when I wrote it. The fix is one extra 
Supabase query — check if a log entry already exists for this 
audit_id before inserting. I cut it because I was running low on 
time and the core flow needed to work end-to-end first. I'd fix 
this before any real users see it.

## 2. If deadline extended by 24 hours, first thing I'd do

Add the deduplication check to detect-changes — one Supabase 
query before inserting into pricing_change_logs:

```ts
const { data: existing } = await supabase
  .from('pricing_change_logs')
  .select('id')
  .eq('audit_id', audit.id)
  .eq('email_sent', true)
  .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  .single()

if (existing) continue 
```

This is the single highest-priority fix — everything else is 
polish, this is correctness.

## 3. One thing Round 1 me made harder for Round 2 me

The email field. In Round 1 I built the lead capture as a modal 
that appears after the audit — email is collected post-audit, 
not pre-audit. For Round 2 I needed the email upfront to attach 
it to the audit record for notifications.

I had to add a new email field to the form, update the FormData 
interface, fix the localStorage merge to handle the new field, 
and update the API to accept the new body shape. It worked but 
it took longer than it should have because I was retrofitting 
something that should have been designed differently from the start.

If I had known Round 2 was coming, I'd have collected email 
upfront in Round 1 and used the modal only as confirmation. 
Lesson: design for extensibility even in MVPs.