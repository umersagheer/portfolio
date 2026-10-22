import Link from 'next/link'

type SectionHeaderProps = {
  index: string
  label: string
  title: string
  href?: string
  linkText?: string
}

// "01 · Work" label over a serif title. The label is the section's one live
// mark: it turns accent while the section is being read (see live-sections).
export default function SectionHeader({
  index,
  label,
  title,
  href,
  linkText
}: SectionHeaderProps) {
  return (
    <div className='mb-6 space-y-2'>
      <p className='section-label font-sourceCodePro text-muted text-xs tracking-wide'>
        {index} · {label}
      </p>
      <div className='flex items-baseline justify-between gap-4'>
        <h2 className='font-display text-3xl leading-tight'>{title}</h2>
        {href && linkText && (
          <Link
            href={href}
            className='text-muted hover:text-accent shrink-0 text-sm font-medium transition-colors'
          >
            {linkText} →
          </Link>
        )}
      </div>
    </div>
  )
}
