# api-design-audit Examples

> REST/GraphQL conventions, versioning, pagination.

## Usage

### Antigravity
```
/audit api-design
```

### Claude Code
```
@/audit api-design
```

## Checks Performed

- RESTful resource naming
- HTTP method usage
- Status code correctness
- Pagination patterns
- Versioning strategy
- Error response format
- Request/response consistency
- GraphQL schema design (if applicable)

## Example Output

```markdown
## API Design Audit

### 🔴 Critical
- POST /users/delete (should be DELETE /users/:id)
- No pagination on /orders endpoint

### 🟠 High
- Inconsistent error format across endpoints
- Missing rate limiting headers

### 🟡 Medium
- No API versioning strategy
- Enum values not documented

### Recommendations
- Standardize on JSON:API or similar format
- Add Link headers for pagination
- Implement /v1/ prefix for versioning
```
