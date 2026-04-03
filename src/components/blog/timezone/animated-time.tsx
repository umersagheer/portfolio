'use client'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'

type AnimatedTimeProps = {
  hours: number
  minutes: number
  seconds?: number
  ampm?: string
  padHours?: boolean
  className?: string
  suffix?: string
}

const TRANSFORM_TIMING = { duration: 400, easing: 'ease-out' } as const
const SPIN_TIMING = { duration: 400, easing: 'ease-out' } as const
const OPACITY_TIMING = { duration: 300, easing: 'ease-out' } as const

export default function AnimatedTime({
  hours,
  minutes,
  seconds,
  ampm,
  padHours = true,
  className,
  suffix
}: AnimatedTimeProps) {
  const hourFormat = padHours
    ? { minimumIntegerDigits: 2 as const }
    : undefined

  return (
    <NumberFlowGroup>
      <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
        <NumberFlow
          value={hours}
          format={hourFormat}
          transformTiming={TRANSFORM_TIMING}
          spinTiming={SPIN_TIMING}
          opacityTiming={OPACITY_TIMING}
        />
        <span>:</span>
        <NumberFlow
          value={minutes}
          format={{ minimumIntegerDigits: 2 }}
          transformTiming={TRANSFORM_TIMING}
          spinTiming={SPIN_TIMING}
          opacityTiming={OPACITY_TIMING}
        />
        {seconds !== undefined && (
          <>
            <span>:</span>
            <NumberFlow
              value={seconds}
              format={{ minimumIntegerDigits: 2 }}
              transformTiming={TRANSFORM_TIMING}
              spinTiming={SPIN_TIMING}
              opacityTiming={OPACITY_TIMING}
            />
          </>
        )}
        {suffix && <span>{suffix}</span>}
        {ampm && <span className='ml-1'>{ampm}</span>}
      </span>
    </NumberFlowGroup>
  )
}
