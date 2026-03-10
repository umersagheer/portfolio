import type { Metadata } from 'next'
import { Poppins, Source_Code_Pro } from 'next/font/google'

import './globals.css'
import { HerouiProvider } from './nextui-provider'
import { cn } from '@heroui/react'
import { GridPattern } from '@/components/grid-patterns'
import { Navbar } from '@/components/navbar'
import Gradient from '@/components/gradient'
import Image from 'next/image'
import { getSiteUrl } from '@/libs/metadata'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-poppins'
})
const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900', '600'],
  variable: '--font-source-code-pro'
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Umer Sagheer',
  description: 'Personal Portfolio of Umer Sagheer'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${poppins.variable} ${sourceCodePro.variable}`}>
        <HerouiProvider>
          <Navbar />
          <div className="fixed inset-0 -z-10">
            <Image src="/backgrounds/bbblurry.svg" alt="" width={1920} height={1080} className="object-cover w-full h-full" />
          </div>
          <main className='container min-h-screen max-w-3xl py-20'>
            <div className='fixed inset-0 z-[-1] max-w-3xl translate-x-1/3 opacity-70 md:translate-x-1/2'>
            </div>
            {children}
          </main>
        </HerouiProvider>
      </body>
    </html>
  )
}
