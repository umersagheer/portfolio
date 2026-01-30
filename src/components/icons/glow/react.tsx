import * as React from 'react'
import { SVGProps } from 'react'

const IconReactGlow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={1.5}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <title>React</title>
    {/* Center dot */}
    <circle cx='12' cy='12' r='1.5' fill='currentColor' />

    {/* Horizontal ellipse */}
    <ellipse cx='12' cy='12' rx='10' ry='4' />

    {/* Diagonal ellipse (rotated 60 degrees) */}
    <ellipse
      cx='12'
      cy='12'
      rx='10'
      ry='4'
      transform='rotate(60 12 12)'
    />

    {/* Diagonal ellipse (rotated -60 degrees) */}
    <ellipse
      cx='12'
      cy='12'
      rx='10'
      ry='4'
      transform='rotate(-60 12 12)'
    />
  </svg>
)

export default IconReactGlow
