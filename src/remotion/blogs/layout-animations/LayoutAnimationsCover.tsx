import { AbsoluteFill, Img, staticFile } from 'remotion'
import { BrandBackdrop } from '../../shared/components/BrandBackdrop'
import { SocialFooter } from '../../shared/components/SocialFooter'
import { colors, fontFamily, gradient } from '../../shared/theme'
import { layoutAnimationsCoverContent } from './config'

export const LayoutAnimationsCover: React.FC = () => {
  return (
    <BrandBackdrop showGrid>
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 50,
          width: 560,
          height: 580,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(1deg)',
            display: 'flex',
            gap: 10,
            padding: 16,
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {['F', 'L', 'I', 'P'].map(letter => (
            <div
              key={letter}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fontFamily.poppins,
                fontSize: 20,
                fontWeight: 800,
                color: '#fff',
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 0,
            transform: 'rotate(-1deg)',
            padding: 14,
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 0,
              background: colors.border,
              borderRadius: 10,
              padding: 3,
            }}
          >
            {['Home', 'About', 'Blog'].map((tab, i) => (
              <div
                key={tab}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontFamily: fontFamily.poppins,
                  fontSize: 12,
                  fontWeight: 600,
                  color: i === 0 ? '#fff' : colors.muted,
                  background: i === 0 ? colors.primary : 'transparent',
                }}
              >
                {tab}
              </div>
            ))}
          </div>
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 10,
              color: colors.muted,
              textAlign: 'center',
            }}
          >
            layoutId indicator
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 110,
            left: 10,
            right: 10,
            transform: 'rotate(-2deg)',
            padding: '18px 16px',
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: 32,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 14,
                left: 0,
                right: 0,
                height: 4,
                background: colors.border,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 30,
                width: 280,
                height: 24,
                borderRadius: 12,
                background: colors.primary,
                opacity: 0.12,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 320,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: colors.primary,
                boxShadow: '0 4px 16px rgba(147, 83, 211, 0.4)',
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 210,
            left: 0,
            width: 220,
            transform: 'rotate(2deg)',
            padding: 14,
            background: colors.codeBg,
            border: `1px solid ${colors.codeBorder}`,
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {[
            { emoji: '🍎', name: 'Apple' },
            { emoji: '🍊', name: 'Orange' },
            { emoji: '🍇', name: 'Grape' },
          ].map(({ emoji, name }) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                border: `1px solid ${colors.codeBorder}`,
                borderRadius: 8,
                fontFamily: fontFamily.poppins,
                fontSize: 12,
                color: colors.foreground,
              }}
            >
              <span>
                {emoji} {name}
              </span>
              <span style={{ color: colors.muted, fontSize: 10 }}>x</span>
            </div>
          ))}
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 9,
              color: colors.muted,
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            AnimatePresence
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 220,
            right: 20,
            width: 180,
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
              height: 50,
              background: gradient,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                height: 8,
                width: '80%',
                background: colors.border,
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 8,
                width: '55%',
                background: colors.border,
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 8,
                width: '65%',
                background: colors.border,
                borderRadius: 4,
              }}
            />
          </div>
        </div>
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
            fontSize: 48,
            fontWeight: 900,
            color: colors.foreground,
            lineHeight: 1.15,
            maxWidth: 600,
            whiteSpace: 'pre-wrap',
          }}
        >
          {layoutAnimationsCoverContent.title}
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
          {layoutAnimationsCoverContent.subtitle}
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
