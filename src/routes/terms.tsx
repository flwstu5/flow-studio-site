import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Facebook, Instagram, Linkedin } from 'lucide-react'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: 'Terms of Service — Flow Studio' },
      { name: 'description', content: 'The terms that govern use of Flow Studio\'s website, tools, and services.' },
      { property: 'og:title', content: 'Terms of Service — Flow Studio' },
      { property: 'og:url', content: 'https://www.flowstudiogrfx.com/terms' },
    ],
  }),
})

function TermsPage() {
  return (
    <main>
      <header className="site-header">
        <div className="wrap nav-inner">
          <a className="logo" href="/" aria-label="Flow Studio home">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" width="350" height="303" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/#services">Services</a>
            <a href="/#faq">FAQ</a>
            <a className="nav-login" href="https://portal.flowstudiogrfx.com/login">Client login</a>
            <a className="nav-cta" href="/#intake">Start a project <ArrowRight size={14} /></a>
          </nav>
        </div>
      </header>

      <section className="section legal-page">
        <div className="wrap">
          <p className="section-label mono">Legal</p>
          <h1 className="display" style={{ fontSize: 'clamp(38px, 5vw, 56px)', marginBottom: 8 }}>Terms of Service</h1>
          <p className="mono" style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 40 }}>Last updated August 8, 2026</p>

          <div className="legal-body">
            <h2>Agreement</h2>
            <p>
              By using flowstudiogrfx.com, the free Website Snapshot tool, or the Flow Studio client portal, you agree to
              these terms. If you don't agree, please don't use the site or services.
            </p>

            <h2>Our services</h2>
            <p>
              Flow Studio provides brand identity, website design and development, print design, and a recurring flyer
              design subscription. Specific scope, deliverables, and pricing for any project are agreed separately with
              each client (by email, proposal, or portal request) before work begins.
            </p>

            <h2>The Website Snapshot tool</h2>
            <p>
              The free snapshot tool provides an automated, best-effort estimate of your site's performance, SEO, and
              accessibility, generated using third-party services including Google PageSpeed Insights and Google Places.
              Results are informational only, are not guaranteed to be complete or fully accurate, and don't constitute a
              professional audit. Competitor information shown is pulled from public business listings and may not be
              exhaustive.
            </p>

            <h2>Subscriptions and payment</h2>
            <p>
              Recurring services (such as the flyer design subscription) are billed on a recurring basis through Stripe
              at the interval shown at checkout. You can cancel a subscription at any time; cancellation stops future
              billing but doesn't refund the current billing period unless we agree otherwise. One-off project work is
              billed per the terms agreed for that project.
            </p>

            <h2>Intellectual property</h2>
            <p>
              Final deliverables (logos, websites, print files, flyers) transfer to the client upon full payment, unless
              a different arrangement is agreed in writing. Flow Studio retains the right to display completed work in
              its own portfolio and marketing unless a client requests otherwise. Work-in-progress drafts, unused
              concepts, and internal tools/templates remain the property of Flow Studio.
            </p>

            <h2>Client portal accounts</h2>
            <p>
              If you're a client with portal access, you're responsible for keeping your login credentials secure and for
              activity under your account. Let us know right away if you suspect unauthorized access.
            </p>

            <h2>Acceptable use</h2>
            <p>
              Don't use our site, tools, or portal to submit unlawful content, attempt to access accounts or data that
              aren't yours, or disrupt the service (e.g. automated scraping or abuse of the snapshot tool).
            </p>

            <h2>Disclaimers &amp; limitation of liability</h2>
            <p>
              Our site and tools are provided "as is." We aim for accuracy but don't guarantee uninterrupted availability
              or that automated results (like the snapshot tool) are error-free. To the extent permitted by law, Flow
              Studio isn't liable for indirect or consequential damages arising from use of the site or free tools.
            </p>

            <h2>Changes</h2>
            <p>We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of the Commonwealth of Kentucky, without regard to conflict-of-law principles.</p>

            <h2>Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:admin@flowstudiogrfx.com">admin@flowstudiogrfx.com</a>.</p>
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
