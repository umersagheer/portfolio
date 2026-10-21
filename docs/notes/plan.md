# Blog Plan — "Git, Under the Hood" (interactive)

> **Status:** planning. This file is the source of truth for the Git-internals blog post.
> We build it **one phase at a time**. Each phase ships 1–3 fully-polished, interactive
> components + the prose around them. Do not start a phase until the previous one is
> approved. Update the checkboxes as we go.

---

## 0. Goal & guiding principles

We're turning two YouTube explainers on Git internals into a single, genuinely
**interactive** blog post — in the exact style of the existing posts
(`layout-animations`, `websockets`, `timezones`). The whole point of the post is
**visualization**: the reader should *do things* and watch Git respond, not read a wall
of text.

Non-negotiable principles (repeat these to yourself before writing any component):

1. **Understanding > flexing.** No jargon dumps. Every term is introduced with a plain
   sentence before it's used. If a sentence would confuse a mid-level dev, rewrite it.
2. **Show, then name.** Demonstrate the behavior interactively first, then attach the
   Git vocabulary to what they just saw.
3. **Git-accurate.** Every hash relationship, arrow direction, and command effect must
   match how Git actually works (see "Accuracy notes" per component). Fake hashes are
   fine (short 7-char hex), fake *behavior* is not.
4. **Arrows point child → parent (backwards in time), always.** A commit stores its
   parent's hash; parents never know their children. Every graph in the post obeys this.
5. **Consistent visual language across all components** (see §2). A blob is always the
   same shape/color everywhere in the post. This is what makes 10 components feel like
   one coherent teaching tool.
6. **Match the repo idioms** (see §3). `'use client'`, `framer-motion`, HeroUI,
   `@tabler/icons-react` / `lucide-react`, semantic color tokens, `DemoContainer`,
   `not-prose`, no semicolons, single quotes, `@/` imports.

---

## 1. Content spine (the narrative)

Decided direction: **Full under-the-hood** — build from physical storage up to commands.
Two parts, mirroring the two source videos but merged into one clean arc.

### Part 1 — The Object Store (how Git *stores* things)
1. **Hook** — "You use Git every day; it works until it doesn't." The 11pm-rebase-panic
   opening. Promise: after this post you'll think in *objects and pointers*, not
   memorized commands.
2. **Inside `.git`** — the four things: `objects/`, `refs/`, `HEAD`, `index`. Delete this
   folder and history is gone.
3. **Content-addressable storage** — you hand Git content, it hands back a hash; the hash
   *is* the key. Two consequences: identical content stored once (dedup), and instant
   corruption detection. → **Component: HashPlayground**
4. **The three objects** — blob (raw bytes, no name), tree (maps names → hashes, can point
   to other trees), commit (tree + parent + author + message). → **Component:
   ObjectInspector** (the flagship, see §4).
5. **Snapshots, not diffs** — every commit is a *full* snapshot; unchanged files reuse the
   same blob hash, so it's cheap. Diffs are computed on the fly, never stored. →
   **Component: SnapshotVsDiff**

### Part 2 — Pointers & Commands (how Git *moves* through history)
6. **The DAG** — commits chained by parent pointers form a directed acyclic graph. Family-
   tree analogy. Merge commits have two parents. → **Component: DagExplorer**
7. **Branches are just pointers** — a branch is a 41-byte file holding one commit hash.
   **HEAD** is a pointer to a branch (or, when detached, straight to a commit). Committing
   = write object, move branch, move HEAD. → **Component: BranchHeadSimulator**
8. **The staging area (index)** — the waiting room between working dir and history.
   working dir → `git add` (blob written) → index → `git commit` (trees + commit written).
   *(Covered inside the flagship ObjectInspector; §4. If it needs its own beat we add
   StagingPipeline, but default is: fold it into the flagship.)*
9. **Merge** — fast-forward (just slide the pointer, no new object) vs 3-way merge (diverged
   history → a brand-new merge commit with two parents). → **Component: MergeSimulator**
10. **Rebase** — "moving commits" is a lie; Git *replays* them as brand-new objects with
    new hashes and new parents; old commits are orphaned. Why you never rebase shared
    history. → **Component: RebaseReplay**
11. **Reset / revert** — reset moves a branch pointer (soft/mixed/hard differ only in what
    they do to index + working dir); revert never moves anything, it adds an inverse
    commit. → **Component: ResetModes** (+ a small ResetVsRevert framing).
12. **Reflog — the safety net** — Git records every move HEAD makes (~90 days). "Nothing is
    truly deleted, just unreferenced." Recover a lost commit by finding its hash. →
    **Component: ReflogRescue**
13. **Recap + Further Reading** — one-paragraph recap (object store + pointers), then links
    to the two videos + Pro Git book + a couple of the good references found in research.

---

## 2. Shared visual language (build FIRST, in Phase 1)

Every component pulls from one small shared kit so the whole post looks like one system.
Location: `src/components/blog/git-internals/shared/`.

| Concept        | Shape / treatment                          | Color token        |
|----------------|--------------------------------------------|--------------------|
| **blob**       | small rounded square, monospace hash       | `secondary` (blue) |
| **tree**       | rounded square, folder glyph               | `primary` (purple) |
| **commit**     | rounded square, slightly larger            | `default` + purple ring when HEAD |
| **branch ref** | pill / sticky-note tag                     | `success`-tinted   |
| **HEAD**       | bold outlined pill, connects to a branch   | `primary` outline  |
| **new object** | purple fill + subtle glow on first appear  | `primary-400`      |
| **orphaned**   | dashed border, dimmed opacity              | `default-300`      |
| **edge**       | thin line; child→parent; animates on draw  | `default-400`      |

Shared files to create in Phase 1:
- `git-object-node.tsx` — the canonical blob/tree/commit box (props: `type`, `hash`,
  `label`, `state: 'normal' | 'new' | 'orphaned' | 'head'`). Used by nearly every component.
- `ref-tag.tsx` — the branch/HEAD sticky-note pill.
- `edge.tsx` — an SVG/positioned connector with an optional draw-on animation.
- `git-demo-container.tsx` — thin wrapper over the existing `DemoContainer` pattern
  (title + optional description + `not-prose`), matching the newer timezone signature
  (`title`, `description`). Keeps every Git demo visually uniform.
- `hashes.ts` — tiny helper to render/format the fake short hashes consistently, plus a
  small fixed pool of realistic-looking 7-char hex so hashes are stable across renders
  (no `Math.random()` at module load — deterministic).
- `palette.ts` — the token map above, one place to tweak.

**Rationale:** the existing posts each rebuild `demo-container`; for a 10-component post,
a real shared kit is what keeps it coherent and keeps each later phase small.

---

## 3. Repo integration rules (applies every phase)

- Components live in `src/components/blog/git-internals/` (+ `shared/` subdir).
- Each is `'use client'`, default-exported, self-contained.
- Register every new component in `src/components/mdx-content.tsx` (import + add to the
  `components` object). MDX cannot import directly — the registry is the only path.
- The post file: `src/content/posts/git-internals.mdx` with standard frontmatter
  (`title`, `summary`, `image: /images/posts/git-internals-cover.png`, `author`,
  `publishedAt`, `category: 'post'`).
- Prose voice: warm, second-person, question-driven — match `layout-animations.mdx`.
- Headings `##`/`###` (auto-slugified → drive the table of contents).
- Code style: no semicolons, single quotes, `avoid` arrow parens, 2-space, no trailing
  commas, `@/` imports. Tailwind classes sorted (plugin handles it).
- Accessibility: buttons are real `<button>`/HeroUI `Button`, interactive segments have
  `aria-*`, respect `prefers-reduced-motion` where a component autoplays.
- After each phase: `pnpm lint` + `pnpm build` must pass. Spot-check the page in dev.

---

## 4. Flagship component — `ObjectInspector` (the "Git workbench")

This is the centerpiece (§1.4). Per your direction, it goes **beyond** the
step-machine/free-play conventions: it's a **lightweight editor + repo workbench** where
you edit file content and watch Git respond at every layer, side by side.

**Layout (three linked panels):**

```
┌─ Working Directory ─┐  ┌─ Staging (index) ─┐  ┌─ Object store + graph ─┐
│ app.py   [edit ▸]   │  │  (empty)          │  │  blobs / trees / commit │
│ db.py               │  │                   │  │  main → … (HEAD)        │
│ README.md           │  │                   │  │                         │
│  ── mini editor ──  │  │                   │  │                         │
└─────────────────────┘  └───────────────────┘  └─────────────────────────┘
        [ git add app.py ]   [ git commit ]   [ git reset ]
```

**Interaction flow (what the user actually does):**
1. Pick a file, edit its text in a small textarea ("light editor, not a full IDE").
2. As they type, a **live hash** recomputes next to the file ("Git would hash this
   content → `c113d0a`"). The file shows as *modified* vs the committed version.
3. **`git add`** → a **blob** object animates into the object-store panel (blue, glow),
   and the file moves into the Staging column. Optionally show a tiny line diff
   (added/removed) between working copy and the staged/committed blob.
4. **`git commit`** → watch, in sequence: a **tree** is built from the staged entries
   (purple), a **commit** wraps that tree and links to the current commit as parent, then
   **`main`** and **HEAD** slide forward to the new commit. Narrated in one short caption
   line, not a modal.
5. **`git reset`** (mode selector: soft / mixed / hard) → the branch pointer moves back;
   the caption explains precisely what happened to index + working dir for that mode; the
   now-unreferenced commit goes **dashed/orphaned** (teeing up reflog later).

**Why this is new for the repo:** existing demos are toggles/sliders/step-players. This
one has *editable content that drives a real hash → object → pointer chain*, with three
synchronized panels. It's the "do things and watch Git respond" surface you described.

**Accuracy notes:**
- Hash is derived deterministically from the textarea content (a small stable hash fn →
  7 hex chars). Identical content ⇒ identical hash (demonstrates dedup live: edit file B
  to match file A and watch the blob hash collide / reuse).
- Commit stores **parent hash**; arrow points new-commit → old-commit.
- Reset moves the *branch*, orphans the commit (doesn't delete it) — matches reflog beat.
- `git add` writes the blob immediately (real Git behavior); commit is what builds trees.

**Scope guard:** if this proves too large for one phase, split into (a) editor + hash +
add→blob, then (b) commit→tree→commit + pointer move, then (c) reset. But *design it as
one component* so the panels stay in sync.

---

## 5. Component catalogue (spec per component)

Each entry: **what it teaches → interaction → Git-accuracy notes.** All wrapped in
`GitDemoContainer`, all using the shared kit (§2).

### C1 · HashPlayground  *(Part 1 · content-addressable storage)*
- **Teaches:** the hash comes from the content; same content → same hash; one bit flip →
  totally different hash (avalanche) → corruption detection + dedup.
- **Interaction:** a text input; live 7-char hash updates as you type. Two side-by-side
  inputs so you can *make them match* and watch hashes converge, or change one char and
  watch the hash scramble. A "flip one bit" button on a sample. Little "stored once" badge
  when both inputs match.
- **Accuracy:** real Git prefixes content with `blob <len>\0` before SHA-1; we don't need
  real SHA-1, but we DO honor "same input ⇒ same output, tiny change ⇒ big change." Caption
  notes real Git uses SHA-1/SHA-256 over `type size\0content`.

### C2 · ObjectInspector *(flagship — see §4)*  *(Part 1 · blob/tree/commit + staging)*

### C3 · SnapshotVsDiff  *(Part 1 · snapshots not diffs)*
- **Teaches:** each commit points to a *full* snapshot; unchanged files reuse the same
  blob; diffs are computed, not stored.
- **Interaction:** a small file set across 2–3 commits. Toggle between **"What Git stores"**
  (full trees each commit, but unchanged blobs visibly *reuse* the same hash — draw a reuse
  edge back to the existing blob) and **"What you see"** (a computed +/- diff). A slider to
  step commit 1 → 2 → 3; changed file lights up, unchanged files show "reused" tags.
- **Accuracy:** unchanged file ⇒ identical blob hash ⇒ the new root tree just re-points to
  the existing blob. Diffs derived by comparing two trees. (Pack/delta compression is a
  storage optimization — one-sentence mention, not a component.)

### C4 · DagExplorer  *(Part 2 · the DAG)*
- **Teaches:** commits form a directed acyclic graph via parent pointers; merges create a
  two-parent node; "directed / acyclic / graph" each explained by interacting.
- **Interaction:** a prebuilt small history with a branch and a merge. Hover/click a commit
  to highlight its parent edge(s) and the ancestry path back to root. A toggle overlays the
  **family-tree analogy** (commit=person, edge=ancestry). Callouts that "you can't make a
  cycle" and "a merge commit has two parents."
- **Accuracy:** edges strictly child→parent. Merge node has exactly two parent edges.

### C5 · BranchHeadSimulator  *(Part 2 · branches + HEAD)*
- **Teaches:** a branch is a sticky-note holding one hash; HEAD points at a branch;
  committing moves the branch + HEAD; `checkout` moves HEAD; detached HEAD = HEAD points
  straight at a commit.
- **Interaction:** buttons: `commit`, `branch feature`, `checkout <x>`, `checkout <hash>`
  (→ detached). Watch the `main`/`feature`/HEAD tags physically move. A panel shows the
  literal file contents: `.git/HEAD → ref: refs/heads/main`, `refs/heads/main → 5ba3d0b`.
  Enter detached state and get the accurate "commits here won't be saved unless you make a
  branch" warning.
- **Accuracy:** branch file = one hash + newline; HEAD usually holds `ref: refs/heads/…`;
  detached HEAD holds a raw hash. New commit updates branch then HEAD follows (because HEAD
  → branch).

### C6 · MergeSimulator  *(Part 2 · merge)*
- **Teaches:** fast-forward (pointer just slides, no new object) vs 3-way merge (diverged →
  new merge commit with two parents).
- **Interaction:** a toggle/scenario switch: **"main hasn't moved"** → press Merge → pointer
  slides forward, caption "fast-forward: zero new objects." **"main moved too"** → press
  Merge → find common ancestor (highlight it), create a new **merge commit** (two parent
  edges), move `main` to it. Same two source images we were given (fast-forward + brand-new
  merge commit) as the visual targets.
- **Accuracy:** ff = no new commit object. 3-way = new commit, two parents, main advances to
  it, feature unchanged.

### C7 · RebaseReplay  *(Part 2 · rebase)*
- **Teaches:** rebase doesn't move commits (objects are immutable); it *replays* their
  changes as **new** commits with **new hashes** and new parents; originals are orphaned;
  never rebase shared history.
- **Interaction:** `feature` (B,C) off an old `main`; `main` has moved (X,Y). Press Rebase →
  animate B→B', C→C' being *recreated* on top of Y with brand-new hashes (old B,C go dashed/
  orphaned), `feature` moves to C'. "New objects, new hashes" caption (matches the given
  screenshot). A short note: if a teammate had the old B,C, this is why it explodes.
- **Accuracy:** hash = f(content, metadata, parent); changing parent ⇒ new hash ⇒ new
  commit. Old commits remain in the object store until GC (orphaned, not moved).

### C8 · ResetModes (+ ResetVsRevert framing)  *(Part 2 · reset / revert)*
- **Teaches:** reset moves the *branch pointer*; soft/mixed/hard differ only in what they
  touch (pointer only / +index / +working dir); revert adds an inverse commit and moves
  nothing back.
- **Interaction:** three columns — **Pointer**, **Index**, **Working dir**. Pick a target
  commit + a mode (soft/mixed/hard) → animate exactly which of the three columns change,
  with the destructive one (hard wipes working dir) clearly flagged. A second small toggle
  contrasts **revert**: no pointer move, a new "inverse" commit appears on top. Callout:
  untracked files survive even hard reset; use revert for shared history.
- **Accuracy:** soft = pointer only; mixed (default) = pointer + index; hard = pointer +
  index + working dir. Revert = new commit, history preserved.

### C9 · ReflogRescue  *(Part 2 · reflog)*
- **Teaches:** Git journals every HEAD move; "lost" commits are only unreferenced, still in
  the object store; recover by finding the hash and pointing a branch at it.
- **Interaction:** replay a small disaster (`reset --hard` from C8, or a bad rebase) that
  orphans a commit. Then open the **reflog** panel — a scrollable journal of HEAD positions
  (`HEAD@{0} …`). Click the pre-disaster entry → a `git branch rescue <hash>` action
  re-attaches a branch to the orphaned commit → it un-dims. "A journal of every HEAD
  position" (matches the given screenshot vibe).
- **Accuracy:** reflog is local, ~90-day default expiry; recovery = create a ref to the
  dangling commit. Nothing was ever truly deleted.

**Total: 9 components** (C2 is the big one). This hits your "comprehensive, take our time"
intent while every component earns its place against a distinct concept. If any feels
redundant while building, we merge — but this is the target.

---

## 6. Phase breakdown (build order)

> Two–three components per phase so no session is overwhelmed. Each phase = build +
> register + write the surrounding MDX prose + `pnpm lint`/`pnpm build` + dev spot-check.
> We only proceed when you've approved the phase.

- [ ] **Phase 0 — Skeleton & prose scaffold**
  - Create `src/content/posts/git-internals.mdx` with frontmatter + the *full prose*
    (all sections written, component tags as placeholders/commented). This lets us read
    the whole narrative end-to-end before building a single widget, and catch pacing
    issues early. Temporary placeholder cover image reference.
  - Create the empty `src/components/blog/git-internals/` (+ `shared/`) dirs.
  - No components yet. Deliverable: a readable draft post.

- [ ] **Phase 1 — Shared kit + C1 (HashPlayground)**
  - Build the whole shared kit (§2): `git-object-node`, `ref-tag`, `edge`,
    `git-demo-container`, `hashes.ts`, `palette.ts`.
  - Build **C1 · HashPlayground** as the first real use of the kit (also the gentlest
    concept → good shakedown for the shared components).
  - Register + wire into MDX. Lint/build/spot-check.

- [ ] **Phase 2 — C2 (ObjectInspector, the flagship)**
  - The big one gets its own phase. Editor + hash + `add`→blob, `commit`→tree→commit +
    pointer move, `reset`. Built as one component with three synced panels (§4).
  - If it runs long, land it in the §4 sub-steps but keep it one component.

- [ ] **Phase 3 — C3 (SnapshotVsDiff) + C4 (DagExplorer)**
  - Closes Part 1 (snapshots) and opens Part 2 (DAG). Both lean on the shared graph/edge
    kit already proven in Phases 1–2.

- [ ] **Phase 4 — C5 (BranchHeadSimulator) + C6 (MergeSimulator)**
  - The pointer-mechanics heart of Part 2. C6 reuses C5's branch/HEAD tags.

- [ ] **Phase 5 — C7 (RebaseReplay) + C8 (ResetModes) + C9 (ReflogRescue)**
  - The "scary commands, demystified" trio. C9 depends on the orphaned-state visuals from
    C7/C8, so they ship together for a coherent finale.

- [ ] **Phase 6 — Remotion cover still & polish**
  - **Cover still only — no promo video.** `src/remotion/blogs/git-internals/`:
    `config.ts` + `GitInternalsCover.tsx` (1280×720 still) per the Remotion CLAUDE.md
    conventions; reuse shared brand backdrop/underline. Pull motifs from the real
    components (blob→tree→commit boxes, the graph).
  - Render still → `public/images/posts/git-internals-cover.png`, point frontmatter at it.
    Replace the Phase 0 placeholder.
  - Final pass: reduced-motion checks, mobile layout of each component, TOC reads well,
    Further Reading links verified. Full `pnpm lint` + `pnpm build`.

---

## 7. Further Reading (to cite at the end of the post)

- YouTube: "How Git works under the hood" — https://www.youtube.com/watch?v=Ala6PHlYjmw
- YouTube: (the commit/DAG/branches/reset/rebase/reflog one) — https://www.youtube.com/watch?v=Csd4lMKPC5g
- Pro Git — 10.2 Git Internals (Git Objects): https://git-scm.com/book/en/v2/Git-Internals-Git-Objects
- freeCodeCamp — A Visual Guide to Git Internals:
  https://www.freecodecamp.org/news/git-internals-objects-branches-create-repo/
- (verify/curate final list in Phase 6)

---

## 8. Accuracy checklist (review against this before shipping any phase)

- [ ] All edges point child → parent (backwards in time).
- [ ] Same content ⇒ same hash, everywhere it matters (dedup, snapshots, ff-merge).
- [ ] `git add` writes a blob; `git commit` builds trees + commit; HEAD follows the branch.
- [ ] Rebase/reset/checkout create/move as Git actually does; "destructive" commands
      orphan (don't delete) — reflog can recover.
- [ ] Fast-forward creates zero new objects; 3-way merge creates one two-parent commit.
- [ ] soft/mixed/hard reset touch exactly {pointer} / {pointer,index} / {pointer,index,wd}.
- [ ] No jargon without a plain-language intro. Read every paragraph aloud test.
```
