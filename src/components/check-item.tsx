'use client'

import { Checkbox } from '@heroui/react'

// Extracted from mdx-content.tsx: HeroUI v3 is client-only, and mdx-content is
// a server component (next-mdx-remote/rsc), so the Checkbox needs its own
// client boundary.
export default function CheckItem({ label }: { label: string }) {
  return (
    <div className='my-1'>
      <Checkbox defaultSelected={false} className='rounded-sm'>
        <Checkbox.Content>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <span className='text-foreground text-sm'>{label}</span>
        </Checkbox.Content>
      </Checkbox>
    </div>
  )
}
