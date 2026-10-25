'use client'

import { useIsClient } from '@/hooks/useIsClient'

// Pakistan is UTC+5 all year (no daylight saving).
const PKT_OFFSET_MINUTES = 5 * 60

// How far my clock is from the reader's, e.g. "5h ahead of you". Only the
// browser knows the reader's timezone, so nothing renders until hydration.
export default function TimeAhead({ prefix = '' }: { prefix?: string }) {
  const isClient = useIsClient()
  if (!isClient) return null

  const diff = PKT_OFFSET_MINUTES + new Date().getTimezoneOffset()
  if (diff === 0) return <>{prefix}same time as you</>

  const hours = Math.floor(Math.abs(diff) / 60)
  const minutes = Math.abs(diff) % 60
  const span = [hours && `${hours}h`, minutes && `${minutes}m`]
    .filter(Boolean)
    .join(' ')
  return (
    <>
      {prefix}
      {span} {diff > 0 ? 'ahead of' : 'behind'} you
    </>
  )
}
