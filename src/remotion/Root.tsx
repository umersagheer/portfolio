import { Composition, Folder, Still } from 'remotion'
import {
  defaultLayoutAnimationsPromoProps,
  LayoutAnimationsCover,
  layoutAnimationsComposition,
  LayoutAnimationsPromo,
  layoutAnimationsPromoSchema,
} from './blogs/layout-animations'
import { BlogCoverStill, blogCoverSchema } from './shared/stills/BlogCoverStill'

import './shared/fonts'

export const Root: React.FC = () => {
  return (
    <>
      <Folder name='blogs'>
        <Folder name='layout-animations'>
          <Composition
            id={layoutAnimationsComposition.id}
            component={LayoutAnimationsPromo}
            durationInFrames={layoutAnimationsComposition.durationInFrames}
            fps={layoutAnimationsComposition.fps}
            width={layoutAnimationsComposition.width}
            height={layoutAnimationsComposition.height}
            schema={layoutAnimationsPromoSchema}
            defaultProps={defaultLayoutAnimationsPromoProps}
          />
          <Still
            id='LayoutAnimationsCover'
            component={LayoutAnimationsCover}
            width={1280}
            height={720}
          />
        </Folder>
      </Folder>

      <Folder name='shared'>
        <Still
          id='BlogCover'
          component={BlogCoverStill}
          width={1280}
          height={720}
          schema={blogCoverSchema}
          defaultProps={{
            title: 'Blog Post Title',
            subtitle: 'A brief description of the post',
          }}
        />
      </Folder>
    </>
  )
}
