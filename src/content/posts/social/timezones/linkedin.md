# LinkedIn post copy

Attach the Timezones Remotion promo video to this post.

## Ready to post

"We have 52 orders today." — Operations manager.
"I see 47." — Developer looking at the dashboard.

Neither was wrong. The missing 5 orders were placed between midnight and 5 AM in Pakistan — which is still "yesterday" in UTC. A classic timezone bug hiding in plain sight.

This is the kind of subtle data-loss bug that slips past tests, passes code review, and only surfaces when someone on a different continent asks, "where did my data go?"

I just published a deep dive into the two rules that prevent nearly every timezone bug I've seen in production.

Here's the mental model:

**Rule 1 — Past data (orders, logs, analytics):** Store UTC, filter in UTC, display in local time. Think of UTC as the "raw negative" — one source of truth, infinite local prints. The moment you store a local time, you've baked in an assumption that will break for someone.

**Rule 2 — Future data (meetings, standups, alarms):** Store the wall-clock time + the IANA timezone name (`America/New_York`, not `EST`). Why? Because governments change UTC offsets. If you convert a future event to UTC today, and DST rules shift before the event happens, your 9 AM standup silently moves to 10 AM.

**The trap almost everyone hits:** `new Date("2026-03-28")` — no `Z` suffix. Chrome parses it as UTC. Safari parses it as local time. Same code, different days, depending on the browser and the user's timezone.

**The PostgreSQL footgun:** `SELECT ts AT TIME ZONE 'Asia/Karachi'` does opposite things depending on whether `ts` is a `timestamptz` or a bare `timestamp`. Apply it once when you should apply it twice, and your "peak hours" chart shows 5 PM orders plotted at 7 AM.

I didn't just write about it — I built 13 interactive demos so you can watch these bugs happen live: step through the date pipeline, trigger the DST gap, break the `AT TIME ZONE` trap, and see exactly where the "missing" orders go.

Check out the full breakdown and play with the demos here:
👉 https://umersagheer.dev/posts/timezones

(P.S. The attached video walks through the past-vs-future storage model, the DST gap visualizer, and the AT TIME ZONE trap — all animated with Remotion!)

#Timezones #WebDevelopment #Backend #PostgreSQL #JavaScript #SystemDesign
