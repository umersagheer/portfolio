'use client'

import { useState } from 'react'
import { Tab, Tabs } from '@heroui/react'
import DemoContainer from './demo-container'

export default function TransformVsLayoutDemo() {
  const [expanded, setExpanded] = useState(false)

  return (
    <DemoContainer title="Transform doesn't affect layout — it just paints on top">
      <div className='mb-4 flex justify-center'>
        <Tabs
          size='sm'
          variant='bordered'
          radius='sm'
          selectedKey={expanded ? 'expanded' : 'normal'}
          onSelectionChange={key => setExpanded(key === 'expanded')}
        >
          <Tab key='normal' title='Normal' />
          <Tab key='expanded' title='Expanded' />
        </Tabs>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {/* Transform panel */}
        <div className='rounded-lg border border-default-200 p-4'>
          <p className='mb-3 text-center text-xs font-medium text-default-500'>
            Using transform
          </p>
          <div className='flex items-center justify-center gap-3'>
            <div className='h-[50px] w-[50px] rounded-md bg-primary-400 transition-all duration-500' />
            <div
              className='h-[50px] w-[50px] rounded-md bg-secondary-400 transition-all duration-500'
              style={{
                transform: expanded ? 'scaleX(2)' : 'scaleX(1)'
              }}
            />
            <div className='h-[50px] w-[50px] rounded-md bg-danger-400 transition-all duration-500' />
          </div>
          <p className='mt-3 text-center text-xs text-default-600'>
            {expanded
              ? 'Overlaps! No layout change.'
              : 'Middle box at normal size'}
          </p>
        </div>

        {/* Width panel */}
        <div className='rounded-lg border border-default-200 p-4'>
          <p className='mb-3 text-center text-xs font-medium text-default-500'>
            Using width
          </p>
          <div className='flex items-center justify-center gap-3'>
            <div className='h-[50px] w-[50px] rounded-md bg-primary-400 transition-all duration-500' />
            <div
              className='h-[50px] rounded-md bg-secondary-400 transition-all duration-500'
              style={{
                width: expanded ? 100 : 50
              }}
            />
            <div className='h-[50px] w-[50px] rounded-md bg-danger-400 transition-all duration-500' />
          </div>
          <p className='mt-3 text-center text-xs text-default-600'>
            {expanded
              ? 'Siblings pushed — layout recalculated.'
              : 'Middle box at normal size'}
          </p>
        </div>
      </div>
    </DemoContainer>
  )
}
