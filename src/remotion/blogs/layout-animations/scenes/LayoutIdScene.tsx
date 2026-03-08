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

const tabs = ['Home', 'Blog', 'Docs', 'Contact']
const tabStops = [14, 30, 48, 66, 82] as const
const tabOrder = [0, 1, 2, 3, 1] as const
const tabWidth = 190
const tabGap = 14

const getIndicatorIndex = (frame: number, fps: number) => {
  if (frame < tabStops[0]) {
    return tabOrder[0]
  }

  for (let i = 0; i < tabStops.length - 1; i++) {
    const start = tabStops[i]
    const end = tabStops[i + 1]

    if (frame >= start && frame < end) {
      const progress = spring({
        frame: frame - start,
        fps,
        durationInFrames: end - start,
        config: { damping: 22, stiffness: 220 },
      })

      return interpolate(progress, [0, 1], [tabOrder[i], tabOrder[i + 1]])
    }
  }

  return tabOrder[tabOrder.length - 1]
}

export const LayoutIdScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const indicatorIndex = getIndicatorIndex(frame, fps)
  const activeTab = Math.round(indicatorIndex)
  const indicatorX = 8 + indicatorIndex * (tabWidth + tabGap)

  const cardProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 16, stiffness: 180 },
  })

  const labelOpacity = interpolate(frame, [12, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Background showGrid={false}>
      <AbsoluteFill
        style={{
          padding: 60,
          alignItems: 'center',
        }}
      >
        <SceneTitle text='layoutId Transitions' />

        <div
          style={{
            marginTop: 78,
            width: 920,
            padding: 28,
            borderRadius: 34,
            background: 'rgba(11, 13, 18, 0.82)',
            border: '1px solid rgba(236, 237, 238, 0.08)',
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.36)',
            transform: `translateY(${interpolate(cardProgress, [0, 1], [30, 0])}px) scale(${0.96 + cardProgress * 0.04})`,
            opacity: cardProgress,
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              gap: tabGap,
              padding: 8,
              borderRadius: 26,
              background: colors.surfaceStrong,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: indicatorX,
                width: tabWidth,
                height: 58,
                borderRadius: 18,
                background: 'rgba(236, 237, 238, 0.94)',
                boxShadow: '0 18px 36px rgba(255, 255, 255, 0.12)',
              }}
            />
            {tabs.map((tab, index) => (
              <div
                key={tab}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: tabWidth,
                  height: 58,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 18,
                  fontFamily: fontFamily.poppins,
                  fontSize: 18,
                  fontWeight: 700,
                  color:
                    activeTab === index ? colors.surfaceStrong : colors.foreground,
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 16,
            }}
          >
            {tabs.map((tab, index) => {
              const distance = Math.abs(indicatorIndex - index)
              const lift = Math.min(distance * 12, 22)
              const opacity = 1 - Math.min(distance * 0.18, 0.4)
              const scale = 1 - Math.min(distance * 0.05, 0.1)
              const isActive = activeTab === index

              return (
                <div
                  key={tab}
                  style={{
                    padding: 18,
                    borderRadius: 24,
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(23, 26, 33, 0.98) 0%, rgba(17, 19, 24, 0.98) 100%)'
                      : 'rgba(17, 19, 24, 0.82)',
                    border: isActive
                      ? '1px solid rgba(236, 237, 238, 0.16)'
                      : '1px solid rgba(236, 237, 238, 0.06)',
                    boxShadow: isActive
                      ? '0 18px 34px rgba(0, 0, 0, 0.26)'
                      : 'none',
                    transform: `translateY(${lift}px) scale(${scale})`,
                    opacity,
                  }}
                >
                  <div
                    style={{
                      height: 90,
                      borderRadius: 18,
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(147, 83, 211, 0.45), rgba(51, 142, 247, 0.3))'
                        : 'linear-gradient(135deg, rgba(147, 83, 211, 0.16), rgba(51, 142, 247, 0.08))',
                    }}
                  />
                  <div
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fontFamily.poppins,
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.foreground,
                      }}
                    >
                      {tab}
                    </div>
                    <div
                      style={{
                        height: 8,
                        width: isActive ? '78%' : '64%',
                        borderRadius: 999,
                        background: 'rgba(236, 237, 238, 0.12)',
                      }}
                    />
                    <div
                      style={{
                        height: 8,
                        width: isActive ? '62%' : '48%',
                        borderRadius: 999,
                        background: 'rgba(236, 237, 238, 0.08)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              border: '1px solid rgba(236, 237, 238, 0.08)',
              background: 'rgba(13, 17, 23, 0.72)',
              fontFamily: fontFamily.mono,
              fontSize: 18,
              color: colors.foreground,
            }}
          >
            {"layoutId='blog-tab-indicator'"}
          </div>
          <div
            style={{
              fontFamily: fontFamily.poppins,
              fontSize: 26,
              fontWeight: 600,
              color: colors.muted,
              textAlign: 'center',
            }}
          >
            One shared element, multiple destinations.
          </div>
        </div>
      </AbsoluteFill>
    </Background>
  )
}
