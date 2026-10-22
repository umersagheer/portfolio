import { ICONS, type IconSlug } from '@/components/about/journey/icons'
import { SHIP_STOPS, drawJourney } from '@/components/about/journey/drawing'
import JourneyController from '@/components/about/journey/journey-controller'
import {
  PLATFORMS,
  STEPS,
  TOOLS,
  type ToolKey
} from '@/components/about/journey/steps'
import styles from '@/components/about/journey/journey.module.css'

// Drawn once on the server at build time; no drawing code reaches the browser.
const { svg, viewBox, badges } = drawJourney()

function Glyph({ slug, size }: { slug: IconSlug; size: number }) {
  return (
    <svg
      viewBox='0 0 24 24'
      width={size}
      height={size}
      aria-hidden='true'
      className={styles.glyph}
    >
      <path d={ICONS[slug]} fill='currentColor' />
    </svg>
  )
}

function MainTool({ tool }: { tool: ToolKey }) {
  const { name, icon } = TOOLS[tool] as { name: string; icon?: IconSlug }
  return (
    <span className={styles.tool}>
      {icon && <Glyph slug={icon} size={15} />}
      {name}
    </span>
  )
}

function SupportingTool({ tool }: { tool: ToolKey }) {
  const { name, icon } = TOOLS[tool] as { name: string; icon?: IconSlug }
  if (!icon)
    return <span className={`${styles.word} font-sourceCodePro`}>{name}</span>
  return (
    <span data-tip={name} role='img' aria-label={name}>
      <Glyph slug={icon} size={13} />
    </span>
  )
}

const toolNames = (keys: ToolKey[]) => keys.map(k => TOOLS[k].name).join(' · ')

export default function Journey() {
  return (
    <JourneyController
      className={styles.root}
      stops={SHIP_STOPS}
      platforms={PLATFORMS}
    >
      <div className={`${styles.head} font-sourceCodePro`}>
        <span>
          FIG 01
          <span className='hidden sm:inline'> · ONE REQUEST, END TO END</span>
        </span>
        <button
          type='button'
          data-ship
          className={`${styles.ship} font-sourceCodePro`}
        >
          SHIP IT ▸
        </button>
      </div>

      <div className={styles.drawing}>
        <svg
          className={styles.svg}
          viewBox={viewBox}
          role='img'
          aria-label='One request, end to end: a phone and laptop send a request through the data layer to the server, through an AI pipeline (retrieve, model, guardrail, memory) to the databases and back. A delivery lane below builds, tests and deploys to Railway, AWS, the App Store and Google Play.'
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        {STEPS.map((step, i) => (
          <span
            key={step.id}
            data-step={step.id}
            aria-hidden='true'
            className={`${styles.badge} font-sourceCodePro`}
            style={{
              left: `${badges[step.id].left.toFixed(2)}%`,
              top: `${badges[step.id].top.toFixed(2)}%`
            }}
          >
            {i + 1}
          </span>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.rows}>
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              type='button'
              data-step={step.id}
              aria-pressed='false'
              aria-controls='journey-panel'
              className={styles.row}
            >
              <span className={styles.name}>
                <span className={`${styles.num} font-sourceCodePro`}>
                  0{i + 1}
                </span>
                {step.name}
              </span>
              <span className={styles.tools}>
                {step.main.map(tool => (
                  <MainTool key={tool} tool={tool} />
                ))}
                <span className={styles.supporting}>
                  {step.supporting.map(tool => (
                    <SupportingTool key={tool} tool={tool} />
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div id='journey-panel' className={styles.panel} aria-live='polite'>
          <div data-panel='none' className={styles.hint}>
            Every product I build follows this path. Pick a step to see how I
            handle it.
          </div>
          {STEPS.map(step => (
            <div key={step.id} data-panel={step.id} hidden>
              <h3>{step.does}</h3>
              <ul>
                {step.patterns.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className={`${styles.note} font-sourceCodePro`}>
                with {toolNames([...step.main, ...step.supporting])}
              </p>
              {step.exploring && (
                <p className={`${styles.note} font-sourceCodePro`}>
                  exploring: {step.exploring}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.foot} font-sourceCodePro`}>
        <span data-readout>
          request · device → data layer → server → ai → databases
        </span>
        <span className={styles.keys}>1–6 · ← → · ESC</span>
      </div>
    </JourneyController>
  )
}
