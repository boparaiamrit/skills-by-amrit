---
description: Explain code, architecture, or concepts in detail with context and examples
---

## Steps

1. Identify what needs explaining from the user's request:
   - Specific file or function?
   - Architectural pattern?
   - Technology or concept?
   - Bug or behavior?

2. Research the target:
// turbo
```
grep -rn "[keyword]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" . | grep -v node_modules | head -30
```

3. Read the source code completely — don't skim.

4. Trace the execution flow:
   - Entry point → intermediate calls → final output
   - Map data transformations along the way
   - Identify side effects

5. Provide the explanation in layers:
   - **High-level summary** (1-2 sentences — what and why)
   - **How it works** (step-by-step walkthrough)
   - **Key decisions** (why this approach was chosen)
   - **Data flow** (what goes in, what transformations happen, what comes out)
   - **Edge cases** (what happens in unusual situations)
   - **Related code** (what else depends on or relates to this)

6. Use code snippets to illustrate:
   - Show the actual code being discussed
   - Annotate with comments explaining non-obvious parts
   - Show example inputs and outputs

7. Answer the user's specific question directly before providing broader context.
