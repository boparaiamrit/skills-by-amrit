# accessibility-audit Examples

> WCAG compliance, keyboard navigation, screen reader support.

## Usage

### Antigravity
```
/audit accessibility
```

### Claude Code
```
@/audit accessibility
```

## Checks Performed

- WCAG 2.1 AA compliance
- Keyboard navigation flow
- Focus management
- Screen reader compatibility
- Color contrast ratios
- Alt text for images
- ARIA labels and roles
- Skip links
- Form labels

## Example Output

```markdown
## Accessibility Audit

### 🔴 Critical
- Missing alt text on 12 images
- Form inputs without labels (login.tsx:45)

### 🟠 High
- Color contrast ratio 3.2:1 (needs 4.5:1)
- No skip link to main content

### 🟡 Medium
- Focus not visible on dropdown menu
- Tab order illogical in settings page

### Actions
- [ ] Add alt="" to decorative images
- [ ] Add aria-label to icon buttons
- [ ] Increase contrast on muted text
```
