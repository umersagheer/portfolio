import TheSvgIcon from '@/components/blog/shared/the-svg-icon'
import type { ProjectMeta } from '@/libs/projects'

// Tech used, as small chips. Icons come from the pinned icon CDN; names
// without an icon there are shown as text only.
export default function StackList({ stack }: { stack: ProjectMeta['stack'] }) {
  return (
    <ul aria-label='Built with' className='flex flex-wrap gap-1.5'>
      {stack.map(item => (
        <li
          key={item.name}
          className='border-hair text-muted inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs'
        >
          {item.icon && <TheSvgIcon slug={item.icon} size={12} />}
          {item.name}
        </li>
      ))}
    </ul>
  )
}
