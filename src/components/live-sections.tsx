'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Marks the section under the reading line (40% down the viewport) with
// `data-live`; CSS then lights that section's label in the accent. Short last
// sections (the footer) never reach that line, so once the end of the page is
// in view the last section is the live one. Two IntersectionObservers, no
// scroll handlers, re-run on every navigation.
export default function LiveSections() {
  const pathname = usePathname()

  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>('[data-section]')
    ]
    const pageEnd = document.querySelector('footer')?.lastElementChild
    if (sections.length === 0) return

    const inBand = new Set<Element>()
    let atEnd = false

    const apply = () => {
      const last = sections[sections.length - 1]
      for (const section of sections) {
        const isLive = atEnd ? section === last : inBand.has(section)
        section.toggleAttribute('data-live', isLive)
      }
    }

    const bandObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target)
          else inBand.delete(entry.target)
        }
        apply()
      },
      { rootMargin: '-40% 0px -59% 0px' }
    )
    sections.forEach(section => bandObserver.observe(section))

    const endObserver = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting
      apply()
    })
    if (pageEnd) endObserver.observe(pageEnd)

    return () => {
      bandObserver.disconnect()
      endObserver.disconnect()
      sections.forEach(section => section.removeAttribute('data-live'))
    }
  }, [pathname])

  return null
}
