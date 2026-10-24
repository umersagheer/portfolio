import Link from 'next/link'
import GithubActivity from '@/components/about/github-activity'
import { ICONS, type IconSlug } from '@/components/about/journey/icons'
import {
  STEPS,
  TOOLS,
  type StepId,
  type ToolKey
} from '@/components/about/journey/steps'
import SectionHeader from '@/components/section-header'
import { siteProfile } from '@/constants/site-profile'

// The stack in five seconds: one stop per layer along a wire, read from the
// same data as the About page's figure. The full picture lives on /about.
const STOPS: { label: string; tools: ToolKey[] }[] = [
  ...(['device', 'data', 'server', 'db'] as StepId[]).map(id => {
    const step = STEPS.find(s => s.id === id)!
    const label = {
      device: 'Client',
      data: 'Data',
      server: 'Server',
      db: 'Database'
    }[id as 'device' | 'data' | 'server' | 'db']
    return { label, tools: step.main }
  }),
  { label: 'Cloud', tools: ['aws', 'railway'] }
]

function Tool({ toolKey }: { toolKey: ToolKey }) {
  const { name, icon } = TOOLS[toolKey] as { name: string; icon?: IconSlug }
  return (
    <li className='flex items-center gap-1.5 text-sm'>
      {icon && (
        <svg
          viewBox='0 0 24 24'
          width={14}
          height={14}
          aria-hidden='true'
          className='shrink-0'
        >
          <path d={ICONS[icon]} fill='currentColor' />
        </svg>
      )}
      {name}
    </li>
  )
}

export default function StackGlance() {
  return (
    <>
      <SectionHeader
        index='03'
        label='Stack'
        title='How I build'
        href='/about'
        linkText='The full picture'
      />
      <div className='relative'>
        {/* The wire the stops sit on (wide screens, where they share a row). */}
        <span
          aria-hidden='true'
          className='absolute top-[5px] right-[10%] left-0 hidden h-px sm:block'
          style={{
            background: 'color-mix(in oklab, var(--accent) 45%, var(--hair))'
          }}
        />
        <ol className='relative grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-5'>
          {STOPS.map(stop => (
            <li key={stop.label} className='space-y-2.5'>
              <span
                aria-hidden='true'
                className='border-accent bg-background block size-[11px] rounded-full border-2'
              />
              <p className='font-sourceCodePro text-muted text-xs tracking-wide uppercase'>
                {stop.label}
              </p>
              <ul className='space-y-1.5'>
                {stop.tools.map(tool => (
                  <Tool key={tool} toolKey={tool} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
      {siteProfile.showGithubActivity && <GithubActivity />}
    </>
  )
}
