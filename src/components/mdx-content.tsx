import { JSX } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import Counter from '@/components/counter'
import { slugify } from '@/libs/toc'

function Code({ children, ...props }: any) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function HeadingTwo({
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  const text = typeof children === 'string' ? children : ''
  const id = slugify(text)
  return (
    <h2 id={id} {...props}>
      {children}
    </h2>
  )
}

function HeadingThree({
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) {
  const text = typeof children === 'string' ? children : ''
  const id = slugify(text)
  return (
    <h3 id={id} {...props}>
      {children}
    </h3>
  )
}

const components = {
  code: Code,
  h2: HeadingTwo,
  h3: HeadingThree,
  Counter
}

export default function MDXContent(
  props: JSX.IntrinsicAttributes & MDXRemoteProps
) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
