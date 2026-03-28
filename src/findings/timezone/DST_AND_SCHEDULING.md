# DST & Future Scheduling — The Complete Guide

**Last updated:** 2026-03-29 **Context:** Learning notes for understanding
Daylight Saving Time and how it affects scheduling in software systems.

---

## Part 1: What is Daylight Saving Time (DST)?

### The Basic Idea

Daylight Saving Time is a practice where clocks are adjusted forward by 1 hour
in spring and back by 1 hour in autumn. The goal (historically) was to make
better use of daylight during evening hours.

- **Spring Forward:** Clocks move ahead. You lose an hour. The day has **23
  hours**.
- **Fall Back:** Clocks move back. You gain an hour. The day has **25 hours**.

### When Does It Happen? (US Example — New York)

| Transition     | When                            | What happens                       | Day length |
| -------------- | ------------------------------- | ---------------------------------- | ---------- |
| Spring Forward | 2nd Sunday of March, 2:00 AM    | Clock jumps from 1:59 AM → 3:00 AM | 23 hours   |
| Fall Back      | 1st Sunday of November, 2:00 AM | Clock jumps from 1:59 AM → 1:00 AM | 25 hours   |

### The Two Timezone Labels for New York

| Season             | Abbreviation | Full Name             | UTC Offset |
| ------------------ | ------------ | --------------------- | ---------- |
| Winter (Nov → Mar) | **EST**      | Eastern Standard Time | UTC − 5    |
| Summer (Mar → Nov) | **EDT**      | Eastern Daylight Time | UTC − 4    |

**Key insight:** New York doesn't have one fixed offset. It alternates between
UTC-5 and UTC-4 depending on the time of year. This is why you should never
store an offset — it changes.

### Who Observes DST?

Not everyone. This is important to know:

| Region                      | Observes DST?                |
| --------------------------- | ---------------------------- |
| United States (most states) | Yes                          |
| Canada (most provinces)     | Yes                          |
| European Union              | Yes (but may abolish soon)   |
| United Kingdom              | Yes                          |
| **Pakistan**                | **No** — PKT is always UTC+5 |
| **Japan**                   | **No**                       |
| **China**                   | **No**                       |
| **India**                   | **No**                       |
| Most of Africa              | No                           |
| Arizona (US state)          | No (except Navajo Nation)    |

Even within a single country, different regions can have different DST rules.
Arizona doesn't observe DST but the Navajo Nation within Arizona does.

### Why Does DST Exist?

- Originally proposed by Benjamin Franklin (1784, half-jokingly)
- First implemented during **World War I** (1916) by Germany to save fuel
- Adopted widely during **World War II** for the same reason
- Made permanent in the US by the Uniform Time Act of 1966
- The actual energy savings are debated — some studies show minimal or zero
  benefit
- There are ongoing movements to abolish DST in both the US and EU

---

## Part 2: The Two Dangerous Transitions

### Transition 1: Spring Forward (The "Gap")

On March 8, 2026 in New York, at 2:00 AM:

```
Wall clock sequence:
  1:00 AM  ← exists
  1:30 AM  ← exists
  1:59 AM  ← exists
  2:00 AM  ← DOES NOT EXIST (clock jumps to 3:00 AM)
  2:15 AM  ← DOES NOT EXIST
  2:30 AM  ← DOES NOT EXIST
  2:59 AM  ← DOES NOT EXIST
  3:00 AM  ← exists (this is where the clock lands)
```

The entire hour from 2:00 AM to 2:59 AM is a **gap** — it never happens.

**In UTC terms:**

```
1:59 AM EST = 06:59 UTC  (offset is -5)
3:00 AM EDT = 07:00 UTC  (offset changes to -4)
```

Notice: 06:59 UTC → 07:00 UTC is just one minute passing. Time doesn't actually
skip — only the **wall clock** skips. UTC marches on steadily.

**The scheduling problem:** If a user schedules a task for "2:30 AM on March 8
in New York", you have an **impossible time**. It doesn't exist. What do you do?

Common strategies:

1. **Shift forward** — treat it as 3:30 AM EDT (most common, what most cron
   systems do)
2. **Shift to the boundary** — treat it as 3:00 AM EDT
3. **Reject it** — tell the user this time doesn't exist and ask them to pick
   another
4. **Store the intent** — "30 minutes after 2 AM" → which becomes 30 minutes
   after the gap → 3:30 AM

### Transition 2: Fall Back (The "Overlap")

On November 1, 2026 in New York, at 2:00 AM:

```
Wall clock sequence:
  1:00 AM EDT  ← exists (first time)
  1:30 AM EDT  ← exists (first time)
  1:59 AM EDT  ← exists (first time)
  2:00 AM EDT  ← would be here, but clock rewinds...
  1:00 AM EST  ← exists AGAIN (second time!)
  1:30 AM EST  ← exists AGAIN (second time!)
  1:59 AM EST  ← exists AGAIN (second time!)
  2:00 AM EST  ← exists (now continues normally)
```

The hour from 1:00 AM to 1:59 AM happens **twice** — once in EDT (UTC-4), then
again in EST (UTC-5).

**In UTC terms:**

```
First  1:30 AM EDT = 05:30 UTC  (offset -4)
Second 1:30 AM EST = 06:30 UTC  (offset -5)
```

These are two different moments in time, one hour apart, but they have the same
wall clock reading.

**The scheduling problem:** If a user schedules a task for "1:30 AM on November
1 in New York", **which 1:30 AM do they mean?** The first one (EDT) or the
second one (EST)?

Common strategies:

1. **Pick the first occurrence** (before the transition) — most common default
2. **Pick the second occurrence** (after the transition) — safer for "end of
   day" operations
3. **Ask the user** — show both options with their UTC equivalents
4. **Run it both times** — for idempotent operations, this might be acceptable

---

## Part 3: Why UTC Alone Fails for Future Events

### The Core Problem

For **past events** (logs, orders, errors): Store UTC. Done. The moment already
happened. UTC perfectly captures it.

For **future events** (scheduled meetings, reminders, recurring tasks): UTC
alone is **not enough**.

### Example: The Daily Standup Bug

A team in New York sets a daily standup at **9:00 AM local time**.

**If you store this as UTC:**

```
Winter: 9:00 AM EST = 14:00 UTC  ✅ You store 14:00 UTC
Spring forward happens (March 8)...
Summer: 14:00 UTC = 10:00 AM EDT  ❌ Meeting fires at 10 AM, not 9 AM!
```

The user's intent was "9:00 AM every day in New York", not "14:00 UTC every
day". By converting to UTC at scheduling time, you **baked in** the winter
offset and broke the summer schedule.

### What You Should Store Instead

For future/recurring events, store the **user's intent**:

```json
{
  "what": "Daily standup",
  "wall_time": "09:00",
  "timezone": "America/New_York",
  "recurrence": "daily"
}
```

Then, when it's time to fire the event, **compute the UTC equivalent on the
fly**:

```javascript
// Don't do this at scheduling time:
const utc = convertToUTC('09:00', 'America/New_York') // ❌ Bakes in current offset

// Do this at execution time (or close to it):
function getNextFireTime(wallTime, timezone) {
  // Use a library that understands DST rules
  // It will compute the correct UTC for the CURRENT offset
  const nextFire = DateTime.fromObject(
    { hour: 9, minute: 0 },
    { zone: 'America/New_York' }
  )
  return nextFire.toUTC()
}
```

### The Decision Framework

| Type of event                      | What to store                                    | Why                                              |
| ---------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **Past event** (log, order, error) | UTC timestamp                                    | The moment already happened. UTC is unambiguous. |
| **One-time future event**          | Wall time + IANA timezone name                   | DST rules might change before the event fires.   |
| **Recurring event**                | Wall time + IANA timezone name + recurrence rule | Each occurrence needs its own UTC calculation.   |
| **Countdown/duration**             | UTC timestamp or duration in seconds             | "In 30 minutes" doesn't depend on wall clock.    |

---

## Part 4: Timezone Names vs. Offsets — Why It Matters

### IANA Timezone Names

The **IANA Time Zone Database** (also called "tz database" or "Olson database")
lists timezone identifiers like:

```
America/New_York
Asia/Karachi
Europe/London
America/Chicago
Pacific/Auckland
```

These names encode the **full history and future rules** of a timezone,
including:

- When DST starts and ends
- What the offsets are
- Historical changes (e.g., when a country adopted or abolished DST)

### Why Offsets Are Dangerous

```
UTC-5  ←  This tells you NOTHING about DST rules
EST    ←  This is ambiguous (multiple regions use "EST")
```

If you store `UTC-5` for a New York user, you've lost the information that
they'll switch to `UTC-4` in summer.

If you store `EST`, you've stored an abbreviation that:

- Is ambiguous (Australia also has an "EST" — Eastern Standard Time, UTC+10)
- Doesn't encode DST transition rules
- Only represents the winter offset

### Always Use IANA Names

```javascript
// ❌ Bad — offset will change
{
  timezone: 'UTC-5'
}
{
  timezone: 'EST'
}

// ✅ Good — encodes all DST rules
{
  timezone: 'America/New_York'
}
```

JavaScript's `Intl` API and modern libraries all work with IANA timezone names:

```javascript
// Get the user's IANA timezone
const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone
// Returns: "America/New_York", "Asia/Karachi", etc.
```

---

## Part 5: Practical Patterns for Handling DST in Code

### Pattern 1: One-Time Future Event (e.g., Doctor Appointment)

User says: "Schedule my appointment for March 8, 2026 at 2:30 PM in New York."

```javascript
// Store this:
{
  scheduledWallTime: '2026-03-08T14:30:00',  // 2:30 PM (no Z, no offset!)
  timezone: 'America/New_York'
}

// When you need to send a notification or check if it's time:
import { DateTime } from 'luxon'

const event = DateTime.fromISO('2026-03-08T14:30:00', {
  zone: 'America/New_York'
})
const utcTime = event.toUTC()
// Luxon knows March 8 is in EDT (UTC-4), so:
// 14:30 EDT = 18:30 UTC ✅
```

### Pattern 2: Recurring Event (e.g., Daily Standup)

```javascript
// Store this:
{
  name: 'Daily Standup',
  wallTime: '09:00',
  timezone: 'America/New_York',
  recurrence: 'RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR'
}

// Compute next fire time dynamically:
function getNextOccurrence(wallTime, timezone) {
  const [hour, minute] = wallTime.split(':').map(Number)
  const now = DateTime.now().setZone(timezone)

  let next = now.set({ hour, minute, second: 0, millisecond: 0 })
  if (next <= now) {
    next = next.plus({ days: 1 })
  }

  // Skip weekends for this example
  while (next.weekday > 5) {
    next = next.plus({ days: 1 })
  }

  return next.toUTC() // Convert to UTC only at computation time
}
```

### Pattern 3: Handling the Spring Forward Gap

What if the user's scheduled time falls in the gap?

```javascript
import { DateTime } from 'luxon'

// March 8, 2026, 2:30 AM in New York — THIS TIME DOESN'T EXIST
const event = DateTime.fromObject(
  { year: 2026, month: 3, day: 8, hour: 2, minute: 30 },
  { zone: 'America/New_York' }
)

console.log(event.isValid) // true — Luxon auto-adjusts
console.log(event.toISO()) // 2026-03-08T03:30:00.000-04:00
// Luxon shifted it forward to 3:30 AM EDT ← common library behavior
```

Most libraries handle this by shifting forward. But you should **detect** and
**inform** the user:

```javascript
function validateScheduledTime(wallTime, timezone) {
  const dt = DateTime.fromISO(wallTime, { zone: timezone })

  // Check if the time was adjusted (means it fell in a gap)
  const roundTrip = dt.toISO()
  const reparsed = DateTime.fromISO(roundTrip, { zone: timezone })

  if (dt.hour !== parseInt(wallTime.split('T')[1].split(':')[0])) {
    return {
      valid: false,
      reason: 'DST_GAP',
      message:
        `${wallTime} doesn't exist in ${timezone} due to DST. ` +
        `The clock jumps forward. Adjusted to ${dt.toFormat('HH:mm')}.`,
      adjustedTime: dt
    }
  }

  return { valid: true, time: dt }
}
```

### Pattern 4: Handling the Fall Back Overlap

What if the user's scheduled time falls in the overlap?

```javascript
// November 1, 2026, 1:30 AM in New York — THIS TIME HAPPENS TWICE

// Luxon lets you specify which offset you want:
const firstOccurrence = DateTime.fromObject(
  { year: 2026, month: 11, day: 1, hour: 1, minute: 30 },
  { zone: 'America/New_York' }
)
// By default, Luxon picks the first occurrence (EDT, offset -4)

console.log(firstOccurrence.offset) // -240 (minutes) = UTC-4 (EDT)
console.log(firstOccurrence.toUTC().toISO()) // 2026-11-01T05:30:00.000Z

// To get the second occurrence (EST, offset -5):
// You'd need to explicitly set the offset or add time
```

---

## Part 6: Database Strategies for Scheduled Events

### Strategy 1: Wall Time + Timezone (Recommended for most apps)

```sql
CREATE TABLE scheduled_events (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  wall_time   TIMESTAMP WITHOUT TIME ZONE,  -- intentionally without tz!
  timezone    TEXT NOT NULL,                 -- IANA name: 'America/New_York'
  recurrence  TEXT                          -- iCal RRULE string
);
```

Here, `timestamp without time zone` is the **correct** choice — because you're
storing the user's intended wall clock time, not a UTC moment.

**This is the opposite of the past events rule!** For logs/orders, you store
UTC. For future scheduled times, you store wall time.

```
Past events:   Store UTC (the moment happened, it's fixed)
Future events: Store wall time + timezone (the offset might change)
```

### Strategy 2: Store Both (Belt and Suspenders)

```sql
CREATE TABLE scheduled_events (
  id               SERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  wall_time        TIMESTAMP WITHOUT TIME ZONE,  -- user's intended time
  timezone         TEXT NOT NULL,                 -- IANA timezone
  computed_utc     TIMESTAMPTZ,                   -- pre-computed UTC for indexing
  last_recomputed  TIMESTAMPTZ DEFAULT NOW()      -- when UTC was last calculated
);
```

The `computed_utc` is recalculated:

- When DST rules are updated (rare but happens)
- At a regular interval before the event
- When the user modifies the event

This gives you the best of both worlds: fast UTC-based queries for "what events
fire in the next hour?" plus the wall time for correctness.

### Strategy 3: For Simple Cases (One-time events, no recurrence)

If the event is one-time and within a few days, storing UTC is fine. DST rules
don't change on short notice. The further in the future, the riskier this gets.

---

## Part 7: Cron Jobs and DST

### The Problem with Cron

Traditional cron runs in the system timezone. If the system is set to
`America/New_York`:

```cron
# "Run at 2:30 AM every day"
30 2 * * * /path/to/script.sh
```

On spring forward day: **2:30 AM doesn't exist** → most cron implementations
skip it. On fall back day: **2:30 AM happens... err, no, 2 AM is after the
fall-back** → but 1:30 AM happens twice → cron may run it twice.

### Solutions

1. **Run cron in UTC** — avoids DST entirely for the scheduler
2. **Use a timezone-aware scheduler** — libraries like `node-cron`, Bull/BullMQ
   with timezone option, or cloud schedulers (AWS EventBridge supports IANA
   timezones)
3. **Make jobs idempotent** — if a job runs twice due to DST overlap, it should
   produce the same result

---

## Part 8: Real-World Case Study — Google Calendar

Google Calendar is the gold standard for handling DST in scheduling:

1. **Events store wall time + IANA timezone** (not UTC)
2. When DST rules change (e.g., a country abolishes DST), Google recalculates
   all affected events
3. **Recurring events** evaluate each occurrence independently — a weekly
   meeting at 9 AM stays at 9 AM year-round, even across DST transitions
4. **All-day events** don't have a time component at all — they're stored as
   dates, not timestamps
5. When you share an event across timezones, each attendee sees it in their
   local time, but the event's "anchor" timezone remains the creator's

---

## Part 9: Libraries & Tools

### JavaScript/TypeScript

| Library                      | DST Support | Notes                                                               |
| ---------------------------- | ----------- | ------------------------------------------------------------------- |
| **Luxon**                    | Excellent   | Built by a Moment.js maintainer. First-class timezone support.      |
| **date-fns-tz**              | Good        | Timezone companion for date-fns. Lightweight.                       |
| **Temporal API**             | Excellent   | TC39 Stage 3 proposal. Built into future JS. The endgame.           |
| **Moment Timezone**          | Good        | Deprecated but still widely used. Don't start new projects with it. |
| **Day.js + timezone plugin** | Decent      | Lightweight but timezone plugin adds complexity.                    |

### The Temporal API (Future of JS)

The Temporal API is the upcoming native solution for dates/times in JavaScript.
It has first-class concepts for the problems we've been discussing:

```javascript
// Temporal.ZonedDateTime — stores instant + timezone + calendar
const meeting = Temporal.ZonedDateTime.from({
  year: 2026,
  month: 3,
  day: 8,
  hour: 9,
  minute: 0,
  timeZone: 'America/New_York'
})

// Temporal.PlainDateTime — wall time without timezone (for storage)
const wallTime = Temporal.PlainDateTime.from('2026-03-08T09:00')

// Temporal has explicit disambiguation for DST:
Temporal.ZonedDateTime.from(
  {
    year: 2026,
    month: 3,
    day: 8,
    hour: 2,
    minute: 30,
    timeZone: 'America/New_York'
  },
  { disambiguation: 'compatible' } // or 'earlier', 'later', 'reject'
)
// 'compatible' → shifts forward (like Luxon)
// 'earlier'    → pick the first occurrence (for overlaps)
// 'later'      → pick the second occurrence (for overlaps)
// 'reject'     → throw an error if ambiguous
```

---

## Part 10: Summary — The Mental Model

### Two Categories of Time in Software

```
┌─────────────────────────────────────────────────────┐
│                    TIME IN SOFTWARE                   │
├──────────────────────┬──────────────────────────────┤
│    PAST EVENTS       │     FUTURE EVENTS            │
│    (Recording)       │     (Scheduling)             │
├──────────────────────┼──────────────────────────────┤
│ • Logs               │ • Meetings                   │
│ • Orders             │ • Reminders                  │
│ • Errors             │ • Recurring tasks            │
│ • Transactions       │ • Appointments               │
│ • Audit trails       │ • Cron jobs                  │
├──────────────────────┼──────────────────────────────┤
│ Store: UTC           │ Store: Wall time + IANA TZ   │
│ Why: Moment is fixed │ Why: Offset may change (DST) │
│ Display: Convert to  │ Compute: UTC at fire time    │
│   local at render    │   not at schedule time       │
├──────────────────────┼──────────────────────────────┤
│ DB type: timestamptz │ DB type: timestamp (no tz)   │
│   or UTC convention  │   + timezone TEXT column      │
└──────────────────────┴──────────────────────────────┘
```

### The Three Rules

1. **Past events → Store UTC.** The moment is fixed. Convert to local time only
   for display.
2. **Future events → Store wall time + IANA timezone name.** Compute UTC when
   the event is about to fire.
3. **Never store offsets.** Use IANA timezone names (`America/New_York`), never
   abbreviations (`EST`) or fixed offsets (`UTC-5`).

### DST Edge Cases Checklist

- [ ] What happens if a scheduled time falls in a DST gap (spring forward)?
- [ ] What happens if a scheduled time falls in a DST overlap (fall back)?
- [ ] Are recurring events calculated per-occurrence or pre-computed in bulk?
- [ ] Are cron jobs running in UTC or local time?
- [ ] If timezone rules change (country abolishes DST), can you recompute?
- [ ] Are you storing IANA timezone names, not offsets?

---

## Appendix: DST Transition Dates (US) — 2024–2030

| Year | Spring Forward | Fall Back  |
| ---- | -------------- | ---------- |
| 2024 | March 10       | November 3 |
| 2025 | March 9        | November 2 |
| 2026 | March 8        | November 1 |
| 2027 | March 14       | November 7 |
| 2028 | March 12       | November 5 |
| 2029 | March 11       | November 4 |
| 2030 | March 10       | November 3 |

US rule: 2nd Sunday of March (spring) and 1st Sunday of November (fall), at 2:00
AM local time.

---

## Appendix: Surprising DST Facts

1. **DST rules change more than you think.** Egypt has changed its DST policy
   multiple times in the last decade. Russia abolished DST in 2014. Turkey
   abolished it in 2016.

2. **Not all DST shifts are 1 hour.** Lord Howe Island (Australia) shifts by
   only 30 minutes. Nepal is UTC+5:45 (no DST, but the offset itself is
   unusual).

3. **The IANA timezone database is updated multiple times per year.** Countries
   announce DST changes, sometimes with very short notice (Egypt once announced
   a change 2 weeks before it happened).

4. **Some places have had "double DST"** — UK during WWII shifted clocks forward
   by 2 hours.

5. **Samoa skipped an entire day** — December 30, 2011 didn't exist there when
   they jumped across the International Date Line.

6. **"Timezone" ≠ "UTC offset"** — There are ~40 unique UTC offsets but ~400+
   IANA timezone entries, because the same offset can have different DST rules
   and historical changes.
