import { interpolate, useCurrentFrame } from 'remotion'
import { colors, fontFamily } from '../theme'

export const CodeBlock: React.FC<{
  code: string
  delay?: number
  speed?: number
}> = ({ code, delay = 0, speed = 1.5 }) => {
  const frame = useCurrentFrame()

  const adjustedFrame = frame - delay
  const charsToShow = Math.max(
    0,
    Math.floor(adjustedFrame * speed)
  )
  const visibleCode = code.slice(0, charsToShow)
  const typingDone = charsToShow >= code.length
  const cursorOpacity = !typingDone
    ? 1
    : interpolate(adjustedFrame % 30, [0, 14, 15, 29], [1, 1, 0, 0])

  const opacity = interpolate(adjustedFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        background: colors.codeBg,
        border: `1px solid ${colors.codeBorder}`,
        borderRadius: 12,
        padding: '24px 28px',
        opacity,
        width: '100%',
      }}
    >
      <pre
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 22,
          color: colors.foreground,
          margin: 0,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {visibleCode}
        {adjustedFrame > 0 && (
          <span style={{ color: colors.primary, opacity: cursorOpacity }}>
            |
          </span>
        )}
      </pre>
    </div>
  )
}
