// Reading progress along the top edge. CSS only: a scroll-driven animation
// (see .scroll-progress in globals.css); browsers without
// animation-timeline simply show no bar.
export function ScrollProgress() {
  return <div aria-hidden='true' className='scroll-progress' />
}
