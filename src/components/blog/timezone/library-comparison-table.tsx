'use client'

import { Table } from '@heroui/react'

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
      <Table>
        <Table.ScrollContainer className='overflow-x-auto'>
          <Table.Content aria-label='Date library comparison'>
            <Table.Header>
              {columns.map((col, i) => (
                <Table.Column
                  key={col.key}
                  id={col.key}
                  isRowHeader={i === 0}
                  className='text-[11px] font-semibold tracking-wider uppercase'
                >
                  {col.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {rows.map(row => (
                <Table.Row key={row.key} id={row.key}>
                  {columns.map(col => (
                    <Table.Cell key={col.key} className='text-xs'>
                      {row[col.key as keyof typeof row]}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  )
}
