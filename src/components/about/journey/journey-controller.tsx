'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type JourneyControllerProps = {
  className: string
  // Where the crate pauses along the delivery lane (build, test, deploy, live).
  stops: number[]
  platforms: string[]
  children: ReactNode
}

const COS = Math.cos(Math.PI / 6)
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

// The figure is drawn on the server; this only switches what is lit. One
// chosen step lights its station, badge, row and panel; "Ship it" runs the
// delivery lane once when the figure first comes into view, then on click.
export default function JourneyController({
  className,
  stops,
  platforms,
  children
}: JourneyControllerProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const steps = [
      ...root.querySelectorAll<HTMLElement>('button[data-step]')
    ].map(el => el.dataset.step!)
    const readout = root.querySelector<HTMLElement>('[data-readout]')
    const restingReadout = readout?.textContent ?? ''
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timers: number[] = []
    let active: string | null = null
    let frame = 0
    let shipping = false
    let inView = false

    const render = () => {
      if (active) root.dataset.active = active
      else delete root.dataset.active
      root
        .querySelectorAll<HTMLElement | SVGElement>('[data-step]')
        .forEach(el => {
          const on = el.dataset.step === active
          if (el instanceof HTMLButtonElement)
            el.setAttribute('aria-pressed', String(on))
          else el.classList.toggle('on', on)
        })
      root.querySelectorAll<HTMLElement>('[data-panel]').forEach(el => {
        el.hidden = el.dataset.panel !== (active ?? 'none')
      })
    }

    const setLive = (el: Element | null, on: boolean) =>
      el
        ?.querySelectorAll('polygon')
        .forEach(p => p.classList.toggle('live', on))

    const ship = () => {
      if (shipping) return
      const crate = root.querySelector<SVGGElement>('[data-crate]')
      const lamps = ['test', 'deploy'].map(n =>
        root.querySelector(`[data-lamp="${n}"]`)
      )
      const dests = [...root.querySelectorAll('[data-dest]')]
      const done = `shipped · ${platforms.join(' · ').toLowerCase()}`
      lamps.forEach(l => setLive(l, false))
      dests.forEach(d => setLive(d, false))

      if (reduced.matches || !crate) {
        lamps.forEach(l => setLive(l, true))
        dests.forEach(d => setLive(d, true))
        if (readout) readout.textContent = done
        return
      }

      shipping = true
      root.dataset.shipping = ''
      crate.style.opacity = '1'
      const [first, test, deploy, last] = stops
      const labels = ['build', 'test ✓', 'deploy', 'live']
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 3200)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const u = first + (last - first) * eased
        crate.setAttribute('transform', `translate(${(u * COS).toFixed(1)} 0)`)
        const stage =
          u < test - 5 ? 0 : u < deploy - 5 ? 1 : u < last - 5 ? 2 : 3
        if (readout)
          readout.textContent = `shipping · ${labels.slice(0, stage + 1).join(' → ')}`
        setLive(lamps[0], stage >= 1)
        setLive(lamps[1], stage >= 2)
        if (t < 1) {
          frame = requestAnimationFrame(tick)
          return
        }
        crate.style.opacity = '0'
        dests.forEach((d, i) =>
          timers.push(window.setTimeout(() => setLive(d, true), 180 * (i + 1)))
        )
        timers.push(
          window.setTimeout(
            () => {
              if (readout) readout.textContent = done
              shipping = false
              delete root.dataset.shipping
            },
            180 * (dests.length + 1)
          )
        )
      }
      frame = requestAnimationFrame(tick)
    }

    const choose = (id: string | null) => {
      active = active === id ? null : id
      render()
      if (!active && readout && !shipping) readout.textContent = restingReadout
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (target.closest('[data-ship]')) return ship()
      const step = target.closest<HTMLElement | SVGElement>('[data-step]')
      if (step?.dataset.step) choose(step.dataset.step)
    }

    // Keys work while the figure is on screen: 1–6 pick a step, ← → move, Esc clears.
    const onKey = (event: KeyboardEvent) => {
      if (
        !inView ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTyping(event.target)
      )
        return
      const n = Number(event.key)
      const i = active ? steps.indexOf(active) : -1
      if (n >= 1 && n <= steps.length) choose(steps[n - 1])
      else if (event.key === 'Escape' && active) choose(active)
      else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const step = event.key === 'ArrowRight' ? 1 : steps.length - 1
        active =
          steps[
            i < 0
              ? event.key === 'ArrowRight'
                ? 0
                : steps.length - 1
              : (i + step) % steps.length
          ]
        render()
      } else return
      event.preventDefault()
    }

    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    })
    const firstView = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        timers.push(window.setTimeout(ship, 500))
      },
      { threshold: 0.5 }
    )
    visibility.observe(root)
    firstView.observe(root)
    root.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    render()

    return () => {
      visibility.disconnect()
      firstView.disconnect()
      root.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(frame)
      timers.forEach(clearTimeout)
    }
  }, [stops, platforms])

  return (
    <figure ref={ref} className={className}>
      {children}
    </figure>
  )
}
