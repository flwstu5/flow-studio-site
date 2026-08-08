import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react'
import { getPostBySlug, type BlogBlock } from '../../blog-posts'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
  head: ({ params }) => {
    const post = getPostBySlug(params.slug)
    if (!post) {
      return { meta: [{ title: 'Post not found — Flow Studio' }] }
    }
    return {
      meta: [
        { title: `${post.title} — Flow Studio` },
        { name: 'description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: `${post.title} — Flow Studio` },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:url', content: `https://www.flowstudiogrfx.com/blog/${post.slug}` },
        { property: 'og:image', content: 'https://www.flowstudiogrfx.com/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${post.title} — Flow Studio` },
        { name: 'twitter:description', content: post.excerpt },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            image: 'https://www.flowstudiogrfx.com/og-image.png',
            url: `https://www.flowstudiogrfx.com/blog/${post.slug}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.flowstudiogrfx.com/blog/${post.slug}`,
            },
            author: { '@type': 'Organization', name: 'Flow Studio', url: 'https://www.flowstudiogrfx.com' },
            publisher: {
              '@type': 'Organization',
              name: 'Flow Studio',
              logo: { '@type': 'ImageObject', url: 'https://www.flowstudiogrfx.com/logo-full1.png' },
            },
          }),
        },
      ],
    }
  },
})

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function renderBlock(block: BlogBlock, i: number) {
  if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>
  if (block.type === 'ul') {
    return (
      <ul key={i}>
        {block.items.map((item, j) => <li key={j}>{item}</li>)}
      </ul>
    )
  }
  return <p key={i}>{block.text}</p>
}

function BlogPostPage() {
  const { slug } = Route.useParams()
  const post = getPostBySlug(slug)

  return (
    <main>
      <header className="site-header">
        <div className="wrap nav-inner">
          <a className="logo" href="/" aria-label="Flow Studio home">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" width="350" height="303" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/#services">Services</a>
            <Link to="/blog">Blog</Link>
            <a href="/#faq">FAQ</a>
            <a className="nav-login" href="https://portal.flowstudiogrfx.com/login">Client login</a>
            <a className="nav-cta" href="/#intake">Start a project <ArrowRight size={14} /></a>
          </nav>
        </div>
      </header>

      {!post ? (
        <section className="section">
          <div className="wrap">
            <h1 className="display">Post not found</h1>
            <p><Link to="/blog">Back to the blog</Link></p>
          </div>
        </section>
      ) : (
        <section className="section legal-page">
          <div className="wrap">
            <p className="section-label mono">
              <Link to="/blog">← Blog</Link> / {post.tag}
            </p>
            <h1 className="display" style={{ fontSize: 'clamp(34px, 4.5vw, 52px)', marginBottom: 10 }}>{post.title}</h1>
            <p className="mono" style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 40 }}>
              {formatDate(post.date)} · {post.readTime}
            </p>

            <div className="legal-body blog-body">
              {post.body.map((block, i) => renderBlock(block, i))}
            </div>

            <div className="blog-post-cta">
              <p>Want help with this on your own site?</p>
              <a className="button button-solid" href="/#intake">Start a project <ArrowRight size={14} /></a>
            </div>
          </div>
        </section>
      )}

      <footer>
        <div className="wrap footer-inner">
          <a className="logo footer-logo" href="/">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" width="350" height="303" loading="lazy" decoding="async" />
          </a>
          <span className="mono">Independent design studio / © 2026</span>
          <div className="footer-social">
            <a href="https://www.instagram.com/flowstudiogrfx" target="_blank" rel="noopener noreferrer" aria-label="Flow Studio on Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://www.facebook.com/share/1JNNpkLKfL/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Flow Studio on Facebook">
              <Facebook size={17} />
            </a>
            <a href="https://www.linkedin.com/company/flowstudiogrfx" target="_blank" rel="noopener noreferrer" aria-label="Flow Studio on LinkedIn">
              <Linkedin size={17} />
            </a>
          </div>
          <div className="footer-contact">
            <a className="mono footer-email" href="mailto:admin@flowstudiogrfx.com">admin@flowstudiogrfx.com</a>
            <div className="footer-legal">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
