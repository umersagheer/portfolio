import { AbsoluteFill } from 'remotion'
import { BrandBackdrop } from './BrandBackdrop'

export const Background: React.FC<{
  children: React.ReactNode
  showGrid?: boolean
}> = ({ children, showGrid = true }) => {
  return (
    <BrandBackdrop showGrid={showGrid}>
      <AbsoluteFill
        style={{
          padding: 60,
        }}
      >
        {children}
      </AbsoluteFill>
    </BrandBackdrop>
  )
}
