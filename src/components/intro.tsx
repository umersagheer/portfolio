'use client'

import { Image } from '@nextui-org/react'
import React from 'react'

export default function Intro() {
  return (
    <div className='flex flex-col items-center justify-between md:flex-row'>
      <div className='max-w-2xl space-y-2'>
        <h2 className='font-sourceCodePro text-2xl font-bold'>
          Hey&#44; I&apos;m Umer
        </h2>
        <p className='text-small tracking-wide'>
          I&apos;m a software engineer based in Pakistan specializing in
          web-based solutions. I build robust and innovative digital systems
          tailored to your business needs&#44; driving efficiency and growth.
        </p>
      </div>
      <Image
        src='/images/authors/intro.jpeg'
        alt='Umer'
        width={150}
        height={150}
        className='-order-1 grayscale'
      />
    </div>
  )
}
