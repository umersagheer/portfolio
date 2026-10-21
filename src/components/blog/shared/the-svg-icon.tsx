'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@heroui/react'

type TheSvgIconProps = {
  alt?: string
  className?: string
  darkVariant?: string
  fallback?: ReactNode
  lightVariant?: string
  size?: number
  slug: string
  variant?: string
}

// Pinned to a commit: jsDelivr serves commit URLs as immutable (cached for a
// year, vs 7 days on @main) and upstream changes can't alter the site. Bump
// it deliberately when new icons are needed.
const THESVG_COMMIT = '8d07be9f43d70ea6d66b7a10ab02f27d1f9bacd6'

function getTheSvgIconUrl(slug: string, variant: string) {
  return `https://cdn.jsdelivr.net/gh/glincker/thesvg@${THESVG_COMMIT}/public/icons/${slug}/${variant}.svg`
}

export default function TheSvgIcon({
  alt = '',
  className,
  darkVariant = 'default',
  fallback = null,
  lightVariant = 'default',
  size = 18,
  slug,
  variant
}: TheSvgIconProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <>{fallback}</>
  }

  // Icons are decorative by default (alt=''): a visible label or the parent
  // link's aria-label already names them.
  const imageProps = {
    unoptimized: true,
    width: size,
    height: size,
    style: { width: size, height: 'auto' },
    onError: () => setHasError(true)
  }

  if (variant || lightVariant === darkVariant) {
    return (
      <Image
        {...imageProps}
        alt={alt}
        src={getTheSvgIconUrl(slug, variant ?? lightVariant)}
        className={cn('shrink-0', className)}
      />
    )
  }

  // Theme-specific files swap in CSS via the `dark` class, not in JS: no
  // post-hydration src change, refetch or flash. Both are lazy, and a
  // display:none lazy image isn't fetched until the theme flips to it.
  return (
    <>
      <Image
        {...imageProps}
        alt={alt}
        src={getTheSvgIconUrl(slug, lightVariant)}
        className={cn('shrink-0 dark:hidden', className)}
      />
      <Image
        {...imageProps}
        alt={alt}
        src={getTheSvgIconUrl(slug, darkVariant)}
        className={cn('hidden shrink-0 dark:block', className)}
      />
    </>
  )
}
