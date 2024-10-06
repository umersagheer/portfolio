import type { Metadata } from 'next'
import { Poppins, Source_Code_Pro } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.css'
import { NextuiProvider } from './nextui-provider'
import Navbar from '@/components/navbar'
import { toastOptions } from '@/constants/toast-options'

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
        <NextuiProvider>
          <Toaster toastOptions={toastOptions} />
          <Navbar />
          <main className='container min-h-screen max-w-4xl py-10'>
            {children}
          </main>
        </NextuiProvider>
      </body>
    </html>
  )
}
