import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import ContactPage from './contact/page'
import TechStackGrid from '@/components/tech-stack-grid'
import { BlurFade } from '@/components/blur-fade'

export default function Home() {
  return (
    <div className='container w-full space-y-8 pb-20'>
      <BlurFade inView delay={0.05}>
        <Intro />
      </BlurFade>
      <BlurFade inView delay={0.15}>
        <RecentProjects />
      </BlurFade>
      <BlurFade inView delay={0.25}>
        <TechStackGrid />
      </BlurFade>
    </div>
  )
}
