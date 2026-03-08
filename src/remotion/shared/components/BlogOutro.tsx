import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { colors, fontFamily } from '../theme'
import { BrandUnderline } from './BrandUnderline'

export const BlogOutro: React.FC<{
  ctaLabel: string
  title: string
  url: string
  message?: string
}> = ({ ctaLabel, title, url, message }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const badgeProgress = spring({
    frame: frame - 4,
    fps,
    config: { damping: 18, stiffness: 220 },
  })

  const titleChars = Math.min(
    title.length,
    Math.max(0, Math.floor((frame - 8) * 1.35))
  )
  const visibleTitle = title.slice(0, titleChars)
  const typingDone = titleChars >= title.length
  const cursorOpacity =
    frame >= 44
      ? 0
      : !typingDone
        ? 1
        : interpolate(frame % 20, [0, 9, 10, 19], [1, 1, 0, 0])

  const messageOpacity = interpolate(frame, [34, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const messageY = interpolate(frame, [34, 50], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const urlOpacity = interpolate(frame, [48, 66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const urlY = interpolate(frame, [48, 66], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const underlineWidth = interpolate(frame, [58, 82], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const logoScale = spring({
    frame: frame - 68,
    fps,
    config: { damping: 15, stiffness: 180 },
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 26,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(badgeProgress, [0, 1], [18, 0])}px) scale(${badgeProgress})`,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            padding: '14px 22px',
            borderRadius: 999,
            background: 'rgba(11, 13, 18, 0.9)',
            border: '1px solid rgba(236, 237, 238, 0.12)',
            boxShadow: '0 18px 60px rgba(0, 0, 0, 0.35)',
          }}
        >
          <span
            style={{
              fontFamily: fontFamily.poppins,
              fontSize: 26,
              fontWeight: 700,
              color: colors.white,
            }}
          >
            {ctaLabel}
          </span>
        </div>
      </div>

      <div
        style={{
          fontFamily: fontFamily.poppins,
          fontSize: 70,
          fontWeight: 900,
          color: colors.foreground,
          textAlign: 'center',
          minHeight: 90,
          letterSpacing: -2,
        }}
      >
        {visibleTitle}
        {frame < 44 && (
          <span
            style={{
              color: colors.white,
              opacity: cursorOpacity,
            }}
          >
            |
          </span>
        )}
      </div>

      {message ? (
        <div
          style={{
            maxWidth: 620,
            textAlign: 'center',
            fontFamily: fontFamily.poppins,
            fontSize: 22,
            lineHeight: 1.5,
            fontWeight: 500,
            color: colors.muted,
            opacity: messageOpacity,
            transform: `translateY(${messageY}px)`,
          }}
        >
          {message}
        </div>
      ) : null}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: urlOpacity,
          transform: `translateY(${urlY}px) scale(${0.96 + urlOpacity * 0.04})`,
        }}
      >
        <div
          style={{
            padding: '18px 28px',
            borderRadius: 28,
            background:
              'linear-gradient(180deg, rgba(23, 26, 33, 0.96) 0%, rgba(11, 13, 18, 0.96) 100%)',
            border: '1px solid rgba(236, 237, 238, 0.12)',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.45)',
          }}
        >
          <span
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 22,
              color: 'rgba(236, 237, 238, 0.94)',
            }}
          >
            {url}
          </span>
        </div>
        <BrandUnderline width={`${underlineWidth}%`} maxWidth={320} height={3} />
      </div>

      <div
        style={{
          marginTop: 30,
          transform: `scale(${Math.max(0, logoScale)})`,
        }}
      >
        <Img
          src={staticFile('logos/US-dark.svg')}
          style={{ width: 120, height: 120 }}
        />
      </div>
    </div>
  )
}
