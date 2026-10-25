import GithubActivity from '@/components/about/github-activity'
import { ICONS, type IconSlug } from '@/components/about/journey/icons'
import {
  STEPS,
  TOOLS,
  type StepId,
  type ToolKey
} from '@/components/about/journey/steps'
import SectionHeader from '@/components/section-header'
import StackStrip from '@/components/stack-strip/stack-strip'
import { siteProfile } from '@/constants/site-profile'

// The stack in five seconds: a small Fig. 01 (screen → server → data) with
// the main tools under each stop, read from the same data as the About
// page's figure. The full picture lives on /about.
const STOPS: { label: string; step: StepId }[] = [
  { label: 'Screen', step: 'device' },
  { label: 'Server', step: 'server' },
  { label: 'Data', step: 'db' }
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
        title='One stack, end to end'
        href='/about#how-i-build'
        linkText='The full picture'
      />
      <p className='text-muted -mt-2 mb-6 max-w-2xl leading-relaxed'>
        TypeScript from the screen to the server: React and Expo up front, Node
        and NestJS behind, Postgres underneath.
      </p>
      <StackStrip />
      <ol className='mt-4 grid grid-cols-3 gap-4'>
        {STOPS.map(stop => (
          <li key={stop.label} className='space-y-2'>
            <p className='font-sourceCodePro text-muted text-xs tracking-wide uppercase'>
              {stop.label}
            </p>
            <ul className='space-y-1.5'>
              {STEPS.find(s => s.id === stop.step)!.main.map(tool => (
                <Tool key={tool} toolKey={tool} />
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {siteProfile.showGithubActivity && <GithubActivity />}
    </>
  )
}
