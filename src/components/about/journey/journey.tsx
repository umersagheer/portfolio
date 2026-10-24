import { ICONS, type IconSlug } from '@/components/about/journey/icons'
import { drawJourney } from '@/components/about/journey/drawing'
import JourneyController from '@/components/about/journey/journey-controller'
import {
  PLATFORMS,
  STEPS,
  TOOLS,
  type ToolKey
} from '@/components/about/journey/steps'
import styles from '@/components/about/journey/journey.module.css'

// Drawn once on the server at build time; no drawing code reaches the browser.
const { svg, viewBox, badges, callouts, overlays } = drawJourney()

const tool = (key: ToolKey) => TOOLS[key] as { name: string; icon?: IconSlug }
const pos = ({ left, top }: { left: number; top: number }) => ({
  left: `${left.toFixed(2)}%`,
  top: `${top.toFixed(2)}%`
})

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

// Icon and name, used in the callouts and the deployment labels.
function Chip({ keys }: { keys: ToolKey[] }) {
  return (
    <>
      {keys.map(key => {
        const { name, icon } = tool(key)
        return (
          <span key={key} className={styles.chipItem}>
            {icon && <Glyph slug={icon} size={12} />}
            {name}
          </span>
        )
      })}
    </>
  )
}

function MainTool({ toolKey }: { toolKey: ToolKey }) {
  const { name, icon } = tool(toolKey)
  return (
    <span className={styles.tool}>
      {icon && <Glyph slug={icon} size={15} />}
      {name}
    </span>
  )
}

function SupportingTool({ toolKey }: { toolKey: ToolKey }) {
  const { name, icon } = tool(toolKey)
  if (!icon)
    return <span className={`${styles.word} font-sourceCodePro`}>{name}</span>
  return (
    <span data-tip={name} role='img' aria-label={name}>
      <Glyph slug={icon} size={13} />
    </span>
  )
}

const toolNames = (keys: ToolKey[]) => keys.map(k => TOOLS[k].name).join(' · ')

// Glow as an SVG filter in user space: a CSS drop-shadow on a perfectly
// horizontal line has a zero-height box and vanishes.
const GLOW_FILTER =
  '<defs><filter id="journey-glow" filterUnits="userSpaceOnUse" x="-2000" y="-2000" width="4000" height="4000"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'

export default function Journey() {
  return (
    <JourneyController className={styles.root} platforms={PLATFORMS}>
      <div className={`${styles.head} font-sourceCodePro`}>
        <span>
          FIG 01
          <span className='hidden sm:inline'> · ONE REQUEST, END TO END</span>
        </span>
      </div>

      <div className={styles.drawing}>
        <svg
          className={styles.svg}
          viewBox={viewBox}
          role='img'
          aria-label='One request, end to end: a laptop and a phone send a request along one cable through the data layer and the server, through an AI pipeline (retrieve, model, guardrail, memory) to the databases. On deploy, builds rise from the server to the cloud, and the update comes back down to the laptop and the phone.'
          dangerouslySetInnerHTML={{ __html: GLOW_FILTER + svg }}
        />

        {STEPS.map(
          (step, i) =>
            step.id !== 'ship' && (
              <span
                key={step.id}
                data-step={step.id}
                aria-hidden='true'
                className={`${styles.badge} font-sourceCodePro`}
                style={pos(badges[step.id])}
              >
                {i + 1}
              </span>
            )
        )}

        {/* Deploy lives on the server: it ships the builds and plays step 06. */}
        <button
          type='button'
          data-deploy
          className={`${styles.deployButton} font-sourceCodePro`}
          style={pos(overlays.deploy)}
        >
          ↑ deploy
        </button>

        {/* What each object is: shown for the chosen step only. */}
        {callouts.map(c => (
          <span
            key={`${c.step}-${c.tools.join('-')}`}
            data-step={c.step}
            data-up={c.up ? '' : undefined}
            aria-hidden='true'
            className={styles.callout}
            style={pos(c)}
          >
            <Chip keys={c.tools} />
          </span>
        ))}

        {/* Deployment, shown while it plays. */}
        <span
          aria-hidden='true'
          data-up=''
          className={`${styles.callout} ${styles.cloudChip}`}
          style={pos(overlays.cloud)}
        >
          <Chip keys={['aws', 'railway']} />
        </span>
        <span
          aria-hidden='true'
          className={`${styles.callout} ${styles.storeChip}`}
          style={pos(overlays.stores)}
        >
          <Chip keys={['appstore', 'googleplay']} />
        </span>
        <div
          aria-hidden='true'
          className={`${styles.terminal} font-sourceCodePro`}
          style={pos(overlays.terminal)}
        >
          <p>
            <span>$</span> build <b>✓</b> api · web · app
          </p>
          <p>
            <span>$</span> test <b>✓</b> passed
          </p>
          <p>
            <span>$</span> deploy <b>→</b> aws · railway
          </p>
        </div>
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
                {step.main.map(key => (
                  <MainTool key={key} toolKey={key} />
                ))}
                <span className={styles.supporting}>
                  {step.supporting.map(key => (
                    <SupportingTool key={key} toolKey={key} />
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div id='journey-panel' className={styles.panel} aria-live='polite'>
          <div data-panel='none' className={styles.hint}>
            Pick a step to see how I handle it, and what each part is built
            with.
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
      <a
        href='https://iso-glow.vercel.app'
        target='_blank'
        rel='noopener noreferrer'
        className={`${styles.credit} font-sourceCodePro`}
      >
        Made with ISO-GLOW ↗
      </a>
    </JourneyController>
  )
}
