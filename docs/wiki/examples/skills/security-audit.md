# security-audit Examples

> OWASP top 10, auth flows, secrets management.

## Usage

### Antigravity
```
/security-scan
```

### Claude Code
```
@/security-scan
```

## OWASP Top 10 Checks

1. Injection
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities
5. Broken Access Control
6. Security Misconfiguration
7. XSS
8. Insecure Deserialization
9. Known Vulnerabilities
10. Insufficient Logging

## Example Output

```markdown
## Security Audit

### 🔴 Critical
- SQL injection in search (query.ts:45)
- JWT secret in source code
- No rate limiting on login

### 🟠 High
- XSS in user bio (unsanitized HTML)
- Session doesn't expire
- No CSRF protection

### 🟡 Medium
- Verbose error messages in production
- Missing security headers

### Findings Detail

#### SQL Injection
```ts
// VULNERABLE (line 45)
db.query(`SELECT * FROM users WHERE name = '${input}'`);

// FIX
db.query('SELECT * FROM users WHERE name = $1', [input]);
```

### Recommendations
- Move secrets to environment variables
- Implement rate limiting (10 req/min)
- Add helmet.js for security headers
```
