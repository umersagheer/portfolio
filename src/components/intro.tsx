'use client'

import { Image } from "@heroui/react"
import React from 'react'

export default function Intro() {
  return (
    <div className='flex flex-col items-start justify-center'>
      <div className='flex items-center justify-start gap-3'>
        <Image
          src='/images/authors/intro.jpeg'
          alt='Umer'
          width={80}
          height={80}
          className='size-20 grayscale'
          isZoomed
        />
        <div className=''>
          <h2 className='font-sourceCodePro text-2xl font-bold'>
            Umer Sagheer
          </h2>
          <h3 className='text-sm font-medium'>Software Engineer</h3>
        </div>
      </div>
      <div className='mt-5 max-w-2xl space-y-1'>
        <h3 className='font-sourceCodePro text-xl font-semibold'>About</h3>
        <p className='text-small tracking-wide'>
          I&apos;m a software engineer based in Pakistan specializing in
          web-based solutions. I build robust and innovative digital systems
          tailored to your business needs&#44; driving efficiency and growth.
        </p>
      </div>
    </div>
  )
}
