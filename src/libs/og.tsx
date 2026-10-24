import fs from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { brandDomain, siteProfile } from '@/constants/site-profile'
import type { ProjectScreen } from '@/libs/projects'

// Link previews (1200×630), drawn at build time in the site's own style: a
// dark panel, a hairline frame, Fraunces for the title, mono for labels and
// the accent only on the dot. Satori can't read woff2, so the same two
// families ship as static TTFs (OFL, licences beside them in src/fonts).
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

const fonts = async () => {
  const dir = path.join(process.cwd(), 'src/fonts')
  // Fraunces is cut twice: the display optical size for the title, the
  // text size for the description (the display cut turns thin when small).
  const [display, text, mono] = await Promise.all([
    fs.readFile(path.join(dir, 'fraunces-og-500.ttf')),
    fs.readFile(path.join(dir, 'fraunces-og-text-400.ttf')),
    fs.readFile(path.join(dir, 'source-code-pro-og-500.ttf'))
  ])
  return [
    {
      name: 'Fraunces Text',
      data: text,
      weight: 400 as const,
      style: 'normal' as const
    },
    {
      name: 'Fraunces',
      data: display,
      weight: 500 as const,
      style: 'normal' as const
    },
    { name: 'Mono', data: mono, weight: 500 as const, style: 'normal' as const }
  ]
}

const C = {
  bg: '#0a0a0b',
  frame: '#26262b',
  ink: '#f2f2f3',
  muted: '#8b8b94',
  accent: '#9353d3'
}

type OgScreen = { data: string; width: number; height: number; phone: boolean }

// A project's cover screen as a PNG data URL (Satori can't decode WebP).
export async function coverForOg(screen: ProjectScreen): Promise<OgScreen> {
  const file = path.join(
    process.cwd(),
    'public',
    (screen.srcDark ?? screen.src).replace(/^\//, '')
  )
  const phone = screen.device === 'phone'
  const png = await sharp(file)
    .resize(phone ? { height: 1040 } : { width: 1040 })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
  const meta = await sharp(png).metadata()
  return {
    data: `data:image/png;base64,${png.toString('base64')}`,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    phone
  }
}

export async function renderOg({
  label,
  title,
  description,
  status,
  screen
}: {
  label?: string
  title: string
  description: string
  status?: string
  screen?: OgScreen
}) {
  const titleSize = title.length > 28 ? 60 : 76
  // Wide screens sit large at the lower right, cropped by the frame; phones stand upright.
  const shot = screen
    ? screen.phone
      ? {
          width: Math.round((screen.width / screen.height) * 470),
          height: 470,
          right: 90,
          top: 100
        }
      : {
          width: 600,
          height: Math.round((screen.height / screen.width) * 600),
          right: -40,
          top: 150
        }
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: C.bg,
          padding: 32
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            border: `1px solid ${C.frame}`,
            borderRadius: 28,
            padding: '44px 52px',
            overflow: 'hidden'
          }}
        >
          {shot && screen && (
            <div
              style={{
                position: 'absolute',
                right: shot.right,
                top: shot.top,
                display: 'flex',
                border: `1px solid ${C.frame}`,
                borderRadius: screen.phone ? 28 : 14,
                padding: screen.phone ? 8 : 6,
                background: '#141417'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screen.data}
                width={shot.width}
                height={shot.height}
                style={{ borderRadius: screen.phone ? 22 : 9 }}
                alt=''
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'Mono',
              fontSize: 22,
              color: C.muted,
              letterSpacing: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: C.accent
                }}
              />
              {brandDomain}
            </div>
            {label && (
              <div style={{ display: 'flex' }}>{label.toUpperCase()}</div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 'auto',
              maxWidth: shot ? 480 : 900,
              gap: 18
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'Fraunces',
                fontSize: titleSize,
                lineHeight: 1.05,
                color: C.ink
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Fraunces Text',
                fontSize: 28,
                lineHeight: 1.35,
                color: C.muted
              }}
            >
              {description}
            </div>
            {status && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginTop: 8,
                  alignSelf: 'flex-start',
                  border: `1px solid ${C.frame}`,
                  borderRadius: 999,
                  padding: '8px 18px',
                  fontFamily: 'Mono',
                  fontSize: 20,
                  color: C.ink
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: C.accent
                  }}
                />
                {status}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 34,
              fontFamily: 'Mono',
              fontSize: 20,
              color: C.muted
            }}
          >
            {siteProfile.name} · Full-stack engineer
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() }
  )
}
