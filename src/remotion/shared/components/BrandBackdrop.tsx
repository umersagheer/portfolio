import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { colors } from '../theme'

export const BrandBackdrop: React.FC<{
  children?: React.ReactNode
  showGrid?: boolean
}> = ({ children, showGrid = true }) => {
  const frame = useCurrentFrame()

  const gridOpacity = showGrid
    ? interpolate(frame, [0, 30], [0.04, 0.14], {
        extrapolateRight: 'clamp',
      })
    : 0

  const glowScale = interpolate(frame, [0, 120], [0.96, 1.04], {
    extrapolateRight: 'clamp',
  })

  const topGlowOpacity = interpolate(frame, [0, 40], [0.22, 0.3], {
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.surfaceStrong} 0%, ${colors.background} 38%, #020304 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 24% 20%, rgba(147, 83, 211, 0.18) 0%, transparent 42%)',
          opacity: topGlowOpacity,
          transform: `scale(${glowScale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 78% 16%, rgba(255, 255, 255, 0.08) 0%, transparent 28%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 85%, rgba(51, 142, 247, 0.12) 0%, transparent 42%)',
          opacity: 0.55,
        }}
      />
      {showGrid && (
        <AbsoluteFill
          style={{
            opacity: gridOpacity,
            backgroundImage: `
              linear-gradient(${colors.border} 1px, transparent 1px),
              linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.42) 100%)',
        }}
      />
      {children}
    </AbsoluteFill>
  )
}
