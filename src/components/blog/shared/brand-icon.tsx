'use client'

import TheSvgIcon from './the-svg-icon'

type BrandSlug = 'drizzle' | 'postgresql' | 'prisma' | 'typeorm'

type BrandIconProps = {
  alt?: string
  className?: string
  size?: number
  slug: BrandSlug
  variant?: string
}

const BRAND_ICON_META: Record<
  BrandSlug,
  {
    title: string
    variants: {
      dark: string
      light: string
    }
  }
> = {
  drizzle: {
    title: 'Drizzle',
    variants: {
      dark: 'default',
      light: 'default'
    }
  },
  postgresql: {
    title: 'PostgreSQL',
    variants: {
      dark: 'default',
      light: 'default'
    }
  },
  prisma: {
    title: 'Prisma',
    variants: {
      dark: 'dark',
      light: 'light'
    }
  },
  typeorm: {
    title: 'TypeORM',
    variants: {
      dark: 'default',
      light: 'default'
    }
  }
}

export default function BrandIcon({
  alt,
  className,
  size = 18,
  slug,
  variant
}: BrandIconProps) {
  const brandMeta = BRAND_ICON_META[slug]

  return (
    <TheSvgIcon
      slug={slug}
      alt={alt ?? brandMeta.title}
      className={className}
      size={size}
      variant={variant}
      lightVariant={brandMeta.variants.light}
      darkVariant={brandMeta.variants.dark}
    />
  )
}
