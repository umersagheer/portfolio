import * as React from 'react'
import { SVGProps } from 'react'
const IconExpo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    {...props}
  >
    <title>Expo</title>
    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
    <path d='M12 2.5c-.5 0-.8.3-1 .7L1.3 19.8c-.2.4-.3.7-.3 1 0 .6.2 1.1.7 1.6.6.8 1.6 1.3 2.3.6.5-.5 5.8-9.8 8.4-13.3.3-.4.7-.4 1 0 2.6 3.5 7.9 12.8 8.4 13.3.7.7 1.7.3 2.3-.6.6-.8.7-1.4.7-2 0-.4-8.3-15.8-9.1-17.1-.8-1.2-1-1.5-2.4-1.5h-1z' />
  </svg>
)
export default IconExpo
