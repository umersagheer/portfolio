import { AbsoluteFill, Img, staticFile } from 'remotion'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { CoverPatternCard } from '../../shared/components/CoverPatternCard'
import { SocialFooter } from '../../shared/components/SocialFooter'
import { colors, fontFamily } from '../../shared/theme'
import { gitResetModesCoverContent } from './config'

const mono = fontFamily.mono

const CardLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 13,
      letterSpacing: 0.4,
      color: colors.muted,
    }}
  >
    {children}
  </span>
)

const CommitNode: React.FC<{
  label: string
  orphaned?: boolean
  head?: boolean
}> = ({ label, orphaned, head }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      borderRadius: 10,
      border: `1.5px ${orphaned ? 'dashed' : 'solid'} ${
        orphaned ? colors.muted : head ? colors.primaryLight : colors.codeBorder
      }`,
      background: head ? 'rgba(147, 83, 211, 0.14)' : 'rgba(255,255,255,0.03)',
      padding: '7px 11px',
      opacity: orphaned ? 0.6 : 1,
    }}
  >
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: 999,
        background: orphaned ? colors.muted : head ? colors.primaryLight : colors.muted,
      }}
    />
    <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, color: colors.foreground }}>
      {label}
    </span>
  </div>
)

const Pill: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 12,
      fontWeight: 700,
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 8,
      padding: '2px 9px',
    }}
  >
    {children}
  </span>
)

export const GitResetModesCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      {/* right-side cluster of reset motif cards */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 70,
          width: 720,
          height: 600,
        }}
      >
        {/* 1 — the mode dial */}
        <CoverPatternCard
          width={360}
          height={112}
          padding='18px 22px'
          showDots
          style={{ top: 0, left: 0, transform: 'rotate(-1.6deg)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <CardLabel>one action, one dial</CardLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              {['--soft', '--mixed', '--hard'].map((m, i) => (
                <span
                  key={m}
                  style={{
                    fontFamily: mono,
                    fontSize: 14,
                    fontWeight: 700,
                    padding: '5px 12px',
                    borderRadius: 8,
                    color: i === 2 ? colors.danger : colors.foreground,
                    background:
                      i === 2 ? 'rgba(243,18,96,0.12)' : 'rgba(255,255,255,0.05)',
                    border:
                      i === 2
                        ? `1px solid ${colors.danger}`
                        : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </CoverPatternCard>

        {/* 2 — the three places (working dir / staging / commit) */}
        <CoverPatternCard
          width={320}
          height={168}
          padding='18px 20px'
          style={{ top: 30, right: 0, transform: 'rotate(1.8deg)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              height: '100%',
            }}
          >
            <CardLabel>reset touches up to 3 places</CardLabel>
            {[
              { name: 'working dir', tone: colors.danger, note: 'only --hard' },
              { name: 'staging area', tone: colors.primaryLight, note: '--mixed +' },
              { name: 'the commit', tone: colors.success, note: 'always' },
            ].map(row => (
              <div
                key={row.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.35)',
                  padding: '7px 11px',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: row.tone,
                  }}
                />
                <span
                  style={{ fontFamily: mono, fontSize: 13, color: colors.foreground }}
                >
                  {row.name}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: mono,
                    fontSize: 11,
                    color: colors.muted,
                  }}
                >
                  {row.note}
                </span>
              </div>
            ))}
          </div>
        </CoverPatternCard>

        {/* 3 — the orphaned-commit graph */}
        <CoverPatternCard
          width={430}
          height={182}
          padding='20px 24px'
          showDots
          style={{ top: 250, left: 40, transform: 'rotate(1.4deg)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              height: '100%',
              justifyContent: 'center',
            }}
          >
            <CardLabel>reset past a commit → it orphans</CardLabel>
            {/* top line: C1 → C2 (main) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CommitNode label='C1' />
              <span style={{ color: colors.muted }}>→</span>
              <CommitNode label='C2' head />
              <span style={{ marginLeft: 6 }}>
                <Pill color={colors.success}>main</Pill>
              </span>
            </div>
            {/* orphaned C3 below */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                paddingLeft: 96,
              }}
            >
              <span style={{ color: colors.muted, fontSize: 18 }}>↘</span>
              <CommitNode label='C3' orphaned />
              <span style={{ fontFamily: mono, fontSize: 11, color: colors.muted }}>
                orphaned
              </span>
            </div>
          </div>
        </CoverPatternCard>
      </div>

      {/* title block bottom-left */}
      <AbsoluteFill
        style={{
          padding: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ position: 'absolute', top: 40, left: 50 }}>
          <Img
            src={staticFile('logos/US-dark.svg')}
            style={{ width: 30, height: 30 }}
          />
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 54,
            fontWeight: 900,
            color: colors.foreground,
            lineHeight: 1.05,
            maxWidth: 560,
            whiteSpace: 'pre-wrap',
          }}
        >
          {gitResetModesCoverContent.title}
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 21,
            color: colors.muted,
            marginTop: 18,
            maxWidth: 560,
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {gitResetModesCoverContent.subtitle}
        </div>

        <SocialFooter style={{ position: 'absolute', bottom: 34, right: 50 }} />
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
