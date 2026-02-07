---
name: doc
description: "Generate or update documentation for the specified code."
disable-model-invocation: true
argument-hint: "[file-or-module]"
---

# /doc — Documentation Generation

Generate comprehensive documentation for code.

## Instructions

1. **Analyze the target** from `$ARGUMENTS`:
   - Read the file or module thoroughly
   - Understand the public API, types, and contracts
   - Identify usage patterns from callers

2. **Generate documentation**:

   **For a module/package** → Create or update `README.md`:
   ```markdown
   # Module Name

   Brief description of what this module does and why it exists.

   ## Usage
   ```code
   import { thing } from './module';
   const result = thing.doSomething(input);
   ```

   ## API Reference
   ### `functionName(param: Type): ReturnType`
   Description. Throws `ErrorType` when...

   ## Examples
   [Real-world usage examples]

   ## Architecture Notes
   [How this fits into the larger system]
   ```

   **For a function/class** → Add JSDoc/docstring:
   ```
   /**
    * Brief description.
    *
    * @param name - Description
    * @returns Description
    * @throws ErrorType - When condition
    * @example
    * const result = myFunction('input');
    */
   ```

3. **Quality rules**:
   - Document the WHY, not just the WHAT
   - Include at least one usage example
   - Document error conditions and edge cases
   - Keep descriptions concise — no filler words
   - Match the existing documentation style in the project
