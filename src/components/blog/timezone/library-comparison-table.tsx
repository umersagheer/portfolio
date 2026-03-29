'use client'

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from '@heroui/react'

const rows = [
    {
        key: 'intl',
        library: 'Intl API',
        useCase: 'Display formatting',
        bundleSize: '0 KB (built-in)'
    },
    {
        key: 'datefns',
        library: 'date-fns-tz',
        useCase: 'Lightweight timezone conversions',
        bundleSize: '~3 KB'
    },
    {
        key: 'luxon',
        library: 'Luxon',
        useCase: 'Full timezone math, DST detection',
        bundleSize: '~23 KB'
    },
    {
        key: 'dayjs',
        library: 'Day.js + tz plugin',
        useCase: 'Middle ground, chainable API',
        bundleSize: '~7 KB'
    }
]

const columns = [
    { key: 'library', label: 'Library' },
    { key: 'useCase', label: 'Use case' },
    { key: 'bundleSize', label: 'Bundle size' }
]

export default function LibraryComparisonTable() {
    return (
        <div className='not-prose my-6'>
            <Table
                aria-label='Date library comparison'
                removeWrapper
                classNames={{
                    base: 'overflow-x-auto',
                    th: 'text-[11px] font-semibold uppercase tracking-wider',
                    td: 'text-xs'
                }}
            >
                <TableHeader columns={columns}>
                    {col => <TableColumn key={col.key}>{col.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows}>
                    {row => (
                        <TableRow key={row.key}>
                            {columnKey => (
                                <TableCell>
                                    {row[columnKey as keyof typeof row]}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
