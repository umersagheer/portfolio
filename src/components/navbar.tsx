'use client'

import { Tabs, Tooltip } from '@heroui/react'
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
          selectedKey={theme}
          onSelectionChange={key => setTheme(key as string)}
          variant='primary'
        >
          <Tabs.ListContainer>
            <Tabs.List
              aria-label='Theme mode'
              className='gap-1 backdrop-blur-lg'
            >
              <Tabs.Tab id='light' className='px-0.5'>
                <Tooltip>
                  <IconSunHighFilled className='size-4 md:size-5' />

                  <Tooltip.Content>Light Mode</Tooltip.Content>
                </Tooltip>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='dark' className='px-0.5'>
                <Tooltip>
                  <IconMoonFilled className='size-4 md:size-5' />

                  <Tooltip.Content>Dark Mode</Tooltip.Content>
                </Tooltip>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='system' className='px-0.5'>
                <Tooltip>
                  <IconDeviceDesktopFilled className='size-4 md:size-5' />

                  <Tooltip.Content>System Preferences</Tooltip.Content>
                </Tooltip>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <ExpandableTabs tabs={navLinks} />
      </div>
    </nav>
  )
}
