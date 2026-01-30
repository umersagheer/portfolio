import * as React from 'react'
import { SVGProps } from 'react'
const IconPostgreSQL = (props: SVGProps<SVGSVGElement>) => (
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
    <title>PostgreSQL</title>
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    {/* Simplified elephant outline */}
    <path d='M12 3c-3 0-5.5 2.5-5.5 5.5 0 1.5.6 2.9 1.5 3.9' />
    <path d='M8 12.4c-.5 1-.8 2.1-.8 3.3 0 3.9 3.1 7 7 7 1.5 0 2.9-.5 4-1.3' />
    <path d='M18.5 21.5c1.4-.8 2.3-2.3 2.3-4 0-1.2-.5-2.4-1.3-3.2' />
    <path d='M19.5 14.3c.9-1 1.5-2.4 1.5-3.8 0-3-2.5-5.5-5.5-5.5' />
    <path d='M12 4v18' />
    <circle cx='9.5' cy='8.5' r='0.5' fill='currentColor' />
    <circle cx='14.5' cy='8.5' r='0.5' fill='currentColor' />
    <path d='M9 15c.5.5 1.5 1 3 1s2.5-.5 3-1' />
  </svg>
)
export default IconPostgreSQL
