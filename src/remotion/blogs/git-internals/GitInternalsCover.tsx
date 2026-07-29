import { AbsoluteFill, Img, staticFile } from 'remotion'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { CoverPatternCard } from '../../shared/components/CoverPatternCard'
import { SocialFooter } from '../../shared/components/SocialFooter'
import { colors, fontFamily } from '../../shared/theme'
import { gitInternalsCoverContent } from './config'

const mono = fontFamily.mono

// ── small building blocks ────────────────────────────────────────────────────

const ObjBadge: React.FC<{ label: string; color: string; bg: string }> = ({
  label,
  color,
  bg,
}) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: colors.white,
      background: bg,
      borderRadius: 6,
      padding: '3px 8px',
    }}
  >
    {label}
  </span>
)

const Hash: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({
  children,
  color = colors.foreground,
  size = 16,
}) => (
  <span style={{ fontFamily: mono, fontSize: size, fontWeight: 700, color }}>
    {children}
  </span>
)

/** A commit node box for the graph card. */
const CommitDot: React.FC<{ hash: string; head?: boolean }> = ({
  hash,
  head,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      borderRadius: 11,
      border: `1.5px solid ${head ? colors.primaryLight : colors.codeBorder}`,
      background: head ? 'rgba(147, 83, 211, 0.14)' : 'rgba(255,255,255,0.03)',
      padding: '9px 13px',
      boxShadow: head ? '0 0 18px rgba(147,83,211,0.18)' : 'none',
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: head ? colors.primaryLight : colors.muted,
      }}
    />
    <Hash size={16}>{hash}</Hash>
  </div>
)

/** A right-pointing arrow (child → parent), matching the post's edges. */
const Arrow: React.FC<{ dir?: 'right' | 'down' }> = ({ dir = 'right' }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 20,
      color: colors.muted,
      lineHeight: 1,
      transform: dir === 'down' ? 'rotate(90deg)' : undefined,
      display: 'inline-block',
    }}
  >
    →
  </span>
)

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

const Pill: React.FC<{
  children: React.ReactNode
  color: string
  dashed?: boolean
}> = ({ children, color, dashed }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 13,
      fontWeight: 700,
      color,
      border: `1.5px ${dashed ? 'dashed' : 'solid'} ${color}`,
      borderRadius: 8,
      padding: '3px 10px',
    }}
  >
    {children}
  </span>
)

// ── the cover ────────────────────────────────────────────────────────────────

export const GitInternalsCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      {/* right-side cluster of git motif cards — larger, tighter, deliberate */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          right: 70,
          width: 720,
          height: 600,
        }}
      >
        {/* 1 — the commit graph (nodes + arrows) */}
        <CoverPatternCard
          width={452}
          height={186}
          padding='20px 24px'
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
            <CardLabel>the commit graph</CardLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CommitDot hash='e6c3e4a' />
              <Arrow />
              <CommitDot hash='1b2cdef' />
              <Arrow />
              <CommitDot hash='8c3ec0c' head />
            </div>
            <div style={{ display: 'flex', gap: 10, paddingLeft: 2 }}>
              <Pill color={colors.success}>main</Pill>
              <Pill color={colors.primaryLight} dashed>
                HEAD
              </Pill>
            </div>
          </div>
        </CoverPatternCard>

        {/* 2 — blob → tree → commit stack */}
        <CoverPatternCard
          width={286}
          height={224}
          padding='20px 22px'
          style={{ top: 26, right: 0, transform: 'rotate(1.8deg)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              height: '100%',
            }}
          >
            <CardLabel>three objects, stacked</CardLabel>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <ObjBadge label='commit' color={colors.muted} bg='rgba(113,113,122,0.5)' />
                <Hash>99a0ca9</Hash>
              </div>
              <span style={{ paddingLeft: 12 }}>
                <Arrow dir='down' />
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <ObjBadge label='tree' color={colors.primaryLight} bg={colors.primary} />
                <Hash color={colors.primaryLight}>4985312</Hash>
              </div>
              <span style={{ paddingLeft: 12 }}>
                <Arrow dir='down' />
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <ObjBadge label='blob' color={colors.secondary} bg={colors.secondary} />
                <Hash color={colors.secondary}>8715535</Hash>
              </div>
            </div>
          </div>
        </CoverPatternCard>

        {/* 3 — the .git two-halves tree */}
        <CoverPatternCard
          width={430}
          height={182}
          padding='22px 26px'
          style={{ top: 236, left: 18, transform: 'rotate(1.4deg)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              height: '100%',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: mono, fontSize: 15, color: colors.muted }}>
              .git/
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: colors.primary,
                }}
              />
              <Hash size={17}>objects/</Hash>
              <CardLabel>· the stuff</CardLabel>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: colors.secondary,
                }}
              />
              <Hash size={17}>refs/ + HEAD</Hash>
              <CardLabel>· the pointers</CardLabel>
            </div>
          </div>
        </CoverPatternCard>

        {/* 4 — refs file readout (branch = one line) */}
        <CoverPatternCard
          width={330}
          height={178}
          padding='20px 22px'
          showDots
          style={{ top: 288, right: 4, transform: 'rotate(-2deg)' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 11,
              height: '100%',
              justifyContent: 'center',
            }}
          >
            <CardLabel>a branch is one line</CardLabel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 9,
                background: 'rgba(0,0,0,0.4)',
                padding: '9px 12px',
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 13, color: colors.muted }}>
                heads/main
              </span>
              <span style={{ marginLeft: 'auto' }}>
                <Hash>8c3ec0c</Hash>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 9,
                background: 'rgba(0,0,0,0.4)',
                padding: '9px 12px',
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 13, color: colors.muted }}>
                HEAD
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: mono,
                  fontSize: 13,
                  color: colors.foreground,
                }}
              >
                ref: …/main
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
          {gitInternalsCoverContent.title}
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
          {gitInternalsCoverContent.subtitle}
        </div>

        <SocialFooter
          style={{ position: 'absolute', bottom: 34, right: 50 }}
        />
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
