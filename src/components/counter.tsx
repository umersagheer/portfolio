'use client'

import { Button } from '@nextui-org/react'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(count + 1)
  const decrement = () => setCount(count - 1)

  return (
    <div className='flex items-center gap-3'>
      <Button isIconOnly onClick={decrement}>
        <MinusIcon />
      </Button>
      <p>Interact: {count}</p>
      <Button isIconOnly onClick={increment}>
        <PlusIcon />
      </Button>
    </div>
  )
}
