'use client'

import {
  Accordion,
  AccordionItem,
  toast,
  Chip,
  Link,
  ScrollShadow
} from '@heroui/react'
import React from 'react'
import { ProjectType } from '@/content/projects'
import {
  IconBrandGithub,
  IconEngineFilled,
  IconLink
} from '@tabler/icons-react'
import Image from 'next/image'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogImage,
  MorphingDialogDescription,
  MorphingDialogClose
} from '@/components/ui/morphing-dialog'
import ScreenshotMarquee from '@/components/ui/screenshot-marquee'

type ProjectProps = {
  projects: ProjectType[]
}

export default function Projects({ projects }: ProjectProps) {
  return (
    <div className='space-y-3'>
      {projects.map(project => (
        <MorphingDialog key={project.title}>
          {/* Card Trigger */}
          <MorphingDialogTrigger
            className='bg-content1 hover:bg-content2 active:bg-content3 cursor-pointer overflow-hidden rounded-lg px-3 py-4 transition-colors duration-250'
            style={{ borderRadius: 8 }}
          >
            <div className='flex items-center gap-2'>
              <MorphingDialogImage className='flex-shrink-0'>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={40}
                  height={30}
                />
              </MorphingDialogImage>
              <div>
                <MorphingDialogTitle className='text-lg font-bold'>
                  {project.title}
                </MorphingDialogTitle>
                <MorphingDialogSubtitle className='text-default-500 line-clamp-1 text-sm'>
                  {project.subTitle}
                </MorphingDialogSubtitle>
              </div>
            </div>
          </MorphingDialogTrigger>

          {/* Expanded Dialog */}
          <MorphingDialogContainer>
            <MorphingDialogContent
              className='bg-content1 relative w-full max-w-2xl overflow-hidden rounded-xl p-6 shadow-xl'
              style={{ borderRadius: 12 }}
            >
              <MorphingDialogClose />

              {/* Shared Layout Elements */}
              <div className='flex items-center gap-3'>
                <MorphingDialogImage className='flex-shrink-0'>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={60}
                    height={50}
                  />
                </MorphingDialogImage>
                <div>
                  <MorphingDialogTitle className='text-xl font-bold'>
                    {project.title}
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className='text-default-500 text-base font-semibold'>
                    {project.subTitle}
                  </MorphingDialogSubtitle>
                </div>
              </div>

              {/* Non-shared Content */}
              <MorphingDialogDescription className='mt-4 space-y-4'>
                {/* Screenshot Marquee */}
                {project.screenshots?.length > 0 && (
                  <ScreenshotMarquee
                    screenshots={project.screenshots}
                    variant='3d'
                    // speed={55}
                  />
                )}

                {/* Links */}
                <div className='flex items-center gap-2'>
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Chip
                        size='sm'
                        className='inline-flex items-center gap-1'
                      >
                        <IconLink className='size-5' />
                        Live Link
                      </Chip>
                    </Link>
                  )}
                  {project.codeLink && (
                    <button
                      type='button'
                      onClick={() =>
                        toast('Access Restricted', {
                          description:
                            'This code is private and cant be viewed.',
                          variant: 'warning'
                        })
                      }
                    >
                      <Chip
                        size='sm'
                        className='inline-flex items-center gap-1'
                      >
                        <IconBrandGithub className='size-5' />
                        Code
                      </Chip>
                    </button>
                  )}
                </div>

                {/* Tech Stack */}
                <Accordion isCompact>
                  <AccordionItem
                    key='tech'
                    aria-label='Tech Stack'
                    title={
                      <div className='flex items-center gap-2'>
                        <IconEngineFilled size={20} />
                        <span>Tech Stack</span>
                      </div>
                    }
                    classNames={{ title: 'text-sm font-semibold' }}
                  >
                    <div className='flex flex-wrap gap-2 pb-2'>
                      {project.tech.map(({ name, icon }) => (
                        <Chip
                          key={name}
                          className='inline-flex items-center gap-1'
                        >
                          {icon}
                          {name}
                        </Chip>
                      ))}
                    </div>
                  </AccordionItem>
                </Accordion>

                {/* Description & Features */}
                <ScrollShadow className='max-h-48 pr-1'>
                  <p className='text-sm'>{project.description}</p>
                  {project.features && (
                    <>
                      <h3 className='text-medium mt-4 font-semibold'>
                        Key Features
                      </h3>
                      <ul className='mt-1 list-disc space-y-1 text-base'>
                        {project.features.map((feature, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='text-primary mt-1'>
                              {feature.icon}
                            </span>
                            <span>{feature.title}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </ScrollShadow>
              </MorphingDialogDescription>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  )
}
