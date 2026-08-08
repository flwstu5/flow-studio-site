import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Flow Studio — Design, On Press' },
      { name: 'description', content: 'Independent graphic design studio for brand identity, websites, print, and recurring flyer design.' },
      { name: 'theme-color', content: '#f4f0e7' },

      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Flow Studio' },
      { property: 'og:url', content: 'https://www.flowstudiogrfx.com/' },
      { property: 'og:title', content: 'Flow Studio — Design, On Press' },
      { property: 'og:description', content: 'Independent graphic design studio for brand identity, websites, print, and recurring flyer design.' },
      { property: 'og:image', content: 'https://www.flowstudiogrfx.com/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Flow Studio — brand, print & web design, plus flyers on repeat.' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Flow Studio — Design, On Press' },
      { name: 'twitter:description', content: 'Independent graphic design studio for brand identity, websites, print, and recurring flyer design.' },
      { name: 'twitter:image', content: 'https://www.flowstudiogrfx.com/og-image.png' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap' },
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', href: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    scripts: [
      {
        defer: true,
        'data-domain': 'flowstudiogrfx.com',
        src: 'https://plausible.io/js/script.js',
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'Flow Studio',
          url: 'https://www.flowstudiogrfx.com',
          logo: 'https://www.flowstudiogrfx.com/logo-full1.png',
          image: 'https://www.flowstudiogrfx.com/og-image.png',
          description: 'Independent graphic design studio for brand identity, websites, print, and recurring flyer design.',
          email: 'admin@flowstudiogrfx.com',
          sameAs: [
            'https://www.instagram.com/flowstudiogrfx',
            'https://www.facebook.com/share/1JNNpkLKfL/?mibextid=wwXIfr',
            'https://www.linkedin.com/company/flowstudiogrfx',
          ],
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  )
}
