'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@heroui/react'
import { TocItem } from '@/libs/toc'

type TableOfContentsProps = {
  items: TocItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
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

  if (items.length === 0) return null

  return (
    <nav>
      <p className='mb-4 text-sm font-semibold'>On this page</p>
      <ul className='relative text-sm'>
        {items.map(item => (
          <li
            key={item.id}
            className='relative'
            style={{ paddingLeft: (item.level - 2) * 12 }}
          >
            {activeId === item.id && (
              <motion.div
                layoutId='toc-active-indicator'
                className='absolute left-0 top-0 h-full w-0.5 rounded-full bg-default-600'
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 30
                }}
              />
            )}
            <a
              href={`#${item.id}`}
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
    </nav>
  )
}
