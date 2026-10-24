import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import StackGlance from '@/components/stack-glance'
import { FadeIn } from '@/components/fade-in'

// data-section: the label of the section being read lights up (live-sections).
const section = 'border-hair border-t py-12'

export default function Home() {
  return (
    <div className='w-full'>
      {/* The intro is the main content: it paints immediately. */}
      <Intro />
      <section id='work' data-section className={`${section} scroll-mt-20`}>
        <FadeIn delay={0.05}>
          <RecentProjects />
        </FadeIn>
      </section>
      <section data-section className={section}>
        <FadeIn delay={0.1}>
          <RecentPosts />
        </FadeIn>
      </section>
      <section data-section className={section}>
        <FadeIn delay={0.15}>
          <StackGlance />
        </FadeIn>
      </section>
    </div>
  )
}
