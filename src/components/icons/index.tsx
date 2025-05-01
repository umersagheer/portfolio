import IconNext from './next'
import IconAuthJs from './authjs'
import IconNextUI from './nextui'
import IconPostgreSQL from './postgreSQL'
import IconPrisma from './prisma'
import IconSupabase from './supabase'
import IconTailwind from './tailwind'
import IconZod from './zod'

export const techIcons: Record<string, JSX.Element> = {
  Nextjs: <IconNext className='size-5' />,
  NextUI: <IconNextUI className='size-5' />,
  Prisma: <IconPrisma className='size-5' />,
  Zod: <IconZod className='size-5' />,
  PostgreSQL: <IconPostgreSQL className='size-5' />,
  Supabase: <IconSupabase className='size-5' />,
  Tailwind: <IconTailwind className='size-5' />,
  AuthJs: <IconAuthJs className='size-5' />
}
