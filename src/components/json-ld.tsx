import { siteProfile } from '@/constants/site-profile'
import { getAbsoluteUrl } from '@/libs/metadata'

// Structured data for search engines, rendered on the server. `<` is escaped
// so content can never close the script tag early.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c')
      }}
    />
  )
}

// The site's author, referenced by posts and projects.
export const personRef = {
  '@type': 'Person',
  '@id': `${getAbsoluteUrl('/')}#person`,
  name: siteProfile.name,
  url: getAbsoluteUrl('/')
}

export function personAndSite() {
  const { socials } = siteProfile
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...personRef,
        jobTitle: 'Full-stack engineer',
        description: siteProfile.role,
        image: getAbsoluteUrl(siteProfile.avatar),
        email: `mailto:${siteProfile.email}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Lahore',
          addressCountry: 'PK'
        },
        worksFor: { '@type': 'Organization', name: 'Softaims' },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Government College University Lahore'
        },
        knowsAbout: [
          'React',
          'Next.js',
          'React Native',
          'Expo',
          'Node.js',
          'NestJS',
          'PostgreSQL',
          'MongoDB',
          'LangChain',
          'Retrieval-augmented generation',
          'AWS'
        ],
        sameAs: [socials.github.url, socials.linkedin.url, socials.x.url]
      },
      {
        '@type': 'WebSite',
        '@id': `${getAbsoluteUrl('/')}#website`,
        url: getAbsoluteUrl('/'),
        name: siteProfile.name,
        publisher: { '@id': personRef['@id'] }
      }
    ]
  }
}
