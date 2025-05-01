import {
  IconBrandSupabase,
  IconClockHour12Filled,
  IconFileInvoiceFilled,
  IconPhotoFilled,
  IconShieldCheckFilled
} from '@tabler/icons-react'

export const projects = [
  {
    id: 1,
    title: 'Fast Food POS & Kitchen App',
    subTitle: 'Real Fastfood Cafe | RFC',
    image: '/images/projects/rfc.png',
    codeLink: 'https://github.com/umer-sagheer/food-chain-management-system',
    liveLink: 'https://realfastfoodcafe.vercel.app/',
    description:
      'A full-stack restaurant management system built with Supabase for Real Fastfood Cafe. Handles everything from billing to inventory, employee roles, real-time order updates, and more — designed for smooth fast food operations.',
    features: [
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Billing system with PDF invoice generation using jsPDF'
      },
      {
        icon: <IconBrandSupabase className='size-5 text-default-500' />,
        title: 'Inventory management powered by Supabase database'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Realtime order management with Supabase subscriptions'
      },
      {
        icon: <IconShieldCheckFilled className='size-5 text-default-500' />,
        title: 'Employee roles and permissions management using Supabase Auth'
      },
      {
        icon: <IconPhotoFilled className='size-5 text-default-500' />,
        title: 'Image uploads handled via Supabase Storage'
      },
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Daily sales reporting using aggregated queries'
      }
    ],
    tech: [
      { name: 'Nextjs' },
      { name: 'AuthJs' },
      { name: 'Supabase' },
      { name: 'Prisma' },
      { name: 'Tailwind' },
      { name: 'NextUI' }
    ]
  },
  {
    id: 1,
    title: 'Student Donation App',
    subTitle: 'Adopt to Educate | ATE',
    image: '/images/projects/ate.png',
    codeLink: 'https://github.com/rhodium-tech-com/adopt-2-educate-user-app',
    liveLink:
      'https://play.google.com/store/apps/details?id=org.adopt2educate.app&pcampaignid=web_share',
    description:
      "A Mobile Application for Student Donation Platform. User can view various Institutions onboarded and their student's progress and can make payments. Built with React Native and Nestjs",
    features: [
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Billing system with PDF invoice generation using jsPDF'
      },
      {
        icon: <IconBrandSupabase className='size-5 text-default-500' />,
        title: 'Inventory management powered by Supabase database'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Realtime order management with Supabase subscriptions'
      },
      {
        icon: <IconShieldCheckFilled className='size-5 text-default-500' />,
        title: 'Employee roles and permissions management using Supabase Auth'
      },
      {
        icon: <IconPhotoFilled className='size-5 text-default-500' />,
        title: 'Image uploads handled via Supabase Storage'
      },
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Daily sales reporting using aggregated queries'
      }
    ],
    tech: [
      { name: 'Nextjs' },
      { name: 'AuthJs' },
      { name: 'Supabase' },
      { name: 'Prisma' },
      { name: 'Tailwind' },
      { name: 'NextUI' }
    ]
  }
]

export type ProjectType = (typeof projects)[number]
