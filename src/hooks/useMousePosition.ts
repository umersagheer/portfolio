import { useEffect, useState, RefObject } from 'react'

interface MousePosition {
  x: number
  y: number
  isInside: boolean
}

export function useMousePosition(ref: RefObject<HTMLElement>): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    isInside: false
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      setMousePosition({ x, y, isInside: true })
    }

    const handleMouseEnter = () => {
      setMousePosition((prev) => ({ ...prev, isInside: true }))
    }

    const handleMouseLeave = () => {
      setMousePosition((prev) => ({ ...prev, isInside: false }))
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref])

  return mousePosition
}
