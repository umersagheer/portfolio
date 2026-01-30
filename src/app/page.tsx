import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'
import ContactPage from './contact/page'
import TechStackGrid from '@/components/tech-stack-grid'
import { BlurFade } from '@/components/blur-fade'
import { GlowCardTest } from '@/components/glow-card-test'
import { IconReact } from '@/components/icons'

export default function Home() {
  return (
    <div className='container w-full space-y-8 pb-20'>
      <BlurFade inView delay={0.05}>
        <Intro />
        <IconReact className='mx-auto mt-8 w-24 h-24 text-heroui-primary/50 animate-spin-slow' />
      </BlurFade>
      <BlurFade inView delay={0.15}>
        <RecentProjects />
      </BlurFade>
      <BlurFade inView delay={0.25}>
        <div className='flex justify-center mb-8'>
          <GlowCardTest />
        </div>
      </BlurFade>
      <BlurFade inView delay={0.35}>
        <TechStackGrid />
      </BlurFade>
    </div>
  )
}
