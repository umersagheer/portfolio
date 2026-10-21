'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn, ScrollShadow } from '@heroui/react'
import { TocItem } from '@/libs/toc'

type TableOfContentsProps = {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  const isClickLocked = useRef(false)

  useEffect(() => {
    if (!activeId) return
    const el = itemRefs.current.get(activeId)
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [activeId])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (isClickLocked.current) return
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%', threshold: 1.0 }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = useCallback((id: string) => {
    isClickLocked.current = true
    setActiveId(id)
    setTimeout(() => {
      isClickLocked.current = false
    }, 1000)
  }, [])

  if (items.length === 0) return null

  return (
    <nav className='mb-14 flex max-h-[calc(100vh-35rem)] min-h-0 flex-col xl:mb-0'>
      <p className='mb-4 text-sm font-semibold'>On this page</p>
      <ScrollShadow className='scrollbar-hide -mr-2 min-h-0 flex-1 overflow-y-auto pr-2'>
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
              {activeId === item.id && (
                <motion.div
                  layoutId='toc-active-indicator'
                  className='bg-muted absolute top-2.5 left-0 h-4 w-0.5 rounded-full'
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 30
                  }}
                />
              )}
              <a
                href={`#${item.id}`}
                onClick={() => handleClick(item.id)}
                className={cn(
                  'block py-1.5 pl-4 transition-colors',
                  // h2 (Part 1/2) read as section headers; h3 lighter/smaller children
                  item.level === 2 ? 'font-semibold' : 'text-[13px]',
                  activeId === item.id
                    ? 'text-foreground font-medium'
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
