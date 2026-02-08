# using-skills Examples

> How to use and combine skills effectively.

## Basic Usage

### Reference a skill
```
Please use the systematic-debugging skill to investigate this error.
```

### Combine skills
```
First use codebase-mapping to understand the architecture,
then use architecture-audit to find issues.
```

## Skill Discovery

### Find relevant skill
```
What skill should I use to review this pull request?
→ code-review skill
```

### Check activation
Skills activate automatically based on context:
- Bug report → systematic-debugging
- New feature → brainstorming → writing-plans → executing-plans
- PR review → code-review
- Production issue → incident-response

## Skill Chaining

### Feature Development Chain
```
1. brainstorming — explore options
2. writing-plans — create task breakdown
3. executing-plans — implement wave by wave
4. code-review — self-review before PR
5. verification-before-completion — final checks
```

### Debugging Chain
```
1. systematic-debugging — investigate root cause
2. test-driven-development — add regression test
3. code-review — review the fix
4. verification-before-completion — verify complete
```
