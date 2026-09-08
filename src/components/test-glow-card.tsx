'use client'

import { SVGGlowWrapper } from './svg-glow-wrapper'
import { IconReact, IconNext } from './icons'
import { Card } from '@heroui/react'

export function TestGlowCard() {
  return (
    <Card className='max-w-md'>
      <Card.Content className='flex flex-col gap-4 p-8'>
        <h3 className='text-xl font-semibold'>React + Next.js</h3>
        <p className='text-muted text-sm'>Full-stack React Framework</p>

        <div className='mt-4 flex items-center justify-center gap-6 border'>
          {/* React Icon with Glow */}
          <SVGGlowWrapper size={96}>
            <IconReact />
          </SVGGlowWrapper>

          {/* Next.js Icon with Glow */}
          <SVGGlowWrapper size={96}>
            <IconNext />
          </SVGGlowWrapper>
        </div>

        <p className='text-muted mt-2 text-center text-xs'>
          Hover over the icons to see the glow effect
        </p>
      </Card.Content>
    </Card>
  )
}
