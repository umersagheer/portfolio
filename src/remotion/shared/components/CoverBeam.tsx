import { useId } from 'react'

type CoverBeamProps = {
  width: number
  height: number
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
}

export const CoverBeam: React.FC<CoverBeamProps> = ({
  width,
  height,
  curvature = 0,
  reverse = false,
  pathColor = 'rgba(255, 255, 255, 0.12)',
  pathWidth = 2,
  pathOpacity = 1,
  gradientStartColor = 'rgba(174, 126, 222, 0.9)',
  gradientStopColor = 'rgba(147, 83, 211, 0.92)',
}) => {
  const gradientId = useId().replace(/:/g, '')
  const startX = 4
  const endX = width - 4
  const centerY = height / 2
  const controlY = centerY - curvature
  const d = `M ${startX},${centerY} Q ${(startX + endX) / 2},${controlY} ${endX},${centerY}`

  return (
    <svg
      fill='none'
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d={d}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap='round'
      />
      <path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth={pathWidth}
        strokeLinecap='round'
      />
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits='userSpaceOnUse'
          x1={reverse ? endX : startX}
          x2={reverse ? startX : endX}
          y1={centerY}
          y2={centerY}
        >
          <stop offset='0%' stopColor={gradientStartColor} stopOpacity='0' />
          <stop offset='22%' stopColor={gradientStartColor} stopOpacity='0.88' />
          <stop offset='50%' stopColor={gradientStopColor} stopOpacity='1' />
          <stop offset='78%' stopColor={gradientStopColor} stopOpacity='0.88' />
          <stop offset='100%' stopColor={gradientStopColor} stopOpacity='0' />
        </linearGradient>
      </defs>
    </svg>
  )
}
