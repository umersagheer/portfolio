'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@heroui/react'
import { useTheme } from 'next-themes'

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

function getTheSvgIconUrl(slug: string, variant: string) {
  return `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/${variant}.svg`
}

export default function TheSvgIcon({
  alt,
  className,
  darkVariant = 'default',
  fallback = null,
  lightVariant = 'default',
  size = 18,
  slug,
  variant
}: TheSvgIconProps) {
  const { resolvedTheme } = useTheme()
  const [hasError, setHasError] = useState(false)

  const themeVariant = resolvedTheme === 'dark' ? darkVariant : lightVariant
  const iconVariant = variant ?? themeVariant
  const src = getTheSvgIconUrl(slug, iconVariant)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError) {
    return <>{fallback}</>
  }

  return (
    <Image
      unoptimized
      src={src}
      alt={alt ?? slug}
      width={size}
      height={size}
      style={{ width: size, height: 'auto' }}
      className={cn('shrink-0', className)}
      onError={() => setHasError(true)}
    />
  )
}
