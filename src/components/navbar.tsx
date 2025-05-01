'use client'

import { Tab, Tabs, Tooltip } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  IconBookmarkFilled,
  IconDeviceDesktopFilled,
  IconHomeFilled,
  IconMessage2Filled,
  IconMoonFilled,
  IconSunHighFilled
} from '@tabler/icons-react'
import { useTheme } from 'next-themes'
export const Navbar = () => {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return (
    <nav className='container fixed top-5 z-20 flex w-full items-center justify-center'>
      <div className='relative flex w-full max-w-3xl items-center justify-between'>
        {/* Gradient blob */}

        <Tabs
          aria-label='Theme mode'
          selectedKey={theme}
          onSelectionChange={key => setTheme(key as string)}
          radius='sm'
          variant='bordered'
          size='sm'
          classNames={{
            tabList: 'gap-1 backdrop-blur-lg',
            tab: ' px-0.5'
          }}
        >
          <Tab
            key={'light'}
            title={
              <Tooltip content='Light Mode'>
                <IconSunHighFilled className='size-4 md:size-5' />
              </Tooltip>
            }
          />

          <Tab
            key={'dark'}
            title={
              <Tooltip content='Dark Mode'>
                <IconMoonFilled className='size-4 md:size-5' />
              </Tooltip>
            }
          />
          <Tab
            key={'system'}
            title={
              <Tooltip content='System Preferences'>
                <IconDeviceDesktopFilled className='size-4 md:size-5' />
              </Tooltip>
            }
          />
        </Tabs>
        <Tabs
          aria-label='navbar'
          selectedKey={pathname}
          radius='sm'
          variant='bordered'
          size='sm'
          classNames={{
            tabList: 'gap-2 backdrop-blur-lg',
            tab: 'max-w-fit px-1 md:px-2'
          }}
        >
          <Tab
            key={'/'}
            title={
              <div className='flex items-center md:space-x-1'>
                <IconHomeFilled className='size-4 md:size-5' />
                <span>Home</span>
              </div>
            }
            href={'/'}
          ></Tab>
          <Tab
            key={'/posts'}
            title={
              <div className='flex items-center md:space-x-1'>
                <IconBookmarkFilled className='size-4 md:size-5' />
                <span>Posts</span>
              </div>
            }
            href={'/posts'}
          ></Tab>
          <Tab
            key={'/contact'}
            title={
              <div className='flex items-center md:space-x-1'>
                <IconMessage2Filled className='size-4 md:size-5' />
                <span>Contact</span>
              </div>
            }
            href={'/contact'}
          ></Tab>
        </Tabs>
      </div>
    </nav>
  )
}
