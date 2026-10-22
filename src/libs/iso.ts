// Isometric drawing helpers that return SVG markup strings, for figures drawn
// on the server. The projection kernel is ported from iso-figure by Tolga
// Cohce (MIT, github.com/MrBongoC/ai-iso-skill). Axes: +x runs down-right,
// +y down-left, +z up. Paint back to front: smaller x + y first, lower z first.

export type Point3 = [number, number, number]

const C = Math.cos(Math.PI / 6)
const S = Math.sin(Math.PI / 6)

export const ISO_COS = C

export function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * C, (x + y) * S - z]
}

const fmt = ([x, y]: [number, number]) => `${x.toFixed(1)},${y.toFixed(1)}`

export function poly(points: Point3[], cls: string) {
  return `<polygon class="${cls}" points="${points.map(p => fmt(project(...p))).join(' ')}"/>`
}

export function line(points: Point3[], cls: string) {
  return `<path class="${cls}" d="M${points.map(p => fmt(project(...p))).join('L')}"/>`
}

export function pathData(points: Point3[]) {
  return `M${points.map(p => fmt(project(...p))).join('L')}`
}

// A box is its three visible faces: front (y + d), side (x + w) and top.
export function box(
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  h: number
) {
  return (
    poly(
      [
        [x, y + d, z + h],
        [x + w, y + d, z + h],
        [x + w, y + d, z],
        [x, y + d, z]
      ],
      'f-front'
    ) +
    poly(
      [
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x + w, y + d, z],
        [x + w, y, z]
      ],
      'f-side'
    ) +
    poly(
      [
        [x, y, z + h],
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x, y + d, z + h]
      ],
      'f-top'
    )
  )
}

export const topRect = (
  x: number,
  y: number,
  z: number,
  w: number,
  d: number,
  cls: string
) =>
  poly(
    [
      [x, y, z],
      [x + w, y, z],
      [x + w, y + d, z],
      [x, y + d, z]
    ],
    cls
  )

export const frontRect = (
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  cls: string
) =>
  poly(
    [
      [x, y, z],
      [x + w, y, z],
      [x + w, y, z - h],
      [x, y, z - h]
    ],
    cls
  )

export const sideRect = (
  x: number,
  y: number,
  z: number,
  d: number,
  h: number,
  cls: string
) =>
  poly(
    [
      [x, y, z],
      [x, y + d, z],
      [x, y + d, z - h],
      [x, y, z - h]
    ],
    cls
  )

function arc(
  cx: number,
  cy: number,
  z: number,
  r: number,
  t0: number,
  t1: number,
  n = 16
) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const t = ((t0 + ((t1 - t0) * i) / n) * Math.PI) / 180
    d +=
      (i ? 'L' : 'M') +
      fmt(project(cx + r * Math.cos(t), cy + r * Math.sin(t), z))
  }
  return d
}

const ellipse = (cx: number, cy: number, z: number, r: number, cls: string) =>
  `<path class="${cls}" d="${arc(cx, cy, z, r, 0, 360, 32)}Z"/>`

// An upright cylinder: the body hull, a mid band, and a top that can be lit.
export function cylinder(
  cx: number,
  cy: number,
  z: number,
  r: number,
  h: number,
  litTop = true
) {
  const s = Math.SQRT1_2
  const left: [number, number] = [cx - r * s, cy + r * s]
  const right: [number, number] = [cx + r * s, cy - r * s]
  const body =
    `M${fmt(project(left[0], left[1], z + h))}L${fmt(project(left[0], left[1], z))}` +
    arc(cx, cy, z, r, 135, -45).replace('M', 'L') +
    `L${fmt(project(right[0], right[1], z + h))}Z`
  return (
    `<path class="f-front" d="${body}"/>` +
    (h > 16
      ? `<path class="det" d="${arc(cx, cy, z + h / 2, r, 135, -45)}"/>`
      : '') +
    ellipse(cx, cy, z + h, r, 'f-top') +
    (litTop ? ellipse(cx, cy, z + h, r * 0.7, 'lit') : '')
  )
}
