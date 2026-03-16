import { AbsoluteFill } from 'remotion'
import { DotPattern } from './DotPattern'
import { colors } from '../theme'

type CoverPatternCardProps = {
  width: number
  height: number
  padding?: number | string
  style?: React.CSSProperties
  children: React.ReactNode
  dotGap?: number
  glowColor?: string
  showDots?: boolean
}

export const CoverPatternCard: React.FC<CoverPatternCardProps> = ({
  width,
  height,
  padding = 14,
  style,
  children,
  dotGap = 16,
  glowColor = 'rgba(147, 83, 211, 0.08)',
  showDots = false,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 15,
          border: `1px solid ${colors.codeBorder}`,
          background: 'rgba(13, 17, 23, 0.92)',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 68%)`,
            transform: 'scale(1.06)',
          }}
        />
        {showDots ? <DotPattern width={width} height={height} gap={dotGap} /> : null}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 42%, rgba(0, 0, 0, 0.1) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            padding,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
