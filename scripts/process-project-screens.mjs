// Turns the local screenshot originals into the WebP files the project pages
// use, plus a manifest of their sizes. Run: pnpm screens
//
// phone   -> <file>.webp       top crop at the screen's aspect (inline frame)
//            <file>-full.webp  full height (lightbox, loaded only on open)
// tablet/desktop -> <file>.webp (width capped)
// fromDark -> the same outputs with a -dark suffix

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { projectScreens } from './project-screens.config.mjs'

const OUT_DIR = 'public/images/projects'
const MANIFEST = 'src/content/projects/screens.json'
const PHONE_WIDTH = 780 // 2x a 390pt-wide phone
const PHONE_HEIGHT = 1688 // 2x 844pt: one screen of an iPhone 14/15
const MAX_WIDTH = 1440
const WEBP = { quality: 80, effort: 6 }

async function write(pipeline, outFile) {
  const { width, height, size } = await pipeline.webp(WEBP).toFile(outFile)
  return { width, height, size }
}

async function processPhone(input, base) {
  const meta = await sharp(input).metadata()
  const scale = PHONE_WIDTH / meta.width
  const fullHeight = Math.round(meta.height * scale)
  const cropHeight = Math.min(PHONE_HEIGHT, fullHeight)

  const inline = await write(
    sharp(input)
      .resize({ width: PHONE_WIDTH })
      .extract({ left: 0, top: 0, width: PHONE_WIDTH, height: cropHeight }),
    `${base}.webp`
  )
  // Only worth a separate full-height file when the frame scrolls meaningfully
  // past one screen (single-screen exports land a pixel or two over).
  const full =
    fullHeight > cropHeight * 1.05
      ? await write(
          sharp(input).resize({ width: PHONE_WIDTH }),
          `${base}-full.webp`
        )
      : null
  return { inline, full }
}

async function processWide(input, base) {
  const meta = await sharp(input).metadata()
  const pipeline = sharp(input)
  if (meta.width > MAX_WIDTH) pipeline.resize({ width: MAX_WIDTH })
  return { inline: await write(pipeline, `${base}.webp`), full: null }
}

const manifest = {}
let totalBytes = 0

for (const [slug, screens] of Object.entries(projectScreens)) {
  // Start clean so a removed or renamed screen never lingers.
  const dir = path.join(OUT_DIR, slug)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })

  for (const screen of screens) {
    for (const [source, suffix] of [
      [screen.from, ''],
      [screen.fromDark, '-dark']
    ]) {
      if (!source) continue
      if (!existsSync(source)) throw new Error(`Missing original: ${source}`)

      const base = path.join(dir, `${screen.file}${suffix}`)
      const out =
        screen.device === 'phone'
          ? await processPhone(source, base)
          : await processWide(source, base)

      totalBytes += out.inline.size + (out.full?.size ?? 0)
      if (suffix) {
        manifest[`${slug}/${screen.file}`].dark = true
        continue
      }
      manifest[`${slug}/${screen.file}`] = {
        device: screen.device,
        width: out.inline.width,
        height: out.inline.height,
        dark: false,
        ...(out.full && {
          full: { width: out.full.width, height: out.full.height }
        })
      }
      console.log(
        `${slug}/${screen.file}: ${out.inline.width}x${out.inline.height}` +
          (out.full ? ` (+ full ${out.full.width}x${out.full.height})` : '')
      )
    }
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(
  `\n${Object.keys(manifest).length} screens, ${(totalBytes / 1024).toFixed(0)} KB total -> ${MANIFEST}`
)
