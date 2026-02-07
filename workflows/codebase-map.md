---
description: Map the entire codebase structure and dependencies
---

// turbo-all

## Steps

1. Get the project structure:
```
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/__pycache__/*" -not -path "*/.next/*" | head -100
```

2. Count files by extension:
```
find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -20
```

3. Find the entry points:
```
cat package.json 2>/dev/null | grep -E "main|module|bin|scripts" || cat pyproject.toml 2>/dev/null | grep -E "entry|scripts" || echo "Check manually"
```

4. Map dependencies:
```
cat package.json 2>/dev/null | grep -A 50 '"dependencies"' | head -30 || cat requirements.txt 2>/dev/null | head -30
```

5. Find the largest files (complexity indicators):
```
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | xargs wc -l 2>/dev/null | sort -rn | head -20
```

6. Create a `CODEBASE-MAP.md` documenting:
   - Project overview and purpose
   - Directory structure with descriptions
   - Key entry points
   - Dependency graph
   - Architecture patterns identified
   - Complexity hotspots (largest files)

7. Present the codebase map to the user.
