'use client'

import NextImage from 'next/image'
import { Image, Tooltip } from '@heroui/react'
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
      <Image
        as={NextImage}
        src={siteProfile.avatar}
        alt={siteProfile.name}
        width={32}
        height={32}
        className='shrink-0 rounded-full grayscale'
      />
      <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-default-500'>
        <span className='font-sourceCodePro font-bold text-foreground'>
          {siteProfile.name}
        </span>
        <span className='text-default-300'>&middot;</span>
        <span>{formatDate(publishedAt)}</span>
        <span className='text-default-300'>&middot;</span>
        <span>{readingTime} min read</span>
        <span className='text-default-300'>&middot;</span>
        <div className='-ml-1 flex items-center gap-0'>
          <Tooltip content='X (Twitter)' size='sm'>
            <a
              href={siteProfile.socials.x.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='X'
              className='rounded-md p-1 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon slug='x' size={12} className='grayscale opacity-70 transition-opacity hover:opacity-100' />
            </a>
          </Tooltip>
          <Tooltip content='GitHub' size='sm'>
            <a
              href={siteProfile.socials.github.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='rounded-md p-1 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon slug='github' size={12} className='grayscale opacity-70 transition-opacity hover:opacity-100' />
            </a>
          </Tooltip>
          <Tooltip content='LinkedIn' size='sm'>
            <a
              href={siteProfile.socials.linkedin.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='rounded-md p-1 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon slug='linkedin' size={12} className='grayscale opacity-70 transition-opacity hover:opacity-100' />
            </a>
          </Tooltip>
          <Tooltip content='Email' size='sm'>
            <a
              href='mailto:umersagheer0075@gmail.com'
              aria-label='Email'
              className='rounded-md p-1 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon
                slug='gmail'
                size={12}
                className='grayscale opacity-70 transition-opacity hover:opacity-100'
                fallback={<MailIcon size={12} className='text-default-500' />}
              />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
