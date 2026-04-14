import {
  IconAdjustmentsBolt,
  IconBrandSupabase,
  IconCalendarStats,
  IconChartAreaFilled,
  IconChefHat,
  IconClockHour12Filled,
  IconCoinFilled,
  IconFileInvoiceFilled,
  IconPhotoFilled,
  IconShieldCheckFilled,
  IconShoppingCartFilled,
  IconUsersGroup
} from '@tabler/icons-react'
import TheSvgIcon from '@/components/blog/shared/the-svg-icon'
import IconZustand from '@/components/icons/zustand'

export const projects = [
  {
    id: 1,
    title: 'Fast Food POS & Kitchen App',
    subTitle: 'Real Fastfood Cafe | RFC',
    image: '/images/projects/rfc.png',
    codeLink: 'https://github.com/umer-sagheer/food-chain-management-system',
    liveLink: 'https://realfastfoodcafe.vercel.app/',
    description:
      'A production-grade full-stack POS and restaurant operations platform built for Real Fastfood Cafe. It supports multi-outlet staff workflows with custom PIN/JWT auth, live Socket.IO order sync, billing and kitchen tickets, inventory, cash book, customer loyalty, and reporting.',

    features: [
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'End-to-end POS flow with dine-in, takeaway, and delivery orders, payment handling, bill receipts, and KOT/modification-KOT printing'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Live order and table updates across staff screens using Socket.IO with activity tracking and workflow-based status management'
      },
      {
        icon: <IconPhotoFilled className='size-5 text-default-500' />,
        title: 'Inventory management for products, variants, recipes, ingredients, stock intake, adjustments, waste logs, and product media uploads'
      },
      {
        icon: <IconShieldCheckFilled className='size-5 text-default-500' />,
        title: 'Custom PIN/JWT authentication with multi-outlet admin controls, role-based permissions, protected routes, and super admin outlet switching'
      },
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Business session and cash-book tools with opening/closing cash, expense tracking, dashboard metrics, and operational reporting'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Customer and loyalty module with saved profiles, order history, staff notes, loyalty tiers, and customer analytics'
      }
    ],

    tech: [
      { name: 'Next.js', icon: <TheSvgIcon slug='nextdotjs' size={14} /> },
      { name: 'Prisma', icon: <TheSvgIcon slug='prisma' size={14} darkVariant='dark' lightVariant='light' /> },
      { name: 'PostgreSQL', icon: <TheSvgIcon slug='postgresql' size={14} /> },
      { name: 'Socket.IO', icon: <TheSvgIcon slug='socketdotio' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'TanStack Query', icon: <TheSvgIcon slug='react-query' size={14} /> },
      { name: 'Tailwind CSS', icon: <TheSvgIcon slug='tailwind-css' size={14} /> },
      { name: 'HeroUI', icon: <TheSvgIcon slug='heroui' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'Cloudinary', icon: <TheSvgIcon slug='cloudinary' size={14} /> }
    ],
    screenshots: [
      { src: '/images/rfc/Login.png', wide: false },
      { src: '/images/rfc/OrderDetail.png', wide: true },
      { src: '/images/rfc/OrderCard.png', wide: false },
      { src: '/images/rfc/Payment.png', wide: true },
      { src: '/images/rfc/Calendar.png', wide: false },
      { src: '/images/rfc/CreateRole.png', wide: true },
      { src: '/images/rfc/Variant.png', wide: false },
      { src: '/images/rfc/Features.png', wide: true },
      { src: '/images/rfc/StockIntake.png', wide: false },
      { src: '/images/rfc/Users.png', wide: true },
      { src: '/images/rfc/DisableOutlet.png', wide: false },
      { src: '/images/rfc/OutletSettings.png', wide: true }
    ]
  },
  {
    id: 2,
    title: 'AI Writing Coach & Classroom Platform',
    subTitle: 'Engagemo AI | Writing Coach',
    image: '/images/projects/engagemo.png',
    codeLink: '',
    liveLink: 'https://engagemo.ai/',
    description:
      'A full-stack writing education platform for schools and independent teachers. Supports role-based classrooms, AI-powered feedback, OCR for scanned work, real-time progress tracking, bulk grading workflows, and report generation with subscription-based feature controls.',
    features: [
      {
        icon: <IconShieldCheckFilled className='size-5 text-default-500' />,
        title: 'Role-based platform for students, teachers, and admins with secure auth flows'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Bulk AI feedback processing with BullMQ + Redis queues, retries, and live progress updates'
      },
      {
        icon: <IconPhotoFilled className='size-5 text-default-500' />,
        title: 'OCR support for image/PDF submissions using Google Cloud Vision'
      },
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Automated individual and class reports with AI analysis and downloadable PDF export'
      },
      {
        icon: <IconBrandSupabase className='size-5 text-default-500' />,
        title: 'Realtime notifications and report status updates via Socket.IO channels'
      },
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Stripe subscription billing with feature gating (AI usage, OCR access, institutional limits)'
      }
    ],
    tech: [
      { name: 'React', icon: <TheSvgIcon slug='react' size={14} /> },
      { name: 'Vite', icon: <TheSvgIcon slug='vite' size={14} /> },
      { name: 'TypeScript', icon: <TheSvgIcon slug='typescript' size={14} /> },
      { name: 'Node.js', icon: <TheSvgIcon slug='nodedotjs' size={14} /> },
      { name: 'Express', icon: <TheSvgIcon slug='express' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'PostgreSQL', icon: <TheSvgIcon slug='postgresql' size={14} /> },
      { name: 'TypeORM', icon: <TheSvgIcon slug='typeorm' size={14} /> },
      { name: 'Redux Toolkit', icon: <TheSvgIcon slug='redux' size={14} /> },
      { name: 'Tailwind CSS', icon: <TheSvgIcon slug='tailwind-css' size={14} /> },
      { name: 'Socket.IO', icon: <TheSvgIcon slug='socketdotio' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'BullMQ + Redis', icon: <TheSvgIcon slug='redis' size={14} /> },
      { name: 'LangChain', icon: <TheSvgIcon slug='langchain' size={14} /> },
      { name: 'xAI (Grok)', icon: <TheSvgIcon slug='xai-grok' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'Google Cloud Vision', icon: <TheSvgIcon slug='gcp-cloud-vision-api' size={14} /> },
      { name: 'Stripe', icon: <TheSvgIcon slug='stripe' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'AWS S3', icon: <TheSvgIcon slug='aws-res-amazon-simple-storage-service-s3-standard' size={14} /> }
    ],
    screenshots: [
      { src: '/images/writing-coach/Login.png', wide: false },
      { src: '/images/writing-coach/TeacherDashboard.png', wide: true },
      { src: '/images/writing-coach/AssignmentDetail.png', wide: false },
      { src: '/images/writing-coach/BulkFeedback.png', wide: true },
      { src: '/images/writing-coach/StudentSubmission.png', wide: false },
      { src: '/images/writing-coach/ReportGeneration.png', wide: true },
      { src: '/images/writing-coach/AdminInstitutionManagement.png', wide: false },
      { src: '/images/writing-coach/Subscription.png', wide: true }
    ]
  },
  {
    id: 3,
    title: 'NourishWise Postpartum App',
    subTitle: 'Postpartum Nutrition, Recovery & Community Platform',
    image: '/images/projects/postpartum.png',
    codeLink: 'https://github.com/your-username/postpartum',
    liveLink: '',
    description:
      'A mobile-first postpartum wellness app built with React Native and Expo. It delivers personalized calorie/macronutrient onboarding, daily meal planning, mood and nutrition tracking, recipe management, grocery workflows, community forums, and premium subscriptions, with Supabase auth and a typed API service layer.',
    features: [
      {
        icon: <IconShieldCheckFilled className='size-5 text-default-500' />,
        title: 'Supabase authentication with email/password plus Google, Apple, and Facebook sign-in'
      },
      {
        icon: <IconAdjustmentsBolt className='size-5 text-default-500' />,
        title: 'Dynamic onboarding that calculates personalized postpartum calorie and macro targets'
      },
      {
        icon: <IconCalendarStats className='size-5 text-default-500' />,
        title: 'Daily dashboard with calendar, mood logging, recommendations, nutrition graph, and meal cards'
      },
      {
        icon: <IconChefHat className='size-5 text-default-500' />,
        title: 'Recipe system with search, favorites, user-created recipes, and nutrition calculation before publish'
      },
      {
        icon: <IconShoppingCartFilled className='size-5 text-default-500' />,
        title: 'Grocery management with add/edit/delete, merge duplicates, and recipe-to-grocery flow'
      },
      {
        icon: <IconChartAreaFilled className='size-5 text-default-500' />,
        title: 'Analytics for nutrition, mood trends, streaks, badges, and engagement insights'
      },
      {
        icon: <IconUsersGroup className='size-5 text-default-500' />,
        title: 'Community forums with post creation, comments, likes, filters, and follow/follower interactions'
      },
      {
        icon: <IconCoinFilled className='size-5 text-default-500' />,
        title: 'RevenueCat-powered premium subscriptions with feature gating and in-app plan management'
      }
    ],
    tech: [
      { name: 'React Native', icon: <TheSvgIcon slug='react' size={14} /> },
      { name: 'Expo', icon: <TheSvgIcon slug='expo' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'TypeScript', icon: <TheSvgIcon slug='typescript' size={14} /> },
      { name: 'Expo Router', icon: <TheSvgIcon slug='expo' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'Supabase', icon: <TheSvgIcon slug='supabase' size={14} /> },
      { name: 'TanStack Query', icon: <TheSvgIcon slug='react-query' size={14} /> },
      { name: 'Zustand', icon: <IconZustand width={14} height={14} className='shrink-0 dark:invert' /> },
      { name: 'React Hook Form', icon: <TheSvgIcon slug='react-hook-form' size={14} /> },
      { name: 'Zod', icon: <TheSvgIcon slug='zod' size={14} /> },
      { name: 'NativeWind', icon: <TheSvgIcon slug='nativewind' size={14} /> },
      { name: 'RevenueCat', icon: <TheSvgIcon slug='revenuecat' size={14} /> },
      { name: 'Axios', icon: <TheSvgIcon slug='axios' size={14} /> },
      { name: 'AWS S3', icon: <TheSvgIcon slug='aws-res-amazon-simple-storage-service-s3-standard' size={14} /> }
    ],
    screenshots: [
      { src: '/images/postpartum/welcome.png', wide: false },
      { src: '/images/postpartum/onboarding-calories.png', wide: true },
      { src: '/images/postpartum/dashboard-home.png', wide: true },
      { src: '/images/postpartum/meal-plans.png', wide: true },
      { src: '/images/postpartum/recipe-detail.png', wide: false },
      { src: '/images/postpartum/add-recipe.png', wide: true },
      { src: '/images/postpartum/grocery-list.png', wide: false },
      { src: '/images/postpartum/analytics.png', wide: true },
      { src: '/images/postpartum/community.png', wide: true },
      { src: '/images/postpartum/subscription.png', wide: false },
      { src: '/images/postpartum/profile.png', wide: false },
      { src: '/images/postpartum/notifications.png', wide: false }
    ]
  },
  {
    id: 4,
    title: 'AI Profitability Intelligence App',
    subTitle: 'Meridian Profits',
    image: '/images/projects/meridian.png',
    codeLink: '', // add your repo link
    liveLink: 'https://meridianprofitsapp.com', // add App Store / Play Store / demo link
    description:
      'A full-stack mobile business clarity platform that helps SMB owners understand true service profitability using labor, overhead, capacity, and AI-powered recommendations. Built with an Expo React Native client and a NestJS + PostgreSQL backend.',
    features: [
      {
        icon: <IconShieldCheckFilled className='size-5 text-default-500' />,
        title: 'Clerk authentication with protected app flows and secure webhook-based user sync'
      },
      {
        icon: <IconFileInvoiceFilled className='size-5 text-default-500' />,
        title: 'Guided onboarding with industry presets, suggested roles, and overhead setup (simple or categorized)'
      },
      {
        icon: <IconBrandSupabase className='size-5 text-default-500' />,
        title: 'Service profitability engine calculating true cost, margin, profit/hour, and minimum safe price'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Auto-recalculation of all related services when role rates or overhead values are updated'
      },
      {
        icon: <IconPhotoFilled className='size-5 text-default-500' />,
        title: 'AI insights pipeline using LangChain/LangGraph + OpenAI, with queue-based generation and report history'
      },
      {
        icon: <IconClockHour12Filled className='size-5 text-default-500' />,
        title: 'Realtime AI generation status via Socket.IO, plus RevenueCat paywall flow for locked insight reports'
      }
    ],
    tech: [
      { name: 'React Native', icon: <TheSvgIcon slug='react' size={14} /> },
      { name: 'Expo', icon: <TheSvgIcon slug='expo' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'Expo Router', icon: <TheSvgIcon slug='expo' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'NestJS', icon: <TheSvgIcon slug='nestjs' size={14} /> },
      { name: 'PostgreSQL', icon: <TheSvgIcon slug='postgresql' size={14} /> },
      { name: 'Prisma', icon: <TheSvgIcon slug='prisma' size={14} darkVariant='dark' lightVariant='light' /> },
      { name: 'Clerk', icon: <TheSvgIcon slug='clerk' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'OpenAI', icon: <TheSvgIcon slug='openai' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'LangChain', icon: <TheSvgIcon slug='langchain' size={14} /> },
      { name: 'LangGraph', icon: <TheSvgIcon slug='langgraph' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'BullMQ + Redis', icon: <TheSvgIcon slug='redis' size={14} /> },
      { name: 'Socket.IO', icon: <TheSvgIcon slug='socketdotio' size={14} darkVariant='default' lightVariant='dark' /> },
      { name: 'React Query', icon: <TheSvgIcon slug='react-query' size={14} /> },
      { name: 'Zustand', icon: <IconZustand width={14} height={14} className='shrink-0 dark:invert' /> },
      { name: 'RevenueCat', icon: <TheSvgIcon slug='revenuecat' size={14} /> },
      { name: 'Sentry', icon: <TheSvgIcon slug='sentry' size={14} /> },
      { name: 'Tailwind (Uniwind)', icon: <TheSvgIcon slug='tailwind-css' size={14} /> }
    ],
    screenshots: [
      { src: '/images/meridian/Welcome.png', wide: false },
      { src: '/images/meridian/OnboardingRoles.png', wide: true },
      { src: '/images/meridian/OverheadSetup.png', wide: false },
      { src: '/images/meridian/Dashboard.png', wide: true },
      { src: '/images/meridian/ServicesList.png', wide: false },
      { src: '/images/meridian/ServiceDetails.png', wide: true },
      { src: '/images/meridian/AiInsights.png', wide: false },
      { src: '/images/meridian/InsightDetail.png', wide: true },
      { src: '/images/meridian/ManageRoles.png', wide: false },
      { src: '/images/meridian/ManageOverhead.png', wide: true }
    ]
  }

]

export type ProjectType = (typeof projects)[number]
