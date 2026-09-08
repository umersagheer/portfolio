'use client'

import NextImage from 'next/image'
import { Tooltip } from '@heroui/react'
import { MailIcon } from 'lucide-react'

import { siteProfile } from '@/constants/site-profile'
import formatDate from '@/libs/utils'
import TheSvgIcon from '@/components/blog/shared/the-svg-icon'

type AuthorCardInlineProps = {
  publishedAt: string
  readingTime: number
}

export default function AuthorCardInline({
  publishedAt,
  readingTime
}: AuthorCardInlineProps) {
  return (
    <div className='flex items-center gap-3 pt-2'>
      <NextImage
        src={siteProfile.avatar}
        alt={siteProfile.name}
        width={32}
        height={32}
        className='shrink-0 rounded-full grayscale'
      />
      <div className='text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
        <span className='font-sourceCodePro text-foreground font-bold'>
          {siteProfile.name}
        </span>
        <span className='text-muted'>&middot;</span>
        <span>{formatDate(publishedAt)}</span>
        <span className='text-muted'>&middot;</span>
        <span>{readingTime} min read</span>
        <span className='text-muted'>&middot;</span>
        <div className='-ml-1 flex items-center gap-0'>
          <Tooltip>
            <a
              href={siteProfile.socials.x.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='X'
              className='hover:bg-surface-secondary rounded-md p-1 transition-colors'
            >
              <TheSvgIcon
                slug='x'
                size={12}
                className='opacity-70 grayscale transition-opacity hover:opacity-100'
              />
            </a>

            <Tooltip.Content>X (Twitter)</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <a
              href={siteProfile.socials.github.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='hover:bg-surface-secondary rounded-md p-1 transition-colors'
            >
              <TheSvgIcon
                slug='github'
                size={12}
                className='opacity-70 grayscale transition-opacity hover:opacity-100'
              />
            </a>

            <Tooltip.Content>GitHub</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <a
              href={siteProfile.socials.linkedin.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='hover:bg-surface-secondary rounded-md p-1 transition-colors'
            >
              <TheSvgIcon
                slug='linkedin'
                size={12}
                className='opacity-70 grayscale transition-opacity hover:opacity-100'
              />
            </a>

            <Tooltip.Content>LinkedIn</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <a
              href='mailto:umersagheer0075@gmail.com'
              aria-label='Email'
              className='hover:bg-surface-secondary rounded-md p-1 transition-colors'
            >
              <TheSvgIcon
                slug='gmail'
                size={12}
                className='opacity-70 grayscale transition-opacity hover:opacity-100'
                fallback={<MailIcon size={12} className='text-muted' />}
              />
            </a>

            <Tooltip.Content>Email</Tooltip.Content>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
