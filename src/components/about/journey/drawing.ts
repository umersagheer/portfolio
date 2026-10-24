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
import type { StepId } from '@/components/about/journey/steps'

// The panorama: u runs left to right on screen and v runs into the scene.
// Objects sit where they read best; the request wire then runs between them in
// isometric steps (along x and y only, with rounded bends), into each component
// and out the other side, so it passes through the system the way a request does.
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
const CABLE_Z = 3.5
// A wire through world points on the floor, its bends rounded in screen space.
function wire(points: [number, number][], radius = 7) {
  const p = points.map(([x, y]) => project(x, y, CABLE_Z))
  const f = (q: [number, number]) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`
  let d = `M${f(p[0])}`
  for (let i = 1; i < p.length - 1; i++) {
    const [a, b, c] = [p[i - 1], p[i], p[i + 1]]
    const toward = (from: [number, number], to: [number, number]) => {
      const len = Math.hypot(to[0] - from[0], to[1] - from[1])
      const r = Math.min(radius, len / 2)
      return [
        from[0] + ((to[0] - from[0]) / len) * r,
        from[1] + ((to[1] - from[1]) / len) * r
      ] as [number, number]
    }
    d += `L${f(toward(b, a))}Q${f(b)} ${f(toward(b, c))}`
  }
  return `${d}L${f(p[p.length - 1])}`
}

const B = 3 // height of a group base

const device = () => {
  const [lx, ly] = xy(-560, 575)
  const [px, py] = xy(-470, 610)
  return (
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

// The API rack the request runs into, and a queue belt in front for slow work.
const server = () => {
  const [rx, ry] = xy(-60, 585)
  const [bx, by] = xy(-70, 690)
  return (
    box(rx - 28, ry - 11, 0, 56, 22, 40) +
    [0, 1, 2]
      .map(k => frontRect(rx - 22 + k * 17, ry + 11, 34, 12, 3, 'lit'))
      .join('') +
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

// Documents to retrieve, the model, then a guardrail gate across the cable:
// nothing reaches the data until the model's output is checked.
const aiPipeline = () => {
  const [dx, dy] = xy(40, 585)
  const [mx, my] = xy(150, 582)
  return (
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
    sideRect(460, 165, B + 33, 32, 12, 'lit')
  )
}

const databases = () =>
  cylAt(480, 585, B, 21, 46) +
  cylAt(560, 585, B, 21, 46) +
  cylAt(520, 692, B, 21, 32)

// Deployment, hidden until Ship plays: builds rise from the server to a cloud,
// then the update comes down to the laptop and the phone.
const CLOUD_Z = 150
const cloud = () =>
  `<g class="cloud">${cylAt(-45, 575, CLOUD_Z, 36, 16, false)}${cylAt(-100, 590, CLOUD_Z, 30, 12, false)}${cylAt(5, 592, CLOUD_Z, 26, 10, false)}</g>`
const arc = (from: Point3, to: Point3, lift: number) => {
  const a = project(...from)
  const b = project(...to)
  const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - lift]
  return `M${a[0].toFixed(1)},${a[1].toFixed(1)}Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`
}
const beamUp = pathData([at(-60, 585, 40), at(-60, 585, CLOUD_Z)])
const beamLaptop = arc(at(-100, 590, CLOUD_Z), at(-560, 560, 58), 30)
const beamPhone = arc(at(-100, 590, CLOUD_Z), at(-470, 612, 46), 18)
// A dark line that appears with its stage, and a small pulse that runs along it.
const deployBeam = (d: string, cls: string) =>
  `<path class="deploy ${cls}" d="${d}"/><path class="zap ${cls}" pathLength="1000" d="${d}"/>`

// Each callout names what the object does. The tools are in the list below,
// so the figure reads at a glance, even while the tour moves on.
type Callout = {
  step: StepId
  label: string
  anchor: Point3
  // up: the chip floats this many units above the anchor; [x, y]: it sits on the floor there.
  to: number | [number, number]
  // Shift an up-callout sideways (screen units), to clear a neighbour.
  dx?: number
}

const w = (x: number, y: number, z: number): Point3 => [x, y, z]

// The request wire, laptop to databases, through every component on the way.
const REQUEST: [number, number][] = [
  [38.5, 570],
  [110, 570],
  [110, 470],
  [225, 470],
  [225, 400],
  [270, 400],
  [270, 322],
  [312, 322],
  [312, 272],
  [366, 272],
  [366, 200],
  [542, 200],
  [542, 52]
]
// The wire point where the request reaches each station's first object.
const ARRIVALS: [Exclude<StepId, 'ship'>, number][] = [
  ['device', 0],
  ['data', 2],
  ['server', 6],
  ['ai', 8],
  ['db', REQUEST.length - 1]
]
const CALLOUTS: Callout[] = [
  {
    step: 'device',
    label: 'Web app',
    anchor: w(7.5, 546, 58),
    to: 36,
    dx: 56
  },
  {
    step: 'device',
    label: 'Mobile app',
    anchor: w(70, 540, 46),
    to: 26,
    dx: 58
  },
  {
    step: 'data',
    label: 'Server cache',
    anchor: w(117.5, 467.5, 51),
    to: 46
  },
  {
    step: 'data',
    label: 'App state',
    anchor: w(160, 450, 47),
    to: 14
  },
  {
    step: 'data',
    label: 'Forms & validation',
    anchor: w(214, 520, 6),
    to: [255, 445]
  },
  {
    step: 'server',
    label: 'API',
    anchor: w(262.5, 322.5, 40),
    to: 60
  },
  {
    step: 'server',
    label: 'Background jobs',
    anchor: w(330, 386, 12),
    to: [360, 345]
  },
  {
    step: 'ai',
    label: 'Retrieval · RAG',
    anchor: w(312.5, 272.5, 12),
    to: 22,
    dx: 8
  },
  {
    step: 'ai',
    label: 'Model calls',
    anchor: w(366, 216, 11),
    to: 70
  },
  {
    step: 'ai',
    label: 'Guardrails',
    anchor: w(457, 185, 43),
    to: 22
  },
  {
    step: 'db',
    label: 'Relational',
    anchor: w(532.5, 52.5, 49),
    to: 30,
    dx: -104
  },
  {
    step: 'db',
    label: 'Documents',
    anchor: w(572.5, 12.5, 49),
    to: 75
  },
  // Its leader rises through the gap between the two cylinders behind it.
  {
    step: 'db',
    label: 'Cache & queues',
    anchor: w(606, 86, 35),
    to: 95
  }
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
    ['ai', 0, 350],
    ['db', 440, 616]
  ]
  for (const [id, u0, u1] of bases)
    svg += `<g class="station" data-step="${id}"><g class="pad">${slab(u0, u1, 545, 748, B)}</g></g>`
  const request = wire(REQUEST)
  // Side wires: the phone, the store drawer, the form, the queue, MongoDB, Redis.
  const sides = [
    [
      [70, 542],
      [70, 570]
    ],
    [
      [160, 449],
      [160, 470]
    ],
    [
      [194, 488],
      [194, 470]
    ],
    [
      [285, 380],
      [270, 380]
    ],
    [
      [542, 100],
      [572, 100],
      [572, 34]
    ],
    [
      [542, 125],
      [600, 125],
      [600, 106]
    ]
  ] as [number, number][][]
  svg += sides.map(s => `<path class="cable" d="${wire(s, 5)}"/>`).join('')
  svg += `<path class="cable main" d="${request}"/>`
  svg += `<path class="pulse" pathLength="1000" d="${request}"/>`
  svg += `<path class="beam" pathLength="1000" d="${request}"/>`

  const stations: [StepId, () => string][] = [
    ['device', device],
    ['data', dataLayer],
    ['server', server],
    ['ai', aiPipeline],
    ['db', databases]
  ]
  for (const [id, draw] of stations)
    svg += `<g class="station obj" data-step="${id}">${draw()}</g>`

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
        ? [a[0] + (c.dx ?? 0), a[1] - c.to]
        : project(c.to[0], c.to[1], 1)
    svg += `<line class="leader" data-step="${c.step}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${end[0].toFixed(1)}" y2="${end[1].toFixed(1)}"/>`
    return {
      step: c.step,
      label: c.label,
      up: typeof c.to === 'number',
      ...pct(end)
    }
  })

  const badges: Record<
    Exclude<StepId, 'ship'>,
    { left: number; top: number }
  > = {
    device: pct(project(...at(-520, 762, 0))),
    data: pct(project(...at(-312, 762, 0))),
    server: pct(project(...at(-104, 762, 0))),
    ai: pct(project(...at(175, 762, 0))),
    db: pct(project(...at(528, 762, 0)))
  }

  const overlays = {
    cloud: pct(project(...at(-45, 575, CLOUD_Z + 24))),
    terminal: pct(project(...at(70, 612, CLOUD_Z - 6))),
    stores: pct(project(...at(-330, 600, 96)))
  }

  // Where the request reaches each station, as a share of the wire (0–1000,
  // matching the beam's pathLength). Straight-line lengths; the rounded bends
  // shorten the real wire by a few units, which doesn't show.
  const flat = REQUEST.map(([x, y]) => project(x, y, CABLE_Z))
  const run = flat.map((_, i) =>
    flat
      .slice(1, i + 1)
      .reduce(
        (sum, p, k) => sum + Math.hypot(p[0] - flat[k][0], p[1] - flat[k][1]),
        0
      )
  )
  const total = run[run.length - 1]
  const stops = ARRIVALS.map(([step, i]) => ({
    step,
    at: Math.round((run[i] / total) * 1000)
  }))

  return {
    svg,
    viewBox: vb.map(n => +n.toFixed(1)).join(' '),
    badges,
    callouts,
    overlays,
    stops
  }
}
