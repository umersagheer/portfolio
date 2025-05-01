'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

export default function Gradient() {
  const pathname = usePathname()

  const getGradientStyle = () => {
    switch (pathname) {
      case '/':
        return 'from-primary w-60 h-40 rounded-xl right-3 top-10 bg-gradient-to-r'
      case '/posts':
        return 'from-warning size-44 right-4 rounded-3xl top-8 bg-gradient-to-tr'
      case '/contact':
        return 'from-success-500 size-56 right-2 rounded-2xl top-6 bg-gradient-to-r'
      default:
        return 'from-blue-600 via-purple-600 to-pink-600'
    }
  }

  return (
    <div className='relative isolate'>
      <div
        className={`absolute ${getGradientStyle()} opacity-60 blur-2xl transition-all duration-700`}
      />
    </div>
  )
}
