'use client'

import { Tabs, Tooltip } from '@heroui/react'
import React from 'react'
import {
  IconDeviceDesktopFilled,
  IconMoonFilled,
  IconSunHighFilled
} from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { ExpandableTabs } from '@/components/ui/tabs'
import { navLinks } from '@/constants/routes'
import { useIsClient } from '@/hooks/useIsClient'

const themeListContainerClass =
  'border-border rounded-[12px] border-2 bg-transparent shadow-xs backdrop-blur-lg'

// The saved theme is only known in the browser, and a Tabs rendered without
// it would select (and set) the first tab. Until hydration, show the same pill
// built from HeroUI's tab classes so it occupies exactly the same space.
function ThemeTabsPlaceholder() {
  return (
    <div className='tabs' data-orientation='horizontal' aria-hidden='true'>
      <div className={`tabs__list-container ${themeListContainerClass}`}>
        <div
          className='tabs__list gap-1 bg-transparent p-1'
          data-orientation='horizontal'
        >
          {[IconSunHighFilled, IconMoonFilled, IconDeviceDesktopFilled].map(
            (Icon, index) => (
              <div key={index} className='tabs__tab px-0.5'>
                <Icon className='size-4 md:size-5' />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const isClient = useIsClient()

  return (
    <nav className='fixed top-5 z-20 flex w-full items-center justify-center'>
      <div className='relative flex w-full max-w-3xl items-center justify-between'>
        {!isClient ? (
          <ThemeTabsPlaceholder />
        ) : (
          <Tabs
            selectedKey={theme}
            onSelectionChange={key => setTheme(key as string)}
            variant='primary'
          >
            {/* Container styled to match the nav pill in ui/tabs.tsx: v3's default
              Tabs container is a solid bg-default block, the v2 `bordered`
              variant was a transparent bordered pill. */}
            <Tabs.ListContainer className={themeListContainerClass}>
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
        )}
        <ExpandableTabs tabs={navLinks} />
      </div>
    </nav>
  )
}
