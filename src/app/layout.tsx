import type { Metadata } from 'next'
import { Poppins, Source_Code_Pro } from 'next/font/google'

import './globals.css'
import { HerouiProvider } from './nextui-provider'
import Navbar from '@/components/navbar'

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
          <main className='container min-h-screen max-w-3xl py-10'>
            <div className='pointer-events-none fixed inset-0 -z-10 flex items-center justify-center bg-white bg-dot-black/[0.2] dark:bg-black dark:bg-dot-white/[0.2]'></div>
            <div className='pointer-events-none fixed inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-background'></div>
            {children}
          </main>
        </HerouiProvider>
      </body>
    </html>
  )
}
