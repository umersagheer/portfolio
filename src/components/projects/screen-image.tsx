import Image, { getImageProps } from 'next/image'
import { preload } from 'react-dom'
import type { ProjectScreen } from '@/libs/projects'

type ScreenImageProps = {
  screen: ProjectScreen
  sizes: string
  priority?: boolean
}

// A screenshot, with its dark-theme twin when there is one. The twins swap in
// CSS via the `dark` class; both are lazy, so the hidden one is never fetched
// unless the theme flips. A prioritised pair preloads the twin that matches
// the system theme (the default), so the visible one is already in the cache
// when it lays out, without fetching both.
export default function ScreenImage({
  screen,
  sizes,
  priority = false
}: ScreenImageProps) {
  const className = 'h-full w-full object-cover object-top'

  if (!screen.srcDark) {
    return (
      <Image
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    )
  }

  if (priority) {
    for (const [src, scheme] of [
      [screen.src, 'light'],
      [screen.srcDark, 'dark']
    ]) {
      const { props } = getImageProps({
        src,
        alt: '',
        width: screen.width,
        height: screen.height,
        sizes
      })
      preload(props.src, {
        as: 'image',
        imageSrcSet: props.srcSet,
        imageSizes: props.sizes,
        fetchPriority: 'high',
        media: `(prefers-color-scheme: ${scheme})`
      })
    }
  }

  return (
    <>
      <Image
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={sizes}
        className={`${className} dark:hidden`}
      />
      <Image
        src={screen.srcDark}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={sizes}
        className={`${className} hidden dark:block`}
      />
    </>
  )
}
