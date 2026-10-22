import type { ProjectScreen } from '@/libs/projects'

type DeviceFrameProps = {
  device: ProjectScreen['device']
  children: React.ReactNode
  className?: string
}

// Hairline device outlines drawn in CSS (no photoreal chrome), so every
// project's screens share one look and follow the theme.
export default function DeviceFrame({
  device,
  children,
  className = ''
}: DeviceFrameProps) {
  if (device === 'phone') {
    return (
      <div
        className={`border-hair bg-surface mx-auto w-full max-w-[250px] rounded-[2rem] border p-1.5 ${className}`}
      >
        <div className='aspect-[390/844] overflow-hidden rounded-[1.6rem]'>
          {children}
        </div>
      </div>
    )
  }

  if (device === 'tablet') {
    return (
      <div
        className={`border-hair bg-surface rounded-2xl border p-2 ${className}`}
      >
        <div className='overflow-hidden rounded-xl'>{children}</div>
      </div>
    )
  }

  return (
    <div
      className={`border-hair bg-surface overflow-hidden rounded-xl border ${className}`}
    >
      <div
        aria-hidden='true'
        className='border-hair flex h-6 items-center gap-1.5 border-b px-3'
      >
        {[0, 1, 2].map(dot => (
          <span key={dot} className='border-hair size-2 rounded-full border' />
        ))}
      </div>
      {children}
    </div>
  )
}
