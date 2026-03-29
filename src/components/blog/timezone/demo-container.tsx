'use client'

import { motion } from 'framer-motion'

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
        <motion.div
            layout
            transition={{ layout: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
            style={{ overflow: 'hidden' }}
            className='not-prose my-8 rounded-xl border border-default-200 bg-default-50 p-6'
        >
            {title && (
                <motion.p layout='position' className='mb-1 text-sm font-medium text-default-500'>
                    {title}
                </motion.p>
            )}
            {description && (
                <motion.p layout='position' className='mb-4 text-xs text-default-400'>
                    {description}
                </motion.p>
            )}
            {!description && title && <div className='mb-3' />}
            <motion.div layout='position'>
                {children}
            </motion.div>
        </motion.div>
    )
}
