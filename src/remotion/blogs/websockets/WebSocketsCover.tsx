import { AbsoluteFill, Img, staticFile } from 'remotion'
import {
  WEBSOCKET_NODE_ICON_SIZE,
  WebSocketBrokerIcon,
  WebSocketClientIcon,
  WebSocketServerIcon,
} from '../../../components/blog/websockets/diagram-icons'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { CoverBeam } from '../../shared/components/CoverBeam'
import { CoverIconCard } from '../../shared/components/CoverIconCard'
import { CoverPatternCard } from '../../shared/components/CoverPatternCard'
import { SocialFooter } from '../../shared/components/SocialFooter'
import { colors, fontFamily } from '../../shared/theme'
import { webSocketsCoverContent } from './config'

const stateLabels = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'] as const

const StateChip: React.FC<{
  label: string
  active?: boolean
}> = ({ label, active = false }) => {
  return (
    <div
      style={{
        padding: '7px 10px',
        borderRadius: 999,
        border: active
          ? `1px solid ${colors.primaryLight}`
          : '1px solid rgba(236, 237, 238, 0.08)',
        background: active
          ? 'rgba(147, 83, 211, 0.12)'
          : 'rgba(255, 255, 255, 0.03)',
        boxShadow: active ? '0 0 10px rgba(147, 83, 211, 0.14)' : 'none',
        fontFamily: fontFamily.mono,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 0.25,
        color: active ? colors.foreground : colors.muted,
      }}
    >
      {label}
    </div>
  )
}

const FrameField: React.FC<{
  label: string
  flex: number
  active?: boolean
}> = ({ label, flex, active = false }) => {
  return (
    <div
      style={{
        flex,
        height: 26,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: active
          ? `1px solid ${colors.primaryLight}`
          : '1px solid rgba(236, 237, 238, 0.06)',
        background: active
          ? 'rgba(147, 83, 211, 0.12)'
          : 'rgba(255, 255, 255, 0.03)',
        color: active ? colors.foreground : colors.muted,
        fontFamily: fontFamily.mono,
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </div>
  )
}

export const WebSocketsCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 50,
          width: 540,
          height: 540,
        }}
      >
        <CoverPatternCard
          width={280}
          height={110}
          padding='12px 14px'
          showDots
          style={{
            top: 0,
            left: 0,
            transform: 'rotate(1deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <CoverIconCard
              icon={
                <WebSocketClientIcon
                  size={WEBSOCKET_NODE_ICON_SIZE}
                  stroke={1.7}
                  color={colors.foreground}
                />
              }
              label='Client'
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ width: 86, height: 16 }}>
                <CoverBeam width={86} height={16} />
              </div>
              <span
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: 9,
                  color: colors.muted,
                  letterSpacing: 0.2,
                }}
              >
                persistent tunnel
              </span>
            </div>

            <CoverIconCard
              icon={
                <WebSocketServerIcon
                  size={WEBSOCKET_NODE_ICON_SIZE}
                  stroke={1.7}
                  color={colors.foreground}
                />
              }
              label='Server'
            />
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={212}
          height={102}
          padding='12px 14px'
          style={{
            top: 6,
            right: 0,
            transform: 'rotate(-1.3deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              height: '100%',
            }}
          >
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 9,
                color: colors.muted,
                letterSpacing: 0.3,
              }}
            >
              message envelope
            </span>
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 9,
                lineHeight: 1.65,
                color: colors.foreground,
                whiteSpace: 'pre',
              }}
            >
              <span style={{ color: colors.primaryLight }}>{'{'}</span>
              {'\n'}
              {'  '}
              <span style={{ color: colors.primaryLight }}>{'"type"'}</span>
              : <span>{'"chat:message"'}</span>
              {','}
              {'\n'}
              {'  '}
              <span style={{ color: colors.primaryLight }}>{'"payload"'}</span>
              : <span>{'{ ... }'}</span>
              {'\n'}
              <span style={{ color: colors.primaryLight }}>{'}'}</span>
            </div>
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={500}
          height={92}
          padding='12px 14px'
          style={{
            top: 124,
            left: 6,
            transform: 'rotate(-1.7deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {stateLabels.map((label, index) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <StateChip label={label} active={index === 1} />
                  {index < stateLabels.length - 1 ? (
                    <div style={{ width: 18, height: 4 }}>
                      <CoverBeam
                        width={18}
                        height={4}
                        pathWidth={1.35}
                        pathColor='rgba(255, 255, 255, 0.08)'
                        gradientStartColor='rgba(174, 126, 222, 0.7)'
                        gradientStopColor='rgba(147, 83, 211, 0.72)'
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontFamily: fontFamily.mono,
                fontSize: 9,
                color: colors.muted,
                letterSpacing: 0.3,
              }}
            >
              readyState lifecycle
            </div>
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={276}
          height={108}
          padding='12px 14px'
          showDots
          style={{
            top: 246,
            left: 0,
            transform: 'rotate(1.8deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <CoverIconCard
              icon={
                <WebSocketServerIcon
                  size={WEBSOCKET_NODE_ICON_SIZE}
                  stroke={1.7}
                  color={colors.foreground}
                />
              }
              label='Server 1'
            />

            <div style={{ width: 34, height: 12 }}>
              <CoverBeam width={34} height={12} />
            </div>

            <CoverIconCard
              icon={
                <WebSocketBrokerIcon
                  size={WEBSOCKET_NODE_ICON_SIZE}
                  stroke={1.7}
                  color={colors.foreground}
                />
              }
              label='Redis'
              accentColor='rgba(255, 255, 255, 0.45)'
            />

            <div style={{ width: 34, height: 12 }}>
              <CoverBeam width={34} height={12} reverse />
            </div>

            <CoverIconCard
              icon={
                <WebSocketServerIcon
                  size={WEBSOCKET_NODE_ICON_SIZE}
                  stroke={1.7}
                  color={colors.foreground}
                />
              }
              label='Server 2'
            />
          </div>
        </CoverPatternCard>

        <CoverPatternCard
          width={196}
          height={104}
          padding='12px 12px 10px'
          style={{
            top: 260,
            right: 16,
            transform: 'rotate(3deg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 9,
                color: colors.muted,
                letterSpacing: 0.3,
              }}
            >
              frame structure
            </span>

            <div
              style={{
                display: 'flex',
                gap: 4,
              }}
            >
              <FrameField label='FIN' flex={2} active />
              <FrameField label='OP' flex={4} active />
              <FrameField label='MASK' flex={3} />
              <FrameField label='LEN' flex={5} />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: '100%',
                  borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.08)',
                }}
              />
              <div
                style={{
                  height: 6,
                  width: '72%',
                  borderRadius: 999,
                  background: 'rgba(147, 83, 211, 0.18)',
                }}
              />
            </div>
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
            fontSize: 52,
            fontWeight: 900,
            color: colors.foreground,
            lineHeight: 1.06,
            maxWidth: 520,
            whiteSpace: 'pre-wrap',
          }}
        >
          {webSocketsCoverContent.title}
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 22,
            color: colors.muted,
            marginTop: 18,
            maxWidth: 560,
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {webSocketsCoverContent.subtitle}
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
