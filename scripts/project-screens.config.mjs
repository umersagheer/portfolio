// Which screenshots each project page shows, and where the originals live.
// Originals are local only (assets/ is gitignored; Munshi's come from its own
// repo); `pnpm screens` turns them into the committed WebP files.
//
// device: 'phone' frames are cropped to the screen for inline use, with a
// full-height copy for the lightbox. 'tablet' and 'desktop' are used as-is.

const munshi =
  process.env.MUNSHI_SCREENS_DIR ?? '../RFC/munshi-site/public/screens'

export const projectScreens = {
  munshi: [
    {
      file: 'orders',
      device: 'tablet',
      from: `${munshi}/hero-tablet-light.png`,
      fromDark: `${munshi}/hero-tablet-dark.png`
    },
    {
      file: 'kitchen',
      device: 'desktop',
      from: `${munshi}/kitchen-light.png`,
      fromDark: `${munshi}/kitchen-dark.png`
    },
    {
      file: 'online',
      device: 'phone',
      from: `${munshi}/online-light.png`,
      fromDark: `${munshi}/online-dark.png`
    },
    {
      file: 'cash',
      device: 'desktop',
      from: `${munshi}/cash-light.png`,
      fromDark: `${munshi}/cash-dark.png`
    },
    {
      file: 'stock',
      device: 'desktop',
      from: `${munshi}/stock-light.png`,
      fromDark: `${munshi}/stock-dark.png`
    },
    {
      file: 'reports',
      device: 'desktop',
      from: `${munshi}/reports-light.png`,
      fromDark: `${munshi}/reports-dark.png`
    }
  ],
  engagemo: [
    { file: 'writing', device: 'desktop', from: 'assets/engagemo/writing.png' },
    {
      file: 'feedback-review',
      device: 'desktop',
      from: 'assets/engagemo/feedback-draft.png'
    },
    { file: 'handwriting', device: 'desktop', from: 'assets/engagemo/ocr.png' },
    {
      file: 'oral-defense',
      device: 'desktop',
      from: 'assets/engagemo/oral-defense.png'
    },
    {
      file: 'gradebook',
      device: 'desktop',
      from: 'assets/engagemo/gradebook.png'
    },
    {
      file: 'rubric',
      device: 'desktop',
      from: 'assets/engagemo/grade-breakdown.png'
    },
    { file: 'report', device: 'desktop', from: 'assets/engagemo/report.png' }
  ],
  nourishwise: [
    { file: 'home', device: 'phone', from: 'assets/nourishwise/01.png' },
    { file: 'meal-plan', device: 'phone', from: 'assets/nourishwise/02.png' },
    { file: 'recipe', device: 'phone', from: 'assets/nourishwise/03.png' },
    { file: 'grocery', device: 'phone', from: 'assets/nourishwise/08.png' },
    { file: 'analytics', device: 'phone', from: 'assets/nourishwise/09.png' },
    { file: 'community', device: 'phone', from: 'assets/nourishwise/10.png' }
  ],
  meridian: [
    {
      file: 'welcome',
      device: 'phone',
      from: 'assets/meridian/Welcome Screen.png'
    },
    { file: 'business-setup', device: 'phone', from: 'assets/meridian/02.png' },
    { file: 'dashboard', device: 'phone', from: 'assets/meridian/05.png' },
    { file: 'services', device: 'phone', from: 'assets/meridian/06.png' },
    { file: 'ai-report', device: 'phone', from: 'assets/meridian/07.png' },
    { file: 'pricing-insight', device: 'phone', from: 'assets/meridian/08.png' }
  ]
}
