---
name: context
description: "Switch context mode to change how the assistant behaves (dev, research, or review)."
disable-model-invocation: true
argument-hint: "[mode: dev|research|review]"
---

# /context — Switch Context Mode

Switch the active context mode to `$ARGUMENTS`.

## Instructions

1. **Determine mode** from `$ARGUMENTS`:
   - `dev` — Write code first, explain after. Minimize discussion, maximize output.
   - `research` — Read widely before concluding. Extended research, document findings.
   - `review` — Quality over speed. Security-first, severity-ordered findings.

2. **If no argument provided**, show the available modes:
   ```
   Available context modes:
   - dev       — Write code first, explain after
   - research  — Read widely before concluding
   - review    — Quality over speed, security-first

   Usage: /context <mode>
   ```

3. **If valid mode provided**:
   - Read the corresponding context file from `contexts/<mode>.md`
   - Internalize the behavior changes described in that file
   - Confirm the switch: `Context switched to **<mode>** mode. <one-line description>`

4. **If invalid mode provided**:
   - Show an error: `Unknown context mode: "<argument>". Valid modes: dev, research, review`

5. **The context mode persists** for the remainder of the conversation unless switched again.
