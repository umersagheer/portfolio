'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, Tab, Alert } from '@heroui/react'
import DemoContainer from './demo-container'

type ORM = 'prisma' | 'typeorm' | 'drizzle'

const ORM_DATA: Record<
    ORM,
    {
        name: string
        schema: string
        sqlType: string
        tzAware: boolean
        fix: string
        fixSchema: string
        gotcha: string
    }
> = {
    prisma: {
        name: 'Prisma',
        schema: `model Order {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  //        ^^^^^^^^
  //  Maps to: timestamp(3) WITHOUT time zone
  //  Prisma's default — no timezone awareness!
}`,
        sqlType: 'timestamp(3) without time zone',
        tzAware: false,
        fix: '@db.Timestamptz(3)',
        fixSchema: `model Order {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now()) @db.Timestamptz(3)
  //                                 ^^^^^^^^^^^^^^^^^
  //  Now maps to: timestamptz(3)
  //  PostgreSQL handles UTC conversion natively
}`,
        gotcha:
            'Raw SQL queries using AT TIME ZONE on the default timestamp type behave counterintuitively — the single AT TIME ZONE trap.'
    },
    typeorm: {
        name: 'TypeORM',
        schema: `@Entity()
class Order {
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date
  //  You choose the type in the decorator.
  //  'timestamp' = without timezone
  //  'timestamptz' = with timezone
}`,
        sqlType: 'timestamp (you choose)',
        tzAware: false,
        fix: "{ type: 'timestamptz' }",
        fixSchema: `@Entity()
class Order {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date
  //                        ^^^^^^^^^^^^
  //  Explicitly opt into timezone-aware type
}`,
        gotcha:
            "When reading bare timestamps, TypeORM may interpret them as the server's local time, not UTC. Set connection option: -c timezone=UTC"
    },
    drizzle: {
        name: 'Drizzle',
        schema: `const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow()
  //  Default: withTimezone is false
  //  Maps to: timestamp WITHOUT time zone
})`,
        sqlType: 'timestamp without time zone',
        tzAware: false,
        fix: '{ withTimezone: true }',
        fixSchema: `const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at', {
    withTimezone: true  // ← explicit!
  }).defaultNow()
  //  Now maps to: timestamptz
})`,
        gotcha:
            "Check the mode option: 'date' returns JS Date objects, 'string' returns ISO strings. String mode avoids auto-conversion surprises."
    }
}

function CodeBlock({ code, highlight }: { code: string; highlight?: string }) {
    return (
        <div className='overflow-x-auto rounded-md bg-default-100 p-3 font-mono text-xs leading-relaxed'>
            {code.split('\n').map((line, i) => {
                const isComment = line.trimStart().startsWith('//')
                const isHighlighted = highlight && line.includes(highlight)
                return (
                    <div
                        key={i}
                        className={
                            isHighlighted
                                ? 'text-primary-600'
                                : isComment
                                    ? 'text-default-400'
                                    : 'text-default-600'
                        }
                    >
                        {line || '\u00A0'}
                    </div>
                )
            })}
        </div>
    )
}

export default function ORMComparisonDemo() {
    const [orm, setOrm] = useState<ORM>('prisma')
    const [showFix, setShowFix] = useState(false)

    const data = ORM_DATA[orm]

    return (
        <DemoContainer
            title='ORM Timezone Defaults'
            description='See what each ORM maps DateTime to — and how to opt into timezone awareness'
        >
            <Tabs
                size='sm'
                variant='bordered'
                selectedKey={orm}
                onSelectionChange={key => {
                    setOrm(key as ORM)
                    setShowFix(false)
                }}
                className='mb-4'
            >
                <Tab key='prisma' title='Prisma' />
                <Tab key='typeorm' title='TypeORM' />
                <Tab key='drizzle' title='Drizzle' />
            </Tabs>

            <div className='mb-4'>
                <div className='mb-2 flex items-center gap-2'>
                    <span className={showFix ? 'text-sm' : 'text-sm font-bold'}>
                        {showFix ? '✅' : '❌'}
                    </span>
                    <button
                        onClick={() => setShowFix(f => !f)}
                        className='text-xs font-medium text-primary-500 underline-offset-2 hover:underline'
                    >
                        {showFix ? 'Show default (problem)' : 'Show fix'}
                    </button>
                </div>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={`${orm}-${showFix}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CodeBlock
                            code={showFix ? data.fixSchema : data.schema}
                            highlight={showFix ? data.fix : undefined}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className='grid gap-2 rounded-lg bg-default-100 p-3'>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>SQL Type</span>
                    <span className='font-mono text-foreground'>
                        {showFix ? 'timestamptz' : data.sqlType}
                    </span>
                </div>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>Timezone Aware?</span>
                    <span
                        className={`font-medium ${showFix
                            ? 'text-success-600'
                            : 'text-danger-600'
                            }`}
                    >
                        {showFix ? 'Yes' : 'No (by default)'}
                    </span>
                </div>
                <div className='flex items-baseline justify-between text-xs'>
                    <span className='text-default-400'>Fix</span>
                    <code className='text-primary-600'>
                        {data.fix}
                    </code>
                </div>
            </div>

            <div className='mt-4'>
                <Alert
                    color='warning'
                    description={data.gotcha}
                    title='Gotcha'
                />
            </div>
        </DemoContainer>
    )
}
