import { useState, type RefObject, useEffect } from 'react'

interface Props {
  cursor: { x: number; y: number }
  cardRef: RefObject<HTMLElement>
  mouseOnCard: boolean
}

const ReactGlow = ({ cursor, cardRef, mouseOnCard }: Props) => {
  const [gradientCenter, setGradientCenter] = useState({ cx: '50%', cy: '50%' })

  useEffect(() => {
    if (cardRef.current && cursor.x !== null && cursor.y !== null) {
      const cardRect = cardRef.current.getBoundingClientRect()
      const cxPercentage = (cursor.x / cardRect.width) * 100
      const cyPercentage = (cursor.y / cardRect.height) * 100
      setGradientCenter({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`
      })
    }
  }, [cursor, cardRef])

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={192}
      height={192}
      viewBox='0 0 24 24'
      className='duration-200 transition-all'
    >
      <defs>
        <radialGradient
          id='reactGradient'
          gradientUnits='userSpaceOnUse'
          r='50%'
          cx={gradientCenter.cx}
          cy={gradientCenter.cy}
        >
          {mouseOnCard ? (
            <>
              <stop stopColor='hsl(var(--heroui-primary))' />
              <stop offset={1} stopColor='hsl(var(--heroui-default-400))' />
            </>
          ) : (
            <stop stopColor='hsl(var(--heroui-default-200))' />
          )}
        </radialGradient>
      </defs>

      {/* React atom icon */}
      <g fill='none' stroke='url(#reactGradient)' strokeLinecap='round' strokeLinejoin='round'>
        {/* Center nucleus */}
        <circle cx='12' cy='12' r='1.5' fill='hsl(var(--heroui-default-200))' />

        {/* Horizontal orbital */}
        <path d='M 2 12 C 2 9.5 6.5 8.5 12 8.5 C 17.5 8.5 22 9.5 22 12 C 22 14.5 17.5 15.5 12 15.5 C 6.5 15.5 2 14.5 2 12' />

        {/* Diagonal orbital 1 */}
        <path d='M 6.5 6 C 4.5 8 4 10.5 5.5 14 C 7 17.5 9.5 19.5 12.5 21 C 15 22 17 21.5 18.5 19.5 C 19.5 18 19.5 15.5 18 12 C 16.5 8.5 14 6.5 11 5 C 8.5 4 6.5 4.5 6.5 6' />

        {/* Diagonal orbital 2 */}
        <path d='M 17.5 6 C 19.5 8 20 10.5 18.5 14 C 17 17.5 14.5 19.5 11.5 21 C 9 22 7 21.5 5.5 19.5 C 4.5 18 4.5 15.5 6 12 C 7.5 8.5 10 6.5 13 5 C 15.5 4 17.5 4.5 17.5 6' />
      </g>
    </svg>
  )
}

export default ReactGlow
