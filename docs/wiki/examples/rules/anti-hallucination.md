# anti-hallucination Rule Examples

> Verification-first protocol that prevents AI fabrication.

## Core Principle

**Never claim without evidence.**

## Examples

### ❌ Hallucination

```
"The API at /api/v2/users supports the 'include' parameter
for eager loading related data."
```
*Problem: Made up without checking*

### ✅ Verified

```
"Looking at src/api/users.ts:34, the endpoint supports:
- ?include=profile (line 45)
- ?include=orders (line 48)
- No eager loading for 'related' as claimed"
```

## Verification Levels

1. **File-Level** — Read the actual file before claiming it exists
2. **Behavioral** — Run the command to verify output
3. **Cross-Reference** — Check multiple sources
4. **Absence Claims** — Exhaustive search before saying "not found"

## Honesty Protocol

When uncertain:
```
"I'm not certain about [X]. Let me verify by [action]."
```

When wrong:
```
"I was incorrect about [X]. The actual behavior is [Y]
as shown in [evidence]."
```

## Cursor Rule

Automatically active via `.cursor/rules/anti-hallucination.mdc`

## Universal Rule

Active via `rules/anti-hallucination.md`
