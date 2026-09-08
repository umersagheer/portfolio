import { DotPattern } from '@/components/ui/dot-pattern'
import { cn } from 'tailwind-variants'

/**
 * A subtle twinkling-dots background layer for a demo "stage" panel — the same
 * DotPattern used across the site, kept faint so it reads as atmosphere, not
 * noise. Drop it as the first child of a `relative overflow-hidden` container.
 */
export default function StageDots({ className }: { className?: string }) {
  return (
    <DotPattern
      glow
      width={18}
      height={18}
      cr={1.15}
      className={cn(
        'text-default-400 pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent),linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect] opacity-70',
        className
      )}
    />
  )
}
