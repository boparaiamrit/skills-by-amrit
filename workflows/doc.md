---
description: Generate documentation for code, APIs, architecture, or project setup
---

## Steps

1. Determine documentation scope from user input:
   - **Code docs** — JSDoc/TSDoc/docstrings for functions and classes
   - **API docs** — Endpoint documentation with request/response examples
   - **Architecture docs** — System design, module relationships, data flow
   - **Setup docs** — Installation, configuration, development setup
   - **README** — Project overview and quick start

2. Research the target area:
// turbo
```
find . -maxdepth 3 -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | head -50; echo "---"; cat README.md 2>/dev/null | head -30
```

3. For each file/module to document:
   - Read the source code completely
   - Understand parameters, return types, side effects
   - Identify usage patterns (grep for imports)
   - Check existing docs for the module/function
   - Read tests for behavioral documentation

4. Follow these documentation standards:
   - **Be specific** — Include parameter types, return types, example values
   - **Document the WHY** — Not just what the code does, but why it exists
   - **Include examples** — Show real usage, not abstract descriptions
   - **Document edge cases** — What happens with null, empty, max values?
   - **Keep it current** — Documentation should match the actual code

5. Generate documentation:
   - For code: Add JSDoc/TSDoc comments inline
   - For APIs: Create `docs/api/` markdown files
   - For architecture: Create `docs/architecture/` with diagrams (Mermaid)
   - For setup: Update or create `README.md`

6. Verify documentation accuracy:
   - Every documented parameter exists in the code
   - Every documented return type matches the actual return
   - Every example can actually run

7. Present the documentation to the user for review.
