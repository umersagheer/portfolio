'use client'

import { useEffect, useRef, useState } from 'react'
import {  motion } from 'framer-motion'
import { Chip, Switch, Tab, Tabs, cn } from '@heroui/react'
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  EyeIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  LockIcon,
  LucideIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UnlockIcon
} from 'lucide-react'

import { DotPattern } from '@/components/ui/dot-pattern'

type DemoMode = 'before' | 'after'
type RouteGroup = 'auth' | 'onboarding' | 'app'
type RowId =
  | 'app-root'
  | 'root-layout'
  | 'auth-group'
  | 'auth-screen'
  | 'onboarding-group'
  | 'onboarding-screen'
  | 'app-group'
  | 'app-layout'
  | 'app-screen'

type TreeNode = {
  id: RowId
  label: string
  kind: 'folder' | 'file'
  group?: RouteGroup
  children?: TreeNode[]
}

type VisibleRow = {
  id: RowId
  label: string
  kind: 'folder' | 'file'
  depth: number
  group?: RouteGroup
}

type CalloutTone = 'neutral' | 'primary' | 'success' | 'warning'

type Callout = {
  text: string
  tone: CalloutTone
  icon: LucideIcon
}

type LogEntry = {
  id: string
  label: string
  tone: CalloutTone
}

const tree: TreeNode[] = [
  {
    id: 'app-root',
    label: 'app',
    kind: 'folder',
    children: [
      { id: 'root-layout', label: '_layout.tsx', kind: 'file' },
      {
        id: 'auth-group',
        label: '(auth)',
        kind: 'folder',
        group: 'auth',
        children: [
          {
            id: 'auth-screen',
            label: 'sign-in.tsx',
            kind: 'file',
            group: 'auth'
          }
        ]
      },
      {
        id: 'onboarding-group',
        label: '(onboarding)',
        kind: 'folder',
        group: 'onboarding',
        children: [
          {
            id: 'onboarding-screen',
            label: 'index.tsx',
            kind: 'file',
            group: 'onboarding'
          }
        ]
      },
      {
        id: 'app-group',
        label: '(app)',
        kind: 'folder',
        group: 'app',
        children: [
          {
            id: 'app-layout',
            label: '_layout.tsx',
            kind: 'file',
            group: 'app'
          },
          { id: 'app-screen', label: 'index.tsx', kind: 'file', group: 'app' }
        ]
      }
    ]
  }
]

const defaultExpanded = [
  'app-root',
  'auth-group',
  'onboarding-group',
  'app-group'
]

function getActiveGroup(signedIn: boolean, onboarded: boolean): RouteGroup {
  if (!signedIn) return 'auth'
  if (!onboarded) return 'onboarding'
  return 'app'
}

function flattenTree(
  nodes: TreeNode[],
  expandedIds: string[],
  depth = 0
): VisibleRow[] {
  return nodes.flatMap(node => {
    const currentRow: VisibleRow = {
      id: node.id,
      label: node.label,
      kind: node.kind,
      group: node.group,
      depth
    }

    if (
      node.kind !== 'folder' ||
      !node.children ||
      !expandedIds.includes(node.id)
    ) {
      return [currentRow]
    }

    return [currentRow, ...flattenTree(node.children, expandedIds, depth + 1)]
  })
}

function getToneClasses(tone: CalloutTone) {
  switch (tone) {
    case 'primary':
      return {
        line: 'bg-primary',
        text: 'text-primary-900'
      }
    case 'success':
      return {
        line: 'bg-success',
        text: 'text-emerald-300'
      }
    case 'warning':
      return {
        line: 'bg-amber-warning',
        text: 'text-amber-200'
      }
    default:
      return {
        line: 'bg-white/10',
        text: 'text-white/65'
      }
  }
}

function getRowCallout(
  rowId: RowId,
  mode: DemoMode,
  signedIn: boolean,
  onboarded: boolean,
  previewGroup: RouteGroup,
  activeGroup: RouteGroup
): Callout | null {
  if (rowId === 'root-layout') {
    return mode === 'after'
      ? {
          text: 'Controls which route groups can exist',
          tone: 'primary',
          icon: ShieldCheckIcon
        }
      : {
          text: 'Mounts first, then redirects after state resolves',
          tone: 'warning',
          icon: AlertTriangleIcon
        }
  }

  if (rowId === 'auth-screen') {
    if (mode === 'after') {
      return !signedIn
        ? {
            text: 'Always accessible while signed out',
            tone: 'success',
            icon: UnlockIcon
          }
        : {
            text: 'Locked once authentication succeeds',
            tone: 'neutral',
            icon: LockIcon
          }
    }

    return signedIn
      ? {
          text: 'Can appear before the session check settles',
          tone: previewGroup === 'auth' ? 'warning' : 'neutral',
          icon: EyeIcon
        }
      : {
          text: 'Stays visible because no redirect is needed',
          tone: 'success',
          icon: UnlockIcon
        }
  }

  if (rowId === 'onboarding-group' || rowId === 'onboarding-screen') {
    if (mode === 'after') {
      if (signedIn && !onboarded) {
        return {
          text: 'Active until setup is completed',
          tone: 'primary',
          icon: SparklesIcon
        }
      }

      if (signedIn && onboarded) {
        return {
          text: 'Skipped completely once onboarding is done',
          tone: 'neutral',
          icon: LockIcon
        }
      }

      return {
        text: 'Locked until the user signs in',
        tone: 'neutral',
        icon: LockIcon
      }
    }

    if (signedIn && onboarded) {
      return {
        text: 'Can flash while profile data is still loading',
        tone:
          previewGroup === 'onboarding' && activeGroup !== 'onboarding'
            ? 'warning'
            : 'neutral',
        icon: AlertTriangleIcon
      }
    }

    if (signedIn) {
      return {
        text: 'Reached after the redirect effect runs',
        tone: previewGroup === 'onboarding' ? 'primary' : 'neutral',
        icon: ArrowRightIcon
      }
    }

    return null
  }

  if (rowId === 'app-group' || rowId === 'app-screen') {
    if (mode === 'after') {
      return signedIn && onboarded
        ? {
            text: 'Active now',
            tone: 'success',
            icon: ShieldCheckIcon
          }
        : {
            text: 'Requires signed in + onboarded',
            tone: 'neutral',
            icon: LockIcon
          }
    }

    if (signedIn && onboarded) {
      return {
        text:
          previewGroup === 'app'
            ? 'Final destination after the redirect chain settles'
            : 'Where the user eventually lands after redirects',
        tone: previewGroup === 'app' ? 'success' : 'primary',
        icon: ArrowRightIcon
      }
    }

    return {
      text: 'Only reachable after redirecting away from auth flow',
      tone: 'neutral',
      icon: LockIcon
    }
  }

  return null
}

function getLogs(
  mode: DemoMode,
  signedIn: boolean,
  onboarded: boolean
): LogEntry[] {
  if (mode === 'after') {
    if (!signedIn) {
      return [
        {
          id: 'after-auth-1',
          label: 'guard: (auth) stays mounted because no session exists',
          tone: 'success'
        },
        {
          id: 'after-auth-2',
          label: 'guard: (onboarding) and (app) never enter the navigator',
          tone: 'neutral'
        },
        {
          id: 'after-auth-3',
          label: 'result: no redirect effect, no wrong-screen flash',
          tone: 'primary'
        }
      ]
    }

    if (!onboarded) {
      return [
        {
          id: 'after-onboarding-1',
          label: 'guard: authenticated user unlocks (onboarding)',
          tone: 'success'
        },
        {
          id: 'after-onboarding-2',
          label: 'guard: (auth) is removed from the stack automatically',
          tone: 'neutral'
        },
        {
          id: 'after-onboarding-3',
          label: 'result: setup flow becomes the only valid branch',
          tone: 'primary'
        }
      ]
    }

    return [
      {
        id: 'after-app-1',
        label: 'guard: authenticated + onboarded unlocks (app)',
        tone: 'success'
      },
      {
        id: 'after-app-2',
        label: 'guard: stale auth and onboarding branches stay unavailable',
        tone: 'neutral'
      },
      {
        id: 'after-app-3',
        label: 'result: user lands directly in the app without redirect churn',
        tone: 'primary'
      }
    ]
  }

  if (!signedIn) {
    return [
      {
        id: 'before-auth-1',
        label: 'mount: auth UI renders first',
        tone: 'neutral'
      },
      {
        id: 'before-auth-2',
        label: 'effect: no redirect needed this time',
        tone: 'success'
      },
      {
        id: 'before-auth-3',
        label: 'risk: routing behavior still depends on imperative effects',
        tone: 'warning'
      }
    ]
  }

  if (!onboarded) {
    return [
      {
        id: 'before-onboarding-1',
        label:
          'mount: signed-out screens can appear before the session check completes',
        tone: 'warning'
      },
      {
        id: 'before-onboarding-2',
        label:
          'effect: session resolves, then router.replace("/(onboarding)") runs',
        tone: 'primary'
      },
      {
        id: 'before-onboarding-3',
        label:
          'risk: the flow is correct, but only after a redirect side effect',
        tone: 'neutral'
      }
    ]
  }

  return [
    {
      id: 'before-app-1',
      label: 'mount: auth tree appears before user profile data is ready',
      tone: 'warning'
    },
    {
      id: 'before-app-2',
      label:
        'flash: onboarding can blink while the profile query is still loading',
      tone: 'warning'
    },
    {
      id: 'before-app-3',
      label: 'redirect: router.replace("/(app)") finally sends the user home',
      tone: 'primary'
    }
  ]
}

export default function ExpoProtectedRoutesDemo() {
  const [mode, setMode] = useState<DemoMode>('after')
  const [signedIn, setSignedIn] = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [expandedFolders, setExpandedFolders] =
    useState<string[]>(defaultExpanded)
  const [previewGroup, setPreviewGroup] = useState<RouteGroup>('auth')

  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

  const activeGroup = getActiveGroup(signedIn, onboarded)

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    if (mode === 'after') {
      setPreviewGroup(activeGroup)
      return
    }

    if (!signedIn) {
      setPreviewGroup('auth')
      return
    }

    if (!onboarded) {
      setPreviewGroup('auth')
      timeoutsRef.current.push(
        setTimeout(() => setPreviewGroup('onboarding'), 700)
      )
      return
    }

    setPreviewGroup('auth')
    timeoutsRef.current.push(
      setTimeout(() => setPreviewGroup('onboarding'), 550)
    )
    timeoutsRef.current.push(setTimeout(() => setPreviewGroup('app'), 1350))

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [activeGroup, mode, onboarded, signedIn])

  const visibleRows = flattenTree(tree, expandedFolders)
  const logs = getLogs(mode, signedIn, onboarded)

  function toggleFolder(id: string) {
    setExpandedFolders(current =>
      current.includes(id)
        ? current.filter(folderId => folderId !== id)
        : [...current, id]
    )
  }

  return (
    <section className='not-prose my-8 overflow-hidden rounded-2xl border border-default-200 bg-default-50 p-5 sm:p-6'>
      <div className='flex flex-col gap-4'>
        <div className='space-y-1'>
          <p className='font-sourceCodePro text-sm font-semibold text-foreground'>
            Auth Routing Visualizer
          </p>
          <p className='max-w-2xl text-sm text-default-500'>
            Compare redirect-driven auth routing with guarded route groups,
            using the file-based mental model Expo Router actually gives you.
          </p>
        </div>

        <Tabs
          size='sm'
          radius='sm'
          variant='bordered'
          selectedKey={mode}
          onSelectionChange={key => setMode(key as DemoMode)}
        >
          <Tab key='before' title='useEffect redirects' />
          <Tab key='after' title='Stack.Protected' />
        </Tabs>
      </div>

      <div className='mt-2 flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-3 rounded-large bg-background px-3 py-2'>
          <div className='space-y-0.5'>
            <p className='text-xs font-medium text-foreground'>Signed in</p>
            <p className='text-[11px] text-default-500'>Clerk/session exists</p>
          </div>
          <Switch
            isSelected={signedIn}
            onValueChange={nextValue => {
              setSignedIn(nextValue)
              if (!nextValue) {
                setOnboarded(false)
              }
            }}
            size='sm'
          />
        </div>

        <div
          className={cn(
            'flex items-center gap-3 rounded-large px-3 py-2 transition-opacity',
            signedIn ? 'bg-background' : 'bg-default-100/70 opacity-60'
          )}
        >
          <div className='space-y-0.5'>
            <p className='text-xs font-medium text-foreground'>Onboarded</p>
            <p className='text-[11px] text-default-500'>Profile completed</p>
          </div>
          <Switch
            isSelected={onboarded}
            isDisabled={!signedIn}
            onValueChange={setOnboarded}
            size='sm'
          />
        </div>
      </div>

      <div className='relative mt-2 overflow-hidden rounded-large border border-default-200 bg-[#070708] p-4'>
        <DotPattern
          glow
          width={18}
          height={18}
          className='text-white/20'
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent), linear-gradient(to bottom, transparent, black 4%, black 96%, transparent)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}
        />

        <div className='relative'>
          <div className='space-y-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'>
            {visibleRows.map(row => {
              const isFolder = row.kind === 'folder'
              const isExpanded = expandedFolders.includes(row.id)
              const previewMatch = row.group === previewGroup
              const activeMatch = row.group === activeGroup
              const callout = getRowCallout(
                row.id,
                mode,
                signedIn,
                onboarded,
                previewGroup,
                activeGroup
              )

              const isBlinkingRisk =
                mode === 'before' &&
                previewGroup !== activeGroup &&
                row.group === previewGroup

              const rowTone =
                callout?.tone ??
                (isBlinkingRisk
                  ? 'warning'
                  : mode === 'after' && activeMatch
                    ? 'success'
                    : 'neutral')

              const toneClasses = getToneClasses(rowTone)

              const statusLabel = (() => {
                if (!row.group) return null

                if (mode === 'after') {
                  if (activeMatch) return 'Active'
                  return row.group === 'auth'
                    ? !signedIn
                      ? 'Open'
                      : 'Locked'
                    : row.group === 'onboarding'
                      ? signedIn && !onboarded
                        ? 'Open'
                        : 'Locked'
                      : signedIn && onboarded
                        ? 'Open'
                        : 'Locked'
                }

                if (previewMatch && previewGroup !== activeGroup) return 'Flash'
                if (previewMatch) return 'Visible'
                if (activeMatch) return 'Target'
                return null
              })()
              const CalloutIcon = callout?.icon

              return (
                <motion.div
                  key={row.id}
                  layout
                  className='grid grid-cols-1 gap-1 lg:grid-cols-[minmax(0,620px)_1fr] lg:gap-6'
                  initial={false}
                  animate={
                    isBlinkingRisk
                      ? {
                          opacity: [0.95, 0.55, 1],
                          transition: {
                            duration: 0.9,
                            repeat: Infinity,
                            repeatType: 'mirror'
                          }
                        }
                      : { opacity: 1 }
                  }
                >
                  <div
                    className={cn(
                      'relative flex min-h-10 items-center gap-2 rounded-xl px-2 py-1.5 transition-colors sm:px-3',
                      previewMatch || activeMatch
                        ? 'bg-white/[0.035]'
                        : 'bg-transparent hover:bg-white/[0.02]'
                    )}
                    style={{
                      paddingLeft: `${12 + row.depth * 28}px`
                    }}
                  >
                    {Array.from({ length: row.depth }).map((_, index) => (
                      <span
                        key={`${row.id}-guide-${index}`}
                        aria-hidden='true'
                        className='absolute bottom-1 top-1 w-px rounded-full bg-white/[0.08]'
                        style={{ left: `${24 + index * 28}px` }}
                      />
                    ))}

                    {isFolder ? (
                      <button
                        type='button'
                        onClick={() => toggleFolder(row.id)}
                        className='flex items-center gap-1 text-white/70 transition-colors hover:text-white'
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${row.label}`}
                      >
                        <ChevronRightIcon
                          size={14}
                          className={cn(
                            'transition-transform',
                            isExpanded && 'rotate-90'
                          )}
                        />
                        {isExpanded ? (
                          <FolderOpenIcon size={16} />
                        ) : (
                          <FolderIcon size={16} />
                        )}
                      </button>
                    ) : (
                      <>
                        <span className='w-[14px]' />
                        <FileIcon size={16} className='text-white/55' />
                      </>
                    )}

                    <span
                      className={cn(
                        'text-white font-sourceCodePro text-sm',
                        row.group &&
                          previewMatch &&
                          previewGroup !== activeGroup
                          ? 'text-warning-100'
                          : row.group && activeMatch
                            ? mode === 'after'
                              ? 'text-success-900'
                              : 'text-primary-500'
                            : undefined
                      )}
                    >
                      {row.label}
                    </span>

                    {statusLabel && (
                      <Chip
                      startContent={CalloutIcon && <CalloutIcon size={12} />}
                        size='sm'
                        variant='shadow'
                        color={
                          statusLabel === 'Active'
                            ? 'success'
                            : statusLabel === 'Open'
                              ? 'primary'
                              : statusLabel === 'Flash'
                                ? 'warning'
                                : statusLabel === 'Visible'
                                  ? 'warning'
                                  : statusLabel === 'Target'
                                    ? 'primary'
                                    : 'default'
                        }
                        classNames={{
                          base: cn('ml-2'),
                        }}
                      >
                        {statusLabel}
                      </Chip>
                    )}
                  </div>

                  {callout ? (
                    <>
                      <div className='hidden items-center gap-4 lg:flex'>
                        <div className={cn('h-px flex-1', toneClasses.line)} />
                        <div
                          className={cn(
                            'flex items-center gap-2 whitespace-nowrap text-sm',
                            toneClasses.text
                          )}
                        >
                          {CalloutIcon && <CalloutIcon size={14} />}
                          <span>{callout.text}</span>
                        </div>
                      </div>

                      <div className='pl-8 text-xs text-white/60 lg:hidden'>
                        {callout.text}
                      </div>
                    </>
                  ) : (
                    <div className='hidden lg:block' />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
