import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react'
import { blogPosts } from '../../blog-posts'

export const Route = createFileRoute('/blog')({
  component: BlogIndexPage,
  head: () => ({
    meta: [
      { title: 'Blog — Flow Studio' },
      { name: 'description', content: 'Notes on brand identity, web design, and flyer design for small businesses — from the Flow Studio team.' },
      { property: 'og:title', content: 'Blog — Flow Studio' },
      { property: 'og:url', content: 'https://www.flowstudiogrfx.com/blog' },
    ],
  }),
})

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1))

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

      <section className="section blog-index">
        <div className="wrap">
          <p className="section-label mono">From the studio</p>
          <div className="section-heading">
            <h1 className="display">Notes on<br />design that works.</h1>
            <p>Brand identity, web design, and flyer design — thoughts from projects we've actually shipped.</p>
          </div>

          <div className="blog-list">
            {posts.map((post) => (
              <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }} className="blog-list-item">
                <div className="blog-list-meta mono">
                  <span>{post.tag}</span>
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="blog-read-more">Read the post <ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
