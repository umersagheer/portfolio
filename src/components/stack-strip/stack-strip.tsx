import { drawStackStrip } from '@/components/stack-strip/drawing'
import styles from '@/components/stack-strip/stack-strip.module.css'

// Drawn once on the server: inline SVG, no script, no image request.
const { svg, viewBox } = drawStackStrip()

export default function StackStrip() {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={viewBox}
        role='img'
        aria-label='A laptop and a phone wired to a server, wired to databases.'
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  )
}
