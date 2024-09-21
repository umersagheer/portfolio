import React from 'react'
import { FloatingDock } from './floating-dock'
import { links } from '@/constants/routes'

export default function Navbar() {
  return (
    <div className='fixed bottom-5 flex w-full items-center justify-center'>
      <FloatingDock items={links} />
    </div>
  )
}
