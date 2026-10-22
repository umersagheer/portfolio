import Image from 'next/image'
import type { ProjectScreen } from '@/libs/projects'

type ScreenImageProps = {
  screen: ProjectScreen
  sizes: string
  priority?: boolean
}

// A screenshot, with its dark-theme twin when there is one. The twins swap in
// CSS via the `dark` class; both are lazy, so the hidden one is never fetched
// unless the theme flips. Single images can be prioritised (above the fold).
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
