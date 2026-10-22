import type { Metadata } from 'next'
import { Source_Code_Pro } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'
import { Providers } from '@/app/providers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSiteUrl } from '@/libs/metadata'

// Headings. One self-hosted file: Fraunces 500 with the full optical-size
// axis (opsz 9-144), so every heading size gets its own drawing. next/font/
// google only exposes that axis with the whole weight range (much larger).
const fraunces = localFont({
  src: '../fonts/fraunces-opsz-500.woff2',
  weight: '500',
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: 'Times New Roman'
})
// Metadata, labels and code. A variable font: one file for every weight.
const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro'
})
// Body text uses the system sans (HeroUI's --font-sans): no download.

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
      <body className={`${fraunces.variable} ${sourceCodePro.variable}`}>
        <Providers>
          <Navbar />
          <main className='container min-h-screen max-w-3xl pt-10 pb-20'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
