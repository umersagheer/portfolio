import { AbsoluteFill, Img, staticFile } from 'remotion'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { CoverBeam } from '../../shared/components/CoverBeam'
import { CoverPatternCard } from '../../shared/components/CoverPatternCard'
import { SocialFooter } from '../../shared/components/SocialFooter'
import { colors, fontFamily } from '../../shared/theme'
import { timezonesCoverContent } from './config'

const ClockChip: React.FC<{
  zone: string
  time: string
  active?: boolean
}> = ({ zone, time, active = false }) => {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 12,
        border: active
          ? `1px solid ${colors.primaryLight}`
          : '1px solid rgba(236, 237, 238, 0.08)',
        background: active ? 'rgba(147, 83, 211, 0.16)' : 'rgba(255, 255, 255, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 8px',
        gap: 6,
      }}
    >
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 10,
          color: active ? colors.foreground : colors.muted,
          letterSpacing: 0.25,
        }}
      >
        {zone}
      </span>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 15,
          fontWeight: 700,
          color: colors.foreground,
        }}
      >
        {time}
      </span>
    </div>
  )
}

const RuleBlock: React.FC<{
  title: string
  body: string
  accent: 'primary' | 'secondary'
}> = ({ title, body, accent }) => {
  const accentColor =
    accent === 'primary' ? 'rgba(147, 83, 211, 0.2)' : 'rgba(51, 142, 247, 0.18)'

  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(236, 237, 238, 0.08)',
        background: accentColor,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 11px',
      }}
    >
      <span
        style={{
          fontFamily: fontFamily.poppins,
          fontSize: 13,
          fontWeight: 700,
          color: colors.foreground,
          lineHeight: 1.15,
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 10,
          color: colors.muted,
          lineHeight: 1.4,
          whiteSpace: 'pre-wrap',
        }}
      >
        {body}
      </span>
    </div>
  )
}

const ParseRow: React.FC<{
  input: string
  state: 'safe' | 'trap'
}> = ({ input, state }) => {
  const isSafe = state === 'safe'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 11px',
        borderRadius: 10,
        border: isSafe
          ? '1px solid rgba(174, 126, 222, 0.36)'
          : '1px solid rgba(243, 18, 96, 0.34)',
        background: isSafe ? 'rgba(147, 83, 211, 0.12)' : 'rgba(243, 18, 96, 0.1)',
      }}
    >
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 10,
          color: colors.foreground,
        }}
      >
        {input}
      </span>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 9,
          letterSpacing: 0.25,
          color: isSafe ? colors.primaryLight : colors.danger,
        }}
      >
        {isSafe ? 'UTC' : 'local trap'}
      </span>
    </div>
  )
}

const DstTransition: React.FC<{
  label: string
  wallTime: string
  utcTime: string
  kind: 'spring' | 'fall'
}> = ({ label, wallTime, utcTime, kind }) => {
  const isSpring = kind === 'spring'
  const accent = isSpring ? 'rgba(255, 156, 189, 0.9)' : 'rgba(137, 186, 255, 0.9)'

  return (
    <div
      style={{
        borderRadius: 10,
        border: '1px solid rgba(236, 237, 238, 0.18)',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '10px 11px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 10,
            color: colors.foreground,
            letterSpacing: 0.25,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fontFamily.mono,
            fontSize: 10,
            color: 'rgba(236, 237, 238, 0.82)',
          }}
        >
          {wallTime}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: 10,
        }}
      >
        <CoverBeam
          width={208}
          height={10}
          pathWidth={1.6}
          pathColor='rgba(236, 237, 238, 0.16)'
          gradientStartColor={accent}
          gradientStopColor={accent}
        />
      </div>
      <span
        style={{
          fontFamily: fontFamily.mono,
          fontSize: 10,
          color: 'rgba(236, 237, 238, 0.76)',
        }}
      >
        UTC {utcTime}
      </span>
    </div>
  )
}

export const TimezonesCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      <div
        style={{
          position: 'absolute',
          top: 30,
          right: 34,
          width: 616,
          height: 590,
        }}
      >
        <CoverPatternCard
          width={344}
          height={252}
          padding='16px 16px'
          showDots
          style={{
            top: 0,
            left: 0,
            transform: 'rotate(0.8deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              height: '100%',
            }}
          >
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 11,
                color: colors.muted,
                letterSpacing: 0.25,
              }}
            >
              Same Moment, Different Clocks
            </span>

            <div
              style={{
                display: 'flex',
                gap: 8,
              }}
            >
              <ClockChip zone='UTC' time='09:00' active />
              <ClockChip zone='KHI' time='14:00' />
              <ClockChip zone='NYC' time='05:00' />
              <ClockChip zone='LON' time='10:00' />
            </div>
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 10,
                color: colors.muted,
                lineHeight: 1.4,
              }}
            >
              One instant, four local representations.
            </div>
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={248}
          height={252}
          padding='16px 14px'
          style={{
            top: 8,
            right: 0,
            transform: 'rotate(-1.4deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              height: '100%',
            }}
          >
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 12,
                color: colors.muted,
                letterSpacing: 0.25,
              }}
            >
              Past vs Future Rules
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              <RuleBlock
                title='Past event'
                body='Store UTC.\nMoment is fixed.'
                accent='primary'
              />
              <RuleBlock
                title='Future event'
                body='Store wall time\n+ IANA zone.'
                accent='secondary'
              />
            </div>
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={334}
          height={286}
          padding='16px 16px'
          showDots
          style={{
            top: 274,
            left: 14,
            transform: 'rotate(-1.8deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              height: '100%',
            }}
          >
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 11,
                color: colors.muted,
                letterSpacing: 0.25,
              }}
            >
              The Date Parsing Trap
            </span>

            <ParseRow input='2026-03-29' state='safe' />
            <ParseRow input='2026-03-29T00:00:00' state='trap' />
            <ParseRow input='2026-03-29T00:00:00.000Z' state='safe' />
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 10,
                color: colors.muted,
                lineHeight: 1.4,
              }}
            >
              Date-time strings without a timezone are interpreted as local time.
            </span>
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={258}
          height={286}
          padding='16px 14px'
          style={{
            top: 280,
            right: 0,
            transform: 'rotate(1.7deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              height: '100%',
            }}
          >
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 11,
                color: colors.muted,
                letterSpacing: 0.25,
              }}
            >
              DST Transitions Visualized
            </span>

            <DstTransition
              label='Spring Forward (Gap)'
              wallTime='2:30 AM missing'
              utcTime='07:30'
              kind='spring'
            />
            <DstTransition
              label='Fall Back (Overlap)'
              wallTime='1:30 AM repeats'
              utcTime='05:30 / 06:30'
              kind='fall'
            />
          </div>
        </CoverPatternCard>
      </div>

      <AbsoluteFill
        style={{
          padding: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 50,
          }}
        >
          <Img
            src={staticFile('logos/US-dark.svg')}
            style={{ width: 30, height: 30 }}
          />
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 50,
            fontWeight: 900,
            color: colors.foreground,
            lineHeight: 1.08,
            maxWidth: 560,
            whiteSpace: 'pre-wrap',
          }}
        >
          {timezonesCoverContent.title}
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 20,
            color: colors.muted,
            marginTop: 14,
            maxWidth: 600,
            lineHeight: 1.35,
            whiteSpace: 'pre-wrap',
          }}
        >
          {timezonesCoverContent.subtitle}
        </div>

        <SocialFooter
          style={{
            position: 'absolute',
            bottom: 34,
            right: 50,
          }}
        />
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
