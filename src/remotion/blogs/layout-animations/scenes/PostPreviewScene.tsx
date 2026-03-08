import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Background } from '../../../shared/components/Background'
import { SceneTitle } from '../../../shared/components/SceneTitle'
import { colors, fontFamily } from '../../../shared/theme'
import { PostBrowserPreview } from '../components/PostBrowserPreview'
import { layoutAnimationsPreviewContent } from '../config'

export const PostPreviewScene: React.FC = () => {
  const frame = useCurrentFrame()

  const captionOpacity = interpolate(frame, [26, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const captionY = interpolate(frame, [26, 40], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <Background showGrid>
      <AbsoluteFill
        style={{
          alignItems: 'center',
        }}
      >
        <div style={{ marginTop: 66 }}>
          <SceneTitle text={layoutAnimationsPreviewContent.sceneTitle} />
        </div>

        <PostBrowserPreview
          top={210}
          width={470}
          height={720}
          enterDelay={10}
          fromY={56}
          scaleFrom={0.9}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 220,
            maxWidth: 700,
            padding: '0 40px',
            textAlign: 'center',
            fontFamily: fontFamily.poppins,
            fontSize: 23,
            lineHeight: 1.55,
            fontWeight: 500,
            color: colors.muted,
            opacity: captionOpacity,
            transform: `translateY(${captionY}px)`,
          }}
        >
          {layoutAnimationsPreviewContent.sceneMessage}
        </div>
      </AbsoluteFill>
    </Background>
  )
}
