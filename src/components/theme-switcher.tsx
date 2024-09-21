'use client'

import { LucideSquare } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const fillColor = theme === 'light' ? '#000000' : '#FFFFFF'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <LucideSquare
      style={{ fill: fillColor }}
      stroke='none'
      className='h-full w-full'
    />
  )
}
