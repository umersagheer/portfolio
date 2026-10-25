'use client'

import NextImage from 'next/image'
import { Tooltip } from '@heroui/react'
import { Link as AriaLink } from 'react-aria-components'
import { CalendarIcon, ClockIcon, MailIcon } from 'lucide-react'

import { siteProfile } from '@/constants/site-profile'
import formatDate from '@/libs/utils'
import TheSvgIcon from '@/components/blog/shared/the-svg-icon'
import BackLink from '@/components/reading/back-link'

type AuthorSidebarProps = {
  publishedAt: string
  readingTime: number
}

// The left rail on wide screens: back to the list, then who wrote it and
// when. Navigation (sections, neighbours) lives in the right rail.
export default function AuthorSidebar({
  publishedAt,
  readingTime
}: AuthorSidebarProps) {
  return (
    <aside
      aria-label='About this post'
      className='fixed top-24 right-[calc(50%+384px+1.5rem)] hidden w-48 xl:block'
    >
      <BackLink href='/posts' label='All posts' />

      <div className='mt-6 flex flex-col gap-2'>
        <NextImage
          src={siteProfile.avatar}
          alt={siteProfile.name}
          width={44}
          height={44}
          className='rounded-full grayscale'
        />

        <p className='font-sourceCodePro text-sm font-bold'>
          {siteProfile.name}
        </p>

        <a
          href={siteProfile.socials.x.url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-accent -mt-1 text-xs'
        >
          {siteProfile.socials.x.label}
        </a>

        {/* HeroUI v3 tooltips only open from a React Aria focusable trigger,
            so tooltip anchors here are react-aria-components Links (a plain
            <a>; internal hrefs route client-side via the app RouterProvider). */}
        <div className='-ml-1.5 flex items-center gap-0.5'>
          <Tooltip>
            <AriaLink
              href={siteProfile.socials.github.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='hover:bg-surface-secondary rounded-md p-1.5 transition-colors'
            >
              <TheSvgIcon slug='github' size={16} className='grayscale' />
            </AriaLink>

            <Tooltip.Content>GitHub</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <AriaLink
              href={siteProfile.socials.linkedin.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='hover:bg-surface-secondary rounded-md p-1.5 transition-colors'
            >
              <TheSvgIcon slug='linkedin' size={16} className='grayscale' />
            </AriaLink>

            <Tooltip.Content>LinkedIn</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <AriaLink
              href='mailto:umersagheer0075@gmail.com'
              aria-label='Email'
              className='hover:bg-surface-secondary rounded-md p-1.5 transition-colors'
            >
              <TheSvgIcon
                slug='gmail'
                size={16}
                className='grayscale'
                fallback={<MailIcon size={16} className='text-muted' />}
              />
            </AriaLink>

            <Tooltip.Content>Email</Tooltip.Content>
          </Tooltip>
        </div>

        <div className='text-muted flex flex-col gap-1 text-xs'>
          <span className='flex items-center gap-1.5'>
            <ClockIcon size={12} />
            {readingTime} min read
          </span>
          <span className='flex items-center gap-1.5'>
            <CalendarIcon size={12} />
            {formatDate(publishedAt)}
          </span>
        </div>
      </div>
    </aside>
  )
}
