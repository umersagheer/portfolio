import { ThemeSwitcher } from '@/components/theme-switcher'
import {
  FolderCodeIcon,
  GanttChartSquareIcon,
  HomeIcon,
  MessageSquareShare
} from 'lucide-react'

export const links = [
  {
    title: 'Home',
    icon: (
      <HomeIcon className='h-full w-full text-neutral-500 dark:text-neutral-300' />
    ),
    href: '/'
  },

  {
    title: 'Posts',
    icon: <GanttChartSquareIcon className='h-full w-full text-warning' />,
    href: '/posts'
  },
  {
    title: 'Projects',
    icon: <FolderCodeIcon className='h-full w-full text-secondary' />,
    href: '/projects'
  },
  {
    title: 'Contact',
    icon: <MessageSquareShare className='h-full w-full text-success' />,
    href: '/contact'
  },
  {
    title: 'Theme',
    icon: <ThemeSwitcher />,
    href: '#'
  }
]
