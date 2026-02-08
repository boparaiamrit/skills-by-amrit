# full-stack-api-integration Examples

> End-to-end API integration from spec to implementation.

## Antigravity

```
/integrate-api openapi.yaml
```

## Claude Code

```
@/integrate openapi.yaml
```

## Process

1. **Spec Analysis** — Parse OpenAPI/GraphQL spec
2. **Surface Mapping** — Identify all affected files
3. **Type Generation** — Create TypeScript types
4. **Service Layer** — Build API client with SOLID principles
5. **Frontend Integration** — Connect components to API
6. **Error Handling** — Add proper error states
7. **Testing** — Integration tests for endpoints

## Example Output

```markdown
## API Integration: User Service

### Surface Map
- Types: `src/types/user.types.ts` (new)
- Service: `src/services/user.service.ts` (new)
- Hooks: `src/hooks/useUser.ts` (new)
- Components: `src/components/UserProfile.tsx` (modified)

### Endpoints Integrated
- [x] GET /users/:id → `getUser(id)`
- [x] POST /users → `createUser(data)`
- [x] PATCH /users/:id → `updateUser(id, data)`
- [x] DELETE /users/:id → `deleteUser(id)`

### Tests Added
- `tests/services/user.service.test.ts`
- `tests/hooks/useUser.test.ts`
```
