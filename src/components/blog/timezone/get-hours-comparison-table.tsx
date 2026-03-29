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
        key: 'railway',
        location: 'Railway Virginia (EST)',
        getHours: '5 (or 4 in summer)',
        getUTCHours: '9'
    },
    {
        key: 'aws',
        location: 'AWS Mumbai (IST)',
        getHours: '14',
        getUTCHours: '9'
    },
    {
        key: 'mac',
        location: 'Your Mac (PKT)',
        getHours: '14',
        getUTCHours: '9'
    }
]

const columns = [
    { key: 'location', label: 'Server location' },
    { key: 'getHours', label: 'getHours() for 09:00 UTC' },
    { key: 'getUTCHours', label: 'getUTCHours()' }
]

export default function GetHoursComparisonTable() {
    return (
        <div className='not-prose my-6'>
            <Table
                aria-label='getHours vs getUTCHours comparison'
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
