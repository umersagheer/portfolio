This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment

Create a `.env` file with:

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
RESEND_API_KEY="re_your_api_key"
```

If you are using Neon on Vercel, prefer its pooled Postgres connection string for `DATABASE_URL`.

## Database setup

This project now uses Prisma migrations for the blog likes tables. After pointing `DATABASE_URL` at a new Postgres database:

```bash
pnpm db:migrate -- --name init-likes
```

On deployment, apply any committed migrations with:

```bash
pnpm db:deploy
```

For Vercel, set the build command to `pnpm build:vercel` so migrations are applied before `next build`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
