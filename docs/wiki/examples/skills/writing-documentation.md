# writing-documentation Examples

> API docs, architecture diagrams, READMEs.

## Usage

### Antigravity
```
/doc src/services/
```

### Claude Code
```
@/doc src/services/
```

## Documentation Types

- API documentation
- Architecture diagrams
- README files
- Code comments
- Changelogs

## Example Output

```markdown
## Documentation: User Service

### Generated Files

#### API Documentation
```ts
/**
 * Creates a new user account.
 *
 * @param data - User creation data
 * @param data.email - User's email (must be unique)
 * @param data.name - User's display name
 * @returns The created user object
 * @throws {DuplicateEmailError} If email already exists
 *
 * @example
 * const user = await createUser({
 *   email: 'john@example.com',
 *   name: 'John Doe'
 * });
 */
async function createUser(data: CreateUserInput): Promise<User>
```

#### README Section
```markdown
## User Service

Handles user account management.

### Methods
- `createUser(data)` — Create new user
- `getUser(id)` — Get user by ID
- `updateUser(id, data)` — Update user
- `deleteUser(id)` — Soft delete user

### Usage
\`\`\`ts
import { userService } from '@/services';
const user = await userService.createUser({ ... });
\`\`\`
```
