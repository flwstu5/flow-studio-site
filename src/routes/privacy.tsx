import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Flow Studio' },
      { name: 'description', content: 'How Flow Studio collects, uses, and protects your information.' },
      { property: 'og:title', content: 'Privacy Policy — Flow Studio' },
      { property: 'og:url', content: 'https://www.flowstudiogrfx.com/privacy' },
    ],
  }),
})

function PrivacyPage() {
  return (
    <main>
      <header className="site-header">
        <div className="wrap nav-inner">
          <a className="logo" href="/" aria-label="Flow Studio home">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" width="350" height="303" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/#services">Services</a>
            <a href="/blog">Blog</a>
            <a href="/#faq">FAQ</a>
            <a className="nav-login" href="https://portal.flowstudiogrfx.com/login">Client login</a>
            <a className="nav-cta" href="/#intake">Start a project <ArrowRight size={14} /></a>
          </nav>
        </div>
      </header>

      <section className="section legal-page">
        <div className="wrap">
          <p className="section-label mono">Legal</p>
          <h1 className="display" style={{ fontSize: 'clamp(38px, 5vw, 56px)', marginBottom: 8 }}>Privacy Policy</h1>
          <p className="mono" style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 40 }}>Last updated August 8, 2026</p>

          <div className="legal-body">
            <h2>Who we are</h2>
            <p>
              Flow Studio ("we," "us") is an independent design studio providing brand identity, web design, print, and
              recurring flyer design services. This policy explains what information we collect through
              flowstudiogrfx.com and our client portal at portal.flowstudiogrfx.com, and how we use it.
            </p>

            <h2>Information we collect</h2>
            <p>We collect information you give us directly, including:</p>
            <ul>
              <li>Name, email address, and business name submitted through our intake forms or the free Website Snapshot tool</li>
              <li>Website URLs you submit for a snapshot check, and any competitor URLs you provide</li>
              <li>Project details and messages you send us</li>
              <li>Payment and billing information, handled directly by our payment processor (Stripe) — we do not store full card numbers</li>
              <li>Account information for clients using the portal (email, password, business details)</li>
            </ul>
            <p>We also collect limited, anonymous, cookie-free analytics (page views, general location, referrer) via Plausible to understand how the site is used.</p>

            <h2>How we use it</h2>
            <ul>
              <li>To respond to inquiries and deliver the services you request</li>
              <li>To run the free Website Snapshot check you request, including calling third-party APIs (Google PageSpeed Insights and Google Places) to generate your report</li>
              <li>To send you your snapshot results and a small number of relevant follow-up emails if you don't become a client (you can unsubscribe at any time)</li>
              <li>To operate your client portal account and deliver ongoing services (e.g. the flyer subscription)</li>
              <li>To improve our site and services</li>
            </ul>
            <p>We do not sell your personal information.</p>

            <h2>Who we share it with</h2>
            <p>We share information only with the service providers that help us run our business:</p>
            <ul>
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Supabase</strong> — database hosting for client and lead records</li>
              <li><strong>Google (PageSpeed Insights, Places API)</strong> — to generate your website snapshot report</li>
              <li><strong>Our email provider</strong> — to send transactional and follow-up emails</li>
            </ul>
            <p>Each of these providers only receives what's necessary to perform their function and is bound by their own privacy and security practices.</p>

            <h2>Data retention</h2>
            <p>
              We keep client account and project data for as long as your account is active plus a reasonable period after,
              for recordkeeping. Snapshot leads that don't convert to clients are kept to improve our follow-up process but
              can be deleted on request.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask us to access, correct, or delete your personal information at any time by emailing{' '}
              <a href="mailto:admin@flowstudiogrfx.com">admin@flowstudiogrfx.com</a>. If you no longer want to receive
              follow-up emails after a snapshot check, use the unsubscribe link in that email or contact us directly.
            </p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy from time to time. Material changes will be reflected by updating the date at the top of this page.</p>

            <h2>Contact</h2>
            <p>Questions about this policy? Email <a href="mailto:admin@flowstudiogrfx.com">admin@flowstudiogrfx.com</a>.</p>
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
