import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { Background } from '../../../shared/components/Background'
import { SceneTitle } from '../../../shared/components/SceneTitle'
import { colors, fontFamily, gradient } from '../../../shared/theme'

const CARD_W = 280
const CARD_H = 350
const DIALOG_W = 700
const DIALOG_H = 600
const CARD_FONT = 24
const DIALOG_FONT = 36

export const MorphingScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Timeline: 0-25 card enters, 25-35 tap indicator, 35-60 morph to dialog,
  // 60-90 hold dialog, 90-110 morph back, 110-120 tagline
  const cardEnter = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  })

  const morphForward =
    frame >= 35
      ? spring({
          frame: frame - 35,
          fps,
          config: { stiffness: 350, damping: 30 },
        })
      : 0

  const morphBack =
    frame >= 90
      ? spring({
          frame: frame - 90,
          fps,
          config: { stiffness: 350, damping: 30 },
        })
      : 0

  const morphProgress = morphForward - morphBack

  const currentW = interpolate(morphProgress, [0, 1], [CARD_W, DIALOG_W])
  const currentH = interpolate(morphProgress, [0, 1], [CARD_H, DIALOG_H])
  const currentFont = interpolate(morphProgress, [0, 1], [CARD_FONT, DIALOG_FONT])

  const backdropOpacity = interpolate(morphProgress, [0, 1], [0, 0.6])

  const tapPulse =
    frame >= 25 && frame < 35
      ? 0.5 + 0.5 * Math.sin((frame - 25) * 0.8)
      : 0

  const taglineOpacity = interpolate(frame, [105, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Background showGrid={false}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ marginTop: -200 }}>
          <SceneTitle text="Morphing Dialog" />
        </div>

        {/* Backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            opacity: backdropOpacity,
          }}
        />

        {/* Morphing card/dialog */}
        <div
          style={{
            width: currentW,
            height: currentH,
            borderRadius: 24,
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            overflow: 'hidden',
            transform: `scale(${cardEnter})`,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        >
          {/* Gradient header */}
          <div
            style={{
              height: interpolate(morphProgress, [0, 1], [120, 200]),
              background: gradient,
              flexShrink: 0,
            }}
          />

          {/* Content */}
          <div
            style={{
              padding: interpolate(morphProgress, [0, 1], [20, 32]),
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily.poppins,
                fontSize: currentFont,
                fontWeight: 700,
                color: colors.foreground,
              }}
            >
              Project Title
            </div>
            <div
              style={{
                fontFamily: fontFamily.poppins,
                fontSize: interpolate(morphProgress, [0, 1], [16, 22]),
                color: colors.muted,
                lineHeight: 1.5,
              }}
            >
              A brief description of the project that expands when the dialog opens.
            </div>
          </div>
        </div>

        {/* Tap indicator */}
        {tapPulse > 0 && (
          <div
            style={{
              position: 'absolute',
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: `2px solid ${colors.primary}`,
              opacity: tapPulse,
              transform: `scale(${1 + tapPulse * 0.3})`,
              zIndex: 20,
            }}
          />
        )}

        {/* Tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 200,
            fontFamily: fontFamily.poppins,
            fontSize: 28,
            fontWeight: 600,
            color: colors.foreground,
            opacity: taglineOpacity,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          One component, two states
        </div>
      </AbsoluteFill>
    </Background>
  )
}
