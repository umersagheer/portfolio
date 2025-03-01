// app/providers.tsx
'use client'

import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

export function HerouiProvider({ children }: { children: React.ReactNode }) {
  const navigate = useRouter()
  return (
    <HeroUIProvider navigate={navigate.push}>
      <NextThemesProvider
        attribute='class'
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
