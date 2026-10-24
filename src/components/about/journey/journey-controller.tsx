'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type JourneyControllerProps = {
  className: string
  platforms: string[]
  children: ReactNode
}

const STAGES = ['dep-up', 'dep-term', 'dep-down', 'dep-done']
const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

// The figure is drawn on the server; this only switches what is lit. A chosen
// step lights its station, badge, callouts, row and panel. Deploy (step 06)
// plays once when the figure first comes into view, then whenever 06 is
// chosen: builds rise to the cloud, a terminal reports, the update comes down.
export default function JourneyController({
  className,
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
    const resting = readout?.textContent ?? ''
    const done = `deployed · ${platforms.join(' · ').toLowerCase()}`
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timers: number[] = []
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

    const choose = (id: string | null) => {
      active = active === id ? null : id
      render()
      if (active === 'ship') deploy()
      else if (!deploying) clearDeploy()
    }

    const onClick = (event: MouseEvent) => {
      if ((event.target as Element).closest('[data-deploy]')) {
        if (active === 'ship') deploy()
        else choose('ship')
        return
      }
      const step = (event.target as Element).closest<HTMLElement | SVGElement>(
        '[data-step]'
      )
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
        later(500, deploy)
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
    }
  }, [platforms])

  return (
    <figure ref={ref} className={className}>
      {children}
    </figure>
  )
}
