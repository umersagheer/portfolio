'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import { Image, Tooltip } from '@heroui/react'
import { CalendarIcon, ClockIcon, MailIcon } from 'lucide-react'

import { siteProfile } from '@/constants/site-profile'
import { PostMetadata } from '@/types'
import formatDate from '@/libs/utils'
import TheSvgIcon from '@/components/blog/shared/the-svg-icon'

type AuthorSidebarProps = {
  adjacentPosts: {
    newerPost: PostMetadata | null
    olderPost: PostMetadata | null
  }
  publishedAt: string
  readingTime: number
}

export default function AuthorSidebar({
  adjacentPosts,
  publishedAt,
  readingTime
}: AuthorSidebarProps) {
  const { newerPost, olderPost } = adjacentPosts

  return (
    <div className='fixed right-[calc(50%+384px+1.5rem)] top-24 hidden w-48 xl:block'>
      {/* Author info */}
      <div className='flex flex-col gap-2'>
        <Image
          as={NextImage}
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
          className='-mt-1 text-xs text-primary'
        >
          {siteProfile.socials.x.label}
        </a>

        <div className='-ml-1.5 flex items-center gap-0.5'>
          <Tooltip content='GitHub' size='sm'>
            <a
              href={siteProfile.socials.github.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='rounded-md p-1.5 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon slug='github' size={16} className='grayscale' />
            </a>
          </Tooltip>
          <Tooltip content='LinkedIn' size='sm'>
            <a
              href={siteProfile.socials.linkedin.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='rounded-md p-1.5 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon slug='linkedin' size={16} className='grayscale' />
            </a>
          </Tooltip>
          <Tooltip content='Email' size='sm'>
            <a
              href='mailto:umersagheer0075@gmail.com'
              aria-label='Email'
              className='rounded-md p-1.5 transition-colors hover:bg-default-100'
            >
              <TheSvgIcon
                slug='gmail'
                size={16}
                className='grayscale'
                fallback={<MailIcon size={16} className='text-default-500' />}
              />
            </a>
          </Tooltip>
        </div>

        <div className='flex flex-col gap-1 text-xs text-default-400'>
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

      {/* Divider */}
      <div className='my-3 h-px w-3/4 bg-default-200' />

      {/* Adjacent posts navigation */}
      <div className='flex flex-col gap-3'>
        {newerPost && (
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] uppercase tracking-wider text-default-400'>
              Previous Article
            </span>
            <Tooltip content={newerPost.title} size='sm' delay={500} classNames={{ content: 'max-w-48' }}>
              <Link
                href={`/posts/${newerPost.postId}`}
                className='line-clamp-2 text-xs text-default-600 transition-colors hover:text-primary'
              >
                {newerPost.title}
              </Link>
            </Tooltip>
          </div>
        )}
        {olderPost && (
          <div className='flex flex-col gap-1'>
            <span className='text-[10px] uppercase tracking-wider text-default-400'>
              Next Article
            </span>
            <Tooltip content={olderPost.title} size='sm' delay={500} classNames={{ content: 'max-w-48' }}>
              <Link
                href={`/posts/${olderPost.postId}`}
                className='line-clamp-2 text-xs text-default-600 transition-colors hover:text-primary'
              >
                {olderPost.title}
              </Link>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Divider + Back */}
      <div className='my-3 h-px w-3/4 bg-default-200' />

      <Link
        href='/posts'
        className='text-xs text-default-500 transition-colors hover:text-primary'
      >
        &larr; Back to posts
      </Link>
    </div>
  )
}
