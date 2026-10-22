import type { Metadata } from 'next'

import Journey from '@/components/about/journey/journey'
import SectionHeader from '@/components/section-header'

export const metadata: Metadata = {
  title: 'About · Umer Sagheer',
  description:
    'How I build: one request, end to end, from the screen to the AI pipeline to the database, and out to the stores.'
}

export default function AboutPage() {
  return (
    <div className='space-y-12'>
      <div className='space-y-3'>
        <h1 className='font-display text-4xl leading-tight'>About</h1>
        <p className='text-muted max-w-2xl leading-relaxed'>
          I&apos;m Umer, a product engineer. I take products from the first tap
          to the database and out to the stores, and I build AI into them where
          it earns its place.
        </p>
      </div>

      <section data-section>
        <SectionHeader
          index='01'
          label='How I build'
          title='From a tap to a reply'
        />
        <p className='text-muted mb-6 max-w-2xl leading-relaxed'>
          Every product I build follows this path. The tools change with the
          problem; the thinking doesn&apos;t.
        </p>
        {/* Figures may break out of the text column on wide screens; text never does. */}
        <div className='min-[1100px]:relative min-[1100px]:left-1/2 min-[1100px]:w-[1040px] min-[1100px]:-translate-x-1/2'>
          <Journey />
        </div>
      </section>
    </div>
  )
}
