# X post copy

Attach the Timezones Remotion promo video to this post.

## Ready to post

"We have 52 orders." "I see 47." — Neither was wrong. The 5 missing orders were placed between midnight and 5 AM local time, which is still "yesterday" in UTC.

Almost every timezone bug comes from not knowing one thing: past data and future data need opposite storage strategies. Past events → store UTC. Future events → store wall time + IANA timezone name. Mix them up and your 9 AM standup silently drifts to 10 AM after a DST change.

I wrote a deep dive covering the full stack — date string parsing traps, the PostgreSQL `AT TIME ZONE` footgun, `getHours()` vs `getUTCHours()`, and the frontend-backend contract — with 13 interactive demos you can break:
https://umersagheer.dev/posts/timezones
