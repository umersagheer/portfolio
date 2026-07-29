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

  // Radial glow layers removed for a flat, consistent identity across every
  // cover and promo. Just a clean vertical dark gradient + the grid.
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.surfaceStrong} 0%, ${colors.background} 45%, #020304 100%)`,
      }}
    >
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
      {children}
    </AbsoluteFill>
  )
}
