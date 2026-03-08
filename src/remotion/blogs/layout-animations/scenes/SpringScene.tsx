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

const presets = [
  { name: 'Bouncy', stiffness: 200, damping: 10, mass: 1, start: 15 },
  { name: 'Stiff', stiffness: 600, damping: 30, mass: 0.5, start: 50 },
  { name: 'Gentle', stiffness: 100, damping: 15, mass: 1.5, start: 85 },
]

const TRACK_LEFT = 80
const TRACK_WIDTH = 800
const BALL_SIZE = 50

export const SpringScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <Background showGrid={false}>
      <AbsoluteFill
        style={{
          padding: 60,
          alignItems: 'center',
        }}
      >
        <SceneTitle text="Spring Physics" />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 80,
            marginTop: 80,
            width: '100%',
          }}
        >
          {presets.map(({ name, stiffness, damping, mass, start }, i) => {
            const isActive = frame >= start
            const ballSpring = isActive
              ? spring({
                  frame: frame - start,
                  fps,
                  config: { stiffness, damping, mass },
                })
              : 0

            const ballX = interpolate(ballSpring, [0, 1], [0, TRACK_WIDTH - BALL_SIZE])

            const labelOpacity = interpolate(
              frame - start + 10,
              [0, 15],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )

            return (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  opacity: labelOpacity,
                }}
              >
                {/* Preset name + params */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '0 20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontFamily.poppins,
                      fontSize: 30,
                      fontWeight: 700,
                      color: isActive ? colors.foreground : colors.muted,
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontFamily: fontFamily.mono,
                      fontSize: 18,
                      color: colors.muted,
                    }}
                  >
                    {stiffness}/{damping}/{mass}
                  </span>
                </div>

                {/* Track */}
                <div
                  style={{
                    position: 'relative',
                    height: BALL_SIZE + 20,
                    marginLeft: 20,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: BALL_SIZE / 2 + 10 - 2,
                      left: 0,
                      width: TRACK_WIDTH,
                      height: 4,
                      background: colors.border,
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: ballX,
                      top: 10,
                      width: BALL_SIZE,
                      height: BALL_SIZE,
                      borderRadius: '50%',
                      background: colors.primary,
                      boxShadow: '0 4px 20px rgba(147, 83, 211, 0.4)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Parameter legend */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            opacity: interpolate(frame, [20, 35], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {['stiffness', 'damping', 'mass'].map(param => (
            <span
              key={param}
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 20,
                color: colors.muted,
                padding: '6px 14px',
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
              }}
            >
              {param}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    </Background>
  )
}
