// app/providers.tsx
'use client'

import { Toast } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { RouterProvider } from 'react-aria-components'

// HeroUI v3 needs no HeroUIProvider. Client-side routing for Link components,
// which v2 got from HeroUIProvider's `navigate` prop, now comes from React
// Aria's RouterProvider. Toasts need their own provider.
export function HerouiProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <RouterProvider navigate={router.push}>
      <NextThemesProvider
        attribute='class'
        enableSystem
        disableTransitionOnChange
      >
        <Toast.Provider placement='top end' />
        {children}
      </NextThemesProvider>
    </RouterProvider>
  )
}
