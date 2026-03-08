import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { colors, fontFamily } from '../theme'
import { BrandUnderline } from './BrandUnderline'

export const SceneTitle: React.FC<{
  text: string
  delay?: number
}> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 220, mass: 0.85 },
  })

  const underlineWidth = interpolate(frame - delay, [8, 28], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [26, 0])}px)`,
      }}
    >
      <h2
        style={{
          fontFamily: fontFamily.poppins,
          fontSize: 42,
          fontWeight: 700,
          color: colors.foreground,
          margin: 0,
          textAlign: 'center',
          letterSpacing: -1,
        }}
      >
        {text}
      </h2>
      <BrandUnderline width={`${underlineWidth}%`} maxWidth={240} />
    </div>
  )
}
