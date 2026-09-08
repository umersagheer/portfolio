'use client'

import { Table } from '@heroui/react'

const rows = [
  {
    key: 'railway',
    location: 'US East server (UTC-5 / UTC-4)',
    getHours: '4 or 5',
    getUTCHours: '9'
  },
  {
    key: 'aws',
    location: 'Mumbai server (UTC+5:30)',
    getHours: '14',
    getUTCHours: '9'
  },
  {
    key: 'mac',
    location: 'Developer laptop (UTC+5)',
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
      <Table>
        <Table.ScrollContainer className='overflow-x-auto'>
          <Table.Content aria-label='getHours vs getUTCHours comparison'>
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
