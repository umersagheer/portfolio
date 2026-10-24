'use client'

import { useRef, useState, type MouseEvent } from 'react'

// "View CV" is a plain link to the PDF. On a desktop it opens the PDF in a
// native <dialog> on the page instead, loaded only then; phones keep the
// browser's own PDF viewer, since embedded PDFs don't scroll there.
export default function CvPreview({
  href,
  className
}: {
  href: string
  className?: string
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [opened, setOpened] = useState(false)

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    const desktop = window.matchMedia(
      '(min-width: 768px) and (pointer: fine)'
    ).matches
    if (!desktop || event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    setOpened(true)
    dialogRef.current?.showModal()
  }

  return (
    <>
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        onClick={open}
        className={className}
      >
        View my CV <span aria-hidden='true'>↗</span>
      </a>

      <dialog
        ref={dialogRef}
        aria-label='CV'
        onClick={event => {
          // A click on the backdrop (the dialog element itself) closes it.
          if (event.target === event.currentTarget) dialogRef.current?.close()
        }}
        className='border-hair bg-background text-foreground m-auto h-[92vh] w-[min(94vw,880px)] max-w-none overflow-hidden rounded-xl border p-0 backdrop:bg-black/75'
      >
        <div className='flex h-full flex-col'>
          <div className='border-hair flex items-center justify-between gap-4 border-b px-4 py-2.5'>
            <p className='font-sourceCodePro text-muted text-xs'>
              Umer Sagheer · CV
            </p>
            <div className='flex items-center gap-2'>
              <a
                href={href}
                download
                className='border-hair hover:border-accent hover:text-accent focus-visible:outline-accent rounded-md border px-2.5 py-1 text-sm font-medium transition-colors focus-visible:outline-2'
              >
                Download PDF <span aria-hidden='true'>↓</span>
              </a>
              <button
                type='button'
                onClick={() => dialogRef.current?.close()}
                className='text-muted hover:text-foreground focus-visible:outline-accent rounded-md px-2 py-1 text-sm focus-visible:outline-2'
              >
                Close <span className='font-sourceCodePro text-xs'>esc</span>
              </button>
            </div>
          </div>
          {opened && (
            <iframe
              src={`${href}#toolbar=0&navpanes=0&view=FitH`}
              title='Umer Sagheer, CV'
              className='h-full w-full flex-1 bg-white'
            />
          )}
        </div>
      </dialog>
    </>
  )
}
