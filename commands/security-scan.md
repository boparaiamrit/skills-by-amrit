---
name: security-scan
description: "Run comprehensive security analysis across code, dependencies, secrets, and configuration."
disable-model-invocation: true
argument-hint: "[optional-scope]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Write
---

# /security-scan — Security Analysis

Comprehensive security scan across code, dependencies, secrets, and configuration.

## Instructions

### Step 1: Determine Scope

From `$ARGUMENTS`:
- If specific scope given: Scan that area only
- If nothing: Full project scan

### Step 2: Secret Detection

```bash
echo "=== SECRET SCAN ==="

# API keys, tokens, passwords
grep -rn "password\|secret\|api_key\|apikey\|token\|auth.*=\|bearer\|jwt" --include="*.ts" --include="*.js" --include="*.py" --include="*.env" --include="*.json" --include="*.yaml" --include="*.yml" . | grep -vi "node_modules\|.git\|dist\|test\|spec\|mock\|example\|placeholder\|process.env\|os.getenv\|os.environ" | head -30

# Private keys
find . -name "*.pem" -o -name "*.key" -o -name "*.p12" -o -name "id_rsa*" 2>/dev/null | grep -v node_modules

# .env files committed
git ls-files | grep -i "\.env" | grep -v ".example\|.sample\|.template"

# Hardcoded IPs/URLs that look like internal infrastructure
grep -rn "[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}" --include="*.ts" --include="*.js" . | grep -v node_modules | grep -v "127.0.0.1\|0.0.0.0\|localhost" | head -10
```

### Step 3: Dependency Vulnerabilities

```bash
echo "=== DEPENDENCY AUDIT ==="
npm audit 2>&1
npm audit --production 2>&1
```

### Step 4: Code Security Analysis

```bash
echo "=== CODE SECURITY ==="

# SQL injection potential (string concatenation in queries)
grep -rn "query\|execute.*\`\|execute.*+" --include="*.ts" --include="*.js" . | grep -v node_modules | grep -v "parameterized\|prepared" | head -20

# eval/exec usage
grep -rn "eval(\|exec(\|Function(\|setTimeout.*string\|setInterval.*string" --include="*.ts" --include="*.js" . | grep -v node_modules | head -10

# Unsanitized user input in HTML
grep -rn "innerHTML\|dangerouslySetInnerHTML\|document.write" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -v node_modules | head -10

# Missing input validation
grep -rn "req.body\|req.params\|req.query" --include="*.ts" --include="*.js" . | grep -v node_modules | grep -v "validate\|sanitize\|zod\|joi\|yup" | head -20

# Insecure crypto
grep -rn "md5\|sha1\|Math.random" --include="*.ts" --include="*.js" . | grep -v node_modules | head -10

# CORS wildcards
grep -rn "Access-Control-Allow-Origin.*\*\|cors({.*origin.*true\|cors()" --include="*.ts" --include="*.js" . | grep -v node_modules | head -10
```

### Step 5: Authentication & Authorization

```bash
echo "=== AUTH ANALYSIS ==="

# Missing auth middleware
grep -rn "app.get\|app.post\|app.put\|app.delete\|router.get\|router.post" --include="*.ts" --include="*.js" . | grep -v node_modules | grep -v "auth\|protect\|guard\|middleware" | head -20

# Session configuration
grep -rn "session\|cookie" --include="*.ts" --include="*.js" --include="*.json" . | grep -v node_modules | head -10

# JWT configuration
grep -rn "jwt\|jsonwebtoken\|expiresIn\|secret" --include="*.ts" --include="*.js" . | grep -v node_modules | head -10
```

### Step 6: Configuration Security

```bash
echo "=== CONFIG SECURITY ==="

# Debug mode in production configs
grep -rn "debug.*true\|DEBUG=true\|NODE_ENV.*dev" --include="*.ts" --include="*.js" --include="*.json" --include="*.env" . | grep -v node_modules | grep -v test | head -10

# Default credentials
grep -rn "admin.*admin\|root.*root\|password.*password\|default.*password" --include="*.ts" --include="*.js" --include="*.json" --include="*.env" . | grep -v node_modules | grep -v test | grep -v example | head -10

# .gitignore check
cat .gitignore | grep -i "env\|secret\|key\|credential" || echo "WARNING: .gitignore may not exclude sensitive files"
```

### Step 7: Generate Security Report

```markdown
# 🔒 Security Scan Report

## Summary
- **Scan date:** [timestamp]
- **Scope:** [what was scanned]
- **Critical findings:** [count]
- **High findings:** [count]
- **Medium findings:** [count]
- **Low findings:** [count]

## 🔴 Critical

### [Finding Title]
- **Type:** [Secret Exposure / SQL Injection / etc.]
- **Location:** `file:line`
- **Impact:** [What could go wrong]
- **Fix:** [Exactly what to do]

## 🟠 High
...

## 🟡 Medium
...

## 🔵 Low / Informational
...

## Recommendations
1. [Priority action 1]
2. [Priority action 2]
3. [Priority action 3]
```

Save to `.planning/research/security-scan.md`.
