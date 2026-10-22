'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { ProjectScreen } from '@/libs/projects'
import DeviceFrame from '@/components/projects/device-frame'
import ScreenImage from '@/components/projects/screen-image'

type ScreenshotGalleryProps = {
  screens: ProjectScreen[]
}

// Captioned screens; clicking one opens it large in a native <dialog>, which
// brings focus trapping and Esc-to-close for free. Phone screens show their
// full-height version there, loaded only when the dialog opens.
export default function ScreenshotGallery({ screens }: ScreenshotGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const active = openIndex === null ? null : screens[openIndex]

  const open = (index: number) => {
    setOpenIndex(index)
    dialogRef.current?.showModal()
  }

  const allPhones = screens.every(screen => screen.device === 'phone')

  return (
    <>
      <div
        className={`grid gap-x-6 gap-y-10 ${
          allPhones ? 'grid-cols-2 sm:grid-cols-3' : 'sm:grid-cols-2'
        }`}
      >
        {screens.map((screen, index) => (
          <figure key={screen.src} className='space-y-3'>
            <button
              type='button'
              onClick={() => open(index)}
              aria-label={`Enlarge: ${screen.alt}`}
              className='focus-visible:outline-accent block w-full cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4'
            >
              <DeviceFrame device={screen.device}>
                <ScreenImage
                  screen={screen}
                  sizes={
                    screen.device === 'phone'
                      ? '250px'
                      : '(max-width: 640px) 100vw, 360px'
                  }
                />
              </DeviceFrame>
            </button>
            {screen.caption && (
              <figcaption className='font-sourceCodePro text-muted text-center text-xs'>
                {screen.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active?.alt}
        onClose={() => setOpenIndex(null)}
        onClick={event => {
          // A click on the backdrop (the dialog element itself) closes it.
          if (event.target === event.currentTarget) dialogRef.current?.close()
        }}
        className='border-hair bg-background text-foreground m-auto max-h-[92vh] max-w-[min(94vw,1100px)] overflow-hidden rounded-xl border p-0 backdrop:bg-black/75'
      >
        {active && (
          <div className='flex max-h-[92vh] flex-col'>
            <div className='border-hair flex items-center justify-between gap-4 border-b px-4 py-2.5'>
              <p className='font-sourceCodePro text-muted truncate text-xs'>
                {active.caption ?? active.alt}
              </p>
              <button
                type='button'
                onClick={() => dialogRef.current?.close()}
                className='text-muted hover:text-foreground focus-visible:outline-accent rounded-md px-2 py-1 text-sm focus-visible:outline-2'
              >
                Close <span className='font-sourceCodePro text-xs'>esc</span>
              </button>
            </div>
            <div className='overflow-y-auto'>
              {active.full ? (
                <Image
                  src={active.full.src}
                  alt={active.alt}
                  width={active.full.width}
                  height={active.full.height}
                  sizes='390px'
                  className='mx-auto w-[390px] max-w-full'
                />
              ) : (
                <div
                  className={
                    active.device === 'phone'
                      ? 'mx-auto w-[390px] max-w-full'
                      : ''
                  }
                >
                  <ScreenImage
                    screen={active}
                    sizes='(max-width: 1100px) 94vw, 1100px'
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
