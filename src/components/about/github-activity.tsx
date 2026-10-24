import { siteProfile } from '@/constants/site-profile'

type Day = { date: string; level: number }

const CELL = 10
const GAP = 2

// The public contribution calendar, read on the server and refreshed daily.
// No token and no client code: if GitHub can't be reached, nothing renders.
async function getCalendar(): Promise<{ days: Day[]; total: string } | null> {
  try {
    const res = await fetch(
      `https://github.com/users/${siteProfile.socials.github.label}/contributions`,
      // A slow GitHub must never hang a build: give up and render nothing.
      { next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return null
    const html = await res.text()
    const days = [
      ...html.matchAll(
        /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d)"/g
      )
    ]
      .map(([, date, level]) => ({ date, level: Number(level) }))
      .sort((a, b) => a.date.localeCompare(b.date))
    const total = html.match(/([\d,]+)\s+contributions\s+in the last year/)?.[1]
    if (days.length === 0 || !total) return null
    return { days, total }
  } catch {
    return null
  }
}

const levelFill = [
  'color-mix(in oklab, var(--foreground) 11%, var(--background))',
  'color-mix(in oklab, var(--accent) 35%, var(--background))',
  'color-mix(in oklab, var(--accent) 55%, var(--background))',
  'color-mix(in oklab, var(--accent) 78%, var(--background))',
  'var(--accent)'
]

export default async function GithubActivity() {
  const calendar = await getCalendar()
  if (!calendar) return null

  const { days, total } = calendar
  // Columns are weeks starting on Sunday, rows are weekdays.
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const weeks = Math.ceil((days.length + offset) / 7)
  const width = weeks * (CELL + GAP) - GAP
  const height = 7 * (CELL + GAP) - GAP

  return (
    <figure className='mt-8 space-y-2'>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className='block h-auto w-full'
        role='img'
        aria-label={`${total} contributions on GitHub in the last year`}
      >
        {days.map((day, i) => (
          <rect
            key={day.date}
            x={Math.floor((i + offset) / 7) * (CELL + GAP)}
            y={((i + offset) % 7) * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={2}
            style={{ fill: levelFill[day.level] ?? levelFill[0] }}
          />
        ))}
      </svg>
      <figcaption className='font-sourceCodePro text-muted flex justify-between text-xs'>
        <span>{total} contributions in the last year</span>
        <a
          href={siteProfile.socials.github.url}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-accent transition-colors'
        >
          GitHub ↗
        </a>
      </figcaption>
    </figure>
  )
}
