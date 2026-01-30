'use client'

import { useRef, useState } from 'react'
import { Card, CardBody } from '@heroui/react'
import ReactGlow from './react-glow'

export function GlowCardTest() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [mouseOnCard, setMouseOnCard] = useState(false)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setCursor({ x, y })
    }
  }

  return (
    <Card
      ref={cardRef}
      className='max-w-md stroke-[0.1] hover:stroke-[0.15] transition-all'
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setMouseOnCard(true)}
      onMouseLeave={() => setMouseOnCard(false)}
    >
      <CardBody className='flex flex-col items-center gap-6 p-12'>
        <h3 className='text-2xl font-semibold'>React</h3>
        <p className='text-sm text-default-500 text-center'>
          JavaScript library for building user interfaces
        </p>

        {/* ReactGlow component - just like Flame */}
        <ReactGlow cursor={cursor} cardRef={cardRef} mouseOnCard={mouseOnCard} />

        <p className='text-xs text-default-400 text-center'>
          Hover over the card to see the glow effect
        </p>
      </CardBody>
    </Card>
  )
}
