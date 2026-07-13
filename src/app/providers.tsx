'use client'

import QueryProvider from './query-provider'

interface ProvidersProp {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProp) {
  return <QueryProvider>{children}</QueryProvider>
}
