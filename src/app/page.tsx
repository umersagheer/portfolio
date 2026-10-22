import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import TechStackGrid from '@/components/tech-stack-grid'
import { FadeIn } from '@/components/fade-in'

const section = 'border-hair border-t py-12'

export default function Home() {
  return (
    <div className='w-full'>
      {/* The intro is the main content: it paints immediately. */}
      <Intro />
      <FadeIn delay={0.05} className={section}>
        <RecentProjects />
      </FadeIn>
      <FadeIn delay={0.1} className={section}>
        <RecentPosts />
      </FadeIn>
      <FadeIn delay={0.15} className={section}>
        <TechStackGrid />
      </FadeIn>
    </div>
  )
}
