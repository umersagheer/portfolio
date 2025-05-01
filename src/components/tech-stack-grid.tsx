import { Card, CardBody } from '@heroui/react'
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
        <Card className='border border-default-100 stroke-[0.1] hover:stroke-[0.2]'>
          <CardBody className='flex-row items-center'>
            React <IconBrandReact /> / Nextjs <IconBrandNextjs />
          </CardBody>
        </Card>
        <Card>
          <CardBody className='flex-row items-center'>
            NodeJs <IconBrandNodejs />
          </CardBody>
        </Card>
        <Card className='lg:row-span-2'>
          <CardBody className='flex-row items-center'>
            React native <IconBrandReactNative />
          </CardBody>
        </Card>
        <Card className='lg:col-span-2'>
          <CardBody className='flex-row items-center'>
            Prisma <IconBrandPrisma />
          </CardBody>
        </Card>
        <Card>
          <CardBody className='flex-row items-center'>
            Redux toolkit
            <IconBrandRedux />
          </CardBody>
        </Card>
        <Card className='lg:col-span-2'>
          <CardBody className='flex-row items-center'>
            Git <IconBrandGit /> / Docker
            <IconBrandDocker />
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
