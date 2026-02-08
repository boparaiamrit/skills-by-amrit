# verification-before-completion Examples

> Quality gates before claiming done.

## Usage

### Antigravity
```
/verify .planning/plans/feature.md
```

### Claude Code
```
@/verify .planning/plans/feature.md
```

## Verification Checklist

1. **Build passes** — `npm run build`
2. **Tests pass** — `npm test`
3. **Lint clean** — `npm run lint`
4. **Types check** — `tsc --noEmit`
5. **Manual test** — Feature works as expected
6. **Edge cases** — Errors handled
7. **Documentation** — Updated if needed

## Example Output

```markdown
## Verification: OAuth Feature

### Automated Checks
- [x] Build: ✅ (42s)
- [x] Tests: ✅ (156 pass, 0 fail)
- [x] Lint: ✅ (0 errors)
- [x] Types: ✅ (0 errors)

### Manual Verification
- [x] Login with Google works
- [x] Login with GitHub works
- [x] Token refresh works
- [x] Logout clears session
- [x] Invalid token shows error

### Edge Cases
- [x] Expired token → redirect to login
- [x] Network error → retry with backoff
- [x] Popup blocked → show message

### Documentation
- [x] README updated
- [x] API docs updated
- [x] Changelog entry added

### Verdict: ✅ COMPLETE
```
