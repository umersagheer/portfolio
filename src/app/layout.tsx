import type { Metadata } from 'next'
import { Source_Code_Pro } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'
import { Providers } from '@/app/providers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import LiveSections from '@/components/live-sections'
import NavHistory from '@/components/nav-history'
import { siteProfile } from '@/constants/site-profile'
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

const description =
  'Full-stack developer in Lahore building web and mobile products with React, Next.js, Expo, Node.js and NestJS, plus AI with LangChain. Open to remote roles.'

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${siteProfile.name} – Full-Stack Developer (React, Node.js, AI)`,
    template: `%s · ${siteProfile.name}`
  },
  description,
  applicationName: siteProfile.name,
  authors: [{ name: siteProfile.name, url: siteUrl }],
  creator: siteProfile.name,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/rss.xml' }
  },
  openGraph: {
    type: 'website',
    siteName: siteProfile.name,
    locale: 'en_US',
    url: '/'
  },
  twitter: {
    card: 'summary_large_image',
    creator: siteProfile.socials.x.label
  }
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
          <LiveSections />
          <NavHistory />
        </Providers>
      </body>
    </html>
  )
}
