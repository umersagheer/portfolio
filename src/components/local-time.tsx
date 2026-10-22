'use client'

import { useEffect, useState } from 'react'
import { useIsClient } from '@/hooks/useIsClient'

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Karachi'
})

// The time is only known in the browser (and pages are prerendered), so the
// server renders a placeholder and the clock fills in after hydration.
export default function LocalTime() {
  const isClient = useIsClient()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return <time>{isClient ? formatter.format(now) : '--:--'}</time>
}
