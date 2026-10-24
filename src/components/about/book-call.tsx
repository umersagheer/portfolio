'use client'

import { useState, type MouseEvent } from 'react'

type CalApi = ((...args: unknown[]) => void) & {
  q?: unknown[][]
  ns?: Record<string, unknown>
  loaded?: boolean
}

declare global {
  interface Window {
    Cal?: CalApi
  }
}

const EMBED_SRC = 'https://app.cal.com/embed/embed.js'

// The same stub Cal.com's snippet installs: calls queue in `q` until
// embed.js arrives and replays them, so the modal can be requested straight
// away. Runs on the first click only.
function loadCal(onError: () => void): CalApi {
  if (window.Cal) return window.Cal
  const cal: CalApi = (...args: unknown[]) => {
    cal.q!.push(args)
  }
  cal.q = []
  cal.ns = {}
  cal.loaded = true
  window.Cal = cal

  const script = document.createElement('script')
  script.src = EMBED_SRC
  script.async = true
  script.onerror = onError
  document.head.appendChild(script)

  cal('init', { origin: 'https://cal.com' })
  cal('ui', {
    cssVarsPerTheme: {
      light: { 'cal-brand': '#7828c8' },
      dark: { 'cal-brand': '#9353d3' }
    }
  })
  return cal
}

// Opens a Cal.com booking in a modal, loading Cal's script on first use.
// If the script can't load, the booking page opens in a new tab instead.
export function openCal(href: string, onFallback?: () => void) {
  const fallback = () => {
    onFallback?.()
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  const cal = loadCal(fallback)
  cal('modal', {
    calLink: new URL(href).pathname.replace(/^\//, ''),
    config: {
      theme: document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
    }
  })
}

// A real link to the booking page. With JavaScript, a click opens the booking
// form in a modal instead, loading Cal.com's script only at that moment; if the
// script can't load, the link opens as normal.
export default function BookCall({
  href,
  label = 'Book a call',
  className
}: {
  href: string
  label?: string
  className?: string
}) {
  const [opening, setOpening] = useState(false)

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return
    event.preventDefault()
    setOpening(true)
    openCal(href, () => setOpening(false))
    // The modal takes over once the script runs; the label only bridges the wait.
    window.setTimeout(() => setOpening(false), 1500)
  }

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      onClick={onClick}
      aria-busy={opening}
      className={className}
    >
      {opening ? 'Opening…' : label} <span aria-hidden='true'>↗</span>
    </a>
  )
}
