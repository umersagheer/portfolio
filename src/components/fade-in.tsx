type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

// CSS-only entrance: runs without JavaScript, so content never waits on
// hydration, and only animates opacity/transform (compositor-friendly).
// Keyframes and the reduced-motion opt-out live in globals.css.
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={['animate-fade-in', className].filter(Boolean).join(' ')}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
