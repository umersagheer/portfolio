'use client'

import Image from 'next/image'
import { cn } from '@heroui/react'
import { useTheme } from 'next-themes'

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

function getBrandIconUrl(slug: BrandSlug, variant: string) {
    return `https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${slug}/${variant}.svg`
}

export default function BrandIcon({
    alt,
    className,
    size = 18,
    slug,
    variant
}: BrandIconProps) {
    const { resolvedTheme } = useTheme()
    const themeKey = resolvedTheme === 'dark' ? 'dark' : 'light'
    const brandMeta = BRAND_ICON_META[slug]
    const iconVariant = variant ?? brandMeta.variants[themeKey]

    return (
        <Image
            unoptimized
            src={getBrandIconUrl(slug, iconVariant)}
            alt={alt ?? brandMeta.title}
            width={size}
            height={size}
            style={{ width: size, height: 'auto' }}
            className={cn('shrink-0', className)}
        />
    )
}