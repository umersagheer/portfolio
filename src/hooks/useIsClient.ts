import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// false on the server *and* during hydration, true on every render after.
// Use it to gate output that can only be known in the browser (the reader's
// timezone, the resolved theme) so the hydration render matches the server
// HTML; React re-renders with the real value straight after.
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
