import React from 'react'

type HeadingProps = {
  children: React.ReactNode
}

export default function Heading({ children }: HeadingProps) {
  return (
    <h3 className='font-sourceCodePro text-xl font-semibold'>{children}</h3>
  )
}
