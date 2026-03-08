import { colors } from '../theme'

export const BrandUnderline: React.FC<{
  width: number | string
  maxWidth?: number | string
  height?: number
  opacity?: number
  glowOpacity?: number
}> = ({
  width,
  maxWidth,
  height = 4,
  opacity = 1,
  glowOpacity = 0.18,
}) => {
  return (
    <div
      style={{
        height,
        width,
        maxWidth,
        opacity,
        borderRadius: 999,
        background: `linear-gradient(90deg, rgba(236, 237, 238, 0) 0%, ${colors.white} 52%, rgba(236, 237, 238, 0) 100%)`,
        boxShadow: `0 0 22px rgba(255, 255, 255, ${glowOpacity})`,
      }}
    />
  )
}
