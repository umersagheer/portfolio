import { Link } from '@nextui-org/react'
import React from 'react'

export default function Posts() {
  return (
    <div>
      <h1>Posts Page</h1>
      <ul>
        <Link href={'/posts/intro-to-mdx'} isBlock>
          <li>intro to mdx</li>
        </Link>
      </ul>
    </div>
  )
}
