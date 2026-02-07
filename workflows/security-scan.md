---
description: Run comprehensive security analysis across code, dependencies, secrets, and configuration
---

## Steps

// turbo-all

1. Secret detection scan:
```
echo "=== SECRETS ==="; grep -rn "password\|secret\|api_key\|apikey\|token\|auth.*=\|bearer" --include="*.ts" --include="*.js" --include="*.py" --include="*.env" --include="*.json" --include="*.yaml" . | grep -vi "node_modules\|.git\|dist\|test\|spec\|mock\|example\|process.env\|os.getenv" | head -20; echo "=== PRIVATE KEYS ==="; find . -name "*.pem" -o -name "*.key" -o -name "*.p12" -o -name "id_rsa*" 2>/dev/null | grep -v node_modules; echo "=== ENV FILES ==="; git ls-files 2>/dev/null | grep -i "\.env" | grep -v ".example\|.sample\|.template"
```

2. Dependency vulnerability audit:
```
npm audit 2>&1 | head -40; echo "==="; npm audit --production 2>&1 | head -20
```

3. Code security analysis:
```
echo "=== SQL INJECTION ==="; grep -rn "query\|execute" --include="*.ts" --include="*.js" . | grep -v node_modules | grep "\`\|+" | head -10; echo "=== EVAL ==="; grep -rn "eval(\|exec(\|Function(\|setTimeout.*string" --include="*.ts" --include="*.js" . | grep -v node_modules | head -5; echo "=== XSS ==="; grep -rn "innerHTML\|dangerouslySetInnerHTML\|document.write" --include="*.ts" --include="*.tsx" --include="*.js" . | grep -v node_modules | head -5; echo "=== INPUT VALIDATION ==="; grep -rn "req.body\|req.params\|req.query" --include="*.ts" --include="*.js" . | grep -v node_modules | grep -v "validate\|sanitize\|zod\|joi" | head -10; echo "=== INSECURE CRYPTO ==="; grep -rn "md5\|sha1\|Math.random" --include="*.ts" --include="*.js" . | grep -v node_modules | head -5; echo "=== CORS ==="; grep -rn "Access-Control-Allow-Origin.*\*\|cors({.*origin.*true" --include="*.ts" --include="*.js" . | grep -v node_modules | head -5
```

4. Auth analysis:
```
echo "=== UNPROTECTED ROUTES ==="; grep -rn "app.get\|app.post\|app.put\|app.delete\|router.get\|router.post" --include="*.ts" --include="*.js" . | grep -v node_modules | grep -v "auth\|protect\|guard\|middleware" | head -15; echo "=== SESSION ==="; grep -rn "session\|cookie\|jwt\|jsonwebtoken" --include="*.ts" --include="*.js" --include="*.json" . | grep -v node_modules | head -10
```

5. Config security:
```
echo "=== DEBUG MODE ==="; grep -rn "debug.*true\|DEBUG=true\|NODE_ENV.*dev" --include="*.ts" --include="*.js" --include="*.json" --include="*.env" . | grep -v node_modules | grep -v test | head -5; echo "=== DEFAULT CREDS ==="; grep -rn "admin.*admin\|root.*root\|password.*password" --include="*.ts" --include="*.js" --include="*.json" . | grep -v node_modules | grep -v test | head -5; echo "=== GITIGNORE ==="; cat .gitignore | grep -i "env\|secret\|key\|credential"
```

6. Categorize all findings by severity:
   - 🔴 Critical: Secret exposure, SQL injection, auth bypass
   - 🟠 High: Missing validation, insecure crypto, CORS wildcards
   - 🟡 Medium: Debug mode, unprotected routes, stale dependencies
   - 🔵 Low: Config improvements, best practice suggestions

7. Generate security report and save to `.planning/research/security-scan.md` with:
   - Summary (date, scope, finding counts by severity)
   - Detailed findings with location, impact, and specific fix instructions
   - Prioritized recommendations
