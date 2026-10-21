'use client'

import dynamic from 'next/dynamic'

// Blog demos for MDX, each a lazy chunk. This has to be a client module:
// dynamic() called from a server component does not split client components,
// so every post would still download every demo. Here each import() is a real
// async chunk that a post only fetches if it renders that demo (SSR intact).
// Chunks are named per post (a series' flagship shares one; each bite-sized
// post gets its own), so a post downloads exactly its demos in few requests.
export const CheckItem = dynamic(
  () =>
    import(/* webpackChunkName: "demos-timezones" */ '@/components/check-item')
)
export const LayoutAnimationDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/layout-animation-demo'
    )
)
export const LayoutIdDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/layout-id-demo'
    )
)
export const AnimatePresenceDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/animate-presence-demo'
    )
)
export const FlipExplainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/flip-explainer'
    )
)
export const SpringVisualizer = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/spring-visualizer'
    )
)
export const MorphingDialogDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/morphing-dialog-demo'
    )
)
export const TransformVsLayoutDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-layout-animations" */ '@/components/blog/layout-animations/transform-vs-layout-demo'
    )
)
export const HttpVsWebSocketDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/http-vs-websocket-demo'
    )
)
export const HandshakeExplainer = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/handshake-explainer'
    )
)
export const LifecycleDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/lifecycle-demo'
    )
)
export const EnvelopePatternDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/envelope-pattern-demo'
    )
)
export const RoutingPatternsDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/routing-patterns-demo'
    )
)
export const PubSubScalingDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/pub-sub-scaling-demo'
    )
)
export const FrameDiagram = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/frame-diagram'
    )
)
export const ProtocolComparisonTable = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-websockets" */ '@/components/blog/websockets/protocol-comparison-table'
    )
)
export const ParseTrapDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/parse-trap-demo'
    )
)
export const DatePipelineDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/date-pipeline-demo'
    )
)
export const TimezoneConverterDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/timezone-converter-demo'
    )
)
export const DSTGapOverlapVisualizer = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/dst-gap-overlap-visualizer'
    )
)
export const ScheduleSimulatorDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/schedule-simulator-demo'
    )
)
export const PastVsFutureStorageDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/past-vs-future-storage-demo'
    )
)
export const ORMComparisonDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/orm-comparison-demo'
    )
)
export const OffByOneBugDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/off-by-one-bug-demo'
    )
)
export const ATTimeZoneTrapDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/at-timezone-trap-demo'
    )
)
export const StandupBugDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/standup-bug-demo'
    )
)
export const ISOStringAnatomy = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/iso-string-anatomy'
    )
)
export const GetHoursComparisonTable = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/get-hours-comparison-table'
    )
)
export const LibraryComparisonTable = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-timezones" */ '@/components/blog/timezone/library-comparison-table'
    )
)
export const ExpoProtectedRoutesDemo = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-expo-router" */ '@/components/blog/expo-router/protected-routes-demo'
    )
)
export const GitInitTerminal = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/git-init-terminal'
    )
)
export const HashPlayground = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/hash-playground'
    )
)
export const ObjectLadder = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/object-ladder'
    )
)
export const BranchHeadSimulator = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/branch-head-simulator'
    )
)
export const HeadPointer = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/head-pointer'
    )
)
export const StagingArea = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/staging-area'
    )
)
export const ResetModes = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git-reset-modes" */ '@/components/blog/git-internals/reset-modes'
    )
)
export const SnapshotVsDiff = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/snapshot-vs-diff'
    )
)
export const DagExplorer = dynamic(
  () =>
    import(
      /* webpackChunkName: "demos-git" */ '@/components/blog/git-internals/dag-explorer'
    )
)
