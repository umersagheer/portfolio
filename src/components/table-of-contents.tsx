'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn, ScrollShadow } from '@heroui/react'
import { TocItem } from '@/libs/toc'

type TableOfContentsProps = {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const isClickLocked = useRef(false)

  // Keep the lit item in view inside the list. Scrolls only the list, never
  // the page (scrollIntoView would also move the window).
  useEffect(() => {
    if (!activeId) return
    const el = itemRefs.current.get(activeId)
    const list = el?.closest<HTMLElement>('[data-toc-list]')
    if (!el || !list) return
    list.scrollTo({
      top: el.offsetTop - list.clientHeight / 2,
      behavior: 'smooth'
    })
  }, [activeId])

  // The section being read is the last heading above a reading line a
  // quarter of the way down the screen. Checked on scroll (once per frame),
  // so a fast scroll or a jump can't skip a section.
  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    let frame = 0
    const update = () => {
      frame = 0
      if (isClickLocked.current) return
      const line = window.innerHeight * 0.25
      let current = ''
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > line) break
        current = heading.id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  const handleClick = useCallback((id: string) => {
    isClickLocked.current = true
    setActiveId(id)
    setTimeout(() => {
      isClickLocked.current = false
    }, 1000)
  }, [])

  if (items.length === 0) return null

  // No framer-motion: the marker is a plain bar per item, so this works on
  // case-study pages too (they ship no framer-motion). The parent bounds the
  // height; the list scrolls inside it.
  return (
    <nav aria-label='On this page' className='flex h-full min-h-0 flex-col'>
      <p className='mb-4 text-sm font-semibold'>On this page</p>
      <ScrollShadow
        data-toc-list
        className='scrollbar-hide -mr-2 min-h-0 flex-1 overflow-y-auto pr-2'
      >
        <ul className='relative text-sm'>
          {items.map(item => (
            <li
              key={item.id}
              ref={el => {
                if (el) itemRefs.current.set(item.id, el)
              }}
              className='relative'
              style={{ paddingLeft: (item.level - 2) * 12 }}
            >
              <span
                aria-hidden='true'
                className={cn(
                  'bg-accent absolute top-2.5 left-0 h-4 w-0.5 rounded-full transition-opacity duration-200',
                  activeId === item.id ? 'opacity-100' : 'opacity-0'
                )}
              />
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? 'location' : undefined}
                onClick={() => handleClick(item.id)}
                className={cn(
                  'block py-1.5 pl-4 transition-colors',
                  // h2 (Part 1/2) read as section headers; h3 lighter/smaller children
                  item.level === 2 ? 'font-semibold' : 'text-[13px]',
                  activeId === item.id
                    ? 'text-foreground'
                    : 'text-muted hover:text-foreground'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </ScrollShadow>
    </nav>
  )
}
