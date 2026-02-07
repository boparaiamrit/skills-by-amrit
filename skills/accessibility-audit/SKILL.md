---
name: accessibility-audit
description: "Use when auditing UI for accessibility, WCAG compliance, keyboard navigation, screen reader support, or when building inclusive interfaces."
---

# Accessibility Audit

## Overview

Accessibility is not an afterthought — it's a legal requirement and an ethical obligation. 15% of the world's population has a disability.

**Core principle:** If it doesn't work with a keyboard and a screen reader, it's broken for millions of users.

## The Iron Law

```
NO INTERACTIVE ELEMENT WITHOUT KEYBOARD ACCESS. NO IMAGE WITHOUT ALT TEXT. NO FORM INPUT WITHOUT LABEL.
```

## When to Use

- Building any user interface
- Auditing existing UI
- Before launch or major release
- When accessibility complaints arise
- During frontend audit

## The Audit Process

### Phase 1: Keyboard Navigation

```
1. CAN you navigate the entire page with Tab?
2. IS focus order logical? (follows visual order)
3. IS focus visible? (outline or highlight on focused element)
4. CAN you activate buttons/links with Enter/Space?
5. CAN you close modals with Escape?
6. DO modals trap focus? (Tab doesn't escape to background)
7. CAN you navigate dropdowns with arrow keys?
```

### Phase 2: Semantic HTML

| Element | Correct | Incorrect |
|---------|---------|-----------|
| Navigation | `<nav>` | `<div class="nav">` |
| Button | `<button>` | `<div onclick>` or `<a href="#">` |
| Heading | `<h1>`→`<h6>` hierarchy | `<div class="title">` |
| List | `<ul>`/`<ol>` | `<div>` with bullet characters |
| Form | `<form>` with `<label>` | `<div>` with placeholder text only |
| Link | `<a href="url">` | `<span onclick>` |
| Main content | `<main>` | `<div id="content">` |

### Phase 3: Images and Media

```
1. DO all images have alt text?
2. IS alt text descriptive (not "image" or "photo")?
3. ARE decorative images marked as decorative (alt="")?
4. DO videos have captions/subtitles?
5. DO audio elements have transcripts?
6. DO animations respect prefers-reduced-motion?
```

### Phase 4: Color and Contrast

```
1. CHECK contrast ratio — text vs background
   - Normal text: minimum 4.5:1
   - Large text (18px+ or 14px+ bold): minimum 3:1
   - UI components: minimum 3:1

2. IS information conveyed without color alone?
   - ❌ "Required fields are red" (color alone)
   - ✅ "Required fields are marked with *" (text + color)

3. DO links stand out from surrounding text without color?
```

### Phase 5: Forms

```
1. DOES every input have a visible label?
2. ARE required fields indicated?
3. ARE error messages clear and associated with inputs?
4. IS form validation accessible? (aria-invalid, aria-describedby)
5. DO error messages explain HOW to fix, not just WHAT's wrong?
```

**Good vs bad error messages:**

```
❌ "Invalid input"
❌ "This field is required"
✅ "Please enter a valid email address (e.g., name@example.com)"
✅ "Password must be at least 8 characters with one number"
```

### Phase 6: ARIA (when HTML semantics aren't enough)

```
1. USE semantic HTML first — ARIA is a last resort
2. ENSURE dynamic content updates are announced (aria-live)
3. CHECK that custom components have appropriate roles
4. VERIFY aria-label/aria-labelledby match visible text
```

**ARIA rules:**
- Don't use ARIA if native HTML works
- Every ARIA role must have required properties
- All interactive ARIA elements must be focusable
- Don't override native semantics

## Output Format

```markdown
# Accessibility Audit: [Project Name]

## WCAG 2.1 Compliance Level
Target: AA / Current: [assessment]

## Findings by Category
| Category | Issues | Severity |
|----------|--------|----------|
| Keyboard | N | 🔴/🟡 |
| Screen Reader | N | 🔴/🟡 |
| Color/Contrast | N | 🟡 |
| Forms | N | 🟠 |
| Images | N | 🟡 |

## Detailed Findings
[Standard severity format]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Testing Tools

| Tool | Checks |
|------|--------|
| axe DevTools | Automated WCAG checks |
| Lighthouse | Accessibility score |
| WAVE | Visual accessibility report |
| Screen reader (NVDA/VoiceOver) | Real-world screen reader testing |
| Keyboard only | Tab through entire interface |
| Contrast checker | Color ratio verification |

## Red Flags

- No alt text on any images
- Click handlers on `<div>` or `<span>` (not `<button>`)
- No visible focus indicators
- Color as the only indicator of state
- Modals that don't trap focus
- No skip navigation link
- Heading hierarchy violations (h1 → h3, skipping h2)

## Integration

- **Part of:** `frontend-audit` includes quick accessibility check
- **Deep dive:** This skill for full WCAG compliance audit
- **During build:** `code-review` checks accessibility basics
