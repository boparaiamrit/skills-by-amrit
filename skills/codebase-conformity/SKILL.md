---
name: codebase-conformity
description: "Use when adding any new code, feature, component, or endpoint to an existing codebase. Enforces pattern uniformity by requiring observation of existing code patterns before writing, matching them exactly, and double-verifying conformity. Covers frontend, backend, naming, structure, error handling, data flow, and styling patterns."
---

# Codebase Conformity

## Overview

AI assistants "innovate" when they should conform. They introduce new patterns, rename conventions, restructure layouts, and use different error handling — all in the same codebase. This skill forces the AI to **read before writing**, **match before creating**, and **verify before claiming done**.

**Core principle:** The existing codebase is the specification. Read it. Match it. Don't improve it in the same commit.

## The Iron Law

```
EVERY NEW FILE, FUNCTION, AND FEATURE MUST CONFORM TO EXISTING CODEBASE PATTERNS. NO EXCEPTIONS. NO INNOVATIONS. NO "BETTER WAYS."
```

## When to Use

**Mandatory (always active):**
- Adding a new file, component, page, route, or endpoint
- Adding a new function, hook, service, or utility
- Modifying existing code as part of a feature
- After any AI-generated code (including your own)
- Implementing any task from a plan

**Recommended:**
- Before reviewing code (check conformity first)
- After a refactoring (verify patterns held)
- When onboarding to an existing codebase

## When NOT to Use

- Greenfield projects with no existing code (there's nothing to conform TO)
- When explicitly refactoring patterns to a NEW standard (use `refactoring-safely`)
- When migrating architecture (use `writing-plans` → `executing-plans`)
- When the existing pattern IS the bug (fix the pattern separately, then conform)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Write code before reading at least 3 sibling files in the same directory — you don't know the pattern yet
- Introduce a new library, utility, or abstraction that doesn't already exist in the codebase — conform, don't innovate
- Use a different naming convention than the existing files — even if you prefer it
- Use a different error handling pattern than existing code — consistency > elegance
- Use a different import style or order than existing files — match them exactly
- Use a different component structure than existing components — structure is a pattern too
- Say "this is a common best practice" to justify deviating — the codebase's practice is the only practice
- Claim conformity without side-by-side comparison — "it looks right" is not verification
- Change an existing pattern while adding a feature — one concern per commit
- Skip double verification — context window amnesia is real, verify twice
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "My way is cleaner" | Consistency beats elegance. A codebase with 2 patterns is worse than 1 mediocre pattern. |
| "This is the modern approach" | Modern in a legacy codebase = inconsistent. Modernize separately. |
| "The existing pattern has issues" | File a ticket. Don't fix patterns while adding features. |
| "I know a better naming convention" | Name like the siblings. Save opinions for refactoring sessions. |
| "The docs recommend this approach" | The codebase IS the documentation. External docs are advisory. |
| "Nobody will notice the difference" | The next AI session will. Humans will during review. Every inconsistency compounds. |
| "It's just one file" | One file becomes the example for the next AI session. Non-conformity spreads. |
| "This pattern doesn't exist yet, so I'm free to define it" | Find the closest existing pattern and extend it. Don't invent from scratch. |

## Iron Questions

```
1. Have I READ at least 3 sibling files before writing new code? (list them)
2. Have I DOCUMENTED the naming pattern used in this directory? (show it)
3. Have I DOCUMENTED the structural pattern used for this type of file? (show it)
4. Does my new code use the EXACT SAME import style, order, and grouping? (side-by-side comparison)
5. Does my new code follow the EXACT SAME error handling pattern? (show the existing pattern, then mine)
6. Does my new code follow the EXACT SAME data fetching/API call pattern? (show the existing pattern, then mine)
7. Are my function/variable/class names consistent with the existing naming scheme? (list 5 existing examples, then mine)
8. Is my file/folder placed in the same location as similar files? (show the directory structure)
9. Have I done a SECOND verification pass, comparing my code to a DIFFERENT sibling file? (which one?)
10. Would a developer reading this file be UNABLE to tell it was written by a different author? (honest assessment)
```

## The Process

### Phase 1: Pattern Discovery (READ BEFORE WRITE)

```
BEFORE writing ANY code, you MUST complete this phase.

1. IDENTIFY the file type you're about to create/modify:
   □ Component / Page / Route
   □ API endpoint / Controller / Handler
   □ Service / Hook / Utility
   □ Type / Interface / Model
   □ Test / Spec
   □ Config / Migration / Script
   □ Stylesheet / Design token

2. FIND at least 3 existing files of the SAME TYPE:
   □ Search in the same directory first
   □ Search in sibling directories second
   □ Search project-wide if needed

3. READ each file completely — pay attention to:
   □ File naming convention (kebab-case? camelCase? PascalCase? Suffix patterns?)
   □ File header / copyright / imports section structure
   □ Import order and grouping (external → internal → relative → types)
   □ Export style (default export? named exports? barrel files?)
   □ Function signature style (arrow vs function, parameter patterns)
   □ Error handling pattern (try-catch? .catch()? error boundaries? custom errors?)
   □ Logging pattern (logger? console? custom utility?)
   □ Comment style (JSDoc? inline? section headers?)
   □ Testing pattern (describe/it? test()? setup/teardown?)

4. RECORD the canonical pattern for EACH observation.
   This becomes your conformity checklist for Phase 3.
```

### Phase 2: Pattern Catalog (DOCUMENT WHAT EXISTS)

```
CREATE a pattern catalog for the area you're working in.
This is your conformity specification.

FRONTEND PATTERNS (if applicable):
| Pattern Area | Example File | Convention |
|-------------|-------------|------------|
| Component naming | [file path] | [PascalCase, suffix with *Card, etc.] |
| Component structure | [file path] | [imports → types → component → export] |
| Props pattern | [file path] | [interface Props, destructured in params] |
| State management | [file path] | [useState/useReducer/Zustand/Redux] |
| Data fetching | [file path] | [useSWR/useQuery/fetch in useEffect] |
| Error handling | [file path] | [error boundary/inline/toast] |
| Loading states | [file path] | [skeleton/spinner/shimmer] |
| Empty states | [file path] | [component/message/CTA] |
| Styling approach | [file path] | [CSS modules/Tailwind/styled/vanilla] |
| Event handler naming | [file path] | [handleX/onX convention] |
| Conditional rendering | [file path] | [ternary/&&/early return] |

BACKEND PATTERNS (if applicable):
| Pattern Area | Example File | Convention |
|-------------|-------------|------------|
| Endpoint structure | [file path] | [controller → service → repo] |
| Request validation | [file path] | [Zod/Joi/class-validator/manual] |
| Response format | [file path] | [{ data, error, status }] |
| Error responses | [file path] | [HTTP codes, error shapes] |
| DB query pattern | [file path] | [ORM/raw SQL/query builder] |
| Auth handling | [file path] | [middleware/decorator/inline] |
| Logging | [file path] | [structured/unstructured, library] |
| Config access | [file path] | [env/config object/DI] |

SHARED PATTERNS:
| Pattern Area | Example File | Convention |
|-------------|-------------|------------|
| Type definitions | [file path] | [interfaces vs types, location, naming] |
| Test structure | [file path] | [describe nesting, naming, assertions] |
| File organization | [dir structure] | [feature-based/layer-based/hybrid] |
| Import aliases | [tsconfig/vite] | [@ prefix, ~ prefix, relative] |
| Constants | [file path] | [UPPER_CASE, location, grouping] |
```

### Phase 3: Conformity Implementation (MATCH, DON'T INVENT)

```
For EVERY piece of new code, apply the pattern catalog:

1. FILE CREATION:
   □ Name matches the convention from Phase 2
   □ Placed in the correct directory (same as siblings)
   □ File structure matches the canonical example

2. IMPORTS:
   □ Same libraries used (don't introduce new ones for the same purpose)
   □ Same import order (match the existing grouping)
   □ Same alias patterns (@ vs ~, relative vs absolute)
   □ Same destructuring style

3. CODE STRUCTURE:
   □ Same function/component skeleton as siblings
   □ Same prop/parameter patterns
   □ Same return value patterns
   □ Same export patterns

4. NAMING:
   □ Variables follow existing convention in nearby files
   □ Functions follow existing verb-noun pattern
   □ Types/interfaces follow existing naming pattern
   □ File name follows existing pattern (singular/plural, suffix convention)

5. ERROR HANDLING:
   □ Same try-catch structure (if used)
   □ Same error propagation pattern
   □ Same user-facing error format
   □ Same logging calls

6. DATA FLOW:
   □ Same data fetching mechanism
   □ Same state management approach
   □ Same caching strategy (if any)
   □ Same transformation utilities

7. STYLING (frontend):
   □ Same CSS methodology
   □ Same class naming convention
   □ Same responsive breakpoint approach
   □ Same spacing/sizing tokens

8. TESTING:
   □ Same test file naming and location
   □ Same describe/it structure
   □ Same assertion library
   □ Same mock/stub approach

FOR EACH ITEM: Note which existing file you're matching.
"Matched to: [file path]" — this is your evidence.
```

### Phase 4: Double Verification (THE CONFORMITY CHECK)

```
THIS IS THE MOST IMPORTANT PHASE. CONTEXT WINDOW AMNESIA IS REAL.
YOU MUST RE-READ YOUR CODE AND COMPARE IT FRESH.

PASS 1 — STRUCTURAL COMPARISON:
1. OPEN your new/modified file
2. OPEN the canonical sibling file from Phase 2
3. COMPARE side-by-side:
   □ Import section matches structure
   □ Type definitions match pattern
   □ Function/component structure matches
   □ Export section matches
   □ Error handling matches
   IF ANY DEVIATION: Fix it or justify it with a specific reason

PASS 2 — NAMING COMPARISON:
1. LIST all identifiers you created (variables, functions, types, files)
2. LIST 5 equivalent identifiers from existing code
3. COMPARE:
   □ Same casing convention
   □ Same prefix/suffix patterns
   □ Same verb-noun structure (if functions)
   □ Same singular/plural convention
   IF ANY DEVIATION: Rename to match

PASS 3 — BEHAVIORAL COMPARISON:
1. TRACE how existing similar features handle:
   □ Success path
   □ Error path
   □ Loading/pending state
   □ Empty/null state
2. VERIFY your code handles ALL of the same states
3. VERIFY your code uses the SAME mechanisms (not alternatives)
   IF ANY DEVIATION: Align to existing approach

PASS 4 — FRESH EYES:
1. PICK a DIFFERENT sibling file than the one used in Pass 1
2. COMPARE your code against THIS file
3. If your code still looks consistent → Conformity confirmed
4. If differences appear → Revisit and align
```

## Output Format

```markdown
# Codebase Conformity Report: [Feature/Change Name]

## Pattern Discovery
- **Files Studied:** [list of 3+ sibling files read]
- **Type of Change:** [component/endpoint/service/etc.]

## Pattern Catalog
[Tables from Phase 2 — what patterns exist]

## Conformity Evidence
| New Code Element | Conforms To | Match Evidence |
|-----------------|------------|----------------|
| [file name] | [sibling file name] | [naming, structure, imports match] |
| [function name] | [sibling function] | [same signature pattern] |
| [error handling] | [sibling error handling] | [same try-catch/error shape] |

## Double Verification
- **Pass 1 (Structure):** ✅/❌ — [notes]
- **Pass 2 (Naming):** ✅/❌ — [notes]
- **Pass 3 (Behavior):** ✅/❌ — [notes]
- **Pass 4 (Fresh Eyes):** ✅/❌ — [notes]

## Deviations (if any)
| Deviation | Justification | Existing Pattern | Decision |
|-----------|--------------|-----------------|----------|
| [what's different] | [why] | [what exists] | [conform/intentional] |

## Verdict
[FULLY CONFORMANT / MINOR DEVIATIONS NOTED / NEEDS ALIGNMENT]
```

## Red Flags — STOP

- Writing code without reading sibling files first
- Introducing a new npm package when an existing one serves the same purpose
- Using `console.log` when the codebase uses a logger
- Using a different state management pattern than existing code
- Naming files differently than siblings (e.g., `kebab-case` when siblings use `PascalCase`)
- Using a different import style or order than existing files
- Creating a new utility function when one already exists
- Using different error handling than the rest of the codebase
- Adding a stylesheet methodology that doesn't match (e.g., Tailwind in a CSS Modules project)
- Skipping the Pattern Discovery phase because "I already know the pattern"
- Saying "this is cleaner" to justify a deviation
- Making structural changes while implementing a feature

## Anti-Shortcut Safety Net

```
THESE RULES EXIST BECAUSE AI WILL INTRODUCE INCONSISTENCY:

1. You CANNOT write a new component without reading 3 existing components first
2. You CANNOT use a different fetch library than the one already in use
3. You CANNOT introduce a new error handling pattern — use the existing one
4. You CANNOT change naming conventions in a single file — either all or none
5. You CANNOT skip the double verification — it catches things the first pass misses
6. You CANNOT say "I matched the pattern" without showing WHICH FILE you matched
7. You CANNOT introduce new abstractions (wrapper functions, helper classes) unless
   the same abstraction pattern already exists elsewhere in the codebase
8. You CANNOT reorganize imports to "improve" them — match the existing order
9. You CANNOT add comments in a style different from existing code
10. You MUST show evidence of conformity, not just claim it
```

## Integration

- **Always active during:** `executing-plans` — every implemented task must conform
- **Pairs with:** `code-review` — conformity is a review criterion
- **Pairs with:** `full-stack-api-integration` — API integration must match existing patterns
- **Before intentional deviation:** `refactoring-safely` — change the pattern systematically
- **For pattern discovery:** `codebase-mapping` — understand the full pattern landscape
- **After:** `verification-before-completion` — conformity check is part of verification
