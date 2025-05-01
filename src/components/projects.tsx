'use client'

import { getIcon } from '@/libs/utils'
import {
  addToast,
  Button,
  Chip,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ScrollShadow
} from '@heroui/react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectType } from '@/content/projects'
import { IconBrandGithub, IconLink } from '@tabler/icons-react'
import Image from 'next/image'
import { BlurFade } from './blur-fade'

type ProjectProps = {
  projects: ProjectType[]
}

export default function Projects({ projects }: ProjectProps) {
  const [selected, setSelected] = useState<ProjectType | null>(null)
  return (
    <>
      <div className='space-y-3'>
        {projects.map(project => (
          <motion.div
            key={project.title}
            layoutId={`project-${project.title}`}
            className='cursor-pointer rounded-lg bg-content1 px-2 py-4 transition-all duration-250 hover:bg-content2 active:bg-content3'
            onClick={() => setSelected(project)}
          >
            <motion.h3
              layoutId={`title-${project.title}`}
              className='text-lg font-bold'
            >
              {project.title}
            </motion.h3>

            {/* Sub Title */}
            <motion.div
              layoutId={`subTitle-${project.title}`}
              className='flex items-center gap-1'
            >
              <Image
                src={project.image}
                alt={project.title}
                width={40}
                height={30}
              />
              <motion.p className='line-clamp-1 text-sm'>
                {project.subTitle}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <Modal
            size='xl'
            isOpen={true}
            onOpenChange={() => setSelected(null)}
            backdrop='transparent'
            // classNames={{
            // backdrop:
            // 'bg-gradient-to-br from-primary/20 to-transparent backdrop-opacity-30'
            // }}
            hideCloseButton
            motionProps={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.25 }
            }}
          >
            <ModalContent className='overflow-hidden'>
              {onClose => (
                <ModalBody>
                  <motion.div
                    layoutId={`project-${selected.title}`}
                    className='space-y-2 rounded-lg bg-content1'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.h2
                      layoutId={`title-${selected.title}`}
                      className='text-xl font-bold'
                    >
                      {selected.title}
                    </motion.h2>

                    {/* Sub Title */}
                    <motion.div
                      layoutId={`subTitle-${selected.title}`}
                      className='flex items-center gap-2'
                    >
                      <Image
                        src={selected.image}
                        alt={selected.title}
                        width={60}
                        height={50}
                      />
                      <motion.p className='line-clamp-1 text-base font-semibold'>
                        {selected.subTitle}
                      </motion.p>
                    </motion.div>

                    {/* Links */}
                    <BlurFade
                      className='flex items-center justify-start gap-2'
                      inView
                      delay={0.25}
                    >
                      {selected.liveLink && (
                        <Chip
                          size='sm'
                          as={Link}
                          startContent={<IconLink className='size-5' />}
                          aria-pressed
                          isExternal
                          href={selected.liveLink}
                        >
                          Live Link
                        </Chip>
                      )}
                      {selected.codeLink && (
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
                          startContent={<IconBrandGithub className='size-5' />}
                        >
                          Code
                        </Chip>
                      )}
                    </BlurFade>

                    {/* Tech Chips */}
                    <BlurFade
                      className='flex flex-wrap justify-start'
                      inView
                      delay={0.35}
                    >
                      {selected.tech.map(({ name }) => (
                        <Chip
                          key={name}
                          startContent={getIcon(name)}
                          size='sm'
                          className='scale-90'
                        >
                          {name}
                        </Chip>
                      ))}
                    </BlurFade>

                    {/* Description */}
                    <ScrollShadow className='h-72' hideScrollBar>
                      <BlurFade inView delay={0.45}>
                        <p className='text-sm'>{selected.description}</p>
                        <h3 className='mt-4 text-medium font-semibold'>
                          Key Features
                        </h3>
                        {selected.features && (
                          <ul className='mt-1 list-disc space-y-1 text-base'>
                            {selected.features.map((feature, index) => (
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
                        )}
                      </BlurFade>
                    </ScrollShadow>
                    <ModalFooter>
                      <Button
                        variant='light'
                        onPress={() => {
                          onClose()
                          setSelected(null)
                        }}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </motion.div>
                </ModalBody>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
