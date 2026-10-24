'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type Stop = { step: string; at: number; name: string }

type JourneyControllerProps = {
  className: string
  platforms: string[]
  // Where the request reaches each station, in the beam's pathLength units.
  tour: Stop[]
  children: ReactNode
}

const STAGES = ['dep-up', 'dep-term', 'dep-down', 'dep-done']
// Tour timing: a station lifts and holds, settles, then the beam moves on.
const HOLD = 1800
const SETTLE = 350
const TRAVEL = 850
const DASH = 28
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

// The figure is drawn on the server; this only switches what is lit. A chosen
// step lifts its station and lights its badge, callouts, row and panel.
// The first time the figure comes into view (and on replay), a tour walks the
// request through it: each station lifts as the beam reaches it, settles, and
// the beam moves on; at the end, Deploy (step 06) plays. Deploy also plays
// whenever 06 is chosen: builds rise to the cloud, a terminal reports, the
// update comes down.
export default function JourneyController({
  className,
  platforms,
  tour,
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
    const beamPath = root.querySelector<SVGPathElement>('.beam')
    const resting = readout?.textContent ?? ''
    const done = `deployed · ${platforms.join(' · ').toLowerCase()}`
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timers: number[] = []
    let tourTimers: number[] = []
    let beam: Animation | null = null
    let active: string | null = null
    let deploying = false
    let inView = false

    const say = (text: string) => {
      if (readout) readout.textContent = text
    }
    const later = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(fn, ms))
    const clearDeploy = () => {
      timers.forEach(clearTimeout)
      timers = []
      deploying = false
      root.classList.remove(...STAGES)
      say(resting)
    }

    const deploy = () => {
      if (deploying) return
      clearDeploy()
      if (reduced.matches) {
        root.classList.add(...STAGES)
        say(done)
        return
      }
      deploying = true
      root.classList.add('dep-up')
      say('deploying · building api, web and app')
      later(900, () => {
        root.classList.add('dep-term')
        say('deploying · build ✓ · tests ✓')
      })
      later(2200, () => {
        root.classList.add('dep-down')
        say('deploying · update → laptop and phone')
      })
      later(3100, () => {
        root.classList.add('dep-done')
        deploying = false
        say(done)
        // Shown in passing unless the reader chose Ship.
        if (active !== 'ship') later(2600, clearDeploy)
      })
    }

    // Lights one step in the drawing and the list, without choosing it.
    const light = (id: string | null) => {
      if (id) root.dataset.active = id
      else delete root.dataset.active
      root
        .querySelectorAll<HTMLElement | SVGElement>('[data-step]')
        .forEach(el => el.classList.toggle('on', el.dataset.step === id))
    }

    const render = () => {
      light(active)
      root
        .querySelectorAll<HTMLButtonElement>('button[data-step]')
        .forEach(el =>
          el.setAttribute('aria-pressed', String(el.dataset.step === active))
        )
      root.querySelectorAll<HTMLElement>('[data-panel]').forEach(el => {
        el.hidden = el.dataset.panel !== (active ?? 'none')
      })
    }

    // Also cancels a tour that is about to start.
    const stopTour = () => {
      tourTimers.forEach(clearTimeout)
      tourTimers = []
      beam?.cancel()
      beam = null
      if (!root.classList.contains('touring')) return
      root.classList.remove('touring')
      render()
      say(resting)
    }

    // The beam's head runs from one stop to the next along the wire.
    const travel = (from: number, to: number) => {
      beam =
        beamPath?.animate(
          [
            { strokeDashoffset: `${DASH - from}px`, opacity: 1 },
            { strokeDashoffset: `${DASH - to}px`, opacity: 1 }
          ],
          { duration: TRAVEL, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' }
        ) ?? null
    }

    const runTour = () => {
      stopTour()
      clearDeploy()
      active = null
      render()
      if (reduced.matches) {
        deploy()
        return
      }
      root.classList.add('touring')
      const at = (ms: number, fn: () => void) =>
        tourTimers.push(window.setTimeout(fn, ms))
      let t = 0
      tour.forEach((stop, i) => {
        if (i > 0) {
          const from = tour[i - 1].at
          at(t, () => travel(from, stop.at))
          t += TRAVEL
        }
        at(t, () => {
          light(stop.step)
          say(`request · ${stop.name}`)
        })
        t += HOLD
        at(t, () => light(null))
        t += SETTLE
      })
      at(t, () => {
        root.classList.remove('touring')
        tourTimers = []
        deploy()
      })
    }

    const choose = (id: string | null) => {
      stopTour()
      active = active === id ? null : id
      render()
      if (active === 'ship') deploy()
      else if (!deploying) clearDeploy()
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (target.closest('[data-replay]')) {
        runTour()
        return
      }
      if (target.closest('[data-deploy]')) {
        stopTour()
        if (active === 'ship') deploy()
        else choose('ship')
        return
      }
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
        isTyping(event.target) ||
        document.querySelector('dialog[open]')
      )
        return
      const n = Number(event.key)
      const i = active ? steps.indexOf(active) : -1
      if (n >= 1 && n <= steps.length) choose(steps[n - 1])
      else if (event.key === 'Escape' && root.classList.contains('touring'))
        stopTour()
      else if (event.key === 'Escape' && active) choose(active)
      else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const right = event.key === 'ArrowRight'
        const next =
          i < 0
            ? right
              ? 0
              : steps.length - 1
            : (i + (right ? 1 : steps.length - 1)) % steps.length
        if (steps[next] !== active) choose(steps[next])
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
        tourTimers.push(window.setTimeout(runTour, 500))
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
      timers.forEach(clearTimeout)
      tourTimers.forEach(clearTimeout)
      beam?.cancel()
    }
  }, [platforms, tour])

  return (
    <figure ref={ref} className={className}>
      {children}
    </figure>
  )
}
