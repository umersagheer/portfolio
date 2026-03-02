type DemoContainerProps = {
  children: React.ReactNode
  title?: string
}

export default function DemoContainer({ children, title }: DemoContainerProps) {
  return (
    <div className='not-prose my-8 rounded-xl border border-default-200 bg-default-50 p-6 dark:border-default-100'>
      {title && (
        <p className='mb-4 text-sm font-medium text-default-500'>{title}</p>
      )}
      {children}
    </div>
  )
}
