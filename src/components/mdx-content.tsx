import { JSX } from 'react'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

import { Checkbox } from '@heroui/react'
import Counter from '@/components/counter'
import { slugify } from '@/libs/toc'
import LayoutAnimationDemo from '@/components/blog/layout-animations/layout-animation-demo'
import LayoutIdDemo from '@/components/blog/layout-animations/layout-id-demo'
import AnimatePresenceDemo from '@/components/blog/layout-animations/animate-presence-demo'
import FlipExplainer from '@/components/blog/layout-animations/flip-explainer'
import SpringVisualizer from '@/components/blog/layout-animations/spring-visualizer'
import MorphingDialogDemo from '@/components/blog/layout-animations/morphing-dialog-demo'
import TransformVsLayoutDemo from '@/components/blog/layout-animations/transform-vs-layout-demo'
import HttpVsWebSocketDemo from '@/components/blog/websockets/http-vs-websocket-demo'
import HandshakeExplainer from '@/components/blog/websockets/handshake-explainer'
import LifecycleDemo from '@/components/blog/websockets/lifecycle-demo'
import EnvelopePatternDemo from '@/components/blog/websockets/envelope-pattern-demo'
import RoutingPatternsDemo from '@/components/blog/websockets/routing-patterns-demo'
import PubSubScalingDemo from '@/components/blog/websockets/pub-sub-scaling-demo'
import FrameDiagram from '@/components/blog/websockets/frame-diagram'
import ProtocolComparisonTable from '@/components/blog/websockets/protocol-comparison-table'
import ParseTrapDemo from '@/components/blog/timezone/parse-trap-demo'
import DatePipelineDemo from '@/components/blog/timezone/date-pipeline-demo'
import TimezoneConverterDemo from '@/components/blog/timezone/timezone-converter-demo'
import DSTGapOverlapVisualizer from '@/components/blog/timezone/dst-gap-overlap-visualizer'
import ScheduleSimulatorDemo from '@/components/blog/timezone/schedule-simulator-demo'
import PastVsFutureStorageDemo from '@/components/blog/timezone/past-vs-future-storage-demo'
import ORMComparisonDemo from '@/components/blog/timezone/orm-comparison-demo'
import OffByOneBugDemo from '@/components/blog/timezone/off-by-one-bug-demo'
import ATTimeZoneTrapDemo from '@/components/blog/timezone/at-timezone-trap-demo'
import StandupBugDemo from '@/components/blog/timezone/standup-bug-demo'
import ISOStringAnatomy from '@/components/blog/timezone/iso-string-anatomy'
import GetHoursComparisonTable from '@/components/blog/timezone/get-hours-comparison-table'
import LibraryComparisonTable from '@/components/blog/timezone/library-comparison-table'
import ExpoProtectedRoutesDemo from '@/components/blog/expo-router/protected-routes-demo'

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

function CheckItem({ label }: { label: string }) {
  return (
    <div className='my-1'>
      <Checkbox defaultSelected={false} size='sm' radius='sm'>
        <span className='text-sm text-foreground'>{label}</span>
      </Checkbox>
    </div>
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
