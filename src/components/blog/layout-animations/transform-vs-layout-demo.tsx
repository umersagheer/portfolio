'use client'

import { useState } from 'react'
import { Tabs } from '@heroui/react'
import DemoContainer from './demo-container'

export default function TransformVsLayoutDemo() {
  const [expanded, setExpanded] = useState(false)

  return (
    <DemoContainer title="Transform doesn't affect layout — it just paints on top">
      <div className='mb-4 flex justify-center'>
        <Tabs
          variant='primary'
          selectedKey={expanded ? 'expanded' : 'normal'}
          onSelectionChange={key => setExpanded(key === 'expanded')}
        >
          <Tabs.ListContainer>
            <Tabs.List>
              <Tabs.Tab id='normal'>
                Normal
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id='expanded'>
                Expanded
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {/* Transform panel */}
        <div className='border-border rounded-lg border p-4'>
          <p className='text-muted mb-3 text-center text-xs font-medium'>
            Using transform
          </p>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-accent h-[50px] w-[50px] rounded-md transition-all duration-500' />
            <div
              className='bg-secondary h-[50px] w-[50px] rounded-md transition-all duration-500'
              style={{
                transform: expanded ? 'scaleX(2)' : 'scaleX(1)'
              }}
            />
            <div className='bg-danger h-[50px] w-[50px] rounded-md transition-all duration-500' />
          </div>
          <p className='text-foreground mt-3 text-center text-xs'>
            {expanded
              ? 'Overlaps! No layout change.'
              : 'Middle box at normal size'}
          </p>
        </div>

        {/* Width panel */}
        <div className='border-border rounded-lg border p-4'>
          <p className='text-muted mb-3 text-center text-xs font-medium'>
            Using width
          </p>
          <div className='flex items-center justify-center gap-3'>
            <div className='bg-accent h-[50px] w-[50px] rounded-md transition-all duration-500' />
            <div
              className='bg-secondary h-[50px] rounded-md transition-all duration-500'
              style={{
                width: expanded ? 100 : 50
              }}
            />
            <div className='bg-danger h-[50px] w-[50px] rounded-md transition-all duration-500' />
          </div>
          <p className='text-foreground mt-3 text-center text-xs'>
            {expanded
              ? 'Siblings pushed — layout recalculated.'
              : 'Middle box at normal size'}
          </p>
        </div>
      </div>
    </DemoContainer>
  )
}
