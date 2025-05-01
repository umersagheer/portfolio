import type { Metadata } from 'next'
import { Poppins, Source_Code_Pro } from 'next/font/google'

import './globals.css'
import { HerouiProvider } from './nextui-provider'
import { cn, ScrollShadow } from '@heroui/react'
import { GridPattern } from '@/components/grid-patterns'
import { Navbar } from '@/components/navbar'
import { usePathname } from 'next/navigation'
import Gradient from '@/components/gradient'

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

export const metadata: Metadata = {
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
          <main className='container min-h-screen max-w-3xl py-20'>
            <div className='fixed inset-0 z-[-1] max-w-3xl translate-x-1/3 opacity-70 md:translate-x-1/2'>
              <Gradient />
              <GridPattern
                squares={[
                  [3, 10],
                  [8, 2],
                  [5, 6],
                  [8, 7],
                  [6, 9]
                ]}
                className={cn(
                  '[mask-image:linear-gradient(135deg,white_0%,white_30%,transparent_40%)]',
                  'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
                )}
              />
            </div>
            {children}
          </main>
        </HerouiProvider>
      </body>
    </html>
  )
}
