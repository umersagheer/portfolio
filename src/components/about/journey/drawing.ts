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

// The panorama: u runs left to right on screen and v runs into the scene, so a
// row of stations at one v reads as a straight line. `at` maps (u, v, z) onto
// the iso floor.
const at = (u: number, v: number, z: number): Point3 => [
  (v + u) / 2,
  (v - u) / 2,
  z
]
const floor = (pts: Point3[], cls: string) =>
  poly(
    pts.map(([u, v, z]) => at(u, v, z)),
    cls
  )

const U = 640
const V0 = 520
const V1 = 880
const ROW = 640 // the request row
const LANE = 804 // the delivery lane
const HALF = 52 // half a station tile
const BEAM_Z = 84

const tileCenter = (t: number) => {
  const [x, y] = at(-520 + 208 * t, ROW, 0)
  return [x, y] as const
}
const tile = (t: number) => {
  const [cx, cy] = tileCenter(t)
  return `<g class="pad">${box(cx - HALF, cy - HALF, 0, 2 * HALF, 2 * HALF, 3)}</g>`
}

const stations: Record<Exclude<StepId, 'ship'>, () => string> = {
  // A laptop and a phone, screens lit.
  device: () => {
    const [cx, cy] = tileCenter(0)
    return (
      tile(0) +
      box(cx - 38, cy - 26, 3, 62, 46, 4) +
      topRect(cx - 32, cy - 20, 7, 50, 34, 'det') +
      box(cx - 38, cy - 26, 7, 62, 4, 52) +
      frontRect(cx - 33, cy - 22, 56, 52, 42, 'lit') +
      box(cx + 30, cy - 4, 3, 16, 4, 42) +
      frontRect(cx + 32, cy, 41, 12, 36, 'lit')
    )
  },
  // A cache shelf (React Query), a store drawer (Zustand) and a form with a tick.
  data: () => {
    const [cx, cy] = tileCenter(1)
    const shelves = [3, 19, 35]
      .map(
        z =>
          box(cx - 46, cy - 46, z, 48, 26, 3) +
          [0, 1, 2]
            .map(
              k =>
                box(cx - 42 + k * 15, cy - 42, z + 3, 11, 12, 9) +
                topRect(cx - 41 + k * 15, cy - 41, z + 12, 9, 10, 'lit')
            )
            .join('')
      )
      .join('')
    return (
      tile(1) +
      shelves +
      box(cx - 46, cy - 23, 3, 3, 3, 38) +
      box(cx - 1, cy - 23, 3, 3, 3, 38) +
      box(cx + 10, cy - 46, 3, 34, 28, 40) +
      [14, 27]
        .map(z => frontRect(cx + 13, cy - 18, 3 + z, 28, 0.1, 'det'))
        .join('') +
      box(cx + 14, cy - 18, 30, 26, 12, 10) +
      topRect(cx + 18, cy - 15, 40, 18, 6, 'lit') +
      box(cx - 42, cy + 6, 3, 56, 36, 3) +
      [0, 1, 2]
        .map(k =>
          line(
            [
              [cx - 34, cy + 14 + k * 9, 6],
              [cx - 6, cy + 14 + k * 9, 6]
            ],
            'det'
          )
        )
        .join('') +
      line(
        [
          [cx, cy + 22, 6],
          [cx + 5, cy + 28, 6],
          [cx + 13, cy + 13, 6]
        ],
        'ink'
      )
    )
  },
  // The gateway every request passes through, a rack, and a queue belt.
  server: () => {
    const [cx, cy] = tileCenter(2)
    return (
      tile(2) +
      box(cx - 44, cy - 48, 3, 8, 8, 62) +
      box(cx - 44, cy + 40, 3, 8, 8, 62) +
      box(cx - 44, cy - 48, 65, 8, 96, 8) +
      sideRect(cx - 36, cy - 40, 71, 80, 4, 'lit') +
      box(cx - 12, cy - 48, 3, 56, 22, 40) +
      [0, 1, 2]
        .map(k => frontRect(cx - 6 + k * 17, cy - 26, 34, 12, 3, 'lit'))
        .join('') +
      box(cx - 8, cy + 8, 3, 50, 12, 4) +
      [0, 1, 2].map(k => box(cx - 4 + k * 16, cy + 9, 7, 10, 10, 8)).join('')
    )
  },
  // Documents to retrieve, the model, a guardrail gate and stacked memory.
  ai: () => {
    const [ax, ay] = tileCenter(3)
    const [bx, by] = tileCenter(4)
    return (
      tile(3) +
      tile(4) +
      line([at(-104, ROW, 4), at(312, ROW, 4)], 'ink') +
      box(ax - 42, ay - 34, 3, 36, 42, 3) +
      box(ax - 39, ay - 36, 6, 36, 42, 3) +
      box(ax - 36, ay - 38, 9, 36, 42, 3) +
      topRect(ax - 30, ay - 32, 12, 24, 4, 'det') +
      topRect(ax - 30, ay - 24, 12, 24, 4, 'det') +
      topRect(ax - 30, ay - 16, 12, 14, 4, 'lit') +
      box(ax + 6, ay - 40, 3, 46, 46, 8) +
      topRect(ax + 16, ay - 30, 11, 26, 26, 'lit') +
      [0, 1, 2]
        .map(
          k =>
            frontRect(ax + 14 + k * 12, ay + 6, 7, 6, 3, 'det') +
            sideRect(ax + 52, ay - 32 + k * 12, 7, 6, 3, 'det')
        )
        .join('') +
      box(bx - 40, by - 44, 3, 5, 5, 36) +
      box(bx - 40, by + 34, 3, 5, 5, 36) +
      box(bx - 40, by - 44, 39, 5, 83, 4) +
      box(bx - 40, by - 39, 22, 5, 73, 2) +
      sideRect(bx - 35, by - 16, 36, 32, 12, 'lit') +
      cylinder(bx + 22, by - 8, 3, 17, 7, false) +
      cylinder(bx + 22, by - 8, 11, 17, 7, false) +
      cylinder(bx + 22, by - 8, 19, 17, 7)
    )
  },
  db: () => {
    const [cx, cy] = tileCenter(5)
    return (
      tile(5) +
      cylinder(cx - 22, cy - 20, 3, 21, 46) +
      cylinder(cx + 24, cy - 22, 3, 21, 46) +
      cylinder(cx + 2, cy + 24, 3, 21, 32)
    )
  }
}

// The delivery lane: build, test and deploy along a track, then four platforms.
// The crate is drawn at u = 0 and moved along the lane by the controller.
export const SHIP_STOPS = [-470, -170, 130, 420]
const shipLane = () => {
  const station = (
    u: number,
    w: number,
    h: number,
    extra: (x: number, y: number) => string
  ) => {
    const [x, y] = at(u, LANE, 0)
    return box(x - w / 2, y - w / 2, 3, w, w, h) + extra(x, y)
  }
  const pads = [
    [455, 790],
    [535, 790],
    [455, 850],
    [535, 850]
  ]
    .map(([u, v], i) => {
      const [x, y] = at(u, v, 0)
      return (
        box(x - 17, y - 17, 3, 34, 34, 5) +
        `<g class="dest" data-dest="${i}">${topRect(x - 12, y - 12, 8, 24, 24, 'lit')}</g>`
      )
    })
    .join('')
  const [crateX, crateY] = at(0, LANE, 0)
  return (
    floor(
      [
        [-560, 790, 3],
        [430, 790, 3],
        [430, 818, 3],
        [-560, 818, 3]
      ],
      'f-top'
    ) +
    floor(
      [
        [-560, 818, 3],
        [430, 818, 3],
        [430, 818, 0],
        [-560, 818, 0]
      ],
      'f-front'
    ) +
    station(SHIP_STOPS[0], 30, 26, (x, y) =>
      frontRect(x - 9, y + 15, 23, 18, 8, 'lit')
    ) +
    station(
      SHIP_STOPS[1],
      26,
      20,
      (x, y) =>
        `<g data-lamp="test">${topRect(x - 8, y - 8, 23, 16, 16, 'lit')}</g>` +
        line(
          [
            [x - 5, y + 1, 24],
            [x - 1, y + 5, 24],
            [x + 6, y - 5, 24]
          ],
          'ink'
        )
    ) +
    station(
      SHIP_STOPS[2],
      32,
      8,
      (x, y) =>
        `<g data-lamp="deploy">${topRect(x - 10, y - 10, 11, 20, 20, 'lit')}</g>`
    ) +
    pads +
    `<g class="crate" data-crate>${box(crateX - 9, crateY - 9, 6, 18, 18, 14)}${frontRect(crateX - 6, crateY + 9, 18, 12, 3, 'live')}</g>`
  )
}

export function drawJourney() {
  let svg =
    floor(
      [
        [-U, V0, 0],
        [U, V0, 0],
        [U, V1, 0],
        [-U, V1, 0]
      ],
      'f-top'
    ) +
    floor(
      [
        [-U, V1, 0],
        [U, V1, 0],
        [U, V1, -10],
        [-U, V1, -10]
      ],
      'f-front'
    ) +
    floor(
      [
        [-U + 10, V0 + 8, 0],
        [U - 10, V0 + 8, 0],
        [U - 10, V1 - 8, 0],
        [-U + 10, V1 - 8, 0]
      ],
      'det'
    )

  for (const id of ['device', 'data', 'server', 'ai', 'db'] as const) {
    svg += `<g class="station" data-step="${id}">${stations[id]()}</g>`
  }
  svg += `<g class="station" data-step="ship">${shipLane()}</g>`

  // The request: an overhead beam from the device to the databases that drops
  // into every station; a dash of light travels along it.
  const posts = [-600, 600].map(u => {
    const [x, y] = at(u, ROW, 0)
    return box(x, y, 0, 3, 3, BEAM_Z)
  })
  const drops = [
    [-520, 62],
    [-312, 44],
    [-104, 76],
    [104, 14],
    [312, 40],
    [520, 50]
  ]
    .map(([u, top]) => line([at(u, ROW, BEAM_Z), at(u, ROW, top + 4)], 'bus'))
    .join('')
  const beam: Point3[] = [at(-600, ROW, BEAM_Z), at(600, ROW, BEAM_Z)]
  svg +=
    posts.join('') +
    drops +
    line(beam, 'bus') +
    `<path class="flow" pathLength="1000" d="${pathData(beam)}"/>`

  const extremes: Point3[] = [
    at(-U, V0, 0),
    at(U, V0, 0),
    at(U, V1, -10),
    at(-U, V1, -10),
    at(0, ROW, BEAM_Z + 6)
  ]
  const pts = extremes.map(p => project(...p))
  const xs = pts.map(p => p[0])
  const ys = pts.map(p => p[1])
  const m = 10
  const viewBox = [
    Math.min(...xs) - m,
    Math.min(...ys) - m,
    Math.max(...xs) - Math.min(...xs) + 2 * m,
    Math.max(...ys) - Math.min(...ys) + 2 * m
  ]

  // Step numbers sit over the drawing as HTML, placed in percent of the view.
  const badgeAt = (p: Point3) => {
    const [x, y] = project(...p)
    return {
      left: ((x - viewBox[0]) / viewBox[2]) * 100,
      top: ((y - viewBox[1]) / viewBox[3]) * 100
    }
  }
  const badges: Record<StepId, { left: number; top: number }> = {
    device: badgeAt(at(-520, 752, 3)),
    data: badgeAt(at(-312, 752, 3)),
    server: badgeAt(at(-104, 752, 3)),
    ai: badgeAt(at(208, 752, 3)),
    db: badgeAt(at(520, 752, 3)),
    ship: badgeAt(at(-600, LANE, 3))
  }

  return { svg, viewBox: viewBox.map(n => +n.toFixed(1)).join(' '), badges }
}
