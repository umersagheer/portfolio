'use client'

import { Table } from '@heroui/react'

const rows = [
  {
    key: 'direction',
    feature: 'Direction',
    websocket: 'Bidirectional',
    sse: 'Server → Client',
    webrtc: 'P2P',
    webtransport: 'Bidirectional'
  },
  {
    key: 'protocol',
    feature: 'Protocol',
    websocket: 'TCP',
    sse: 'HTTP',
    webrtc: 'UDP (DTLS)',
    webtransport: 'QUIC (HTTP/3)'
  },
  {
    key: 'reconnect',
    feature: 'Reconnect',
    websocket: 'Manual',
    sse: 'Automatic',
    webrtc: 'Manual',
    webtransport: 'Automatic'
  },
  {
    key: 'best-for',
    feature: 'Best for',
    websocket: 'Chat, collab',
    sse: 'Live feeds',
    webrtc: 'Video/audio',
    webtransport: 'Gaming, streaming'
  }
]

const columns = [
  { key: 'feature', label: 'Feature' },
  { key: 'websocket', label: 'WebSocket' },
  { key: 'sse', label: 'SSE' },
  { key: 'webrtc', label: 'WebRTC' },
  { key: 'webtransport', label: 'WebTransport' }
]

export default function ProtocolComparisonTable() {
  return (
    <div className='not-prose my-6'>
      <Table>
        <Table.ScrollContainer className='overflow-x-auto'>
          <Table.Content aria-label='Protocol comparison'>
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
