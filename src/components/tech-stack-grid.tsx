import { Card } from '@heroui/react'
import React from 'react'
import Heading from './heading'
import {
  IconBrandDocker,
  IconBrandGit,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandPrisma,
  IconBrandReact,
  IconBrandReactNative,
  IconBrandRedux
} from '@tabler/icons-react'

export default function TechStackGrid() {
  return (
    <div className='flex flex-col gap-1'>
      <Heading>What I work with...</Heading>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='border-default-100 border stroke-[0.1] hover:stroke-[0.2]'>
          <Card.Content className='flex-row items-center'>
            React <IconBrandReact /> / Nextjs <IconBrandNextjs />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className='flex-row items-center'>
            NodeJs <IconBrandNodejs />
          </Card.Content>
        </Card>
        <Card className='lg:row-span-2'>
          <Card.Content className='flex-row items-center'>
            React native <IconBrandReactNative />
          </Card.Content>
        </Card>
        <Card className='lg:col-span-2'>
          <Card.Content className='flex-row items-center'>
            Prisma <IconBrandPrisma />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className='flex-row items-center'>
            Redux toolkit
            <IconBrandRedux />
          </Card.Content>
        </Card>
        <Card className='lg:col-span-2'>
          <Card.Content className='flex-row items-center'>
            Git <IconBrandGit /> / Docker
            <IconBrandDocker />
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
