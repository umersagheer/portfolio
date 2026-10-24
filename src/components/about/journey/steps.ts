import type { IconSlug } from '@/components/about/journey/icons'

export type Tool = { name: string; icon?: IconSlug }

export const TOOLS = {
  react: { name: 'React', icon: 'react' },
  next: { name: 'Next.js', icon: 'nextdotjs' },
  expo: { name: 'Expo', icon: 'expo' },
  tailwind: { name: 'Tailwind', icon: 'tailwindcss' },
  query: { name: 'React Query', icon: 'reactquery' },
  axios: { name: 'Axios', icon: 'axios' },
  zustand: { name: 'Zustand' },
  rhf: { name: 'React Hook Form', icon: 'reacthookform' },
  zod: { name: 'Zod', icon: 'zod' },
  node: { name: 'Node.js', icon: 'nodedotjs' },
  nest: { name: 'NestJS', icon: 'nestjs' },
  express: { name: 'Express', icon: 'express' },
  socket: { name: 'Socket.IO', icon: 'socketdotio' },
  bullmq: { name: 'BullMQ' },
  langchain: { name: 'LangChain', icon: 'langchain' },
  openai: { name: 'OpenAI', icon: 'openai' },
  langgraph: { name: 'LangGraph' },
  rag: { name: 'RAG' },
  mem0: { name: 'mem0' },
  postgres: { name: 'PostgreSQL', icon: 'postgresql' },
  mongo: { name: 'MongoDB', icon: 'mongodb' },
  prisma: { name: 'Prisma', icon: 'prisma' },
  redis: { name: 'Redis', icon: 'redis' },
  docker: { name: 'Docker', icon: 'docker' },
  aws: { name: 'AWS', icon: 'amazonwebservices' },
  railway: { name: 'Railway', icon: 'railway' },
  eas: { name: 'EAS', icon: 'expo' },
  sentry: { name: 'Sentry', icon: 'sentry' },
  vitest: { name: 'Vitest', icon: 'vitest' },
  guardrails: { name: 'Guardrails' },
  appstore: { name: 'App Store', icon: 'appstore' },
  googleplay: { name: 'Google Play', icon: 'googleplay' }
} satisfies Record<string, Tool>

export type ToolKey = keyof typeof TOOLS
export type StepId = 'device' | 'data' | 'server' | 'ai' | 'db' | 'ship'

export type Step = {
  id: StepId
  name: string
  // Main tools are named; supporting ones show as small glyphs or words.
  main: ToolKey[]
  supporting: ToolKey[]
  does: string
  patterns: string[]
  exploring?: string
}

// One request through a product, in order. Every line is backed by shipped
// work or the owner's own word (see docs/portfolio-enhancement-plan.md).
export const STEPS: Step[] = [
  {
    id: 'device',
    name: 'Device',
    main: ['react', 'expo'],
    supporting: ['next', 'tailwind'],
    does: 'Where the tap happens: web and mobile from one way of building.',
    patterns: [
      'Accessible components on theme tokens, from the web to Expo.',
      'Motion with purpose; reduced motion respected.'
    ]
  },
  {
    id: 'data',
    name: 'Data layer',
    main: ['query'],
    supporting: ['axios', 'zustand', 'rhf', 'zod'],
    does: 'Keeps the screen fast and honest: cached server data, small client stores, validated forms.',
    patterns: [
      'Query-key factories, one hook per resource; mutations invalidate by key.',
      'Typed services over one Axios client with silent token refresh.',
      'Small Zustand stores; server data never goes in a store.',
      'A Zod schema per form, with errors inline.'
    ]
  },
  {
    id: 'server',
    name: 'Server',
    main: ['node', 'nest'],
    supporting: ['express', 'socket', 'bullmq'],
    does: 'Checks every request at the door, owns the business logic, and hands slow work to queues.',
    patterns: [
      'Thin routes; services own the logic; one central error handler.',
      'Slow work on queues, progress over sockets, retries that never double.',
      'NestJS microservices, including one that talks to industrial sensors.'
    ],
    exploring: 'event streaming'
  },
  {
    id: 'ai',
    name: 'AI pipeline',
    main: ['langchain', 'openai'],
    supporting: ['langgraph', 'rag', 'mem0'],
    does: 'Retrieve, prompt, check, remember: AI inside the product, not a chat box beside it.',
    patterns: [
      "Retrieval (RAG) over a product's own content.",
      'Multi-step model calls orchestrated with LangGraph.',
      'Guardrails: model output checked against real data before anyone sees it.',
      'Conversation memory with mem0, so context carries across sessions.'
    ],
    exploring: 'agent workflows, evals'
  },
  {
    id: 'db',
    name: 'Databases',
    main: ['postgres', 'mongo'],
    supporting: ['prisma', 'redis'],
    does: 'Where the truth lives, shaped by the questions the product asks most.',
    patterns: [
      'Schema-first models with versioned migrations.',
      'Redis for queues, locks and caches.'
    ],
    exploring: 'indexing strategy, query plans'
  },
  {
    id: 'ship',
    name: 'Ship',
    main: ['docker', 'aws'],
    supporting: ['railway', 'eas', 'sentry', 'vitest'],
    does: 'Build, test, deploy: to Railway, AWS, the App Store and Google Play.',
    patterns: [
      'Docker locally; Railway and AWS in production; EAS builds and over-the-air updates.',
      'Vitest suites, Sentry and structured logs.'
    ]
  }
]

export const PLATFORMS = ['Railway', 'AWS', 'App Store', 'Google Play']
