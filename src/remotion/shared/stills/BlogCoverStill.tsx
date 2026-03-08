import { AbsoluteFill, Img, staticFile } from 'remotion'
import { z } from 'zod'
import { brandDomain } from '../brand'
import { BrandBackdrop } from '../components/BrandBackdrop'
import { colors, fontFamily } from '../theme'

export const blogCoverSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  coverImage: z.string().optional(),
})

type BlogCoverProps = z.infer<typeof blogCoverSchema>

export const BlogCoverStill: React.FC<BlogCoverProps> = ({
  title,
  subtitle,
  coverImage,
}) => {
  return (
    <BrandBackdrop showGrid>
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
            right: 50,
          }}
        >
          <Img
            src={staticFile('logos/US-dark.svg')}
            style={{ width: 20, height: 20 }}
          />
        </div>

        {coverImage && (
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 60,
              right: 160,
              height: 300,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <Img
              src={coverImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 52,
            fontWeight: 900,
            color: colors.foreground,
            lineHeight: 1.15,
            maxWidth: 900,
            whiteSpace: 'pre-wrap',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: fontFamily.poppins,
            fontSize: 24,
            color: colors.muted,
            marginTop: 16,
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
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
          {brandDomain}
        </div>
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
