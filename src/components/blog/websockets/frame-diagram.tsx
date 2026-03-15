'use client'

import DemoContainer from './demo-container'

const fields = [
  { label: 'FIN', bits: 1, color: 'bg-primary-500/20 text-primary-600', note: 'Final fragment' },
  { label: 'RSV1', bits: 1, color: 'bg-default-200 text-default-500', note: 'Reserved' },
  { label: 'RSV2', bits: 1, color: 'bg-default-200 text-default-500', note: 'Reserved' },
  { label: 'RSV3', bits: 1, color: 'bg-default-200 text-default-500', note: 'Reserved' },
  { label: 'Opcode', bits: 4, color: 'bg-secondary-500/20 text-secondary-600', note: '4 bits' },
  { label: 'MASK', bits: 1, color: 'bg-warning-500/20 text-warning-600', note: 'Masked?' },
  { label: 'Payload len', bits: 7, color: 'bg-success-500/20 text-success-600', note: '7 bits' },
  {
    label: 'Extended payload length',
    bits: 16,
    color: 'bg-success-500/10 text-success-600',
    note: 'if len = 126 → 16-bit, if 127 → 64-bit'
  },
  {
    label: 'Masking-key',
    bits: 32,
    color: 'bg-warning-500/10 text-warning-600',
    note: '0 or 4 bytes (present if MASK = 1)'
  },
  {
    label: 'Payload Data',
    bits: 0,
    color: 'bg-primary-500/10 text-primary-600',
    note: 'Variable length'
  }
]

export default function FrameDiagram() {
  return (
    <DemoContainer title='WebSocket Frame Structure'>
      {/* Bit ruler */}
      <div className='mb-1 flex items-end gap-px px-1'>
        {Array.from({ length: 32 }, (_, i) => (
          <div
            key={i}
            className='flex flex-1 justify-center text-[8px] text-default-400'
          >
            {i % 8 === 0 ? i : ''}
          </div>
        ))}
      </div>

      {/* Frame fields */}
      <div className='flex flex-col gap-1'>
        {/* Row 1: FIN + RSV + Opcode + MASK + Payload len (16 bits) */}
        <div className='flex gap-px'>
          {fields.slice(0, 7).map(f => (
            <div
              key={f.label}
              className={`flex items-center justify-center rounded-md px-1 py-2.5 text-[10px] font-semibold ${f.color}`}
              style={{ flex: f.bits }}
            >
              <span className='truncate'>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Row 2: Extended payload length (16/64 bits) */}
        <div className='flex gap-px'>
          <div
            className={`flex items-center justify-center rounded-md px-2 py-2.5 text-[10px] font-semibold ${fields[7].color}`}
            style={{ flex: 1 }}
          >
            {fields[7].label}
          </div>
        </div>

        {/* Row 3: Masking-key + Payload Data */}
        <div className='flex gap-px'>
          <div
            className={`flex items-center justify-center rounded-md px-2 py-2.5 text-[10px] font-semibold ${fields[8].color}`}
            style={{ flex: 32 }}
          >
            {fields[8].label}
          </div>
        </div>

        <div className='flex gap-px'>
          <div
            className={`flex items-center justify-center rounded-md px-2 py-3 text-[10px] font-semibold ${fields[9].color}`}
            style={{ flex: 1 }}
          >
            {fields[9].label}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className='mt-4 flex flex-wrap gap-x-4 gap-y-1.5'>
        {fields.map(f => (
          <div key={f.label} className='flex items-center gap-1.5'>
            <div className={`size-2.5 rounded-sm ${f.color.split(' ')[0]}`} />
            <span className='text-[10px] text-default-500'>
              <span className='font-medium'>{f.label}</span>
              {' — '}
              {f.note}
            </span>
          </div>
        ))}
      </div>
    </DemoContainer>
  )
}
