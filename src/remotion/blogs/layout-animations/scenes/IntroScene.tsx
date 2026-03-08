import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { Background } from '../../../shared/components/Background'
import { BrandUnderline } from '../../../shared/components/BrandUnderline'
import { colors, fontFamily } from '../../../shared/theme'
import type { LayoutAnimationsPromoProps } from '../config'

type IntroSceneProps = Pick<
  LayoutAnimationsPromoProps,
  'title' | 'subtitle' | 'author'
>

const introTabs = ['Home', 'Blog', 'Docs']
const tabWidth = 92
const tabGap = 8
const tabInnerPadding = 8

export const IntroScene: React.FC<IntroSceneProps> = ({
  title,
  subtitle,
  author,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.8 },
  })

  const subtitleOpacity = interpolate(frame, [48, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const subtitleY = interpolate(frame, [48, 72], [22, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const lineWidth = interpolate(frame, [54, 84], [0, 420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const authorOpacity = interpolate(frame, [72, 94], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const cardProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 170 },
  })

  const indicatorProgress = spring({
    frame: frame - 28,
    fps,
    durationInFrames: 34,
    config: { damping: 24, stiffness: 260 },
  })

  const indicatorX = interpolate(
    indicatorProgress,
    [0, 1],
    [tabInnerPadding, tabInnerPadding + tabWidth + tabGap],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )
  const activeIndex = indicatorProgress > 0.55 ? 1 : 0
  const heroTitle = title.split(' ').join('\n')

  return (
    <Background showGrid>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 208,
            left: 70,
            padding: 18,
            borderRadius: 26,
            background: 'rgba(13, 17, 23, 0.88)',
            border: '1px solid rgba(236, 237, 238, 0.08)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
            transform: `translateY(${interpolate(cardProgress, [0, 1], [36, 0])}px) rotate(-8deg)`,
            opacity: interpolate(frame, [20, 46], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            {['F', 'L', 'I', 'P'].map(letter => (
              <div
                key={letter}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontFamily.poppins,
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.white,
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: fontFamily.mono,
              fontSize: 16,
              color: colors.muted,
            }}
          >
            Measure. Invert. Animate.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 236,
            right: 72,
            padding: 18,
            borderRadius: 28,
            background: 'rgba(13, 17, 23, 0.88)',
            border: '1px solid rgba(236, 237, 238, 0.08)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
            transform: `translateY(${interpolate(cardProgress, [0, 1], [44, 0])}px) rotate(7deg)`,
            opacity: interpolate(frame, [28, 54], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              gap: tabGap,
              padding: tabInnerPadding,
              borderRadius: 20,
              background: colors.surfaceStrong,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: tabInnerPadding,
                left: indicatorX,
                width: tabWidth,
                height: 44,
                borderRadius: 14,
                background: 'rgba(236, 237, 238, 0.95)',
                boxShadow: '0 10px 24px rgba(255, 255, 255, 0.14)',
              }}
            />
            {introTabs.map((tab, index) => (
              <div
                key={tab}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: tabWidth,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontFamily.poppins,
                  fontSize: 16,
                  fontWeight: 700,
                  color:
                    activeIndex === index
                      ? colors.surfaceStrong
                      : colors.foreground,
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: fontFamily.mono,
              fontSize: 16,
              color: colors.muted,
              textAlign: 'center',
            }}
          >
            shared element transitions
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 845,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
            transform: `scale(${titleScale})`,
          }}
        >
          <div
            style={{
              fontFamily: fontFamily.poppins,
              fontSize: 88,
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.04,
              color: colors.foreground,
              padding: '0 20px',
              whiteSpace: 'pre-wrap',
              letterSpacing: -3,
            }}
          >
            {heroTitle}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 1108,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <BrandUnderline width={lineWidth} maxWidth={420} />

          <div
            style={{
              fontFamily: fontFamily.poppins,
              fontSize: 32,
              fontWeight: 600,
              color: colors.foreground,
              textAlign: 'center',
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>

          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 22,
              color: colors.muted,
              opacity: authorOpacity,
            }}
          >
            {author}
          </div>
        </div>
      </AbsoluteFill>
    </Background>
  )
}
