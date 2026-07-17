/**
 * A tiny, dependency-free line diff for the Git-internals demos.
 *
 * Real Git computes diffs on the fly by comparing two snapshots — it never stores
 * them. These demos do the same in miniature: given the old and new content of a
 * file, we compute which lines were added / removed / left alone, purely for
 * display. Classic longest-common-subsequence over lines, then a back-walk to emit
 * rows in order. Small enough to reuse in the SnapshotVsDiff demo later.
 */

export type DiffRowType = 'add' | 'remove' | 'context'

export type DiffRow = {
  type: DiffRowType
  text: string
  /** 1-based line number in the old file (null for added lines). */
  oldLine: number | null
  /** 1-based line number in the new file (null for removed lines). */
  newLine: number | null
}

/** Split into lines without a trailing empty row when the text ends in a newline. */
function toLines(text: string): string[] {
  if (text === '') return []
  const lines = text.split('\n')
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop()
  return lines
}

/**
 * Diff `oldText` against `newText`, line by line. Returns rows in file order:
 * `context` = unchanged, `remove` = only in old, `add` = only in new.
 */
export function diffLines(oldText: string, newText: string): DiffRow[] {
  const a = toLines(oldText)
  const b = toLines(newText)
  const n = a.length
  const m = b.length

  // LCS length table over lines. lcs[i][j] = LCS of a[i:] and b[j:].
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  )
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  // Back-walk to emit rows in order.
  const rows: DiffRow[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({ type: 'context', text: a[i], oldLine: i + 1, newLine: j + 1 })
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      rows.push({ type: 'remove', text: a[i], oldLine: i + 1, newLine: null })
      i++
    } else {
      rows.push({ type: 'add', text: b[j], oldLine: null, newLine: j + 1 })
      j++
    }
  }
  while (i < n) {
    rows.push({ type: 'remove', text: a[i], oldLine: i + 1, newLine: null })
    i++
  }
  while (j < m) {
    rows.push({ type: 'add', text: b[j], oldLine: null, newLine: j + 1 })
    j++
  }

  return rows
}

/** Quick counts for a summary line (e.g. "+3 −1"). */
export function diffStat(rows: DiffRow[]): { added: number; removed: number } {
  let added = 0
  let removed = 0
  for (const row of rows) {
    if (row.type === 'add') added++
    else if (row.type === 'remove') removed++
  }
  return { added, removed }
}
