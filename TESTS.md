# Tests

## Audit Engine Tests

**File:** `lib/auditEngine.test.ts`  
**How to run:** `pnpm test`

| # | Test | What it covers |
|---|------|----------------|
| 1 | should detect overpaying vs official price | Flags when user pays more than official price × seats |
| 2 | should flag team plan overkill for 2 users | Detects team plan waste for small teams |
| 3 | should mark spend as optimal when correctly priced | Returns optimal when spend matches official price |
| 4 | should correctly sum total monthly and annual savings | Verifies savings math across multiple tools |
| 5 | should suggest Cursor over GitHub Copilot for coding use case | Cross-tool recommendation logic |