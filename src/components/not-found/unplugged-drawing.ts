import { box, frontRect, project, topRect, type Point3 } from '@/libs/iso'

// Fig. 404: a monitor whose cable was pulled from the wall socket. The plug
// lies on the floor; plugged in, it sits in the socket's port.
const fmt = ([x, y]: [number, number]) => `${x.toFixed(1)},${y.toFixed(1)}`
// A loose cable: an S-curve that bulges sideways, so it reads as slack.
const curve = (a: Point3, b: Point3, sag: number) => {
  const p = project(...a)
  const q = project(...b)
  const c1: [number, number] = [p[0] - sag * 1.6, p[1] + sag * 1.2]
  const c2: [number, number] = [q[0] + sag * 1.8, q[1] - sag * 0.4]
  return `M${fmt(p)}C${fmt(c1)} ${fmt(c2)} ${fmt(q)}`
}
const through = (points: Point3[]) =>
  `M${points.map(p => fmt(project(...p))).join('L')}`

const PLUG = { w: 18, d: 22, h: 14 }
const FLOOR_PLUG: Point3 = [196, 160, 0]
const SOCKET_PLUG: Point3 = [281, 34, 42]
const CABLE_OUT: Point3 = [118, 74, 6]

export function drawUnplugged() {
  let svg = box(0, 0, -8, 380, 240, 8)
  svg += topRect(8, 8, 0, 364, 224, 'det')

  // Cables first, so the objects stand on them: slack (unplugged) and taut.
  const slack = curve(CABLE_OUT, [FLOOR_PLUG[0] + 9, FLOOR_PLUG[1], 7], 26)
  const taut = through([
    CABLE_OUT,
    [210, 74, 1],
    [210, 92, 1],
    [290, 92, 1],
    [290, 56, 1],
    [290, 56, 49]
  ])
  svg += `<path class="cable slack" d="${slack}"/>`
  svg += `<path class="cable taut" d="${taut}"/>`
  svg += `<path class="pulse" pathLength="1000" d="${taut}"/>`

  // The monitor: a stand, a base and a screen that lights when power returns.
  svg += box(40, 40, 0, 80, 50, 4)
  svg += box(74, 58, 4, 12, 10, 26)
  svg += box(30, 56, 30, 100, 6, 64)
  svg += frontRect(36, 62, 88, 88, 52, 'screen')

  // The wall socket, with its port and a status light.
  svg += box(250, 20, 0, 80, 14, 108)
  svg += frontRect(270, 34, 74, 40, 40, 'f-front')
  svg += frontRect(280, 34, 64, 20, 20, 'port')
  svg += frontRect(312, 34, 98, 8, 4, 'led')

  // The plug, drawn where it lies; it slides to the socket when plugged in.
  const [x, y, z] = FLOOR_PLUG
  const plug =
    box(x, y, z, PLUG.w, PLUG.d, PLUG.h) +
    frontRect(x + 4, y + PLUG.d, z + PLUG.h - 4, 10, 4, 'lit')
  const from = project(...FLOOR_PLUG)
  const to = project(...SOCKET_PLUG)
  svg += `<g class="plug" style="--dx:${(to[0] - from[0]).toFixed(1)}px;--dy:${(to[1] - from[1]).toFixed(1)}px">${plug}</g>`

  const pts = [
    [0, 0, -8],
    [380, 0, -8],
    [0, 240, -8],
    [380, 240, -8],
    [250, 20, 108],
    [30, 56, 94]
  ].map(p => project(...(p as Point3)))
  const xs = pts.map(p => p[0])
  const ys = pts.map(p => p[1])
  const m = 12
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
