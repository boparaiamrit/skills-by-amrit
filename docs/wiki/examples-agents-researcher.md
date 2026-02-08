# Researcher Agent Examples

> Deep codebase and domain research with evidence-based findings.

## Spawning

### Claude Code
```
Spawn researcher agent: "How does authentication work in this codebase?"
```

### Via /team
```
@/team start full "Implement new feature"
```
*Researcher is the 1st phase*

## What It Does

1. **Exhaustive Search** — Finds all relevant files
2. **Evidence Collection** — Gathers code snippets
3. **Source Attribution** — Links every finding to source
4. **Structured Report** — Organized findings document

## Output

```markdown
## Research: Authentication Flow

### Findings

1. **Entry Point**
   - File: `src/middleware/auth.ts:12`
   - Uses JWT validation with refresh tokens

2. **Session Storage**
   - File: `src/services/session.ts:34`
   - Redis-backed with 24h TTL

3. **User Lookup**
   - File: `src/repositories/user.ts:56`
   - Prisma ORM with soft delete support

### Recommendations
- Consider adding rate limiting on login endpoint
- Session refresh logic could use optimization
```
