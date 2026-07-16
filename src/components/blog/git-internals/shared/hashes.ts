/**
 * Deterministic *fake* hashes for the Git-internals demos.
 *
 * Real Git hashes content by prepending a header — `blob <byte-length>` then a NUL
 * separator — and running SHA-1 (or SHA-256) over the result. We don't need real
 * crypto here; we need the two *properties* that make content-addressable storage
 * click:
 *
 *   1. Same content in  =>  same hash out          (this is what enables dedup)
 *   2. One character changes => the whole hash scrambles   (the "avalanche" effect,
 *      which is what makes silent corruption detectable)
 *
 * So we use a tiny, stable, dependency-free hash: FNV-1a to fold the bytes, then a
 * MurmurHash-style integer finalizer to get strong avalanche on short strings.
 * Purely a function of its input — no Math.random(), no module-load state — so it's
 * SSR-safe and identical on every render.
 */

/**
 * The NUL byte real Git puts between the object header and the content. Built via
 * fromCharCode so this source file stays clean ASCII text (no embedded NUL bytes)
 * while the runtime string carries a real NUL — exactly what Git hashes over.
 */
const NUL = String.fromCharCode(0)

/**
 * The header real Git hashes over, formatted for *display* in captions —
 * e.g. `blob 5·`. We use a middle dot to stand in for the invisible NUL so it is
 * visible on screen (the real separator is a NUL byte; see `hashPayload`).
 */
export function gitBlobHeader(content: string): string {
  // Byte length, not character length — matches Git. TextEncoder is SSR-safe.
  const byteLength = new TextEncoder().encode(content).length
  return `blob ${byteLength}·`
}

/** The exact byte string Git would hash: `<type> <len>` + NUL + content. */
function hashPayload(content: string, type: 'blob' | 'tree' | 'commit'): string {
  const len = new TextEncoder().encode(content).length
  return `${type} ${len}${NUL}${content}`
}

/** MurmurHash3 fmix32 finalizer — spreads bits so tiny input changes avalanche. */
function fmix32(h: number): number {
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return h >>> 0
}

/** 32-bit FNV-1a over the UTF-8 bytes of `input`, seeded so we can derive two lanes. */
function fnv1a(input: string, seed: number): number {
  let h = (0x811c9dc5 ^ seed) >>> 0
  const bytes = new TextEncoder().encode(input)
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i]
    // h *= 16777619, kept in 32-bit space
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return fmix32(h)
}

/**
 * The core: hash any content to a stable, Git-looking 7-char hex string.
 * We fold the *real* Git object header in too (type, length, NUL), so identical
 * content always collides and a single-byte edit avalanches — like the real thing.
 */
export function hashContent(
  content: string,
  type: 'blob' | 'tree' | 'commit' = 'blob'
): string {
  const payload = hashPayload(content, type)
  // Two independent lanes give us 8 hex chars of entropy; take 7 like `git --short`.
  const a = fnv1a(payload, 0x9e3779b9)
  const b = fnv1a(payload, 0x85ebca6b)
  const hex = a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0')
  return hex.slice(0, 7)
}

/** Hash an arbitrary key (a commit's tree+parent+meta string, a ref name, etc.). */
export function hashKey(key: string): string {
  return hashContent(key, 'commit')
}

/**
 * A small pool of stable, realistic-looking 7-char hashes for demos that need
 * pre-seeded objects (a starting commit graph, etc.) without deriving them from
 * live content. Deterministic — generated from fixed seeds at module load, no RNG.
 */
export const HASH_POOL: string[] = Array.from({ length: 24 }, (_, i) =>
  hashContent(`seed-object-${i}`, 'commit')
)

/** Format a hash for display — Git shows the first 7 by convention (`--oneline`). */
export function shortHash(hash: string): string {
  return hash.slice(0, 7)
}
