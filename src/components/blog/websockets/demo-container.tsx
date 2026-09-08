type DemoContainerProps = {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function DemoContainer({
  children,
  title,
  description
}: DemoContainerProps) {
  return (
    <div className='not-prose border-border bg-surface my-8 rounded-xl border p-6'>
      {title && <p className='text-muted mb-1 text-sm font-medium'>{title}</p>}
      {description && <p className='text-muted mb-4 text-xs'>{description}</p>}
      {!description && title && <div className='mb-3' />}
      {children}
    </div>
  )
}
