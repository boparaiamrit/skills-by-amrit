# Example: Greenfield Walkthrough

> Building a real-time trading dashboard from scratch — full conversation flow showing every step.

---

## The Scenario

You're building a **real-time trading dashboard** that shows live crypto prices, your portfolio, and trade history. No code exists yet.

---

## Step 1: Install and Init

**You:** Install skills and tell your AI agent:
```
/init-project
```

**AI responds:**
```
I'll set up the project structure. Let me bootstrap the planning system first.

> Running: node planning-tools.cjs init

✅ Created .planning/ directory with 12 files:
  - MEMORY.md, STATE.md, config.json
  - decisions/, plans/, research/, sessions/, handoffs/
  - context/architecture.md, patterns.md, gotchas.md, tech-debt.md

Now I need to understand what we're building. Let me ask some questions:

1. What is this project?
2. Who is it for?
3. What are the main features?
4. What tech stack do you prefer?
5. Any hard constraints (timeline, budget, existing integrations)?
```

**You:**
```
1. Real-time trading dashboard for crypto
2. Just me — personal use
3. Live prices, portfolio view, trade history, P&L charts
4. Next.js, Supabase, TailwindCSS
5. Must connect to Binance API. 1 week timeline.
```

**AI writes:**
- `MEMORY.md` — project brain with all context
- `ROADMAP.md` — phases (Data Pipeline → Charts → Portfolio → Alerts)
- `REQUIREMENTS.md` — feature list with priorities

---

## Step 2: Discuss the First Feature

**You:**
```
/discuss implement live price feed
```

**AI responds:**

```markdown
## 📋 Discussion: Live Price Feed

I've identified 4 decisions we need to lock before planning.

---

### Q1: Data Connection 📡

| | Option | What It Means |
|:---:|:---|:---|
| **A** | WebSocket (real-time) | Sub-second updates, more complex, persistent connection |
| **B** | REST polling (every 5s) | Simple, uses more bandwidth, slight delay |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — You said "real-time" so WebSocket is the right fit

---

### Q2: Price Display Format 💰

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Table with sparklines | Dense info, classic trading UI |
| **B** | Cards with mini-charts | Visual, modern, less data density |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Matches professional trading dashboards

---

### Q3: Number of Trading Pairs 📊

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Top 10 (BTC, ETH, ...) | Fast, focused, low bandwidth |
| **B** | Top 50 | Comprehensive, more WebSocket streams |
| **C** | User-configurable watchlist | Most flexible, more UI work |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: C** — You'll want to customize this over time

---

### Q4: State Management 🗄️

| | Option | What It Means |
|:---:|:---|:---|
| **A** | React state (useState) | Simple, no extra deps, might re-render a lot |
| **B** | Zustand | Lightweight, good perf with selectors |
| **C** | Redux Toolkit | Heavy but battle-tested for complex state |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: B** — Perfect balance for real-time data with minimal re-renders

---

### ⚡ Quick Answer

> **All recommended:** `1A 2A 3C 4B`
>
> **Example custom:** `1A 2B 3C 4:"use Jotai instead"`

**Your answer:**
```

**You respond:**
```
1A 2A 3C 4B
```

**AI confirms and locks:**
```markdown
## ✅ Decisions Locked

| # | Decision | Your Choice | Notes |
|---|----------|-------------|-------|
| 1 | Data connection | A: WebSocket | 🏆 Matches recommendation |
| 2 | Display format | A: Table + sparklines | 🏆 Matches recommendation |
| 3 | Trading pairs | C: User watchlist | 🏆 Matches recommendation |
| 4 | State management | B: Zustand | 🏆 Matches recommendation |

Saved to: .planning/research/live-price-feed-context.md
Recorded: "Discussed live-price-feed — locked 4 decisions"

Confirm these are correct? Then I'll create the plan.
```

---

## Step 3: Plan

**You:**
```
/plan
```

**AI creates** `.planning/plans/001-live-price-feed.md`:

```markdown
## Plan: Live Price Feed

### Task 1: WebSocket Service + Zustand Store

<files>
- src/services/binance-ws.ts (CREATE)
- src/stores/price-store.ts (CREATE)
- src/types/trading.ts (CREATE)
</files>

<action>
Create a Binance WebSocket service that connects to the spot market stream.
Use Zustand for state (locked decision Q4=B).
DON'T use REST polling — we're using WebSocket (locked decision Q1=A).
DON'T hardcode trading pairs — make it configurable (locked decision Q3=C).
</action>

<verify>
Run: npx tsc --noEmit
Check: WebSocket connects and receives price updates in dev console
</verify>

<done>
- [ ] WebSocket service connects to Binance
- [ ] Zustand store holds prices keyed by symbol
- [ ] TypeScript types defined for Price, Ticker, WatchlistItem
</done>

### Task 2: Price Table UI with Sparklines

<files>
- src/components/PriceTable.tsx (CREATE)
- src/components/Sparkline.tsx (CREATE)
- src/components/WatchlistManager.tsx (CREATE)
- src/app/page.tsx (EDIT)
</files>

<action>
Build a table component that displays real-time prices from the Zustand store.
Use table format with sparklines (locked decision Q2=A).
Include a watchlist manager for adding/removing pairs.
</action>

<verify>
Run: npm run build
Visual: Table shows live-updating prices with sparkline charts
</verify>

<done>
- [ ] PriceTable renders all watchlist items
- [ ] Sparkline shows 1-minute candle history
- [ ] WatchlistManager lets user add/remove pairs
- [ ] Prices update in real-time without full table re-render
</done>
```

---

## Step 4: Execute

**You:**
```
/execute
```

**AI works through tasks:**

```
📋 Loading plan: .planning/plans/001-live-price-feed.md
📍 State: Phase 0, Plan 0, Task 0

--- Task 1: WebSocket Service + Zustand Store ---

Creating src/services/binance-ws.ts...
Creating src/stores/price-store.ts...
Creating src/types/trading.ts...

Running verification: npx tsc --noEmit ✅
Testing WebSocket connection... ✅ Receiving BTC/USDT prices

✅ Task 1 complete.
> Running: node planning-tools.cjs state advance-task
> Committing: git commit -m "feat(prices): add Binance WebSocket service and Zustand price store"

--- Task 2: Price Table UI with Sparklines ---

Creating src/components/PriceTable.tsx...
Creating src/components/Sparkline.tsx...
Creating src/components/WatchlistManager.tsx...
Editing src/app/page.tsx...

Running verification: npm run build ✅
Visual check: Table rendering with live data ✅

✅ Task 2 complete.
> Running: node planning-tools.cjs state advance-task
> Committing: git commit -m "feat(ui): add real-time price table with sparklines and watchlist"

📊 Plan complete. 2/2 tasks done.
```

---

## Step 5: Verify

**You:**
```
/verify
```

**AI validates:**

```
✅ All planned files exist (6/6)
✅ Build passes (npm run build)
✅ TypeScript clean (npx tsc --noEmit)
✅ WebSocket connects and receives data
✅ Table renders with live prices
✅ Sparklines animate correctly
✅ Watchlist add/remove works

Result: PASS — all verification checks passed.
No gaps detected.
```

---

## What the `.planning/` Directory Looks Like After

```
.planning/
├── MEMORY.md                     ← "This is a Next.js crypto dashboard..."
├── STATE.md                      ← "Phase 0, Plan 1, Task 2 (complete)"
├── config.json                   ← { mode: "interactive", depth: "standard" }
├── plans/
│   └── 001-live-price-feed.md    ← The plan we just executed
├── research/
│   └── live-price-feed-context.md ← Locked decisions (1A 2A 3C 4B)
├── decisions/
│   └── DECISIONS.md              ← "Chose WebSocket over REST polling..."
├── sessions/
│   └── 2026-02-18-session.md     ← What we did this session
└── handoffs/
    └── LATEST.md                 ← "Completed price feed. Next: portfolio view."
```

---

## Next Steps

This greenfield example showed the **happy path**. For more about:
- 🟡 Adding features to existing code → [Brownfield Walkthrough](examples-Getting-Started-Brownfield)
- ⚠️ What happens when things go wrong → deviation protocol in [/execute examples](examples-commands-execute)
- 💬 More about the MCQ format → [/discuss examples](examples-commands-discuss)
