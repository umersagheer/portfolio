import Intro from '@/components/intro'
import RecentPosts from '@/components/recent-posts'
import RecentProjects from '@/components/recent-projects'

export default function Home() {
  return (
    <div className='container w-full space-y-8 pb-20'>
      <Intro />
      <RecentPosts />
      <RecentProjects />
    </div>
  )
}
