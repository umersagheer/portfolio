import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { Background } from '../../../shared/components/Background'
import { CodeBlock } from '../../../shared/components/CodeBlock'
import { SceneTitle } from '../../../shared/components/SceneTitle'
import { colors, fontFamily } from '../../../shared/theme'

const BOX_COLORS = [colors.primary, colors.secondary, '#f31260']
const BOX_SIZE = 120

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const transformActive = frame > 50 && frame < 100
  const widthActive = frame > 100

  const transformScale = transformActive
    ? interpolate(frame, [50, 70, 85, 100], [1, 1.8, 1.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1

  const widthGrow = widthActive
    ? interpolate(frame, [100, 120, 135, 150], [1, 1.8, 1.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1

  const warningOpacity =
    transformActive
      ? interpolate(frame, [55, 65], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

  const goodOpacity =
    widthActive
      ? interpolate(frame, [105, 115], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0

  return (
    <Background showGrid={false}>
      <AbsoluteFill
        style={{
          padding: 60,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <SceneTitle text="Transform vs Layout" />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 60,
            marginTop: 80,
            width: '100%',
          }}
        >
          {/* Transform panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 24,
                color: colors.muted,
                textAlign: 'center',
              }}
            >
              Using transform
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                alignItems: 'center',
                height: BOX_SIZE + 40,
                position: 'relative',
              }}
            >
              {BOX_COLORS.map((color, i) => {
                const boxScale = spring({
                  frame: frame - i * 5,
                  fps,
                  config: { damping: 12, stiffness: 200 },
                })
                const isMiddle = i === 1
                return (
                  <div
                    key={i}
                    style={{
                      width: BOX_SIZE,
                      height: BOX_SIZE,
                      borderRadius: 16,
                      background: color,
                      transform: `scale(${boxScale * (isMiddle ? transformScale : 1)})`,
                      opacity: 0.9,
                      zIndex: isMiddle ? 2 : 1,
                    }}
                  />
                )
              })}
            </div>
            <div
              style={{
                fontFamily: fontFamily.poppins,
                fontSize: 20,
                color: colors.danger,
                textAlign: 'center',
                opacity: warningOpacity,
                fontWeight: 600,
              }}
            >
              Overlaps neighbors!
            </div>
          </div>

          {/* Width panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 24,
                color: colors.muted,
                textAlign: 'center',
              }}
            >
              Using width
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                alignItems: 'center',
                height: BOX_SIZE + 40,
              }}
            >
              {BOX_COLORS.map((color, i) => {
                const boxScale = spring({
                  frame: frame - i * 5,
                  fps,
                  config: { damping: 12, stiffness: 200 },
                })
                const isMiddle = i === 1
                return (
                  <div
                    key={i}
                    style={{
                      width: isMiddle ? BOX_SIZE * widthGrow : BOX_SIZE,
                      height: BOX_SIZE,
                      borderRadius: 16,
                      background: color,
                      transform: `scale(${boxScale})`,
                      opacity: 0.9,
                    }}
                  />
                )
              })}
            </div>
            <div
              style={{
                fontFamily: fontFamily.poppins,
                fontSize: 20,
                color: '#45d483',
                textAlign: 'center',
                opacity: goodOpacity,
                fontWeight: 600,
              }}
            >
              Pushes siblings — layout recalculation
            </div>
          </div>
        </div>

        <div style={{ marginTop: 50, width: '100%' }}>
          <CodeBlock
            code={`.box {\n  /* transform: cheap, GPU */\n  transform: scaleX(2);\n\n  /* width: triggers layout */\n  width: 200px;\n}`}
            delay={40}
            speed={2}
          />
        </div>
      </AbsoluteFill>
    </Background>
  )
}
