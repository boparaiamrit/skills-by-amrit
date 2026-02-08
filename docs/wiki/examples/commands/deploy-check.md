# /deploy-check Command Examples

> Pre-deployment validation.

## Usage

```
@/deploy-check
```

## Checks

- Build passes
- Tests pass
- No lint errors
- Environment variables set
- Database migrations ready
- Feature flags configured
- Rollback plan documented

## Output

```markdown
## Deploy Check: v2.3.1

### Pre-flight
- [x] Build: ✅
- [x] Tests: ✅ (156 pass)
- [x] Lint: ✅
- [x] Types: ✅

### Environment
- [x] DATABASE_URL set
- [x] API_KEY set
- [ ] ❌ NEW_FEATURE_FLAG missing

### Verdict: ⚠️ BLOCKED
Missing NEW_FEATURE_FLAG
```
