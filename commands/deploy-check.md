---
name: deploy-check
description: "Run pre-deployment safety checks."
disable-model-invocation: true
argument-hint: "[environment: staging|production]"
---

# /deploy-check — Pre-Deployment Safety

Run comprehensive safety checks before deploying.

## Instructions

1. **Determine environment** from `$ARGUMENTS` (default: production).

2. **Run safety checklist**:

   ### Build Verification
   - [ ] Project builds without errors
   - [ ] No TypeScript/compiler errors
   - [ ] No linting errors or warnings

   ### Test Verification
   - [ ] All unit tests pass
   - [ ] All integration tests pass (if they exist)
   - [ ] Test coverage hasn't decreased

   ### Git State
   - [ ] Working directory is clean (no uncommitted changes)
   - [ ] Current branch is up to date with remote
   - [ ] No merge conflicts with main/production branch

   ### Security
   - [ ] No secrets or API keys in committed files
   - [ ] No `console.log` / `print` debug statements in production code
   - [ ] Dependencies are up to date (check for known vulnerabilities)

   ### Database
   - [ ] All migrations are committed and tested
   - [ ] No destructive migrations without backups
   - [ ] Migration order is correct

3. **Output a deployment report**:
   ```
   ## Deployment Check — [environment]
   ✅ Build: Clean
   ✅ Tests: 42/42 passing
   ✅ Git: Clean, up to date
   ⚠️ Security: 1 warning (see below)
   ✅ Database: 2 pending migrations

   ### Warnings
   - [details]

   ### Ready to deploy: YES/NO
   ```

4. **Do NOT deploy** — only report readiness. Let the user decide.
