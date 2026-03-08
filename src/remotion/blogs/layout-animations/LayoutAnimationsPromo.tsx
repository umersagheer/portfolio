import { Series } from 'remotion'
import { SceneFade } from '../../shared/components/SceneFade'
import {
  sceneDurations,
  type LayoutAnimationsPromoProps,
} from './config'
import { FlipScene } from './scenes/FlipScene'
import { IntroScene } from './scenes/IntroScene'
import { LayoutIdScene } from './scenes/LayoutIdScene'
import { MorphingScene } from './scenes/MorphingScene'
import { OutroScene } from './scenes/OutroScene'
import { PostPreviewScene } from './scenes/PostPreviewScene'
import { ProblemScene } from './scenes/ProblemScene'
import { SpringScene } from './scenes/SpringScene'

export const LayoutAnimationsPromo: React.FC<LayoutAnimationsPromoProps> = ({
  title,
  subtitle,
  author,
  ctaLabel,
  url,
  outroMessage,
}) => {
  return (
    <Series>
      <Series.Sequence durationInFrames={sceneDurations.intro}>
        <SceneFade durationInFrames={sceneDurations.intro} exitFrames={12}>
          <IntroScene title={title} subtitle={subtitle} author={author} />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.problem}>
        <SceneFade durationInFrames={sceneDurations.problem}>
          <ProblemScene />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.flip}>
        <SceneFade durationInFrames={sceneDurations.flip}>
          <FlipScene />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.layoutId}>
        <SceneFade durationInFrames={sceneDurations.layoutId}>
          <LayoutIdScene />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.spring}>
        <SceneFade durationInFrames={sceneDurations.spring}>
          <SpringScene />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.morphing}>
        <SceneFade durationInFrames={sceneDurations.morphing}>
          <MorphingScene />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.postPreview}>
        <SceneFade durationInFrames={sceneDurations.postPreview}>
          <PostPreviewScene />
        </SceneFade>
      </Series.Sequence>
      <Series.Sequence durationInFrames={sceneDurations.outro}>
        <SceneFade durationInFrames={sceneDurations.outro} enterFrames={16}>
          <OutroScene
            title={title}
            url={url}
            ctaLabel={ctaLabel}
            outroMessage={outroMessage}
          />
        </SceneFade>
      </Series.Sequence>
    </Series>
  )
}
