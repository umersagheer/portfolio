import NextImage from 'next/image'
import React from 'react'
import { siteProfile } from '@/constants/site-profile'

export default function Intro() {
  return (
    <div className='flex flex-col items-start justify-center pb-12'>
      <div className='flex items-center justify-start gap-4'>
        <div className='size-20 shrink-0 overflow-hidden rounded-xl'>
          {/* Above the fold and the page's LCP element: sized to its 80px box
              and fetched eagerly. */}
          <NextImage
            src={siteProfile.avatar}
            alt={siteProfile.name}
            width={80}
            height={80}
            priority
            className='size-20 grayscale transition-transform duration-300 hover:scale-110'
          />
        </div>
        <div className=''>
          <h1 className='font-display text-4xl leading-tight sm:text-5xl'>
            {siteProfile.name}
          </h1>
          <p className='text-muted text-sm font-medium'>{siteProfile.role}</p>
        </div>
      </div>
      <div className='mt-6 max-w-2xl space-y-2'>
        <p className='font-sourceCodePro text-muted text-xs tracking-wide'>
          About
        </p>
        <p className='leading-relaxed'>
          Hi, I&apos;m a software engineer from Pakistan 🇵🇰, turning ideas into
          sleek web & mobile apps.
        </p>
      </div>
    </div>
  )
}
