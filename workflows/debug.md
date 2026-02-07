---
description: Systematically debug an issue using scientific method with hypothesis-driven investigation
---

## Steps

1. Gather symptoms from the user:
   - **Expected behavior** — What should happen?
   - **Actual behavior** — What happens instead?
   - **Error messages** — Exact error text or stack traces?
   - **Timeline** — When did this start? What changed recently?
   - **Reproduction** — Steps to trigger the issue?

2. Verify the environment:
// turbo
```
git status; echo "==="; git log --oneline -10; echo "==="; node --version 2>/dev/null; python --version 2>/dev/null; echo "==="; npm run build 2>&1 | tail -10
```

3. Form 3-5 hypotheses ranked by likelihood:
   - For each: rationale, test to prove/disprove, evidence needed
   - Prioritize by: recent code changes, error specificity, reproduction reliability

4. Test hypotheses in order of confidence:

   a. **Gather evidence:**
   // turbo
   ```
   grep -rn "[error-text]" --include="*.ts" --include="*.js" . | grep -v node_modules | head -20
   ```

   b. **Trace the code path:**
   Read relevant files, follow function calls from entry to failure point

   c. **Check recent changes:**
   // turbo
   ```
   git log --all -p -- [affected-file] 2>/dev/null | head -80
   ```

   d. **Record results** for each hypothesis: ✅ Confirmed / ❌ Rejected / ⚠️ Inconclusive with evidence

5. Once root cause is identified, document:
   - What: exact technical description
   - Where: file:line
   - When introduced: commit/date if identifiable
   - Why not caught: missing test, edge case, config issue

6. Apply the minimal fix:
   - Change the fewest lines possible
   - Don't refactor while debugging
   - Add a comment explaining WHY if non-obvious

7. Write a regression test that would have caught this bug.

8. Verify the fix:
// turbo
```
npm run build 2>&1 | tail -5; echo "==="; npm test 2>&1 | tail -15; echo "==="; npm run lint 2>&1 | tail -5
```

9. Check for ripple effects — did the fix break anything else?

10. Save debug report to `.planning/debug/[slug].md` with:
    - Symptoms, hypotheses tested, root cause, fix applied, prevention measures
    - Update `.planning/STATE.md` with the debug entry
