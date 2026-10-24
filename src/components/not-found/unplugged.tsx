'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from '@/components/not-found/unplugged.module.css'

type State = 'unplugged' | 'plugged' | 'live'

// The 404 figure. Plugging the cable back in (click the plug or the button)
// slides it into the socket, powers the screen, then goes home.
export default function Unplugged({
  svg,
  viewBox
}: {
  svg: string
  viewBox: string
}) {
  const router = useRouter()
  const [state, setState] = useState<State>('unplugged')
  const timers = useRef<number[]>([])

  useEffect(() => {
    router.prefetch('/')
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [router])

  const plugIn = () => {
    if (state !== 'unplugged') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/')
      return
    }
    setState('plugged')
    timers.current.push(
      window.setTimeout(() => setState('live'), 650),
      window.setTimeout(() => router.push('/'), 2000)
    )
  }

  return (
    <figure className={styles.figure} data-state={state}>
      <svg
        className={styles.svg}
        viewBox={viewBox}
        role='img'
        aria-label='A monitor whose cable has been pulled from the wall socket. The plug lies on the floor.'
        onClick={event => {
          if ((event.target as Element).closest('.plug')) plugIn()
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <button
        type='button'
        onClick={plugIn}
        disabled={state !== 'unplugged'}
        className={styles.button}
      >
        {state === 'unplugged' ? 'Plug it back in' : 'Reconnecting…'}
      </button>
    </figure>
  )
}
