# /debug Workflow Examples

> Systematically debug using scientific method with hypothesis-driven investigation.

## Basic Usage

```
/debug [error-message-or-symptom]
```

---

## Examples

### Example 1: Runtime Error

```
/debug "Uncaught ReferenceError: config is not defined"
```

**Workflow steps:**
1. ✅ Gathers symptoms (auto)
2. ✅ Verifies environment (turbo)
3. Forms hypotheses:
   - H1: Import missing
   - H2: Variable scoping issue
   - H3: Build not including file
4. Tests each with evidence gathering (turbo)
5. Documents root cause
6. Applies minimal fix
7. Verifies fix (turbo)

### Example 2: Intermittent Failure

```
/debug "API returns 500 randomly, about 10% of requests"
```

**Investigation:**
1. Checks logs for error patterns
2. Forms hypotheses:
   - H1: Race condition in async code
   - H2: Database connection pool exhausted
   - H3: Memory pressure causing GC pauses
3. Tests each with monitoring data

### Example 3: Integration Issue

```
/debug "Stripe webhook events not being processed"
```

**Analysis:**
1. Checks webhook endpoint registration
2. Verifies signature validation
3. Tests event handling locally
4. Identifies incorrect secret key in production

---

## Turbo Mode

Steps marked with `// turbo` auto-run:
- Environment verification
- Evidence gathering commands
- Build/test verification

---

## Output

Creates `.planning/debug/[slug].md` with:
- Symptoms documented
- Hypotheses tested
- Root cause identified
- Fix applied
- Prevention measures

---

## Claude Code Equivalent

```
@/debug "Stripe webhook events not being processed"
```

Same structured approach in command form.
