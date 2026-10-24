import {
  box,
  cylinder,
  frontRect,
  line,
  pathData,
  poly,
  project,
  sideRect,
  topRect,
  type Point3
} from '@/libs/iso'
import type { StepId, ToolKey } from '@/components/about/journey/steps'

// The panorama: u runs left to right on screen and v runs into the scene, so
// everything at one v reads as a straight line. The request cable runs along
// v = ROW; objects sit behind it (smaller v) or in front of it (larger v), so
// the cable stays visible from end to end.
const ROW = 640
const BACK = 520
const FRONT = 770
const at = (u: number, v: number, z: number): Point3 => [
  (v + u) / 2,
  (v - u) / 2,
  z
]
const xy = (u: number, v: number) => [(v + u) / 2, (v - u) / 2] as const
const boxAt = (
  u: number,
  v: number,
  z: number,
  w: number,
  d: number,
  h: number
) => {
  const [x, y] = xy(u, v)
  return box(x - w / 2, y - d / 2, z, w, d, h)
}
const cylAt = (
  u: number,
  v: number,
  z: number,
  r: number,
  h: number,
  lit = true
) => {
  const [x, y] = xy(u, v)
  return cylinder(x, y, z, r, h, lit)
}
// A flat slab of floor between two u and two v values (reads as a screen rectangle).
const slab = (u0: number, u1: number, v0: number, v1: number, h: number) =>
  poly([at(u0, v0, h), at(u1, v0, h), at(u1, v1, h), at(u0, v1, h)], 'f-top') +
  poly([at(u0, v1, h), at(u1, v1, h), at(u1, v1, 0), at(u0, v1, 0)], 'f-front')
// A short cable from an object to the request cable.
const CABLE_Z = 3.5
const spur = (u: number, v: number) =>
  line([at(u, v, CABLE_Z), at(u, ROW, CABLE_Z)], 'cable')

const B = 3 // height of a group base

const device = () => {
  const [lx, ly] = xy(-560, 575)
  const [px, py] = xy(-470, 610)
  return (
    spur(-560, 629) +
    spur(-470, 620) +
    box(lx - 31, ly - 23, 0, 62, 46, 4) +
    topRect(lx - 25, ly - 15, 4, 50, 34, 'det') +
    box(lx - 31, ly - 23, 4, 62, 4, 52) +
    frontRect(lx - 26, ly - 19, 52, 52, 42, 'lit screen') +
    box(px - 8, py - 2, 0, 16, 4, 44) +
    frontRect(px - 6, py + 2, 41, 12, 36, 'lit screen')
  )
}

// A cache shelf (React Query), a store drawer (Zustand), a form with a tick.
const dataLayer = () => {
  const [sx, sy] = xy(-350, 585)
  const [dx, dy] = xy(-275, 595)
  const [cx, cy] = xy(-312, 700)
  const shelves = [B, B + 16, B + 32]
    .map(
      z =>
        box(sx - 24, sy - 13, z, 48, 26, 3) +
        [0, 1, 2]
          .map(
            k =>
              box(sx - 20 + k * 15, sy - 9, z + 3, 11, 12, 9) +
              topRect(sx - 19 + k * 15, sy - 8, z + 12, 9, 10, 'lit')
          )
          .join('')
    )
    .join('')
  return (
    spur(-350, 622) +
    spur(-275, 626) +
    spur(-312, 654) +
    shelves +
    box(sx - 24, sy + 10, B, 3, 3, 38) +
    box(sx + 21, sy + 10, B, 3, 3, 38) +
    box(dx - 17, dy - 14, B, 34, 28, 40) +
    [14, 27]
      .map(z => frontRect(dx - 14, dy + 14, B + z, 28, 0.1, 'det'))
      .join('') +
    box(dx - 13, dy + 14, B + 27, 26, 12, 10) +
    topRect(dx - 9, dy + 17, B + 37, 18, 6, 'lit') +
    box(cx - 28, cy - 18, B, 56, 36, 3) +
    [0, 1, 2]
      .map(k =>
        line(
          [
            [cx - 20, cy - 10 + k * 9, B + 3],
            [cx + 8, cy - 10 + k * 9, B + 3]
          ],
          'det'
        )
      )
      .join('') +
    line(
      [
        [cx + 13, cy - 2, B + 3],
        [cx + 18, cy + 4, B + 3],
        [cx + 26, cy - 11, B + 3]
      ],
      'ink'
    )
  )
}

// The gateway straddles the cable (every request passes the door), a rack of
// services behind it and a queue belt in front.
const server = () => {
  const [rx, ry] = xy(-60, 585)
  const [bx, by] = xy(-70, 690)
  return (
    spur(-60, 624) +
    spur(-70, 659) +
    box(rx - 28, ry - 11, 0, 56, 22, 40) +
    [0, 1, 2]
      .map(k => frontRect(rx - 22 + k * 17, ry + 11, 34, 12, 3, 'lit'))
      .join('') +
    box(245, 351, 0, 8, 8, 62) +
    box(245, 439, 0, 8, 8, 62) +
    box(245, 351, 62, 8, 96, 8) +
    sideRect(253, 359, 68, 80, 4, 'lit') +
    box(bx - 25, by - 6, 0, 50, 12, 4) +
    [0, 1, 2]
      .map(
        k =>
          box(bx - 21 + k * 16, by - 5, 4, 10, 10, 8) +
          topRect(bx - 19 + k * 16, by - 3, 12, 6, 6, 'lit')
      )
      .join('')
  )
}

// Documents to retrieve, the model, a guardrail gate across the cable, memory.
const aiPipeline = () => {
  const [dx, dy] = xy(40, 585)
  const [mx, my] = xy(150, 582)
  const [nx, ny] = xy(360, 690)
  return (
    spur(40, 626) +
    spur(150, 628) +
    spur(360, 666) +
    box(dx - 18, dy - 21, B, 36, 42, 3) +
    box(dx - 15, dy - 23, B + 3, 36, 42, 3) +
    box(dx - 12, dy - 25, B + 6, 36, 42, 3) +
    topRect(dx - 6, dy - 19, B + 9, 24, 4, 'det') +
    topRect(dx - 6, dy - 11, B + 9, 24, 4, 'det') +
    topRect(dx - 6, dy - 3, B + 9, 14, 4, 'lit') +
    box(mx - 23, my - 23, B, 46, 46, 8) +
    topRect(mx - 13, my - 13, B + 8, 26, 26, 'lit') +
    [0, 1, 2]
      .map(
        k =>
          frontRect(mx - 15 + k * 12, my + 23, B + 4, 6, 3, 'det') +
          sideRect(mx + 23, my - 15 + k * 12, B + 4, 6, 3, 'det')
      )
      .join('') +
    box(455, 147, B, 5, 5, 36) +
    box(455, 218, B, 5, 5, 36) +
    box(455, 147, B + 36, 5, 76, 4) +
    box(455, 152, B + 19, 5, 66, 2) +
    sideRect(460, 165, B + 33, 32, 12, 'lit') +
    cylinder(nx, ny, B, 17, 7, false) +
    cylinder(nx, ny, B + 8, 17, 7, false) +
    cylinder(nx, ny, B + 16, 17, 7)
  )
}

const databases = () =>
  spur(480, 615) +
  spur(560, 615) +
  spur(520, 662) +
  cylAt(480, 585, B, 21, 46) +
  cylAt(560, 585, B, 21, 46) +
  cylAt(520, 692, B, 21, 32)

// Deployment, hidden until Ship plays: builds rise from the server to a cloud,
// then the update comes down to the laptop and the phone.
const CLOUD_Z = 150
const cloud = () =>
  `<g class="cloud">${cylAt(-45, 575, CLOUD_Z, 36, 16, false)}${cylAt(-100, 590, CLOUD_Z, 30, 12, false)}${cylAt(5, 592, CLOUD_Z, 26, 10, false)}</g>`
const beamUp: Point3[] = [at(-60, 585, 40), at(-60, 585, CLOUD_Z)]
const beamLaptop: Point3[] = [at(-100, 590, CLOUD_Z), at(-560, 560, 58)]
const beamPhone: Point3[] = [at(-100, 590, CLOUD_Z), at(-470, 612, 46)]
const deployBeam = (pts: Point3[], cls: string) =>
  `<path class="deploy ${cls}" pathLength="1000" d="${pathData(pts)}"/>`

type Callout = {
  step: StepId
  tools: ToolKey[]
  anchor: Point3
  // up: the chip floats this many units above the anchor; [u, v]: it sits on the floor there.
  to: number | [number, number]
}

const CALLOUTS: Callout[] = [
  {
    step: 'device',
    tools: ['react', 'next', 'tailwind'],
    anchor: at(-560, 560, 60),
    to: 26
  },
  {
    step: 'device',
    tools: ['expo'],
    anchor: at(-470, 622, 0),
    to: [-470, 712]
  },
  {
    step: 'data',
    tools: ['query', 'axios'],
    anchor: at(-350, 585, 51),
    to: 46
  },
  { step: 'data', tools: ['zustand'], anchor: at(-275, 595, 47), to: 14 },
  {
    step: 'data',
    tools: ['rhf', 'zod'],
    anchor: at(-284, 708, 6),
    to: [-228, 712]
  },
  {
    step: 'server',
    tools: ['nest', 'express'],
    anchor: at(-150, 640, 72),
    to: 18
  },
  {
    step: 'server',
    tools: ['node', 'socket'],
    anchor: at(-60, 585, 40),
    to: 60
  },
  {
    step: 'server',
    tools: ['bullmq'],
    anchor: at(-70, 700, 12),
    to: [-12, 714]
  },
  { step: 'ai', tools: ['rag'], anchor: at(40, 585, 12), to: 22 },
  {
    step: 'ai',
    tools: ['openai', 'langchain'],
    anchor: at(150, 582, 11),
    to: 62
  },
  { step: 'ai', tools: ['guardrails'], anchor: at(270, 640, 43), to: 22 },
  {
    step: 'ai',
    tools: ['langgraph'],
    anchor: at(200, ROW, 3.5),
    to: [176, 712]
  },
  { step: 'ai', tools: ['mem0'], anchor: at(360, 700, 26), to: [300, 716] },
  { step: 'db', tools: ['postgres'], anchor: at(480, 585, 49), to: 18 },
  { step: 'db', tools: ['mongo'], anchor: at(560, 585, 49), to: 52 },
  { step: 'db', tools: ['prisma'], anchor: at(430, ROW, 3.5), to: [418, 712] },
  { step: 'db', tools: ['redis'], anchor: at(540, 700, 35), to: [592, 716] }
]

export function drawJourney() {
  let svg =
    slab(-640, 640, BACK, FRONT, 0) +
    poly(
      [
        at(-630, BACK + 8, 0),
        at(630, BACK + 8, 0),
        at(630, FRONT - 8, 0),
        at(-630, FRONT - 8, 0)
      ],
      'det'
    )

  // Passes, back to front: the group bases, the request cable on top of them
  // (a dash of light travels along it), then the objects standing on it.
  const bases: [StepId, number, number][] = [
    ['data', -410, -214],
    ['ai', 0, 416],
    ['db', 440, 616]
  ]
  for (const [id, u0, u1] of bases)
    svg += `<g class="station" data-step="${id}"><g class="pad">${slab(u0, u1, 545, 748, B)}</g></g>`
  const cable: Point3[] = [at(-560, ROW, CABLE_Z), at(560, ROW, CABLE_Z)]
  svg +=
    line(cable, 'cable main') +
    `<path class="flow" pathLength="1000" d="${pathData(cable)}"/>`

  const stations: [StepId, () => string][] = [
    ['device', device],
    ['data', dataLayer],
    ['server', server],
    ['ai', aiPipeline],
    ['db', databases]
  ]
  for (const [id, draw] of stations)
    svg += `<g class="station" data-step="${id}">${draw()}</g>`

  svg += `<g class="ship">${deployBeam(beamUp, 'up')}${cloud()}${deployBeam(beamLaptop, 'down')}${deployBeam(beamPhone, 'down')}</g>`

  const extremes: Point3[] = [
    at(-640, BACK, 0),
    at(640, BACK, 0),
    at(640, FRONT, 0),
    at(-640, FRONT, 0),
    at(-45, 575, CLOUD_Z + 40)
  ]
  const pts = extremes.map(p => project(...p))
  const xs = pts.map(p => p[0])
  const ys = pts.map(p => p[1])
  const m = 10
  const vb = [
    Math.min(...xs) - m,
    Math.min(...ys) - m,
    Math.max(...xs) - Math.min(...xs) + 2 * m,
    Math.max(...ys) - Math.min(...ys) + 2 * m
  ]
  const pct = ([x, y]: [number, number]) => ({
    left: ((x - vb[0]) / vb[2]) * 100,
    top: ((y - vb[1]) / vb[3]) * 100
  })

  // Callouts: a leader line in the drawing, a chip of real icons over it in HTML.
  const callouts = CALLOUTS.map(c => {
    const a = project(...c.anchor)
    const end: [number, number] =
      typeof c.to === 'number'
        ? [a[0], a[1] - c.to]
        : project(...at(c.to[0], c.to[1], 1))
    svg += `<line class="leader" data-step="${c.step}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${end[0].toFixed(1)}" y2="${end[1].toFixed(1)}"/>`
    return {
      step: c.step,
      tools: c.tools,
      up: typeof c.to === 'number',
      ...pct(end)
    }
  })

  const badges: Record<StepId, { left: number; top: number }> = {
    device: pct(project(...at(-520, 762, 0))),
    data: pct(project(...at(-312, 762, 0))),
    server: pct(project(...at(-104, 762, 0))),
    ai: pct(project(...at(208, 762, 0))),
    db: pct(project(...at(528, 762, 0))),
    ship: pct(project(...at(-150, 585, CLOUD_Z - 4)))
  }

  const overlays = {
    cloud: pct(project(...at(-45, 575, CLOUD_Z + 24))),
    terminal: pct(project(...at(40, 600, CLOUD_Z + 14))),
    stores: pct(project(...at(-330, 600, 96)))
  }

  return {
    svg,
    viewBox: vb.map(n => +n.toFixed(1)).join(' '),
    badges,
    callouts,
    overlays
  }
}
