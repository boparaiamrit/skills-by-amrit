# /discuss Command Examples

> Lock decisions BEFORE planning. Prevents the #1 cause of rework: wrong assumptions about what the user wants.

## Usage

### Claude Code
```
@/discuss add authentication to the app
```

### Antigravity
```
/discuss add authentication to the app
```

## What It Does

1. **Identifies** 3-8 decision points where multiple approaches exist
2. **Presents** multiple-choice questions with lettered options and recommendations
3. **Waits** for your quick-answer (one line: `1A 2B 3C`)
4. **Locks** decisions in a CONTEXT.md file
5. **Records** decisions in the planning state

## The MCQ Format

Every question follows this structure:

```markdown
### Q1: Decision Category 🔒

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Option name | 1-line trade-off |
| **B** | Option name | 1-line trade-off |
| **C** | Option name | 1-line trade-off |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Why this is the best default
```

## Quick-Answer Format

Answer ALL questions in one line at the bottom:

```
1A 2B 3C 4A 5A
```

### Quick-Answer Variations

| Input | Meaning |
|:---|:---|
| `1A 2B 3C` | Question 1: A, Question 2: B, Question 3: C |
| `1A 2A 3:"use Redis"` | Q3 is a custom answer in quotes |
| Just press Enter | Accept all recommendations |
| `change Q3 to B` | After confirmation, change a decision |

## Full Example — Adding Search to an App

**You:**
```
/discuss add search functionality
```

**AI responds:**

```markdown
## 📋 Discussion: Search Functionality

I've identified 5 decisions we need to lock.

---

### Q1: Search Engine 🔍

| | Option | What It Means |
|:---:|:---|:---|
| **A** | PostgreSQL full-text | No extra infra, good enough for <100K docs |
| **B** | Elasticsearch | Best relevance, heavy infra, operational cost |
| **C** | Meilisearch | Typo-tolerant, lightweight, easy setup |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — You're already on PostgreSQL,
> no extra services needed for your scale

---

### Q2: Search UX 🎨

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Instant (search-as-you-type) | Great UX, more API calls |
| **B** | Submit-based (press Enter) | Simple, fewer API calls |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Modern users expect instant results

---

### Q3: Search Scope 📐

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Single entity (e.g., Products) | Focused, simple UI |
| **B** | Global (all entities) | Shows products, orders, users in one box |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: B** — One search box, multiple result types

---

### Q4: Result Display 📄

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Dropdown under search bar | Fast, non-disruptive, limited space |
| **B** | Dedicated results page | Full layout, pagination, filters |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Shows results instantly without navigation

---

### Q5: Indexing Strategy 🗄️

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Real-time (triggers) | Always fresh, slight write overhead |
| **B** | Background job (every 5 min) | Cheaper, slight delay |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Your data changes infrequently enough

---

### ⚡ Quick Answer

> **All recommended:** `1A 2A 3B 4A 5A`
>
> **Example custom:** `1C 2A 3B 4A 5:"hourly cron job"`

**Your answer:**
```

**You respond:**
```
1A 2A 3B 4A 5A
```

**AI confirms:**
```
✅ Decisions Locked — 5 choices captured.
All match recommendations.
Saved to: .planning/research/search-functionality-context.md

Run /plan to create the implementation plan.
```

## When NOT to Use /discuss

- ❌ Bug fix — "fix the login button" (no decisions needed)
- ❌ Config change — "set the timeout to 30s" (one approach)
- ❌ User says "just do it" — respect their trust

## Integration Flow

```
/discuss → CONTEXT.md → /plan → reads CONTEXT.md → tasks respect locked decisions
```
