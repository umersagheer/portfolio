'use client'

import { SVGGlowWrapper } from './svg-glow-wrapper'
import { IconReact, IconNext } from './icons'
import { Card, CardBody } from '@heroui/react'

export function TestGlowCard() {
  return (
    <Card className='max-w-md'>
      <CardBody className='flex flex-col gap-4 p-8'>
        <h3 className='text-xl font-semibold'>React + Next.js</h3>
        <p className='text-sm text-default-500'>Full-stack React Framework</p>

        <div className='flex gap-6 items-center justify-center mt-4 border'>
          {/* React Icon with Glow */}
          <SVGGlowWrapper size={96}>
            <IconReact />
          </SVGGlowWrapper>

          {/* Next.js Icon with Glow */}
          <SVGGlowWrapper size={96}>
            <IconNext />
          </SVGGlowWrapper>
        </div>

        <p className='text-xs text-center text-default-400 mt-2'>
          Hover over the icons to see the glow effect
        </p>
      </CardBody>
    </Card>
  )
}
