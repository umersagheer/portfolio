type DemoContainerProps = {
  children: React.ReactNode
  title?: string
}

export default function DemoContainer({ children, title }: DemoContainerProps) {
  return (
    <div className='not-prose border-border bg-surface my-8 rounded-xl border p-6'>
      {title && <p className='text-muted mb-4 text-sm font-medium'>{title}</p>}
      {children}
    </div>
  )
}
