# LLM Prompts

## Audit Summary Prompt

Used in: `app/api/summary/route.ts`

### The Prompt
You are a financial advisor specializing in AI tool costs for startups.
A startup has completed an AI spend audit. Here are the results:
Team size: {teamSize} people
Primary use case: {useCase}
Total monthly savings identified: ${totalMonthlySavings}
Total annual savings identified: ${totalAnnualSavings}
Tool breakdown:
{recommendations}
Write a personalized 80-100 word summary paragraph for this startup. Be specific, mention their actual tools and numbers, and be honest. If savings are low, acknowledge they're spending well. If savings are high, emphasize the opportunity. Do not use bullet points. Write in second person ("your team", "you're paying"). Do not add a heading.

### Why I wrote it in this way

- **Second person** ("your team") makes it feel personal not generic
- **Be honest** instruction prevents the AI from manufacturing fake savings
- **No bullet points** keeps it as a readable paragraph, not a list
- **80-100 words** is enough to be useful without being overwhelming
- Including actual numbers forces specificity over vague advice

### What I tried that didn't work

- First version said "provide recommendations" — AI kept repeating the audit data instead of summarizing it
- Without the "do not add a heading" instruction, Claude added "Summary:" before every response
- Asking for "concise" without a word count gave inconsistent length responses

### Fallback

If the Anthropic API fails, a template string is used:
"Your team of {n} is spending on {x} AI tools. We identified ${savings}/month in potential savings..."

## Model Used
Groq API with llama3-8b-8192 (free tier)
Note: Originally planned to use Anthropic API but switched to Groq
free tier to avoid credit requirements during development.
The prompt structure remains the same.