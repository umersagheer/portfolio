/** @type {import('next').NextConfig} */
const nextConfig = {
  // The likes route checks that a post exists by listing the MDX files, so
  // make sure they ship inside that serverless function.
  outputFileTracingIncludes: {
    '/api/posts/[postId]/likes': ['./src/content/posts/*.mdx']
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net'
      }
    ]
  }
}

export default nextConfig
