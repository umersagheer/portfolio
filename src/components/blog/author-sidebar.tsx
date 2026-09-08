'use client'

import NextImage from 'next/image'
import Link from 'next/link'
import { Tooltip } from '@heroui/react'
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
    <div className='fixed top-24 right-[calc(50%+384px+1.5rem)] hidden w-48 xl:block'>
      {/* Author info */}
      <div className='flex flex-col gap-2'>
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

        <div className='-ml-1.5 flex items-center gap-0.5'>
          <Tooltip>
            <a
              href={siteProfile.socials.github.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='hover:bg-surface-secondary rounded-md p-1.5 transition-colors'
            >
              <TheSvgIcon slug='github' size={16} className='grayscale' />
            </a>

            <Tooltip.Content>GitHub</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <a
              href={siteProfile.socials.linkedin.url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='hover:bg-surface-secondary rounded-md p-1.5 transition-colors'
            >
              <TheSvgIcon slug='linkedin' size={16} className='grayscale' />
            </a>

            <Tooltip.Content>LinkedIn</Tooltip.Content>
          </Tooltip>
          <Tooltip>
            <a
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
            </a>

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

      {/* Divider */}
      <div className='bg-surface-tertiary my-3 h-px w-3/4' />

      {/* Adjacent posts navigation */}
      <div className='flex flex-col gap-3'>
        {newerPost && (
          <div className='flex flex-col gap-1'>
            <span className='text-muted text-[10px] tracking-wider uppercase'>
              Previous Article
            </span>
            <Tooltip delay={500}>
              <Link
                href={`/posts/${newerPost.postId}`}
                className='text-foreground hover:text-accent line-clamp-2 text-xs transition-colors'
              >
                {newerPost.title}
              </Link>

              <Tooltip.Content className='max-w-52 overflow-hidden p-0'>
                <div className='flex flex-col'>
                  {newerPost.image && (
                    <NextImage
                      src={newerPost.image}
                      alt={newerPost.title ?? ''}
                      width={208}
                      height={117}
                      className='aspect-video w-full rounded-none object-cover'
                    />
                  )}
                  <span className='px-2 py-1.5 text-xs'>{newerPost.title}</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
          </div>
        )}
        {olderPost && (
          <div className='flex flex-col gap-1'>
            <span className='text-muted text-[10px] tracking-wider uppercase'>
              Next Article
            </span>
            <Tooltip delay={500}>
              <Link
                href={`/posts/${olderPost.postId}`}
                className='text-foreground hover:text-accent line-clamp-2 text-xs transition-colors'
              >
                {olderPost.title}
              </Link>

              <Tooltip.Content className='max-w-52 overflow-hidden p-0'>
                <div className='flex flex-col'>
                  {olderPost.image && (
                    <NextImage
                      src={olderPost.image}
                      alt={olderPost.title ?? ''}
                      width={208}
                      height={117}
                      className='aspect-video w-full rounded-none object-cover'
                    />
                  )}
                  <span className='px-2 py-1.5 text-xs'>{olderPost.title}</span>
                </div>
              </Tooltip.Content>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Divider + Back */}
      <div className='bg-surface-tertiary my-3 h-px w-3/4' />

      <Link
        href='/posts'
        className='text-muted hover:text-accent text-xs transition-colors'
      >
        &larr; Back to posts
      </Link>
    </div>
  )
}
