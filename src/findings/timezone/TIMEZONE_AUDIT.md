# Timezone Guide & Audit — RFC POS

**Last updated:** 2026-03-21
**Context:** Next.js server on Railway (Virginia, US East), PostgreSQL on Railway, operations in Pakistan (UTC+5)

---

## Part 1: Timezone Fundamentals for Developers

### What is UTC?

UTC (Coordinated Universal Time) is the universal reference point for time. Every timezone is expressed as an offset from UTC:

- **Pakistan (PKT):** UTC + 5 hours
- **New York (EST/EDT):** UTC - 5 / UTC - 4 hours
- **London (GMT/BST):** UTC + 0 / UTC + 1 hour

When it's **12:00 PM UTC**, it's simultaneously **5:00 PM** in Pakistan. Same moment, different clock reading.

### How JavaScript Handles Time

`new Date()` always captures the current moment as a **UTC value internally**, regardless of where the server runs (Virginia, London, Pakistan — doesn't matter).

```javascript
const now = new Date()

// Internally: milliseconds since Jan 1, 1970 UTC
// When converted to ISO string:
now.toISOString()  // "2026-03-21T12:00:00.000Z"
//                                           ↑
//                               "Z" = Zulu = UTC
```

**Key insight:** If a customer in Pakistan places an order at **5:00 PM PKT**:

- JavaScript stores: `2026-03-21T12:00:00.000Z` (12:00 UTC)
- It subtracts 5 hours because Pakistan is UTC **+5** (ahead of UTC)
- UTC is always "behind" Pakistan time

### PostgreSQL: Two Timestamp Types

This is where most timezone bugs originate.

#### `timestamp without time zone` (what RFC POS uses)

```sql
-- Stored: 2026-03-21 12:00:00
-- No timezone label. Just a bare number.
-- PostgreSQL has NO IDEA if this is noon UTC, noon Pakistan, or noon anywhere else.
```

It's like writing "5:00" on a sticky note without saying AM/PM or which city. Ambiguous.

#### `timestamp with time zone` (timestamptz) — the industry standard

```sql
-- Stored: 2026-03-21 12:00:00+00
-- PostgreSQL KNOWS this is UTC.
-- Can intelligently convert to any timezone.
```

PostgreSQL's own documentation recommends `timestamptz` for most applications.

#### Why `timestamp without time zone` still works for us

Our system is consistent: JavaScript always sends UTC → PostgreSQL stores the literal UTC value → Prisma reads it back assuming UTC. The round-trip is correct. **The danger is only when you use `AT TIME ZONE` in SQL queries** (explained below).

### The Golden Rule

```
STORE in UTC  →  FILTER using UTC ranges  →  DISPLAY in user's timezone
```

1. **Store UTC** — `new Date()` does this automatically
2. **Filter with UTC ranges** — "March 18 in Pakistan" = "March 17 19:00 UTC to March 18 18:59 UTC"
3. **Display in local time** — convert to user's timezone only at the last step (UI or SQL grouping)

---

## Part 2: The `AT TIME ZONE` Trap in PostgreSQL

This is the most common timezone bug in PostgreSQL applications.

### The operator behaves DIFFERENTLY based on input type

#### On `timestamptz` — converts TO the target timezone (what you'd expect):

```sql
SELECT timestamptz '2026-03-21 12:00:00+00' AT TIME ZONE 'Asia/Karachi';
-- Result: 2026-03-21 17:00:00 (5 PM — correct!)
-- "I have a UTC moment. What does the clock read in Pakistan?" → 5 PM
```

#### On `timestamp without time zone` — assumes the value IS IN the target timezone (opposite!):

```sql
SELECT timestamp '2026-03-21 12:00:00' AT TIME ZONE 'Asia/Karachi';
-- Result: 2026-03-21 07:00:00+00 (7 AM UTC — WRONG direction!)
-- "You're telling me 12:00 is Pakistan time? Let me convert to UTC." → 12 - 5 = 7 AM
```

### Why this is confusing

The same SQL keyword does **opposite things** depending on the input type. With `timestamp without time zone`, `AT TIME ZONE 'Asia/Karachi'` doesn't convert TO Pakistan time — it converts FROM Pakistan time (to UTC).

### The fix: Double `AT TIME ZONE`

```sql
-- Step 1: Label the bare timestamp as UTC (produces timestamptz)
"createdAt" AT TIME ZONE 'UTC'
-- Result: 2026-03-21 12:00:00+00 (now PostgreSQL knows it's UTC)

-- Step 2: Convert the labeled timestamp to Pakistan time
("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Karachi'
-- Result: 2026-03-21 17:00:00 (5 PM — correct!)
```

The first `AT TIME ZONE 'UTC'` says: "this bare value is in UTC" (returns `timestamptz`).
The second `AT TIME ZONE 'Asia/Karachi'` says: "convert that to Pakistan time" (returns `timestamp`).

---

## Part 3: How RFC POS Handles Timezones

### Architecture

```
TenantSettings.timezone (DB)
        ↓
  JWT Token (embedded in token payload)
        ↓
  AuthContext (available in every request)
        ↓
  Controllers → Services (passed as parameter)
        ↓
  timezone.ts utilities (convert dates using tenant timezone)
```

**Source of truth:** `TenantSettings.timezone` (default: `'Asia/Karachi'`)

### What we do correctly

#### 1. Date range filtering — `getBusinessDayRange()`

When the client says "show me March 18 data", the server converts to UTC boundaries:

```typescript
getBusinessDayRange("2026-03-18", "Asia/Karachi")
// Returns:
// start: 2026-03-17T19:00:00.000Z  (March 18 00:00 PKT in UTC)
// end:   2026-03-18T18:59:59.999Z  (March 18 23:59 PKT in UTC)
```

All services use this for filtering: orders, sessions, expenses, inventory, analytics.

#### 2. Order number generation — `formatOrderNumber()`

Uses `getDateStrInTimezone()` to get the correct business date in tenant timezone before generating the order number.

#### 3. Business date calculation

When closing a session, `getDateStrInTimezone(session.openedAt, timezone)` correctly determines which business day the session belongs to.

#### 4. Client sends date strings, not timestamps

Date pickers send `"2026-03-18"` (YYYY-MM-DD strings), not UTC timestamps. The server handles timezone conversion. This avoids client-side timezone confusion.

### The timezone utility — `lib/server/utils/timezone.ts`

| Function | Purpose |
|----------|---------|
| `getBusinessDateStr(timezone)` | Get today's business date as YYYY-MM-DD in tenant timezone |
| `getDateStrInTimezone(date, timezone)` | Convert any UTC Date to YYYY-MM-DD in given timezone |
| `getStartOfBusinessDay(timezone)` | Get start of today's business day as UTC Date |
| `getBusinessDayRange(dateStr, timezone)` | Convert YYYY-MM-DD to UTC start/end Date objects |
| `formatOrderNumber(count, timezone)` | Generate order number with timezone-correct date |

---

## Part 4: Bug Found & Fixed (March 2026)

### The bug

Two raw SQL queries used single `AT TIME ZONE` on `timestamp without time zone` columns, causing hours/dates to shift in the **wrong direction**.

### Affected features

1. **Peak Hours chart** — `EXTRACT(HOUR FROM "createdAt" AT TIME ZONE $4)` in `sales.analytics.service.ts`
2. **Revenue Trend grouping** — `("createdAt" AT TIME ZONE '${timezone}')` in `analytics.utils.ts`

### How it manifested

Orders placed at **5 PM PKT** showed up in the **7 AM** bucket in the Peak Hours chart. The 10-hour shift (not 5) happened because:

1. `createdAt` stored: `12:00 UTC` (which is 5 PM PKT)
2. `AT TIME ZONE 'Asia/Karachi'` on bare timestamp: PostgreSQL assumes `12:00` IS Pakistan time, converts to UTC → `07:00`
3. `EXTRACT(HOUR)` returns `7` instead of `17`

### The fix

```sql
-- Before (wrong — single AT TIME ZONE on timestamp without time zone):
EXTRACT(HOUR FROM "createdAt" AT TIME ZONE 'Asia/Karachi')

-- After (correct — double AT TIME ZONE):
EXTRACT(HOUR FROM ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Karachi')
```

Same fix applied to `getDateTruncSql()` for revenue trend grouping.

### Files changed

| File | Line | Change |
|------|------|--------|
| `lib/server/services/analytics/sales.analytics.service.ts` | 218 | Peak hours: added `AT TIME ZONE 'UTC'` before `AT TIME ZONE $4` |
| `lib/server/services/analytics/analytics.utils.ts` | 106 | Date truncation: added `AT TIME ZONE 'UTC'` before `AT TIME ZONE '${timezone}'` |

---

## Part 5: Checklist for Future Development

### When writing raw SQL with timestamps

- **Never** use single `AT TIME ZONE` on `timestamp without time zone` columns
- **Always** use the double pattern: `("col" AT TIME ZONE 'UTC') AT TIME ZONE '${tz}'`
- Or use `getDateTruncSql()` from `analytics.utils.ts` which handles this correctly

### When filtering by date range

- **Always** use `getBusinessDayRange(dateStr, timezone)` from `timezone.ts`
- **Never** construct UTC boundaries manually (e.g., `new Date('2026-03-18T00:00:00Z')`)

### When displaying dates on the frontend

- **Prefer** specifying `timeZone` in `Intl.DateTimeFormat` options using the tenant timezone
- **Currently** the app relies on the browser's local timezone (works because users are in Pakistan, but fragile)

### When adding new DateTime fields to Prisma schema

- Prisma's default `DateTime` maps to `timestamp without time zone` in PostgreSQL
- This is fine as long as you follow the patterns above
- For date-only fields (business dates), use `@db.Date`

### If migrating to `timestamptz` in the future

- Add `@db.Timestamptz` annotation to DateTime fields in Prisma schema
- Single `AT TIME ZONE` would then work correctly (no double pattern needed)
- All `getBusinessDayRange()` usage would remain correct (no changes needed)
- This is the ideal long-term approach but requires a migration

---

## Quick Reference

| Scenario | What to use |
|----------|-------------|
| "What business date is it now?" | `getBusinessDateStr(timezone)` |
| "Give me orders from March 18" | `getBusinessDayRange("2026-03-18", timezone)` → use `start`/`end` in WHERE |
| "Group orders by hour in local time" (raw SQL) | `("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE '${tz}'` |
| "Group orders by day in local time" (raw SQL) | `getDateTruncSql(granularity, timezone)` |
| "Generate order number with correct date" | `formatOrderNumber(count, timezone)` |
| "Display timestamp to user" | `Intl.DateTimeFormat('en-US', { timeZone: tz }).format(date)` |
