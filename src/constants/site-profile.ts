export const brandDomain = 'umersagheer.dev'

export const siteProfile = {
  name: 'Umer Sagheer',
  avatar: '/images/authors/intro.jpeg',
  role: 'Software Engineer',
  email: 'umersagheer0075@gmail.com',
  // wa.me wants the full international number, digits only.
  whatsapp: { number: '923018155698', label: '+92 301 8155698' },
  cv: '/umer-sagheer-cv.pdf',
  // Cal.com meetings: a short intro for hiring, a longer call for projects.
  booking: {
    intro: 'https://cal.com/umer-sagheer/intro',
    project: 'https://cal.com/umer-sagheer/project'
  },
  // Shows the GitHub contribution heatmap on /about. Off until private
  // contributions are counted on the profile, so the calendar reflects the work.
  showGithubActivity: true as boolean,
  socials: {
    x: {
      platform: 'X',
      label: '@umersagheer_dev',
      url: 'https://x.com/umersagheer_dev',
      iconSlug: 'x'
    },
    github: {
      platform: 'GitHub',
      label: 'umersagheer',
      url: 'https://github.com/umersagheer',
      iconSlug: 'github'
    },
    linkedin: {
      platform: 'LinkedIn',
      label: 'muhammad-umar75',
      url: 'https://www.linkedin.com/in/muhammad-umar75/',
      iconSlug: 'linkedin'
    }
  }
} as const
