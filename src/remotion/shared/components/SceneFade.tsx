import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'

export const SceneFade: React.FC<{
  children: React.ReactNode
  durationInFrames: number
  enterFrames?: number
  exitFrames?: number
  translateY?: number
  scaleFrom?: number
}> = ({
  children,
  durationInFrames,
  enterFrames = 12,
  exitFrames = 12,
  translateY = 28,
  scaleFrom = 0.985,
}) => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fadeOut = interpolate(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const enterY = interpolate(frame, [0, enterFrames], [translateY, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const exitY = interpolate(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [0, -translateY / 2],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  const enterScale = interpolate(frame, [0, enterFrames], [scaleFrom, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const exitScale = interpolate(
    frame,
    [durationInFrames - exitFrames, durationInFrames],
    [1, 1.01],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  )

  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(fadeIn, fadeOut),
        transform: `translateY(${enterY + exitY}px) scale(${enterScale * exitScale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  )
}
