import Image from 'next/image'
import Link from 'next/link'
import type { ProjectMeta } from '@/libs/projects'
import DeviceFrame from '@/components/projects/device-frame'
import ScreenImage from '@/components/projects/screen-image'

// A project on /projects: the first screen peeking out of a stage, then the
// facts. The whole card is the link; the accent border marks hover/focus.
export default function ProjectCard({ project }: { project: ProjectMeta }) {
  const cover = project.screens[0]

  return (
    <Link
      href={`/projects/${project.slug}`}
      className='group border-hair hover:border-accent focus-visible:outline-accent flex flex-col overflow-hidden rounded-2xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
    >
      <div className='bg-surface border-hair flex h-56 justify-center overflow-hidden border-b px-6 pt-6'>
        {cover ? (
          <DeviceFrame
            device={cover.device}
            className={cover.device === 'phone' ? 'max-w-[160px]' : 'w-full'}
          >
            <ScreenImage
              screen={cover}
              sizes={
                cover.device === 'phone'
                  ? '160px'
                  : '(max-width: 640px) 100vw, 340px'
              }
            />
          </DeviceFrame>
        ) : (
          <Image
            src={project.logo}
            alt=''
            width={72}
            height={72}
            className='size-18 self-center object-contain'
          />
        )}
      </div>
      <div className='flex flex-1 flex-col gap-2 p-5'>
        <div className='flex items-center gap-2.5'>
          <Image
            src={project.logo}
            alt=''
            width={24}
            height={24}
            className='size-6 object-contain'
          />
          <h2 className='font-semibold'>{project.title}</h2>
        </div>
        <p className='text-muted line-clamp-2 text-sm leading-relaxed'>
          {project.tagline}
        </p>
        <p className='font-sourceCodePro text-muted text-xs'>
          {project.status} · {project.platform}
        </p>
        <span className='group-hover:text-accent mt-auto pt-2 text-sm font-medium transition-colors'>
          View case study →
        </span>
      </div>
    </Link>
  )
}
