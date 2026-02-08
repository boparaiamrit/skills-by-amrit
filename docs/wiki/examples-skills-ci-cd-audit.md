# ci-cd-audit Examples

> Build times, test reliability, deployment safety.

## Usage

### Antigravity
```
/audit ci-cd
```

### Claude Code
```
@/audit ci-cd
```

## Checks Performed

- Build time optimization
- Test reliability (flaky tests)
- Deployment rollback capability
- Environment parity
- Secret management
- Pipeline security
- Artifact caching

## Example Output

```markdown
## CI/CD Audit

### 🔴 Critical
- Secrets hardcoded in docker-compose.yml
- No rollback strategy defined

### 🟠 High
- 3 flaky tests (fail 10% of runs)
- Build time: 18min (target: <10min)

### 🟡 Medium
- No staging environment
- Cache invalidation issues

### Pipeline Analysis
- Build: 8min (could be 4min with caching)
- Test: 7min (parallel: 3min)
- Deploy: 3min ✅

### Recommendations
- Enable npm/pip caching
- Split tests into parallel jobs
- Add canary deployment stage
```
