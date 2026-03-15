import { AbsoluteFill, Img, staticFile } from 'remotion'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { colors, fontFamily } from '../../shared/theme'
import { webSocketsCoverContent } from './config'

export const WebSocketsCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      {/* Warning/amber tinted glow overlays */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 24% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 42%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 72% 75%, rgba(34, 197, 94, 0.08) 0%, transparent 36%)',
        }}
      />

      {/* Visual motifs - upper right quadrant */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 50,
          width: 520,
          height: 540,
        }}
      >
        {/* Card 1: Client ↔ Server tunnel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(1deg)',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            padding: 16,
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Client box */}
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: colors.surfaceSoft,
              border: `1px solid ${colors.border}`,
              fontFamily: fontFamily.mono,
              fontSize: 11,
              fontWeight: 600,
              color: colors.foreground,
            }}
          >
            Client
          </div>
          {/* Gradient line */}
          <div
            style={{
              width: 80,
              height: 3,
              borderRadius: 2,
              background: `linear-gradient(90deg, #f59e0b, #22c55e)`,
            }}
          />
          {/* Server box */}
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: colors.surfaceSoft,
              border: `1px solid ${colors.border}`,
              fontFamily: fontFamily.mono,
              fontSize: 11,
              fontWeight: 600,
              color: colors.foreground,
            }}
          >
            Server
          </div>
        </div>

        {/* Card 2: Envelope JSON snippet */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 0,
            transform: 'rotate(-1.5deg)',
            padding: '14px 16px',
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            maxWidth: 240,
          }}
        >
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 10,
              lineHeight: 1.6,
              color: colors.muted,
              whiteSpace: 'pre',
            }}
          >
            <span style={{ color: '#f59e0b' }}>{'{'}</span>
            {'\n'}
            {'  '}
            <span style={{ color: '#9353d3' }}>{'"type"'}</span>
            <span style={{ color: colors.muted }}>: </span>
            <span style={{ color: '#22c55e' }}>{'"chat:message"'}</span>
            <span style={{ color: colors.muted }}>,</span>
            {'\n'}
            {'  '}
            <span style={{ color: '#9353d3' }}>{'"payload"'}</span>
            <span style={{ color: colors.muted }}>: </span>
            <span style={{ color: '#f59e0b' }}>{'{ ... }'}</span>
            {'\n'}
            <span style={{ color: '#f59e0b' }}>{'}'}</span>
          </div>
        </div>

        {/* Card 3: State machine row */}
        <div
          style={{
            position: 'absolute',
            top: 110,
            left: 10,
            right: 10,
            transform: 'rotate(-2deg)',
            padding: '16px 20px',
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {[
            { label: 'CONNECTING', color: '#f59e0b' },
            { label: 'OPEN', color: '#22c55e' },
            { label: 'CLOSING', color: '#f59e0b' },
            { label: 'CLOSED', color: colors.muted },
          ].map((state, i, arr) => (
            <div
              key={state.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: state.color,
                    boxShadow: `0 0 12px ${state.color}44`,
                  }}
                />
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 7,
                    color: state.color,
                    fontWeight: 600,
                  }}
                >
                  {state.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    width: 20,
                    height: 2,
                    background: colors.border,
                    borderRadius: 1,
                    marginBottom: 14,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card 4: Pub/Sub card */}
        <div
          style={{
            position: 'absolute',
            top: 210,
            left: 0,
            width: 260,
            transform: 'rotate(2deg)',
            padding: '14px 18px',
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {[
            { label: 'Server 1', color: colors.secondary },
            { label: 'Redis', color: '#ef4444' },
            { label: 'Server 2', color: colors.secondary },
          ].map((node, i, arr) => (
            <div
              key={node.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: node.color,
                    boxShadow: `0 0 10px ${node.color}44`,
                  }}
                />
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 8,
                    color: colors.muted,
                    fontWeight: 600,
                  }}
                >
                  {node.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    width: 16,
                    height: 2,
                    background: `linear-gradient(90deg, ${node.color}, ${arr[i + 1].color})`,
                    borderRadius: 1,
                    marginBottom: 16,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card 5: Frame bits preview */}
        <div
          style={{
            position: 'absolute',
            top: 230,
            right: 20,
            width: 200,
            transform: 'rotate(3deg)',
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              display: 'flex',
              gap: 3,
            }}
          >
            {[
              { label: 'FIN', color: '#9353d3', flex: 1 },
              { label: 'RSV', color: colors.border, flex: 3 },
              { label: 'OP', color: '#338ef7', flex: 4 },
              { label: 'M', color: '#f59e0b', flex: 1 },
              { label: 'LEN', color: '#22c55e', flex: 7 },
            ].map(f => (
              <div
                key={f.label}
                style={{
                  flex: f.flex,
                  height: 24,
                  borderRadius: 4,
                  background: `${f.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: fontFamily.mono,
                  fontSize: 7,
                  fontWeight: 700,
                  color: f.color,
                }}
              >
                {f.label}
              </div>
            ))}
          </div>
          <div
            style={{
              padding: '6px 12px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <div
              style={{
                height: 6,
                width: '100%',
                background: `${colors.border}`,
                borderRadius: 3,
              }}
            />
            <div
              style={{
                height: 6,
                width: '70%',
                background: `${colors.border}`,
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
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
            fontSize: 48,
            fontWeight: 900,
            color: colors.foreground,
            lineHeight: 1.15,
            maxWidth: 600,
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
            marginTop: 16,
            maxWidth: 500,
            lineHeight: 1.4,
          }}
        >
          {webSocketsCoverContent.subtitle}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 50,
            fontFamily: fontFamily.mono,
            fontSize: 18,
            color: colors.muted,
          }}
        >
          {webSocketsCoverContent.footerDomain}
        </div>
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
