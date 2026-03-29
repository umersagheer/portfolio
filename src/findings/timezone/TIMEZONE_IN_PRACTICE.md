# Timezones in Practice — Databases, ORMs, Frontend & Backend

**Last updated:** 2026-03-29 **Context:** Practical guide for a MERN stack
developer using Prisma, TypeORM, Drizzle, PostgreSQL, and JavaScript/TypeScript.

---

## Part 1: The User-Changed-Location Problem

This is a real scheduling concern: a user in New York schedules a reminder for 9
AM, then moves to London. What happens?

### The answer depends on: who owns the timezone — the event or the user?

#### Model A: Timezone lives on the event (Google Calendar style)

```
Event stored:
  wall_time: '09:00'
  timezone: 'America/New_York'    ← anchored to New York
```

- User flies to London. Event STILL fires at 9:00 AM New York time.
- In the London user's UI, they see: "9:00 AM EST (2:00 PM your time)"
- If the user wants it at 9 AM London time instead, they **edit** the event and
  change the timezone to `Europe/London`.

**When to use this:** Calendar apps, shared meetings, anything where the event
is tied to a place or a group of people in that place.

#### Model B: Timezone lives on the user profile (Simple reminder style)

```
Event stored:
  wall_time: '09:00'
  user_timezone: (pulled from user profile at fire time)

User profile:
  timezone: 'America/New_York'   ← user updates this when they move
```

- User moves to London, updates their profile timezone to `Europe/London`.
- Now the 9 AM reminder fires at 9:00 AM London time.
- Old events that already fired aren't affected (they're in the past — stored as
  UTC moments).

**When to use this:** Personal reminders, notification preferences, "wake me up
at 7 AM" type features.

#### Model C: Hybrid (Recommended for most apps)

- **One-time events:** Store timezone on the event (Model A). The user chose
  this time in this timezone — respect it.
- **Recurring personal events:** Pull timezone from the user profile (Model B).
  "Every day at 9 AM" should follow the user.
- **Shared events (meetings, standups):** Store timezone on the event (Model A).
  If the meeting is for the New York team, it stays in New York time.

### What about auto-detecting location changes?

You can detect the user's current timezone from the browser:

```javascript
const currentTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
// User was 'America/New_York', now returns 'Europe/London'
```

Options:

1. **Silently update** their profile timezone → risky, might surprise them
2. **Prompt them:** "It looks like you're in London now. Update your timezone?"
   → best UX
3. **Leave it** and let them update manually → simplest, safest

---

## Part 2: How Databases Handle Timestamps

### PostgreSQL (What You'll Use Most)

PostgreSQL has two timestamp types. This is the most important database concept
for timezones.

#### `timestamp without time zone` (aka `timestamp`)

```sql
CREATE TABLE logs (
  created_at TIMESTAMP  -- without time zone
);

INSERT INTO logs VALUES ('2026-03-29 14:30:00');
-- PostgreSQL stores: 2026-03-29 14:30:00
-- It has NO IDEA what timezone this is. It's just a number.
```

It's like writing "2:30 PM" on a sticky note. 2:30 PM **where**? Pakistan? New
York? London? PostgreSQL doesn't know and doesn't care.

**When it's fine:** When your entire system agrees on a convention (like "we
always store UTC") and you're disciplined about it. This is what your RFC POS
does.

**When it breaks:** When someone writes a raw query using `AT TIME ZONE` — it
behaves counterintuitively (you already learned this in TIMEZONE_AUDIT.md).

#### `timestamp with time zone` (aka `timestamptz`) — The Recommended One

```sql
CREATE TABLE logs (
  created_at TIMESTAMPTZ  -- with time zone
);

INSERT INTO logs VALUES ('2026-03-29 14:30:00+05');
-- PostgreSQL converts to UTC internally: 2026-03-29 09:30:00+00
-- When you SELECT, it returns it in your session's timezone
```

**Key behavior:** PostgreSQL does NOT store the offset `+05`. It converts
everything to UTC internally and stores that. The `+05` is only used during
INSERT to know what the input means. When you `SELECT`, PostgreSQL converts from
its stored UTC to whatever your `SET timezone` session setting is.

```sql
SET timezone = 'Asia/Karachi';
SELECT created_at FROM logs;
-- Shows: 2026-03-29 14:30:00+05

SET timezone = 'America/New_York';
SELECT created_at FROM logs;
-- Shows: 2026-03-29 05:30:00-04  (same moment, different clock reading)
```

**This is the industry standard.** PostgreSQL's own docs recommend `timestamptz`
for almost everything.

#### Quick comparison

| Feature                               | `timestamp`                                      | `timestamptz`                               |
| ------------------------------------- | ------------------------------------------------ | ------------------------------------------- |
| Stores timezone info?                 | No — bare number                                 | Yes — converts to UTC internally            |
| `AT TIME ZONE` behavior               | Counterintuitive (assumes input IS in that zone) | Intuitive (converts TO that zone)           |
| Safe for past events?                 | Yes, if you always use UTC convention            | Yes, natively                               |
| Safe for future scheduled wall times? | Yes — you WANT a bare number here                | No — it would convert your wall time to UTC |
| Recommended by PostgreSQL docs?       | For wall times only                              | For everything else                         |

#### The Surprising Twist for Scheduling

For **future scheduled wall times**, `timestamp WITHOUT time zone` is actually
correct:

```sql
-- User schedules a meeting at 9:00 AM New York time
INSERT INTO events (wall_time, timezone) VALUES
  ('2026-06-15 09:00:00', 'America/New_York');
-- We WANT the bare "09:00" stored, not converted to UTC
-- The timezone column tells us how to interpret it later
```

If you used `timestamptz` here, PostgreSQL would convert 9:00 AM EDT to 13:00
UTC — and now you've baked in the offset, which is the exact problem we
discussed in the DST guide.

```
Past events  → timestamptz (let Postgres handle UTC)
Future wall times → timestamp + separate timezone column
```

### MySQL

MySQL's `DATETIME` is like PostgreSQL's `timestamp without time zone` — no
timezone awareness. MySQL's `TIMESTAMP` auto-converts to UTC (like
`timestamptz`) but has a narrower range (up to year 2038 — the Y2K38 bug).

```sql
-- MySQL
DATETIME   → bare number, no conversion (like Postgres timestamp)
TIMESTAMP  → auto-converts to/from UTC (like Postgres timestamptz, but limited to 2038)
```

### SQL Server

SQL Server has three types:

```sql
DATETIME2         → bare number, no timezone (like Postgres timestamp)
DATETIMEOFFSET    → stores the value WITH an offset (like +05:00)
                    Unlike Postgres, it actually STORES the offset, not just UTC
```

The `DATETIMEOFFSET` differs from PostgreSQL's `timestamptz` — PostgreSQL
discards the offset and stores UTC, while SQL Server preserves the original
offset. This means SQL Server knows the input was "+05:00" but PostgreSQL only
knows the UTC equivalent.

### MongoDB

MongoDB stores dates as UTC milliseconds since epoch (like JavaScript's
`Date.getTime()`). There's no timezone type. It's always UTC.

```javascript
// MongoDB
{
  createdAt: ISODate('2026-03-29T09:30:00.000Z')
}
// The "Z" means UTC. Always UTC. No timezone column needed for past events.
```

For scheduling, you'd store wall time as a string and timezone as a separate
field — same pattern as PostgreSQL.

---

## Part 3: ORMs and Timezone Pitfalls

### Prisma (Your Primary ORM)

#### How Prisma maps DateTime

In your `schema.prisma`:

```prisma
model Order {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
}
```

By default, Prisma's `DateTime` maps to:

- **PostgreSQL:** `timestamp(3) without time zone` ← note: WITHOUT timezone!
- **MySQL:** `DATETIME(3)`
- **SQL Server:** `DATETIME2`

**This catches people off guard.** Prisma doesn't use `timestamptz` by default.
You have to opt in:

```prisma
model Order {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now()) @db.Timestamptz(3)  // ← explicit!
}
```

#### The Prisma-to-JavaScript round trip

```
Prisma writes a Date → sends ISO string to PostgreSQL → stored in DB
Prisma reads from DB → creates a JavaScript Date → always in UTC

JavaScript Date objects are ALWAYS UTC internally.
Prisma always sends/receives UTC.
```

This means the round trip is safe **as long as you don't mix raw SQL with Prisma
queries** — because raw SQL can interpret `timestamp without time zone`
differently.

#### Prisma's `@default(now())`

```prisma
createdAt DateTime @default(now())
```

This uses PostgreSQL's `NOW()` function, which returns the current time in the
**server's timezone setting**. If your PostgreSQL server is set to UTC (which it
should be), this gives you UTC. If someone set the server to `Asia/Karachi`,
`NOW()` returns PKT.

**Best practice:** Always ensure your PostgreSQL server timezone is UTC:

```sql
SHOW timezone;  -- Should return 'UTC'
-- If not:
ALTER SYSTEM SET timezone = 'UTC';
```

#### Prisma common pitfalls

```typescript
// ❌ PITFALL 1: Comparing dates without considering timezone
const orders = await prisma.order.findMany({
  where: {
    createdAt: {
      gte: new Date('2026-03-29') // This is midnight UTC, not midnight Pakistan!
    }
  }
})

// ✅ FIX: Be explicit about what "March 29" means
const startOfDayPKT = new Date('2026-03-28T19:00:00.000Z') // March 29 00:00 PKT
const orders = await prisma.order.findMany({
  where: {
    createdAt: { gte: startOfDayPKT }
  }
})

// ❌ PITFALL 2: Using $queryRaw with AT TIME ZONE
const result = await prisma.$queryRaw`
  SELECT * FROM "Order"
  WHERE "createdAt" AT TIME ZONE 'Asia/Karachi' > ${someDate}
`
// This is the single AT TIME ZONE trap from your audit!

// ✅ FIX: Double AT TIME ZONE
const result = await prisma.$queryRaw`
  SELECT * FROM "Order"
  WHERE ("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Karachi' > ${someDate}
`
```

### TypeORM

TypeORM is more explicit about timezone types.

```typescript
@Entity()
class Order {
  @CreateDateColumn({ type: 'timestamptz' }) // ← you choose the type
  createdAt: Date

  // For scheduled wall times:
  @Column({ type: 'timestamp' }) // deliberately WITHOUT timezone
  scheduledWallTime: Date

  @Column()
  timezone: string // 'America/New_York'
}
```

#### TypeORM pitfalls

```typescript
// ❌ PITFALL: TypeORM can strip timezone info when reading
// If your column is `timestamp without time zone`, TypeORM creates a
// JavaScript Date by parsing the bare string — and assumes it's LOCAL time
// on the machine running Node.js, NOT UTC.

// If your Node.js server is in Virginia (EST), TypeORM might interpret
// '2026-03-29 12:00:00' as 12:00 EST, not 12:00 UTC.

// ✅ FIX: Set the connection timezone
// In your TypeORM config:
{
  type: 'postgres',
  // ... other config
  extra: {
    // Force the PostgreSQL session to UTC
    options: '-c timezone=UTC'
  }
}
```

### Drizzle

Drizzle gives you the most control, since you define types explicitly:

```typescript
import { pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core'

// For past events — use timestamptz (called 'with timezone' in Drizzle)
const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
  //                                   ^^^^^^^^^^^^^^^^
  //                                   This maps to TIMESTAMPTZ
})

// For future scheduled events — use timestamp WITHOUT timezone
const events = pgTable('events', {
  id: serial('id').primaryKey(),
  wallTime: timestamp('wall_time', { withTimezone: false }),
  //                                 ^^^^^^^^^^^^^^^^^
  //                                 Bare timestamp — stores wall clock
  timezone: text('timezone').notNull() // 'America/New_York'
})
```

#### Drizzle mode option

Drizzle has a `mode` option that changes how timestamps are handled in
JavaScript:

```typescript
// mode: 'date' (default) — returns JavaScript Date objects
timestamp('created_at', { withTimezone: true, mode: 'date' })

// mode: 'string' — returns ISO strings (e.g., '2026-03-29T12:00:00.000Z')
timestamp('created_at', { withTimezone: true, mode: 'string' })
```

`mode: 'string'` can be useful when you want to avoid JavaScript Date's
automatic timezone conversion and handle the string yourself.

### ORM Summary

| ORM         | Default DateTime type   | How to get timestamptz    | Watch out for                                   |
| ----------- | ----------------------- | ------------------------- | ----------------------------------------------- |
| **Prisma**  | `timestamp(3)` (no tz)  | `@db.Timestamptz(3)`      | Raw SQL `AT TIME ZONE` trap                     |
| **TypeORM** | You choose in decorator | `{ type: 'timestamptz' }` | Assumes local time when reading bare timestamps |
| **Drizzle** | You choose explicitly   | `{ withTimezone: true }`  | Check `mode` option (date vs string)            |

---

## Part 4: Node.js Server — Timezone Behavior

### JavaScript Date is Always UTC Internally

This is worth repeating because it's the most important thing:

```javascript
const d = new Date()
// Internally: milliseconds since Jan 1, 1970 00:00:00 UTC
// There is no "timezone" stored in a Date object

d.toISOString() // '2026-03-29T09:30:00.000Z'  ← always UTC
d.toString() // 'Sun Mar 29 2026 14:30:00 GMT+0500 (PKT)' ← local
d.toLocaleString() // '3/29/2026, 2:30:00 PM' ← local
d.getHours() // 14  ← local hours (PKT)
d.getUTCHours() // 9   ← UTC hours
```

`getHours()` vs `getUTCHours()` — this is where bugs happen. `getHours()` uses
the **server's timezone**, which depends on where your server runs:

| Server location        | `getHours()` returns | `getUTCHours()` returns |
| ---------------------- | -------------------- | ----------------------- |
| Railway Virginia (EST) | 5 (4 in summer)      | 9                       |
| AWS Mumbai (IST)       | 15                   | 9                       |
| Local Mac (PKT)        | 14                   | 9                       |

The UTC value is always 9. The local value changes depending on where the code
runs. **Never use `getHours()`, `getDay()`, etc. on the server** unless you
intentionally want the server's local time (you almost never do).

### Force Node.js to Think in UTC

Set the `TZ` environment variable:

```bash
# In your .env or hosting platform
TZ=UTC

# Or in code (before any Date usage)
process.env.TZ = 'UTC'
```

Now `getHours()` and `getUTCHours()` return the same thing. `toString()` shows
UTC. This doesn't change how dates are stored — it changes how they're
**displayed and parsed** by Node.js.

**Railway, Vercel, AWS Lambda, and most cloud platforms default to UTC.** But
your local Mac doesn't. This is why code can work in production but show wrong
times locally.

### The `new Date('2026-03-29')` Trap

```javascript
// These two look the same but behave DIFFERENTLY:

new Date('2026-03-29')
// Parsed as: 2026-03-29T00:00:00.000Z  ← midnight UTC ✅

new Date('2026-03-29T00:00:00')
// Parsed as: 2026-03-29T00:00:00 LOCAL TIME  ← midnight in server timezone!
// On a PKT server: 2026-03-28T19:00:00.000Z  ← previous day in UTC!
```

**Why?** The ECMAScript spec says:

- Date-only strings (`YYYY-MM-DD`) are parsed as UTC
- Date-time strings without a `Z` or offset are parsed as **local time**

This is one of the most common timezone bugs in JavaScript. Always append `Z` or
an offset:

```javascript
// ✅ Safe — explicit UTC
new Date('2026-03-29T00:00:00.000Z')
new Date('2026-03-29T00:00:00+00:00')

// ✅ Safe — date-only (interpreted as UTC)
new Date('2026-03-29')

// ❌ Dangerous — interpreted as local time
new Date('2026-03-29T00:00:00')
new Date('2026-03-29 00:00:00')
```

---

## Part 5: Frontend — Libraries and Patterns

### When Do You Need a Timezone Library?

You **don't** need one if:

- You display dates in the user's browser timezone (Intl API handles this)
- You only format UTC dates for display

You **do** need one if:

- You need to display times in a **specific timezone** (not the user's)
- You convert between timezones
- You do date math that crosses DST boundaries (e.g., "add 1 day")
- You work with recurring events / scheduling

### The Native Intl API (No Library Needed)

The browser's built-in `Intl.DateTimeFormat` is surprisingly powerful:

```javascript
const date = new Date('2026-03-29T09:30:00.000Z') // UTC moment

// Display in user's local timezone (automatic)
date.toLocaleString('en-US')
// '3/29/2026, 2:30:00 PM' (if user is in PKT)

// Display in a specific timezone
date.toLocaleString('en-US', { timeZone: 'America/New_York' })
// '3/29/2026, 5:30:00 AM'

// Full control over formatting
new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
}).format(date)
// 'Sunday, March 29, 2026, 05:30 AM EDT'
```

**The Intl API is enough for 70% of timezone display needs.** It's built into
every browser and Node.js. No bundle size cost.

### Luxon — The Full-Featured Choice

**When to use:** When you need timezone math, not just formatting. Converting
between timezones, handling DST transitions, working with recurring events.

```javascript
import { DateTime } from 'luxon'

// Create a time in a specific timezone
const nyTime = DateTime.fromObject(
  { year: 2026, month: 3, day: 29, hour: 9, minute: 0 },
  { zone: 'America/New_York' }
)

console.log(nyTime.toISO())
// '2026-03-29T09:00:00.000-04:00' (EDT, UTC-4 in March)

// Convert to another timezone
const londonTime = nyTime.setZone('Europe/London')
console.log(londonTime.toFormat('HH:mm ZZZZ'))
// '13:00 GMT' (London is UTC+0 in March... wait, BST starts March 29!)
// Actually: '14:00 British Summer Time'

// Check if a time exists (DST gap detection)
const gapTime = DateTime.fromObject(
  { year: 2026, month: 3, day: 8, hour: 2, minute: 30 },
  { zone: 'America/New_York' }
)
// Luxon auto-adjusts to 3:30 AM EDT

// Date math that respects DST
const beforeDST = DateTime.fromObject(
  { year: 2026, month: 3, day: 7, hour: 12 },
  { zone: 'America/New_York' }
)
const nextDay = beforeDST.plus({ days: 1 })
console.log(nextDay.hour) // 12 — still noon! Luxon respects wall clock
// Even though only 23 hours passed (spring forward day), "plus 1 day" = same wall time

// Compare: adding 24 hours instead of 1 day
const plus24h = beforeDST.plus({ hours: 24 })
console.log(plus24h.hour) // 13 — 1 PM! Because 24 hours after noon, crossing
// spring forward, is 1 PM on the wall clock
```

**Key Luxon concept:** `.plus({ days: 1 })` and `.plus({ hours: 24 })` give
**different results** when crossing a DST boundary. Days are "calendar days"
(wall clock stays same). Hours are absolute duration.

**Bundle size:** ~20KB gzipped (Luxon uses the browser's Intl API internally, so
it doesn't ship its own timezone data).

### date-fns + date-fns-tz — The Lightweight Choice

**When to use:** When you already use date-fns for formatting/parsing and need
to add timezone support. Tree-shakeable — only import what you use.

```javascript
import { format } from 'date-fns'
import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz'

const utcDate = new Date('2026-03-29T09:30:00.000Z')

// Format a UTC date in a specific timezone
formatInTimeZone(utcDate, 'America/New_York', 'yyyy-MM-dd HH:mm:ss zzz')
// '2026-03-29 05:30:00 EDT'

formatInTimeZone(utcDate, 'Asia/Karachi', 'yyyy-MM-dd HH:mm:ss zzz')
// '2026-03-29 14:30:00 PKT'

// Convert UTC to a "zoned" Date (for display purposes)
const nyDate = toZonedTime(utcDate, 'America/New_York')
// This Date object's LOCAL getters now return New York values
// (it adjusts the internal UTC value so that getHours() etc. give NY time)

// Convert a wall clock time to UTC
const wallTime = new Date(2026, 5, 15, 9, 0) // June 15, 9:00 AM
const utcEquivalent = fromZonedTime(wallTime, 'America/New_York')
// fromZonedTime says: "9:00 AM is New York time, give me the UTC equivalent"
```

**Important caveat:** `toZonedTime` doesn't actually create a timezone-aware
Date. It **hacks** the UTC value so that JavaScript's local getters
(`.getHours()`, etc.) return the target timezone's values. It's a workaround
because JavaScript's Date can't represent non-local, non-UTC times.

**Bundle size:** ~3KB gzipped for `date-fns-tz` (plus whatever date-fns
functions you import).

### Day.js + timezone plugin

```javascript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs('2026-03-29T09:30:00.000Z').tz('America/New_York').format('HH:mm z')
// '05:30 EDT'
```

**Bundle size:** ~2KB core + ~1KB per plugin. Smallest option, but timezone
support feels bolted-on rather than native.

### Library Comparison

| Feature                       | Intl API     | Luxon              | date-fns-tz   | Day.js + tz  |
| ----------------------------- | ------------ | ------------------ | ------------- | ------------ |
| **Bundle size**               | 0 (built-in) | ~20KB              | ~3KB          | ~3KB         |
| **Format dates**              | ✅           | ✅                 | ✅            | ✅           |
| **Convert timezones**         | Display only | ✅ Full            | ✅            | ✅           |
| **DST gap/overlap detection** | ❌           | ✅                 | ❌            | ❌           |
| **Date math across DST**      | ❌           | ✅ (days vs hours) | Partial       | Partial      |
| **Recurring events**          | ❌           | ❌ (use rrule.js)  | ❌            | ❌           |
| **Immutable API**             | N/A          | ✅                 | ✅ (date-fns) | ✅           |
| **Tree-shakeable**            | N/A          | ❌ (class-based)   | ✅            | Plugin-based |

### Recommendation for Your Stack

```
Display only (formatting UTC for the user)     → Intl API (free, built-in)
Need timezone conversions (simple)              → date-fns-tz (lightweight)
Need timezone math, DST detection, scheduling   → Luxon (comprehensive)
Recurring events                                → rrule.js + Luxon
```

---

## Part 6: The Frontend ↔ Backend Contract

This is where most timezone bugs actually happen — in the communication between
frontend and backend.

### Rule 1: Always Send UTC or Date Strings Over the Wire

```typescript
// ❌ BAD: Sending a timezone-aware string that the backend might misparse
fetch('/api/orders', {
  body: JSON.stringify({
    createdAfter: '2026-03-29T14:30:00+05:00' // Ambiguous if backend strips offset
  })
})

// ✅ GOOD: Send UTC
fetch('/api/orders', {
  body: JSON.stringify({
    createdAfter: '2026-03-29T09:30:00.000Z' // Clear, unambiguous
  })
})

// ✅ ALSO GOOD: Send a date string + let backend handle timezone
fetch('/api/orders', {
  body: JSON.stringify({
    businessDate: '2026-03-29', // "Give me March 29 orders"
    timezone: 'Asia/Karachi' // Backend converts to UTC range
  })
})
```

### Rule 2: Frontend Formats, Backend Computes

```
Backend's job:
  - Store timestamps in UTC
  - Convert date strings to UTC ranges using the user's timezone
  - Return UTC timestamps in API responses

Frontend's job:
  - Detect the user's timezone (Intl API)
  - Format UTC timestamps for display in local time
  - Send UTC or date strings (not local time) to the backend
```

### Rule 3: JSON.stringify Sends UTC Automatically

```javascript
const date = new Date() // some local time

JSON.stringify({ date })
// '{"date":"2026-03-29T09:30:00.000Z"}'  ← always ISO 8601 UTC

// This is because Date.prototype.toJSON() calls toISOString()
// which always returns UTC. You don't need to convert manually.
```

This means when you send a Date through an API response or request body, it's
automatically UTC. The frontend receives it, creates a `new Date()`, and
displays it in local time. The round trip works.

---

## Part 7: Common Timezone Bugs (The Hall of Shame)

### Bug 1: "Yesterday's order shows up in today's report"

**Cause:** Filtering by date without timezone conversion.

```javascript
// An order placed at 11 PM PKT (March 28) = 6 PM UTC (March 28)
// When you filter: WHERE created_at >= '2026-03-28' AND created_at < '2026-03-29'
// This filters by UTC dates, and the order falls on March 28 UTC — correct in UTC,
// but the user placed it on March 28 PKT — also correct!

// But what about an order at 1 AM PKT (March 29) = 8 PM UTC (March 28)?
// UTC date: March 28. PKT date: March 29.
// If you filter by UTC date, this order shows up in March 28's report.
// The user who placed it at 1 AM on March 29 sees it in yesterday's report. Bug!
```

**Fix:** Convert the business date to UTC range before filtering (your
`getBusinessDayRange()` pattern).

### Bug 2: "The app works fine until deployment"

**Cause:** Development machine and server have different timezones.

```javascript
// Local Mac (PKT): new Date().getHours() → 14
// Railway (UTC):   new Date().getHours() → 9
// Any code using getHours() for business logic breaks when deployed
```

**Fix:** Never use `getHours()` / `getDay()` / `getMonth()` on the server. Use
`getUTCHours()` or a library.

### Bug 3: "The date picker is off by one day"

**Cause:** Date picker returns a date string, frontend converts it to Date,
timezone shift pushes it to previous day.

```javascript
// User picks "March 29" on a date picker
// Date picker gives you: '2026-03-29'

// You do:
const date = new Date('2026-03-29T00:00:00') // ← parsed as LOCAL time!
// On a PKT machine: this becomes 2026-03-28T19:00:00Z
// You send this to the backend. Backend sees March 28 UTC. Off by one day!

// Fix:
const date = new Date('2026-03-29T00:00:00Z') // ← explicit UTC
// OR just send the string '2026-03-29' to the backend and let it handle timezone
```

### Bug 4: "Cron job runs twice on one day, skips another"

**Cause:** Cron running in local timezone during DST transition (covered in DST
guide).

**Fix:** Run cron in UTC or use timezone-aware scheduler.

### Bug 5: "User sees the wrong time after traveling"

**Cause:** Timezone hardcoded in the app instead of using the event's timezone.

```javascript
// ❌ Always showing times in the stored timezone
format(event.time, 'HH:mm', { timeZone: event.timezone })
// If user moved to London, they see New York times without context

// ✅ Show both the event time and the user's local equivalent
const eventTime = formatInTimeZone(event.utcTime, event.timezone, 'HH:mm zzz')
const localTime = formatInTimeZone(event.utcTime, userTimezone, 'HH:mm zzz')
// "09:00 AM EDT (2:00 PM BST)"
```

---

## Part 8: Testing Timezone Code

### The Problem

Your tests pass on your machine (PKT) but fail in CI (UTC). Or vice versa.

### Strategy 1: Force TZ in Tests

```json
// package.json
{
  "scripts": {
    "test": "TZ=UTC jest"
  }
}
```

But this only tests one timezone. Better to test multiple:

```javascript
// test.ts
describe('getBusinessDayRange', () => {
  it('handles PKT correctly', () => {
    const range = getBusinessDayRange('2026-03-29', 'Asia/Karachi')
    expect(range.start.toISOString()).toBe('2026-03-28T19:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-03-29T18:59:59.999Z')
  })

  it('handles EDT correctly (DST active)', () => {
    const range = getBusinessDayRange('2026-03-29', 'America/New_York')
    // March 29 is after spring forward, so offset is -4 (EDT)
    expect(range.start.toISOString()).toBe('2026-03-29T04:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-03-30T03:59:59.999Z')
  })

  it('handles EST correctly (DST inactive)', () => {
    const range = getBusinessDayRange('2026-01-15', 'America/New_York')
    // January is EST, offset is -5
    expect(range.start.toISOString()).toBe('2026-01-15T05:00:00.000Z')
    expect(range.end.toISOString()).toBe('2026-01-16T04:59:59.999Z')
  })
})
```

### Strategy 2: Always Assert in UTC

```javascript
// ❌ Fragile — depends on server timezone
expect(date.getHours()).toBe(9)

// ✅ Stable — UTC is the same everywhere
expect(date.toISOString()).toBe('2026-03-29T09:30:00.000Z')
expect(date.getUTCHours()).toBe(9)
```

### Strategy 3: Test DST Boundaries Explicitly

If your code does any date math, add tests for DST transition days:

```javascript
it('handles spring forward day correctly', () => {
  // March 8, 2026 — spring forward in US
  const result = getBusinessDayRange('2026-03-08', 'America/New_York')
  // This day is only 23 hours long in New York
  const durationMs = result.end.getTime() - result.start.getTime()
  const durationHours = durationMs / (1000 * 60 * 60)
  expect(durationHours).toBeCloseTo(23, 0) // 23 hours, not 24!
})
```

---

## Part 9: Checklist — Senior Engineer Timezone Habits

### Before Writing Code

- [ ] Do I know if this is a past event (UTC) or future event (wall time + tz)?
- [ ] What timezone is the server running in?
- [ ] Does the PostgreSQL server timezone match (should be UTC)?
- [ ] Am I using `timestamptz` or `timestamp`? Which is correct for this case?

### In The Database Layer

- [ ] Prisma: Did I add `@db.Timestamptz` for past events? (or am I aware it
      defaults to `timestamp` without tz?)
- [ ] Raw SQL: Am I using double `AT TIME ZONE` for
      `timestamp without time zone` columns?
- [ ] Date range queries: Am I converting business dates to UTC ranges?
- [ ] Am I storing IANA timezone names (not offsets) in any `timezone` columns?

### In The API Layer

- [ ] Am I sending/receiving UTC timestamps (ISO 8601 with Z) over the wire?
- [ ] Am I sending date strings + timezone instead of pre-converted timestamps
      for date filters?
- [ ] Frontend formatting: Am I using Intl API or a library, not manual offset
      math?

### In Tests

- [ ] Do tests pass regardless of the developer's local timezone?
- [ ] Do I have tests for DST transition days?
- [ ] Am I asserting with UTC values (`.toISOString()`, `.getUTCHours()`)?

### When Debugging

- [ ] Run `date` in the server terminal — what timezone is it?
- [ ] Run `SHOW timezone;` in PostgreSQL — is it UTC?
- [ ] Check `process.env.TZ` — is it set?
- [ ] Is the bug only happening for users in DST-observing timezones?
- [ ] Is the bug only happening near midnight (date boundary issue)?
