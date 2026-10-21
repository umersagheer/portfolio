import { JSX } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import { slugify } from '@/libs/toc'

import {
  CheckItem,
  LayoutAnimationDemo,
  LayoutIdDemo,
  AnimatePresenceDemo,
  FlipExplainer,
  SpringVisualizer,
  MorphingDialogDemo,
  TransformVsLayoutDemo,
  HttpVsWebSocketDemo,
  HandshakeExplainer,
  LifecycleDemo,
  EnvelopePatternDemo,
  RoutingPatternsDemo,
  PubSubScalingDemo,
  FrameDiagram,
  ProtocolComparisonTable,
  ParseTrapDemo,
  DatePipelineDemo,
  TimezoneConverterDemo,
  DSTGapOverlapVisualizer,
  ScheduleSimulatorDemo,
  PastVsFutureStorageDemo,
  ORMComparisonDemo,
  OffByOneBugDemo,
  ATTimeZoneTrapDemo,
  StandupBugDemo,
  ISOStringAnatomy,
  GetHoursComparisonTable,
  LibraryComparisonTable,
  ExpoProtectedRoutesDemo,
  GitInitTerminal,
  HashPlayground,
  ObjectLadder,
  BranchHeadSimulator,
  HeadPointer,
  StagingArea,
  ResetModes,
  SnapshotVsDiff,
  DagExplorer
} from '@/components/blog/mdx-demos'

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
  LayoutAnimationDemo,
  LayoutIdDemo,
  AnimatePresenceDemo,
  FlipExplainer,
  SpringVisualizer,
  MorphingDialogDemo,
  TransformVsLayoutDemo,
  HttpVsWebSocketDemo,
  HandshakeExplainer,
  LifecycleDemo,
  EnvelopePatternDemo,
  RoutingPatternsDemo,
  PubSubScalingDemo,
  FrameDiagram,
  ProtocolComparisonTable,
  ParseTrapDemo,
  DatePipelineDemo,
  TimezoneConverterDemo,
  DSTGapOverlapVisualizer,
  ScheduleSimulatorDemo,
  PastVsFutureStorageDemo,
  ORMComparisonDemo,
  OffByOneBugDemo,
  ATTimeZoneTrapDemo,
  StandupBugDemo,
  ISOStringAnatomy,
  GetHoursComparisonTable,
  LibraryComparisonTable,
  ExpoProtectedRoutesDemo,
  GitInitTerminal,
  HashPlayground,
  ObjectLadder,
  BranchHeadSimulator,
  HeadPointer,
  StagingArea,
  ResetModes,
  SnapshotVsDiff,
  DagExplorer,
  CheckItem
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
