import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { Background } from '../../../shared/components/Background'
import { SceneTitle } from '../../../shared/components/SceneTitle'
import { colors, fontFamily } from '../../../shared/theme'

const STEPS = [
  { letter: 'F', label: 'First', start: 20 },
  { letter: 'L', label: 'Last', start: 50 },
  { letter: 'I', label: 'Invert', start: 80 },
  { letter: 'P', label: 'Play', start: 105 },
]

const START_X = 140
const END_X = 700
const BOX_START_W = 120
const BOX_END_W = 200
const BOX_Y = 750

export const FlipScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Determine box position based on FLIP step
  let boxX = START_X
  let boxW = BOX_START_W

  if (frame >= 50 && frame < 80) {
    // L: instant teleport to end
    boxX = END_X
    boxW = BOX_END_W
  } else if (frame >= 80 && frame < 105) {
    // I: visually snap back to start (invert)
    boxX = START_X
    boxW = BOX_START_W
  } else if (frame >= 105) {
    // P: spring animate to end
    const springVal = spring({
      frame: frame - 105,
      fps,
      config: { damping: 15, stiffness: 200 },
    })
    boxX = interpolate(springVal, [0, 1], [START_X, END_X])
    boxW = interpolate(springVal, [0, 1], [BOX_START_W, BOX_END_W])
  }

  // Ghost trails during Play step
  const showGhosts = frame >= 105 && frame < 135
  const ghostCount = 3

  return (
    <Background showGrid={false}>
      <AbsoluteFill
        style={{
          padding: 60,
          alignItems: 'center',
        }}
      >
        <SceneTitle text="The FLIP Technique" />

        {/* Letter badges */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 60,
          }}
        >
          {STEPS.map(({ letter, label, start }) => {
            const isActive = frame >= start
            const badgeScale = isActive
              ? spring({
                  frame: frame - start,
                  fps,
                  config: { damping: 12, stiffness: 300 },
                })
              : 0.8

            return (
              <div
                key={letter}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transform: `scale(${badgeScale})`,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: isActive ? colors.primary : colors.border,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: fontFamily.poppins,
                    fontSize: 36,
                    fontWeight: 800,
                    color: isActive ? '#fff' : colors.muted,
                    boxShadow: isActive
                      ? '0 4px 24px rgba(147, 83, 211, 0.4)'
                      : 'none',
                  }}
                >
                  {letter}
                </div>
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 18,
                    color: isActive ? colors.foreground : colors.muted,
                  }}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Animation track */}
        <div
          style={{
            position: 'absolute',
            top: BOX_Y - 20,
            left: 60,
            right: 60,
            height: 200,
          }}
        >
          {/* Track line */}
          <div
            style={{
              position: 'absolute',
              top: 70,
              left: 100,
              right: 100,
              height: 3,
              background: colors.border,
              borderRadius: 2,
            }}
          />

          {/* Ghost outlines for start/end positions */}
          <div
            style={{
              position: 'absolute',
              left: START_X,
              top: 0,
              width: BOX_START_W,
              height: 140,
              borderRadius: 16,
              border: `2px dashed ${colors.border}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: END_X,
              top: 0,
              width: BOX_END_W,
              height: 140,
              borderRadius: 16,
              border: `2px dashed ${colors.border}`,
            }}
          />

          {/* Ghost trails */}
          {showGhosts &&
            Array.from({ length: ghostCount }).map((_, i) => {
              const ghostProgress = interpolate(
                frame - 105,
                [0, 30],
                [0, 1],
                { extrapolateRight: 'clamp' }
              )
              const ghostX = interpolate(
                ghostProgress * ((i + 1) / (ghostCount + 1)),
                [0, 1],
                [START_X, END_X]
              )
              const ghostW = interpolate(
                ghostProgress * ((i + 1) / (ghostCount + 1)),
                [0, 1],
                [BOX_START_W, BOX_END_W]
              )
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: ghostX,
                    top: 0,
                    width: ghostW,
                    height: 140,
                    borderRadius: 16,
                    background: colors.primary,
                    opacity: 0.15 - i * 0.03,
                  }}
                />
              )
            })}

          {/* Main box */}
          <div
            style={{
              position: 'absolute',
              left: boxX,
              top: 0,
              width: boxW,
              height: 140,
              borderRadius: 16,
              background: colors.primary,
              boxShadow: '0 8px 32px rgba(147, 83, 211, 0.3)',
            }}
          />

          {/* Step narration */}
          {STEPS.map(({ start, label }, i) => {
            const nextStart = STEPS[i + 1]?.start ?? 150
            const isVisible = frame >= start && frame < nextStart
            const narrationOpacity = isVisible
              ? interpolate(frame - start, [0, 10], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 0

            const descriptions = [
              'Measure current position',
              'Apply layout change instantly',
              'Apply inverse transform',
              'Animate to final position',
            ]

            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  top: 170,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  fontFamily: fontFamily.poppins,
                  fontSize: 26,
                  color: colors.foreground,
                  opacity: narrationOpacity,
                  fontWeight: 600,
                }}
              >
                {descriptions[i]}
              </div>
            )
          })}
        </div>
      </AbsoluteFill>
    </Background>
  )
}
