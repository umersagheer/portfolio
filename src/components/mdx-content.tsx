import { JSX } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import Counter from '@/components/counter'
import { slugify } from '@/libs/toc'
import LayoutAnimationDemo from '@/components/blog/layout-animations/layout-animation-demo'
import LayoutIdDemo from '@/components/blog/layout-animations/layout-id-demo'
import AnimatePresenceDemo from '@/components/blog/layout-animations/animate-presence-demo'
import FlipExplainer from '@/components/blog/layout-animations/flip-explainer'
import SpringVisualizer from '@/components/blog/layout-animations/spring-visualizer'
import MorphingDialogDemo from '@/components/blog/layout-animations/morphing-dialog-demo'
import TransformVsLayoutDemo from '@/components/blog/layout-animations/transform-vs-layout-demo'

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

function Anchor({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = href?.startsWith('http')
  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}

const components = {
  code: Code,
  a: Anchor,
  h2: HeadingTwo,
  h3: HeadingThree,
  Counter,
  LayoutAnimationDemo,
  LayoutIdDemo,
  AnimatePresenceDemo,
  FlipExplainer,
  SpringVisualizer,
  MorphingDialogDemo,
  TransformVsLayoutDemo
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
