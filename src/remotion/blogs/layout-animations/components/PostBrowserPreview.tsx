import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import {
  BookOpen,
  Clock3,
  FolderClosed,
  House,
  Mail,
  Monitor,
  Moon,
  Search,
  SunMedium,
} from 'lucide-react'
import { colors, fontFamily } from '../../../shared/theme'
import { layoutAnimationsPreviewContent } from '../config'

const themeIcons = [SunMedium, Moon, Monitor]
const navItems = [
  { label: 'Home', icon: House },
  { label: 'Posts', icon: BookOpen, active: true },
  { label: 'Projects', icon: FolderClosed },
  { label: 'Contact', icon: Mail },
]

type PostBrowserPreviewProps = {
  top?: number
  width?: number
  height?: number
  enterDelay?: number
  fromY?: number
  scaleFrom?: number
}

export const PostBrowserPreview: React.FC<PostBrowserPreviewProps> = ({
  top = 108,
  width = 420,
  height = 640,
  enterDelay = 6,
  fromY = 48,
  scaleFrom = 0.92,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const frameProgress = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 18, stiffness: 180 },
  })

  const chromeProgress = spring({
    frame: frame - (enterDelay + 10),
    fps,
    config: { damping: 20, stiffness: 220 },
  })

  const cardProgress = spring({
    frame: frame - (enterDelay + 18),
    fps,
    config: { damping: 20, stiffness: 210 },
  })

  const scrollProgress = interpolate(frame, [enterDelay + 38, enterDelay + 82], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        width,
        height,
        borderRadius: 42,
        overflow: 'hidden',
        background: 'rgba(9, 11, 16, 0.84)',
        border: '1px solid rgba(236, 237, 238, 0.1)',
        boxShadow: '0 28px 90px rgba(0, 0, 0, 0.4)',
        opacity: frameProgress,
        transform: `translateX(-50%) translateY(${interpolate(frameProgress, [0, 1], [fromY, 0])}px) scale(${scaleFrom + frameProgress * (1 - scaleFrom)})`,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8, 10, 14, 0.96) 0%, rgba(5, 7, 10, 0.98) 100%)',
        }}
      >
        <div
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            borderBottom: '1px solid rgba(236, 237, 238, 0.06)',
            fontFamily: fontFamily.mono,
            fontSize: 13,
            color: colors.muted,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map(index => (
              <div
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'rgba(236, 237, 238, 0.18)',
                }}
              />
            ))}
          </div>
          <div>{layoutAnimationsPreviewContent.footerDomain}</div>
          <div>preview</div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '24px 22px 22px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: chromeProgress,
              transform: `translateY(${interpolate(chromeProgress, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 4,
                padding: 4,
                borderRadius: 18,
                background: 'rgba(17, 19, 24, 0.96)',
                border: '1px solid rgba(236, 237, 238, 0.08)',
              }}
            >
              {themeIcons.map((Icon, index) => (
                <div
                  key={index}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      index === 2 ? 'rgba(236, 237, 238, 0.08)' : 'transparent',
                    color: index === 2 ? colors.foreground : colors.muted,
                  }}
                >
                  <Icon size={17} strokeWidth={2} />
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: 4,
                borderRadius: 22,
                background: 'rgba(17, 19, 24, 0.96)',
                border: '1px solid rgba(236, 237, 238, 0.08)',
              }}
            >
              {navItems.map(({ label, icon: Icon, active }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: active ? '10px 16px' : '10px 12px',
                    borderRadius: 16,
                    background: active
                      ? 'rgba(147, 83, 211, 0.24)'
                      : 'transparent',
                    color: active ? '#c88cff' : colors.muted,
                    fontFamily: fontFamily.poppins,
                    fontSize: active ? 15 : 0,
                    fontWeight: 600,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={16} strokeWidth={2.2} />
                  {active ? label : null}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              opacity: chromeProgress,
              transform: `translateY(${interpolate(chromeProgress, [0, 1], [14, 0])}px)`,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily.poppins,
                fontSize: 22,
                fontWeight: 800,
                color: colors.foreground,
              }}
            >
              {layoutAnimationsPreviewContent.sectionTitle}
            </div>
            <div
              style={{
                marginTop: 4,
                fontFamily: fontFamily.poppins,
                fontSize: 14,
                color: colors.foreground,
                opacity: 0.92,
              }}
            >
              {layoutAnimationsPreviewContent.searchLabel}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 56,
              padding: '0 18px',
              borderRadius: 18,
              background: 'rgba(236, 237, 238, 0.08)',
              color: colors.foreground,
              opacity: chromeProgress,
              transform: `translateY(${interpolate(chromeProgress, [0, 1], [14, 0])}px)`,
            }}
          >
            <Search size={20} strokeWidth={2.4} />
            <div
              style={{
                fontFamily: fontFamily.poppins,
                fontSize: 17,
                color: colors.foreground,
                opacity: 0.88,
              }}
            >
              Search by title...
            </div>
          </div>

          <div
            style={{
              borderRadius: 26,
              overflow: 'hidden',
              background: 'rgba(17, 19, 24, 0.96)',
              border: '1px solid rgba(236, 237, 238, 0.08)',
              boxShadow: '0 18px 54px rgba(0, 0, 0, 0.26)',
              opacity: cardProgress,
              transform: `translateY(${interpolate(cardProgress, [0, 1], [34, 0])}px) scale(${0.95 + cardProgress * 0.05})`,
            }}
          >
            <div style={{ position: 'relative', height: 250 }}>
              <Img
                src={staticFile(layoutAnimationsPreviewContent.coverImage)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(5, 7, 10, 0) 0%, rgba(5, 7, 10, 0.12) 100%)',
                }}
              />
            </div>

            <div
              style={{
                padding: '22px 22px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: 17,
                  lineHeight: 1.45,
                  color: colors.foreground,
                }}
              >
                {layoutAnimationsPreviewContent.cardTitle}
              </div>

              <div
                style={{
                  fontFamily: fontFamily.poppins,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: colors.muted,
                }}
              >
                {layoutAnimationsPreviewContent.cardSummary}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: fontFamily.poppins,
                  fontSize: 14,
                  color: colors.muted,
                }}
              >
                <span>{layoutAnimationsPreviewContent.publishedAt}</span>
                <span>·</span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Clock3 size={14} strokeWidth={2.2} />
                  {layoutAnimationsPreviewContent.readingTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            width: 64,
            height: 6,
            borderRadius: 999,
            background: 'rgba(236, 237, 238, 0.2)',
            transform: `translateX(-50%) translateY(${scrollProgress * 2}px)`,
          }}
        />
      </AbsoluteFill>
    </div>
  )
}
