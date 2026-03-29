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
        <div className='not-prose my-8 rounded-xl border border-default-200 bg-default-50 p-6 dark:border-default-100'>
            {title && (
                <p className='mb-1 text-sm font-medium text-default-500'>{title}</p>
            )}
            {description && (
                <p className='mb-4 text-xs text-default-400'>{description}</p>
            )}
            {!description && title && <div className='mb-3' />}
            {children}
        </div>
    )
}
