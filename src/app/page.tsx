import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import TechStackGrid from '@/components/tech-stack-grid'
import { FadeIn } from '@/components/fade-in'

export default function Home() {
  return (
    <div className='container w-full space-y-8 pb-20'>
      {/* The intro is the main content: it paints immediately. */}
      <Intro />
      <FadeIn delay={0.05}>
        <RecentProjects />
      </FadeIn>
      <FadeIn delay={0.1}>
        <RecentPosts />
      </FadeIn>
      <FadeIn delay={0.15}>
        <TechStackGrid />
      </FadeIn>
    </div>
  )
}
