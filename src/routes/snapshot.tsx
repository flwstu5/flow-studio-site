import { useEffect, useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CircleCheck, TriangleAlert, CircleX, Minus, Download } from 'lucide-react'
import { runSnapshot } from '../server/snapshot'
import { trackEvent } from '../lib/analytics'

export const Route = createFileRoute('/snapshot')({
  component: SnapshotPage,
  head: () => ({
    meta: [
      { title: 'Free Website Snapshot — Flow Studio' },
      {
        name: 'description',
        content: 'Get a free instant grade for your website: performance, SEO, accessibility, Google Business Profile, and how you stack up against local competitors.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://www.flowstudiogrfx.com/snapshot' },
      { property: 'og:title', content: 'Free Website Snapshot — Flow Studio' },
      {
        property: 'og:description',
        content: 'Get a free instant grade for your website: performance, SEO, accessibility, Google Business Profile, and how you stack up against local competitors.',
      },
      { property: 'og:image', content: 'https://www.flowstudiogrfx.com/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Free Website Snapshot — Flow Studio' },
      {
        name: 'twitter:description',
        content: 'Get a free instant grade for your website: performance, SEO, accessibility, Google Business Profile, and how you stack up against local competitors.',
      },
      { name: 'twitter:image', content: 'https://www.flowstudiogrfx.com/og-image.png' },
    ],
  }),
})

type CheckStatus = 'pass' | 'warn' | 'fail'
type CheckResult = { id: string; label: string; status: CheckStatus; detail: string }
type PageSpeedScores = { performance: number; seo: number; accessibility: number }
type Reviews = { rating: number | null; count: number | null }
type Grade = { percent: number; letter: string }
type CompetitorResult = {
  label: string
  url: string
  ok: boolean
  pageSpeed: PageSpeedScores | null
  checks: CheckResult[]
  reviews: Reviews | null
}
type SnapshotResult =
  | {
      ok: true
      url: string
      pageSpeed: PageSpeedScores | null
      checks: CheckResult[]
      grade: Grade
      reviews: Reviews | null
      competitorSource: 'manual' | 'auto' | 'none'
      competitors: CompetitorResult[]
    }
  | { ok: false; error: string }

// Mirrors src/server/snapshot.ts SERVICE_MAP — kept in sync manually since
// this needs to run client-side and the two files aren't otherwise shared.
const SERVICE_MAP: Record<string, { service: string; fix: string }> = {
  title: { service: 'Website design & dev', fix: 'Rewrite page titles for search and click-through.' },
  description: { service: 'Website design & dev', fix: 'Add compelling meta descriptions across key pages.' },
  h1: { service: 'Website design & dev', fix: 'Clean up heading structure so each page has one clear H1.' },
  alt: { service: 'Website design & dev', fix: 'Add descriptive alt text to images for accessibility and SEO.' },
  viewport: { service: 'Website design & dev', fix: 'Fix mobile responsiveness so the site works properly on phones.' },
  https: { service: 'Website design & dev', fix: 'Move the site to HTTPS for security and trust.' },
  social: { service: 'Website design & dev', fix: 'Add Open Graph tags so links preview properly when shared.' },
  schema: { service: 'Website design & dev', fix: 'Add structured data (schema.org) for richer search results.' },
  favicon: { service: 'Website design & dev', fix: 'Add a favicon for a more polished, trustworthy look.' },
  'social-links': { service: 'Website design & dev', fix: 'Link up social profiles across the site.' },
  robots: { service: 'Website design & dev', fix: 'Add a robots.txt with proper crawl instructions.' },
  sitemap: { service: 'Website design & dev', fix: 'Add a sitemap.xml so search engines can find every page.' },
  gbp: { service: 'Something else', fix: 'Claim and optimize the Google Business Profile so local searchers can find and trust the business.' },
}

function buildIntakeLink(opportunities: CheckResult[], business: string) {
  const top = opportunities.slice(0, 5)
  const lines = top.map((c) => `- ${c.label}: ${SERVICE_MAP[c.id]?.fix ?? c.detail}`).join('\n')
  const message = `From the free site check${business ? ` for ${business}` : ''}, we'd like help with:\n${lines}`
  const params = new URLSearchParams({ serviceType: 'Website design & dev', message })
  return `/?${params.toString()}#intake`
}

function SnapshotPage() {
  const [form, setForm] = useState({ url: '', email: '', business: '', competitor1: '', competitor2: '' })
  const [showCompetitors, setShowCompetitors] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SnapshotResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Supports staff deep-linking from the portal: /snapshot?url=...&email=...&business=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const url = params.get('url')
    const email = params.get('email')
    const business = params.get('business')
    if (!url && !email && !business) return
    setForm((prev) => ({
      ...prev,
      url: url ?? prev.url,
      email: email ?? prev.email,
      business: business ?? prev.business,
    }))
  }, [])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const data = (await runSnapshot({ data: form })) as SnapshotResult
      if (data.ok) {
        setResult(data)
        setStatus('done')
        trackEvent('Snapshot Run', { grade: data.grade.letter })
      } else {
        setErrorMsg(data.error)
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong running that scan — try again in a moment.')
      setStatus('error')
    }
  }

  const opportunities = result && result.ok ? result.checks.filter((c) => c.status !== 'pass') : []
  const wins = result && result.ok ? result.checks.filter((c) => c.status === 'pass') : []
  const reachableCompetitors = result && result.ok ? result.competitors.filter((c) => c.ok) : []

  return (
    <main>
      <header className="site-header no-print">
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

      <section className="snapshot-hero section">
        <div className="wrap">
          <p className="section-label mono no-print">Free tool</p>
          <div className="section-heading no-print">
            <h1 className="display">What's your site<br />missing?</h1>
            <p>Drop in your website and we'll check it for the SEO and site-health basics that affect whether people actually find you — free, no strings.</p>
          </div>

          {status !== 'done' && (
            <form onSubmit={handleSubmit} className="snapshot-form">
              <input
                required
                aria-label="Website URL"
                placeholder="yourbusiness.com"
                value={form.url}
                onChange={(e) => updateField('url', e.target.value)}
              />
              <input
                required
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <input
                aria-label="Business name"
                placeholder="Business name (optional)"
                value={form.business}
                onChange={(e) => updateField('business', e.target.value)}
              />

              {!showCompetitors ? (
                <button
                  type="button"
                  className="snapshot-toggle"
                  onClick={() => setShowCompetitors(true)}
                >
                  + Compare against a competitor
                </button>
              ) : (
                <div className="snapshot-competitor-fields">
                  <input
                    aria-label="Competitor website"
                    placeholder="Competitor website (optional)"
                    value={form.competitor1}
                    onChange={(e) => updateField('competitor1', e.target.value)}
                  />
                  <input
                    aria-label="Another competitor website"
                    placeholder="Another competitor (optional)"
                    value={form.competitor2}
                    onChange={(e) => updateField('competitor2', e.target.value)}
                  />
                </div>
              )}

              <button type="submit" className="button button-solid" disabled={status === 'loading'}>
                {status === 'loading' ? 'Scanning…' : 'Get my free snapshot'} <ArrowRight size={16} />
              </button>
              {status === 'error' && <p className="snapshot-error">{errorMsg}</p>}
              <p className="snapshot-fineprint">Takes about 15–45 seconds. We'll only use your email to send your results and follow up.</p>
            </form>
          )}

          {status === 'done' && result?.ok && (
            <div className="snapshot-results" id="snapshot-report">
              <div className="snapshot-report-head">
                <GradeBadge grade={result.grade} />
                <div className="snapshot-report-head-text">
                  <p className="mono snapshot-report-url">{result.url}</p>
                  <p className="snapshot-report-summary">
                    {opportunities.length} opportunit{opportunities.length === 1 ? 'y' : 'ies'} found · {wins.length} thing{wins.length === 1 ? '' : 's'} already working
                  </p>
                </div>
                <button type="button" className="button button-outline no-print" onClick={() => window.print()}>
                  <Download size={15} /> Download PDF
                </button>
              </div>

              {result.pageSpeed && (
                <div className="snapshot-scores">
                  <ScoreCard label="Performance" value={result.pageSpeed.performance} />
                  <ScoreCard label="SEO" value={result.pageSpeed.seo} />
                  <ScoreCard label="Accessibility" value={result.pageSpeed.accessibility} />
                </div>
              )}

              {result.reviews && (
                <p className="snapshot-check-detail" style={{ marginBottom: 20 }}>
                  Google rating: <strong>{result.reviews.rating ?? '—'}★</strong> from{' '}
                  <strong>{result.reviews.count ?? 0}</strong> review{result.reviews.count === 1 ? '' : 's'}.
                </p>
              )}

              {opportunities.length > 0 && (
                <div className="snapshot-group">
                  <h3>Opportunities ({opportunities.length})</h3>
                  <ul className="snapshot-checklist">
                    {opportunities.map((c) => (
                      <li key={c.id} className={`snapshot-check ${c.status}`}>
                        {c.status === 'fail' ? <CircleX size={16} /> : <TriangleAlert size={16} />}
                        <div>
                          <p className="snapshot-check-label">{c.label}</p>
                          <p className="snapshot-check-detail">{c.detail}</p>
                          {SERVICE_MAP[c.id] && (
                            <p className="snapshot-check-fix">We fix this as part of {SERVICE_MAP[c.id].service}.</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {wins.length > 0 && (
                <div className="snapshot-group">
                  <h3>Already working ({wins.length})</h3>
                  <ul className="snapshot-checklist">
                    {wins.map((c) => (
                      <li key={c.id} className="snapshot-check pass">
                        <CircleCheck size={16} />
                        <div>
                          <p className="snapshot-check-label">{c.label}</p>
                          <p className="snapshot-check-detail">{c.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.competitors.length > 0 && (
                <div className="snapshot-group">
                  <h3>How you compare</h3>
                  {result.competitorSource === 'auto' && (
                    <p className="snapshot-check-detail" style={{ marginBottom: 14 }}>
                      We automatically found these nearby based on your site's business info.
                    </p>
                  )}
                  {reachableCompetitors.length === 0 ? (
                    <p className="snapshot-check-detail">
                      Couldn't reach the competitor site(s) you gave us — double-check those URLs.
                    </p>
                  ) : (
                    <ComparisonTable primary={result} competitors={reachableCompetitors} />
                  )}
                </div>
              )}

              <div className="snapshot-cta">
                <p className="no-print">We just emailed a copy of this to our team — if you'd like help fixing any of this, let's talk.</p>
                <p className="snapshot-cta-print-only">Ready to fix this? Let's talk — flowstudiogrfx.com</p>
                <a
                  href={opportunities.length > 0 ? buildIntakeLink(opportunities, form.business) : '/#intake'}
                  className="button button-solid"
                >
                  Start a project <ArrowRight size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="no-print">
        <div className="wrap footer-inner">
          <a className="logo footer-logo" href="/">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" width="350" height="303" />
          </a>
          <span className="mono">Independent design studio / © 2026</span>
          <div className="footer-contact">
            <a className="mono footer-email" href="mailto:admin@flowstudiogrfx.com">admin@flowstudiogrfx.com</a>
            <span className="mono footer-response">We reply within 1 business day</span>
            <div className="footer-legal no-print">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

function GradeBadge({ grade }: { grade: Grade }) {
  const tier = grade.percent >= 90 ? 'good' : grade.percent >= 70 ? 'ok' : 'poor'
  return (
    <div className={`grade-badge ${tier}`}>
      <span className="grade-letter">{grade.letter}</span>
      <span className="grade-percent mono">{grade.percent}%</span>
    </div>
  )
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  const tier = value >= 90 ? 'good' : value >= 50 ? 'ok' : 'poor'
  return (
    <div className={`score-card ${tier}`}>
      <span className="score-value">{value}</span>
      <span className="score-label mono">{label}</span>
    </div>
  )
}

function StatusIcon({ status }: { status: CheckStatus | undefined }) {
  if (status === 'pass') return <CircleCheck size={15} className="status-pass" />
  if (status === 'warn') return <TriangleAlert size={15} className="status-warn" />
  if (status === 'fail') return <CircleX size={15} className="status-fail" />
  return <Minus size={15} className="status-unknown" />
}

function ComparisonTable({
  primary,
  competitors,
}: {
  primary: { url: string; pageSpeed: PageSpeedScores | null; reviews: Reviews | null; checks: CheckResult[] }
  competitors: CompetitorResult[]
}) {
  function findStatus(checks: CheckResult[], id: string) {
    return checks.find((c) => c.id === id)?.status
  }

  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Check</th>
            <th>You</th>
            {competitors.map((c) => (
              <th key={c.url}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {primary.checks.map((check) => (
            <tr key={check.id}>
              <td>{check.label}</td>
              <td><StatusIcon status={check.status} /></td>
              {competitors.map((c) => (
                <td key={c.url}><StatusIcon status={findStatus(c.checks, check.id)} /></td>
              ))}
            </tr>
          ))}
          {primary.pageSpeed && (
            <>
              <tr>
                <td>Performance score</td>
                <td>{primary.pageSpeed.performance}</td>
                {competitors.map((c) => (
                  <td key={c.url}>{c.pageSpeed ? c.pageSpeed.performance : '—'}</td>
                ))}
              </tr>
              <tr>
                <td>SEO score</td>
                <td>{primary.pageSpeed.seo}</td>
                {competitors.map((c) => (
                  <td key={c.url}>{c.pageSpeed ? c.pageSpeed.seo : '—'}</td>
                ))}
              </tr>
              <tr>
                <td>Accessibility score</td>
                <td>{primary.pageSpeed.accessibility}</td>
                {competitors.map((c) => (
                  <td key={c.url}>{c.pageSpeed ? c.pageSpeed.accessibility : '—'}</td>
                ))}
              </tr>
            </>
          )}
          <tr>
            <td>Google rating</td>
            <td>{primary.reviews?.rating ?? '—'}</td>
            {competitors.map((c) => (
              <td key={c.url}>{c.reviews?.rating ?? '—'}</td>
            ))}
          </tr>
          <tr>
            <td>Review count</td>
            <td>{primary.reviews?.count ?? '—'}</td>
            {competitors.map((c) => (
              <td key={c.url}>{c.reviews?.count ?? '—'}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
