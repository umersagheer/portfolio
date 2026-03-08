import { AbsoluteFill } from 'remotion'
import { Background } from '../../../shared/components/Background'
import { BlogOutro } from '../../../shared/components/BlogOutro'
import type { LayoutAnimationsPromoProps } from '../config'

type OutroSceneProps = Pick<
  LayoutAnimationsPromoProps,
  'title' | 'url' | 'ctaLabel' | 'outroMessage'
>

export const OutroScene: React.FC<OutroSceneProps> = ({
  title,
  url,
  ctaLabel,
  outroMessage,
}) => {
  return (
    <Background showGrid>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <BlogOutro
          title={title}
          url={url}
          ctaLabel={ctaLabel}
          message={outroMessage}
        />
      </AbsoluteFill>
    </Background>
  )
}
