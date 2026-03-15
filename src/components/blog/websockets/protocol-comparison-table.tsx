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
      <Table
        aria-label='Protocol comparison'
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
