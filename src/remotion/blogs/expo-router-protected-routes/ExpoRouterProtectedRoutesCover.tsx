import { AbsoluteFill, Img, staticFile } from 'remotion'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { SocialFooter } from '../../shared/components/SocialFooter'
import { colors, fontFamily } from '../../shared/theme'
import { expoRouterProtectedRoutesCoverContent } from './config'
import {
  IconAlertTriangle,
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
  IconLock
} from '@tabler/icons-react'

const statusColors = {
  primary: {
    background: 'rgba(147, 83, 211, 0.16)',
    border: 'rgba(174, 126, 222, 0.28)',
    text: colors.primaryLight
  },
  success: {
    background: 'rgba(23, 201, 100, 0.12)',
    border: 'rgba(23, 201, 100, 0.24)',
    text: colors.success
  },
  warning: {
    background: 'rgba(245, 165, 36, 0.12)',
    border: 'rgba(245, 165, 36, 0.24)',
    text: colors.warning
  },
  neutral: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: 'rgba(236, 237, 238, 0.65)'
  }
} as const

const ExplorerRow: React.FC<{
  depth: number
  label: string
  kind: 'file' | 'folder'
  expanded?: boolean
  active?: boolean
  accent?: keyof typeof statusColors
  badge?: string
  callout?: string
  calloutTone?: keyof typeof statusColors
  icon?: React.ReactNode
}> = ({
  depth,
  label,
  kind,
  expanded = false,
  active = false,
  accent = 'neutral',
  badge,
  callout,
  calloutTone = 'neutral',
  icon
}) => {
  const accentColors = statusColors[accent]
  const calloutColors = statusColors[calloutTone]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '450px 1fr',
        gap: 18,
        alignItems: 'center'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: 34,
          paddingLeft: 12 + depth * 26,
          paddingRight: 12,
          gap: 8,
          borderRadius: 12,
          background: active ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          border: active
            ? '1px solid rgba(255, 255, 255, 0.06)'
            : '1px solid transparent'
        }}
      >
        {Array.from({ length: depth }).map((_, index) => (
          <div
            key={`${label}-guide-${index}`}
            style={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: 28 + index * 26,
              width: 1,
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 999
            }}
          />
        ))}

        {kind === 'folder' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'rgba(236, 237, 238, 0.72)'
            }}
          >
            <IconChevronRight
              size={12}
              style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
            {expanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />}
          </div>
        ) : (
          <>
            <div style={{ width: 12 }} />
            <IconFile size={16} color='rgba(236, 237, 238, 0.58)' />
          </>
        )}

        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 20,
            color: active ? colors.foreground : 'rgba(236, 237, 238, 0.86)'
          }}
        >
          {label}
        </span>

        {badge && (
          <div
            style={{
              marginLeft: 10,
              padding: '5px 11px',
              borderRadius: 999,
              border: `1px solid ${accentColors.border}`,
              background: accentColors.background,
              color: accentColors.text,
              fontFamily: fontFamily.mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.25
            }}
          >
            {badge}
          </div>
        )}
      </div>

      {callout ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <div
            style={{
              height: 1,
              flex: 1,
              background: calloutColors.border
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              color: calloutColors.text,
              fontFamily: fontFamily.poppins,
              fontSize: 15,
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            {icon}
            <span>{callout}</span>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  )
}

const ToggleCard: React.FC<{
  label: string
  sublabel: string
  color: string
}> = ({ label, sublabel, color }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 14,
        border: `1px solid ${colors.codeBorder}`,
        background: 'rgba(255, 255, 255, 0.04)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 15,
            fontWeight: 700,
            color: colors.foreground
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 11,
            color: 'rgba(236, 237, 238, 0.6)'
          }}
        >
          {sublabel}
        </span>
      </div>

      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: color,
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            right: 3,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: colors.white
          }}
        />
      </div>
    </div>
  )
}

export const ExpoRouterProtectedRoutesCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      <div
        style={{
          position: 'absolute',
          top: 34,
          right: 42,
          width: 672,
          height: 552
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: 28,
            border: `1px solid ${colors.codeBorder}`,
            background: `linear-gradient(180deg, ${colors.surfaceStrong} 0%, ${colors.background} 38%, #020304 100%)`,
            overflow: 'hidden',
            boxShadow: '0 22px 60px rgba(0, 0, 0, 0.42)',
            width: '100%',
            height: '100%'
          }}
        >
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 24% 20%, rgba(147, 83, 211, 0.18) 0%, transparent 42%)'
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 78% 16%, rgba(255, 255, 255, 0.08) 0%, transparent 28%)'
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 50% 85%, rgba(51, 142, 247, 0.12) 0%, transparent 42%)',
              opacity: 0.55
            }}
          />
          <AbsoluteFill
            style={{
              opacity: 0.12,
              backgroundImage: `
                linear-gradient(${colors.border} 1px, transparent 1px),
                linear-gradient(90deg, ${colors.border} 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.38) 100%)'
            }}
          />

          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              padding: '18px 20px 18px',
              height: '100%'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.2)'
                  }}
                />
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 12,
                    color: 'rgba(236, 237, 238, 0.5)',
                    letterSpacing: 0.3
                  }}
                >
                  Auth Routing Visualizer
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10
              }}
            >
              <ToggleCard
                label='Signed in'
                sublabel='session exists'
                color='rgba(147, 83, 211, 0.88)'
              />
              <ToggleCard
                label='Onboarded'
                sublabel='profile completed'
                color='rgba(23, 201, 100, 0.88)'
              />
            </div>

            <div
              style={{
                flex: 1,
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.018)',
                padding: '16px 16px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <ExplorerRow
                depth={0}
                label='app'
                kind='folder'
                expanded
                accent='neutral'
              />
              <ExplorerRow
                depth={1}
                label='_layout.tsx'
                kind='file'
                active
                accent='primary'
                calloutTone='primary'
              />
              <ExplorerRow depth={1} label='(auth)' kind='folder' expanded />
              <ExplorerRow depth={2} label='sign-in.tsx' kind='file' />
              <ExplorerRow
                depth={1}
                label='(onboarding)'
                kind='folder'
                expanded
              />
              <ExplorerRow depth={2} label='index.tsx' kind='file' />
              <ExplorerRow
                depth={1}
                label='(app)'
                kind='folder'
                expanded
                active
                accent='success'
                badge='ACTIVE'
              />
              <ExplorerRow
                depth={2}
                label='_layout.tsx'
                kind='file'
                badge='guarded'
                accent='success'
              />
              <ExplorerRow
                depth={2}
                label='index.tsx'
                kind='file'
                badge='home'
                accent='success'
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 13px',
                  borderRadius: 16,
                  border: `1px solid ${statusColors.success.border}`,
                  background: statusColors.success.background,
                  color: statusColors.success.text,
                  fontFamily: fontFamily.poppins,
                  fontSize: 15,
                  fontWeight: 700
                }}
              >
                <IconLock size={15} />
                No redirect flash
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 13px',
                  borderRadius: 16,
                  border: `1px solid ${statusColors.warning.border}`,
                  background: statusColors.warning.background,
                  color: statusColors.warning.text,
                  fontFamily: fontFamily.poppins,
                  fontSize: 15,
                  fontWeight: 700
                }}
              >
                <IconAlertTriangle size={15} />
                useEffect can blink
              </div>
            </div>
          </div>
        </div>
      </div>

      <AbsoluteFill
        style={{
          padding: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 50
          }}
        >
          <Img
            src={staticFile('logos/US-dark.svg')}
            style={{ width: 30, height: 30 }}
          />
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: fontFamily.poppins,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.04,
            color: colors.foreground,
            whiteSpace: 'pre-wrap',
            maxWidth: 430
          }}
        >
          {expoRouterProtectedRoutesCoverContent.title}
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 20,
            color: colors.muted,
            marginTop: 14,
            maxWidth: 420,
            lineHeight: 1.36,
            whiteSpace: 'pre-wrap'
          }}
        >
          {expoRouterProtectedRoutesCoverContent.subtitle}
        </div>

        <SocialFooter
          style={{
            position: 'absolute',
            bottom: 34,
            right: 50
          }}
        />
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
