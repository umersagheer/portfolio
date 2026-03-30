import GithubIcon from '../../../components/icons/github'
import XIcon from '../../../components/icons/x'
import { brandSocials } from '../brand'
import { colors, fontFamily } from '../theme'

type SocialFooterProps = {
  style?: React.CSSProperties
}

const socialItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderRadius: 999,
  border: `1px solid ${colors.codeBorder}`,
  background: 'rgba(13, 17, 23, 0.78)',
  boxShadow: '0 10px 26px rgba(0, 0, 0, 0.32)',
}

const iconStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  fill: colors.foreground,
  color: colors.foreground,
  flexShrink: 0,
}

export const SocialFooter: React.FC<SocialFooterProps> = ({ style }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        ...style,
      }}
    >
      <div style={socialItemStyle}>
        <XIcon style={iconStyle} />
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 14,
            color: colors.muted,
          }}
        >
          {brandSocials.x.label}
        </span>
      </div>

      <div style={socialItemStyle}>
        <GithubIcon style={iconStyle} />
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 14,
            color: colors.muted,
          }}
        >
          {brandSocials.github.label}
        </span>
      </div>
    </div>
  )
}
