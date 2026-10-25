import TheSvgIcon from '@/components/blog/shared/the-svg-icon'
import type { ProjectMeta } from '@/libs/projects'

// The first few entries of `stack` are the core tools (order them that way in
// the frontmatter); the rest are one click away in a native <details>.
const CORE = 5

export default function StackList({ stack }: { stack: ProjectMeta['stack'] }) {
  const core = stack.slice(0, CORE)
  const rest = stack.slice(CORE)

  return (
    <div className='space-y-2'>
      <ul aria-label='Core stack' className='flex flex-wrap gap-x-3 gap-y-1.5'>
        {core.map(item => (
          <li
            key={item.name}
            className='inline-flex items-center gap-1.5 text-sm'
          >
            {item.icon && <TheSvgIcon slug={item.icon} size={12} />}
            {item.name}
          </li>
        ))}
      </ul>
      {rest.length > 0 && (
        <details className='group'>
          <summary className='font-sourceCodePro text-muted hover:text-foreground w-fit cursor-pointer list-none text-xs transition-colors [&::-webkit-details-marker]:hidden'>
            <span className='group-open:hidden'>+{rest.length} more</span>
            <span className='hidden group-open:inline'>Show less</span>
          </summary>
          <p className='text-muted mt-1.5 text-xs leading-relaxed'>
            {rest.map(item => item.name).join(' · ')}
          </p>
        </details>
      )}
    </div>
  )
}
