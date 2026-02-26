'use client'

import { getIcon } from '@/libs/utils'
import { addToast, Button, Chip, Link } from '@heroui/react'
import React from 'react'
import { ProjectType } from '@/content/projects'
import { IconBrandGithub, IconLink } from '@tabler/icons-react'
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
  MorphingDialogClose,
  useMorphingDialog
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
            className='cursor-pointer bg-content1 px-3 py-4 transition-colors duration-250 hover:bg-content2 active:bg-content3'
            style={{ borderRadius: '0.5rem' }}
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
                <MorphingDialogSubtitle className='line-clamp-1 text-sm text-default-500'>
                  {project.subTitle}
                </MorphingDialogSubtitle>
              </div>
            </div>
          </MorphingDialogTrigger>

          {/* Expanded Dialog */}
          <MorphingDialogContainer>
            <MorphingDialogContent
              className='relative w-full max-w-2xl overflow-hidden bg-content1 p-6 shadow-xl'
              style={{ borderRadius: '0.75rem' }}
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
                  <MorphingDialogSubtitle className='text-base font-semibold text-default-500'>
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
                    <Chip
                      size='sm'
                      as={Link}
                      startContent={<IconLink className='size-5' />}
                      aria-pressed
                      isExternal
                      href={project.liveLink}
                    >
                      Live Link
                    </Chip>
                  )}
                  {project.codeLink && (
                    <Chip
                      size='sm'
                      aria-pressed
                      as={Link}
                      isExternal
                      onPress={() =>
                        addToast({
                          title: 'Access Restricted',
                          description:
                            'This code is private and cant be viewed.',
                          variant: 'flat',
                          color: 'warning'
                        })
                      }
                      startContent={
                        <IconBrandGithub className='size-5' />
                      }
                    >
                      Code
                    </Chip>
                  )}
                </div>

                {/* Tech Chips */}
                <div className='flex flex-wrap gap-1'>
                  {project.tech.map(({ name }) => (
                    <Chip
                      key={name}
                      startContent={getIcon(name)}
                      size='sm'
                    >
                      {name}
                    </Chip>
                  ))}
                </div>

                {/* Description & Features */}
                <div className='max-h-48 overflow-y-auto pr-1'>
                  <p className='text-sm'>{project.description}</p>
                  {project.features && (
                    <>
                      <h3 className='mt-4 text-medium font-semibold'>
                        Key Features
                      </h3>
                      <ul className='mt-1 list-disc space-y-1 text-base'>
                        {project.features.map((feature, index) => (
                          <li
                            key={index}
                            className='flex items-start gap-2'
                          >
                            <span className='mt-1 text-primary'>
                              {feature.icon}
                            </span>
                            <span>{feature.title}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Close Button */}
                <div className='flex justify-end'>
                  <CloseButton />
                </div>
              </MorphingDialogDescription>
            </MorphingDialogContent>
          </MorphingDialogContainer>
        </MorphingDialog>
      ))}
    </div>
  )
}

function CloseButton() {
  const { setIsOpen } = useMorphingDialog()

  return (
    <Button variant='light' onPress={() => setIsOpen(false)}>
      Close
    </Button>
  )
}
