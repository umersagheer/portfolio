import Link from 'next/link'
import Unplugged from '@/components/not-found/unplugged'
import { drawUnplugged } from '@/components/not-found/unplugged-drawing'

// Drawn once on the server; only the plug-in interaction runs in the browser.
const { svg, viewBox } = drawUnplugged()

const link =
  'hover:text-accent focus-visible:outline-accent rounded-sm font-medium transition-colors focus-visible:outline-2'

export default function NotFound() {
  return (
    <div className='space-y-8 py-6 text-center'>
      <div className='space-y-3'>
        <p className='font-sourceCodePro text-muted text-xs tracking-wide'>
          FIG 404 · UNPLUGGED
        </p>
        <h1 className='font-display text-4xl leading-tight'>
          This page got unplugged.
        </h1>
        <p className='text-muted mx-auto max-w-md leading-relaxed'>
          The link may be old, or the page has moved. Plug it back in to go
          home.
        </p>
      </div>
      <Unplugged svg={svg} viewBox={viewBox} />
      <p className='text-muted text-sm'>
        Or go to{' '}
        <Link href='/projects' className={link}>
          Projects
        </Link>
        ,{' '}
        <Link href='/posts' className={link}>
          Posts
        </Link>
        , or press <kbd className='font-sourceCodePro text-xs'>⌘K</kbd> to
        search.
      </p>
    </div>
  )
}
