import { AbsoluteFill } from 'remotion'
import { useId } from 'react'

type DotPatternProps = {
  width: number
  height: number
  gap?: number
  radius?: number
  opacity?: number
  dotColor?: string
  glowColor?: string
}

export const DotPattern: React.FC<DotPatternProps> = ({
  width,
  height,
  gap = 16,
  radius = 1.05,
  opacity = 0.48,
  dotColor = 'rgba(255, 255, 255, 0.22)',
  glowColor = 'rgba(147, 83, 211, 0.5)',
}) => {
  const gradientId = useId().replace(/:/g, '')

  const columns = Math.ceil(width / gap) + 1
  const rows = Math.ceil(height / gap) + 1

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='none'
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id={gradientId}>
            <stop offset='0%' stopColor={glowColor} stopOpacity='0.78' />
            <stop offset='35%' stopColor={dotColor} stopOpacity='0.95' />
            <stop offset='100%' stopColor={dotColor} stopOpacity='0' />
          </radialGradient>
        </defs>

        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: columns }).map((_, column) => (
            <circle
              key={`${row}-${column}`}
              cx={column * gap + gap / 2}
              cy={row * gap + gap / 2}
              r={radius}
              fill={`url(#${gradientId})`}
            />
          ))
        )}
      </svg>
    </AbsoluteFill>
  )
}
