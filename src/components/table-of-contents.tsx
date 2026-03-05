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
    <nav className='flex max-h-[calc(100vh-35rem)] flex-col mb-14'>
      <p className='mb-4 text-sm font-semibold'>On this page</p>
      <ScrollShadow className='-mr-2 flex-1 overflow-y-auto pr-2 scrollbar-hide'>
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
                  className='absolute left-0 top-2.5 h-4 w-0.5 rounded-full bg-default-600'
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
                  activeId === item.id
                    ? 'font-medium text-foreground'
                    : 'text-default-400 hover:text-foreground'
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
