---
description: Deep research on a topic, technology, or codebase area before planning
---

## Steps

1. Define the research question from the user's input:
   - What exactly are we investigating?
   - Is this codebase analysis, technology evaluation, or domain knowledge?
   - What depth is needed (quick scan vs deep dive)?

2. For codebase research, map the relevant area:
// turbo
```
find . -maxdepth 3 -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | head -100
```

3. Search for relevant code:
// turbo
```
grep -rn "[keyword]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" . | grep -v node_modules | head -40
```

4. For each relevant file found:
   - Read the FULL file (don't skim)
   - Trace imports and exports to map the dependency chain
   - Read associated tests (they document expected behavior)
   - Check git history: `git log --oneline -10 -- [file]`

5. Identify patterns and conventions:
   - Naming conventions (files, functions, variables)
   - Directory structure patterns
   - Import patterns and module organization
   - Error handling patterns
   - Testing patterns and frameworks
   - Config management approach

6. Check for risks and concerns:
   - Inconsistencies in patterns (potential bugs or tech debt)
   - Hidden dependencies and tight coupling
   - Performance concerns (N+1 queries, unbounded loops)
   - Security concerns (input validation, auth checks)

7. Create research directory if needed:
// turbo
```
mkdir -p .planning/research
```

8. Save structured research report to `.planning/research/[topic-slug].md` with:
   - Executive summary (3-5 sentences)
   - Key findings (each with file:line source, detail, and implications)
   - Patterns identified
   - Dependency map
   - Risks and concerns with severity
   - Actionable recommendations
   - Files examined list

9. Present key findings to user and ask:
   - **Proceed to planning?** — `/plan [feature]` using this research
   - **Dive deeper?** — Research a specific finding further
   - **Change direction?** — Research revealed a better approach
