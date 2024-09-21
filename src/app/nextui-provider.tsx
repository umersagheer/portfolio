// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/navigation'

export function NextuiProvider({ children }: { children: React.ReactNode }) {
  const navigate = useRouter()
  return (
    <NextUIProvider navigate={navigate.push}>
      <NextThemesProvider
        attribute='class'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  )
}
