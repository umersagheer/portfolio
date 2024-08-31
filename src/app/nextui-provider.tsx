// app/providers.tsx
'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function NextuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
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
