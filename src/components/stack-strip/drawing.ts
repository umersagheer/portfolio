import {
  box,
  cylinder,
  frontRect,
  line,
  project,
  topRect,
  type Point3
} from '@/libs/iso'

// The home page's small Fig. 01: screens, a server and databases on three
// plates, wired left to right. Each stop is drawn in its own 70 × 56 frame
// and shifted along +x / −y, which keeps the plates level on screen.
const STEP = 75
const at =
  (k: number) =>
  ([x, y, z]: Point3): Point3 => [x + k * STEP, y - k * STEP, z]

function plate(k: number) {
  const [x, y] = at(k)([0, 0, 0])
  return topRect(x, y, 0, 70, 56, 'det')
}

export function drawStackStrip() {
  const s0 = at(0)
  const s1 = at(1)
  const s2 = at(2)

  // One cable on the ground, drawn first so the objects stand on it: it runs
  // from under the laptop, through the server, into the databases. The stops'
  // centres share a screen height (the shift keeps x + y constant), so it's a
  // single level run that shows only in the gaps between objects.
  let svg = line([s0([27, 36, 0]), s1([35, 28, 0]), s2([36, 27, 0])], 'wire')

  // 1 · a laptop and a phone, screens lit
  svg += plate(0)
  svg += box(8, 12, 0, 38, 2, 26)
  svg += frontRect(11, 14, 23, 32, 20, 'lit')
  svg += box(8, 16, 0, 38, 26, 2)
  svg += box(52, 30, 0, 10, 2, 20)
  svg += frontRect(53.5, 32, 18.5, 7, 17, 'lit')

  // 2 · a server with drive slots and a live light
  svg += plate(1)
  const [sx, sy] = s1([18, 10, 0])
  svg += box(sx, sy, 0, 34, 30, 40)
  for (const z of [8, 16, 24, 32]) {
    svg += line(
      [
        [sx + 4, sy + 30, z],
        [sx + 30, sy + 30, z]
      ],
      'det'
    )
  }
  svg += frontRect(sx + 22, sy + 30, 37, 8, 3, 'lit')

  // 3 · databases, tops lit
  svg += plate(2)
  for (const [cx, cy, h] of [
    [24, 18, 22],
    [48, 18, 22],
    [36, 38, 13]
  ]) {
    const [x, y] = s2([cx, cy, 0])
    svg += cylinder(x, y, 0, 11, h)
  }

  // Fit the view to the plates and the tallest object.
  const corners: Point3[] = [0, 1, 2].flatMap(k =>
    (
      [
        [0, 0, 0],
        [70, 0, 0],
        [70, 56, 0],
        [0, 56, 0]
      ] as Point3[]
    ).map(at(k))
  )
  const tops: Point3[] = [s1([18, 10, 40]), s0([8, 12, 26]), s2([24, 18, 33])]
  const pts = [...corners, ...tops].map(p => project(...p))
  const xs = pts.map(p => p[0])
  const ys = pts.map(p => p[1])
  const m = 4
  const viewBox = [
    Math.min(...xs) - m,
    Math.min(...ys) - m,
    Math.max(...xs) - Math.min(...xs) + 2 * m,
    Math.max(...ys) - Math.min(...ys) + 2 * m
  ]
    .map(n => +n.toFixed(1))
    .join(' ')

  return { svg, viewBox }
}
