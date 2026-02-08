---
name: accessibility-audit
description: "Use when auditing UI for accessibility, WCAG compliance, keyboard navigation, screen reader support, or when building inclusive interfaces."
---

# Accessibility Audit

## Overview

Accessibility is not an afterthought — it's a legal requirement and an ethical obligation. 15% of the world's population has a disability. Accessible design is better design for everyone.

**Core principle:** If it doesn't work with a keyboard and a screen reader, it's broken for millions of users.

## The Iron Law

```
NO INTERACTIVE ELEMENT WITHOUT KEYBOARD ACCESS. NO IMAGE WITHOUT ALT TEXT. NO FORM INPUT WITHOUT LABEL. NO COLOR AS SOLE INDICATOR.
```

## When to Use

- Building any user interface
- Auditing existing UI for compliance
- Before launch or major release
- When accessibility complaints arise
- During frontend audit
- When targeting government or enterprise clients (legal compliance)

## When NOT to Use

- CLI tools or backend services (no UI)
- API-only projects (use `api-design-audit`)
- If the `frontend-audit` quick accessibility check found no issues AND the app is simple (< 5 pages)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "accessibility looks fine" — test every interactive element with keyboard only
- Say "alt text is present" — verify it's DESCRIPTIVE, not "image" or "photo" or the filename
- Say "forms are accessible" — verify every input has a VISIBLE label (placeholder is NOT a label)
- Say "contrast is fine" — measure actual contrast ratios (4.5:1 text, 3:1 components)
- Skip screen reader testing — use NVDA, VoiceOver, or at minimum, test with browser accessibility tree
- Say "we use semantic HTML" — check for div-as-button, span-as-link, div-as-list patterns
- Accept "it works with a mouse" as sufficient — mouse users are NOT the accessibility bar
- Say "ARIA will fix it" — ARIA is a last resort; native HTML is always preferred
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "Our users don't have disabilities" | You don't know that. 15% of all people do. Plus situational disabilities (broken arm, bright sunlight). |
| "We'll add accessibility later" | Retrofitting accessibility is 10x harder than building it in. |
| "Screen readers aren't our target" | Screen readers are used by blind, low-vision, dyslexic, and cognitively impaired users. Plus SEO benefits. |
| "Placeholder text is fine as a label" | Placeholders disappear on input — users forget what the field is for mid-typing. |
| "We removed focus outlines because they're ugly" | You just broke keyboard navigation. Style them, don't remove them. |
| "Only sighted users use our app" | Temporary impairments, aging, situational contexts (screen glare, one hand busy) affect everyone. |
| "ARIA will make it accessible" | Wrong ARIA is worse than no ARIA. Use native HTML elements first, always. |

## Iron Questions

```
1. Can a keyboard-only user complete the primary task without a mouse?
2. Can a screen reader user understand the page structure from headings alone?
3. If all CSS was disabled, does the content still make logical sense?
4. Does every form input remain understandable when its placeholder disappears?
5. Can a user with color blindness understand all information on the page?
6. Does the page work at 200% zoom without horizontal scrolling?
7. Can a user with reduced motion use the site without disorientation?
8. Would a user with cognitive disabilities understand the error messages?
9. Can someone using voice control identify and activate all interactive elements?
10. Does the site pass automated WCAG 2.1 AA checks with zero violations?
```

## The Audit Process

### Phase 1: Keyboard Navigation

```
1. CAN you navigate the entire page with Tab?
2. IS focus order logical? (follows visual/reading order)
3. IS focus visible? (styled outline or highlight — NOT outline: none)
4. CAN you activate buttons/links with Enter/Space?
5. CAN you close modals, dropdowns, and popups with Escape?
6. DO modals trap focus? (Tab stays within modal, doesn't leak)
7. CAN you navigate dropdowns and menus with arrow keys?
8. IS there a skip navigation link? (first focusable element)
9. CAN you reach all interactive elements? (no keyboard traps)
10. DOES focus return logically after closing overlays?
```

**Focus management testing:**

| Scenario | Expected Behavior | Common Failure |
|----------|-------------------|---------------|
| Open modal | Focus moves to modal's first element | Focus stays behind modal |
| Close modal | Focus returns to trigger button | Focus goes to top of page |
| Delete item from list | Focus moves to next/previous item | Focus disappears |
| Error on form submit | Focus moves to first error | Focus stays on submit button |
| Navigation dropdown | Arrow keys move between items | Tab-only (skips items) |
| Carousel/slider | Arrow keys control slides | Only mouse control |

### Phase 2: Semantic HTML

| Element | Correct | Incorrect | Why It Matters |
|---------|---------|-----------|---------------|
| Navigation | `<nav>` | `<div class="nav">` | Screen readers announce "navigation" |
| Button | `<button>` | `<div onclick>` or `<a href="#">` | Focusable, Enter/Space activated, announced as "button" |
| Heading | `<h1>`→`<h6>` hierarchy | `<div class="title">` | Screen readers build page outline from headings |
| List | `<ul>`/`<ol>` | `<div>` with bullets | Screen readers announce "list, 5 items" |
| Form | `<form>` with `<label>` | `<div>` with placeholder only | Labels persist, associate with inputs |
| Link | `<a href="url">` | `<span onclick>` | Focusable, announced as "link" |
| Main content | `<main>` | `<div id="content">` | Skip navigation target, landmark |
| Table | `<table>` with `<th>` | `<div>` grid with CSS | Screen readers announce headers per cell |
| Section | `<section aria-label>` | `<div class="section">` | Landmark navigation |

**Detection:**

```bash
# Find div-as-button anti-pattern
grep -rn "div.*onClick\|span.*onClick" --include="*.tsx" --include="*.jsx" . | grep -v node_modules

# Find missing labels
grep -rn "<input" --include="*.tsx" --include="*.jsx" . | grep -v "aria-label\|aria-labelledby\|id=.*for=" | grep -v node_modules | head -20

# Find outline: none (focus removal)
grep -rn "outline.*none\|outline.*0" --include="*.css" --include="*.scss" . | grep -v node_modules
```

### Phase 3: Images and Media

```
1. DO all images have alt text?
2. IS alt text descriptive? (not "image", "photo", or filename)
3. ARE decorative images marked as decorative (alt="" or role="presentation")?
4. DO videos have captions/subtitles?
5. DO audio elements have transcripts?
6. DO animations respect prefers-reduced-motion?
7. DO auto-playing media have stop/pause controls?
```

**Alt text quality guide:**

| Image Context | Bad Alt | Good Alt |
|--------------|---------|----------|
| Product photo | "image" | "Red leather wallet with gold clasp" |
| User avatar | "avatar" | "Profile photo of Jane Doe" |
| Chart/graph | "chart" | "Bar chart showing revenue growth from $1M in 2022 to $3M in 2024" |
| Decorative border | "border decoration" | `alt=""` (empty — decorative) |
| Icon button | No alt | `aria-label="Close dialog"` |
| Logo | "logo" | "Acme Corp homepage" (if it's a link) |

### Phase 4: Color and Contrast

```
1. CHECK contrast ratios:
   - Normal text (< 18px): minimum 4.5:1
   - Large text (18px+ or 14px+ bold): minimum 3:1
   - UI components and borders: minimum 3:1

2. IS information conveyed without color alone?
   - ❌ "Required fields are red" (color alone)
   - ✅ "Required fields are marked with *" (text + color)

3. DO links stand out from surrounding text without color?
   - Underline, bold, or icon + color

4. TEST with color blindness simulation:
   - Deuteranopia (green-blind, most common)
   - Protanopia (red-blind)
   - Tritanopia (blue-blind)
```

### Phase 5: Forms

```
1. DOES every input have a visible label? (not just placeholder)
2. ARE required fields indicated? (* or "required" text)
3. ARE error messages clear and associated with inputs? (aria-describedby)
4. IS form validation accessible? (aria-invalid on fields with errors)
5. DO error messages explain HOW to fix, not just WHAT's wrong?
6. IS there an error summary at the top of the form?
7. DO group labels exist for related inputs? (fieldset + legend)
8. ARE success states communicated to screen readers?
```

**Error message quality:**

| Bad | Good | Why |
|-----|------|-----|
| "Invalid input" | "Email must include @ symbol" | Actionable |
| "Error" | "Password must be at least 8 characters" | Specific |
| "Required" | "Please enter your phone number" | Context |
| Red border only | Red border + icon + text message | Multiple indicators |

### Phase 6: ARIA (Last Resort)

```
1. ARE you using semantic HTML first? (ARIA supplements, not replaces)
2. ARE dynamic content updates announced? (aria-live="polite" or "assertive")
3. DO custom components have appropriate roles?
4. DO aria-label/aria-labelledby match visible text?
5. IS every ARIA role paired with its required properties?
6. ARE interactive ARIA elements focusable? (tabindex="0")
```

**ARIA rules (first rule of ARIA: don't use ARIA):**

| Rule | Example |
|------|---------|
| Use native HTML first | `<button>` not `<div role="button">` |
| Don't change native semantics | Don't put `role="heading"` on a `<button>` |
| All interactive elements must be keyboard accessible | `tabindex="0"` + keydown handlers |
| Don't use `role="presentation"` on focusable elements | It strips semantics but element remains interactive |
| All form elements need accessible names | `aria-label`, `aria-labelledby`, or `<label>` |

### Phase 7: Responsive and Zoom

```
1. DOES the page work at 200% browser zoom? (WCAG requirement)
2. IS there horizontal scrolling at 320px viewport width?
3. DO touch targets meet minimum size? (44x44px on mobile)
4. IS text resizable without breaking layout?
5. ARE there text-only zoom issues? (content overflow, overlap)
```

## Testing Tools

| Tool | Checks | Phase |
|------|--------|-------|
| axe DevTools (browser extension) | Automated WCAG checks | All |
| Lighthouse Accessibility | Accessibility score (0-100) | Quick scan |
| WAVE | Visual accessibility report | All |
| NVDA (Windows) / VoiceOver (Mac) | Screen reader testing | Phase 1, 2 |
| Keyboard only (Tab + Enter + Escape) | Keyboard navigation | Phase 1 |
| WebAIM Contrast Checker | Color ratio verification | Phase 4 |
| prefers-reduced-motion test | Animation respect | Phase 3 |
| Chrome DevTools Rendering | Color blindness simulation | Phase 4 |

## Output Format

```markdown
# Accessibility Audit: [Project Name]

## WCAG 2.1 Compliance
- **Target:** AA
- **Current:** [AA / Partial AA / Non-compliant]
- **Automated Score:** [Lighthouse accessibility score] / 100

## Findings by Category
| Category | Issues | Critical | Assessment |
|----------|--------|----------|------------|
| Keyboard Navigation | N | N | 🔴/🟡/🟢 |
| Semantic HTML | N | N | 🔴/🟡/🟢 |
| Images & Media | N | N | 🔴/🟡/🟢 |
| Color & Contrast | N | N | 🔴/🟡/🟢 |
| Forms | N | N | 🔴/🟡/🟢 |
| ARIA Usage | N | N | 🔴/🟡/🟢 |
| Responsive/Zoom | N | N | 🔴/🟡/🟢 |

## Detailed Findings
[Standard severity format]

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — STOP and Investigate

- `outline: none` without replacement focus style
- Click handlers on `<div>` or `<span>` (not `<button>`)
- No alt text on any images
- Color as the only indicator of state (error, success, required)
- Modals that don't trap focus
- No skip navigation link
- Heading hierarchy violations (h1 → h3, skipping h2)
- Form inputs without associated labels
- Auto-playing audio or video without controls
- Text that can't be resized
- No prefers-reduced-motion handling for animations

## Integration

- **Part of:** `frontend-audit` includes quick accessibility check
- **Deep dive:** This skill for full WCAG compliance audit
- **During build:** `code-review` checks accessibility basics
- **Legal:** Required before launch for government/enterprise clients
