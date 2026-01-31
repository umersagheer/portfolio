'use client'

import { Tab, Tabs, Tooltip } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  IconDeviceDesktopFilled,
  IconMoonFilled,
  IconSunHighFilled
} from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { ExpandableTabs } from './ui/tabs'
import { navLinks } from '@/constants/routes'
export const Navbar = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    <nav className='fixed top-5 z-20 flex w-full items-center justify-center'>
      <div className='relative flex w-full max-w-3xl items-center justify-between'>
        {/* Gradient blob */}

        <Tabs
          aria-label='Theme mode'
          selectedKey={theme}
          onSelectionChange={key => setTheme(key as string)}
          radius='sm'
          variant='bordered'
          // size='sm'
          classNames={{
            tabList: 'gap-1 backdrop-blur-lg',
            tab: ' px-0.5'
          }}
        >
          <Tab
            key={'light'}
            title={
              <Tooltip content='Light Mode' size='sm'>
                <IconSunHighFilled className='size-4 md:size-5' />
              </Tooltip>
            }
          />

          <Tab
            key={'dark'}
            title={
              <Tooltip content='Dark Mode' size='sm'>
                <IconMoonFilled className='size-4 md:size-5' />
              </Tooltip>
            }
          />
          <Tab
            key={'system'}
            title={
              <Tooltip content='System Preferences' size='sm'>
                <IconDeviceDesktopFilled className='size-4 md:size-5' />
              </Tooltip>
            }
          />
        </Tabs>
        <ExpandableTabs tabs={navLinks} />
      </div>
    </nav>
  )
}
