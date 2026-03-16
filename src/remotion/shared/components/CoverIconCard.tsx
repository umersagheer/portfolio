import { colors, fontFamily } from '../theme'

type CoverIconCardProps = {
  icon: React.ReactNode
  label?: string
  size?: number
  iconSize?: number
  accentColor?: string
}

export const CoverIconCard: React.FC<CoverIconCardProps> = ({
  icon,
  label,
  size = 44,
  iconSize = 26,
  accentColor = colors.primary,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <div
        style={{
          zIndex: 1,
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 11,
          border: '1px solid rgba(236, 237, 238, 0.12)',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(11, 13, 18, 0.72) 100%)',
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 24px rgba(0, 0, 0, 0.34), 0 0 12px ${accentColor}10`,
          backdropFilter: 'blur(14px)',
        }}
      >
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.foreground,
          }}
        >
          {icon}
        </div>
      </div>

      {label ? (
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 9,
            color: colors.muted,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}
