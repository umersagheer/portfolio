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
          {/* Container styled to match the nav pill in ui/tabs.tsx: v3's default
              Tabs container is a solid bg-default block, the v2 `bordered`
              variant was a transparent bordered pill. */}
          <Tabs.ListContainer className='border-border rounded-[12px] border-2 bg-transparent shadow-xs backdrop-blur-lg'>
            <Tabs.List
              aria-label='Theme mode'
              className='gap-1 bg-transparent p-1'
            >
              {/* The Tab is the focusable control. Tooltips only open from a
                  focusable trigger, so each icon gets a presentational
                  Tooltip.Trigger kept out of the tab order (tabIndex -1): it
                  feeds hover to the tooltip without adding a tab stop. */}
              <Tabs.Tab id='light' aria-label='Light Mode' className='px-0.5'>
                <Tooltip>
                  <Tooltip.Trigger
                    role='presentation'
                    tabIndex={-1}
                    className='flex'
                  >
                    <IconSunHighFilled className='size-4 md:size-5' />
                  </Tooltip.Trigger>

                  <Tooltip.Content>Light Mode</Tooltip.Content>
                </Tooltip>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='dark' aria-label='Dark Mode' className='px-0.5'>
                <Tooltip>
                  <Tooltip.Trigger
                    role='presentation'
                    tabIndex={-1}
                    className='flex'
                  >
                    <IconMoonFilled className='size-4 md:size-5' />
                  </Tooltip.Trigger>

                  <Tooltip.Content>Dark Mode</Tooltip.Content>
                </Tooltip>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab
                id='system'
                aria-label='System Preferences'
                className='px-0.5'
              >
                <Tooltip>
                  <Tooltip.Trigger
                    role='presentation'
                    tabIndex={-1}
                    className='flex'
                  >
                    <IconDeviceDesktopFilled className='size-4 md:size-5' />
                  </Tooltip.Trigger>

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
