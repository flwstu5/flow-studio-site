import { useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CircleCheck, TriangleAlert, CircleX, Minus } from 'lucide-react'
import { runSnapshot } from '../server/snapshot'

export const Route = createFileRoute('/snapshot')({
  component: SnapshotPage,
})

type CheckStatus = 'pass' | 'warn' | 'fail'
type CheckResult = { id: string; label: string; status: CheckStatus; detail: string }
type PageSpeedScores = { performance: number; seo: number; accessibility: number }
type CompetitorResult = {
  label: string
  url: string
  ok: boolean
  pageSpeed: PageSpeedScores | null
  checks: CheckResult[]
}
type SnapshotResult =
  | {
      ok: true
      url: string
      pageSpeed: PageSpeedScores | null
      checks: CheckResult[]
      competitorSource: 'manual' | 'auto' | 'none'
      competitors: CompetitorResult[]
    }
  | { ok: false; error: string }

function SnapshotPage() {
  const [form, setForm] = useState({ url: '', email: '', business: '', competitor1: '', competitor2: '' })
  const [showCompetitors, setShowCompetitors] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<SnapshotResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

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
      <header className="site-header">
        <div className="wrap nav-inner">
          <a className="logo" href="/" aria-label="Flow Studio home">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/#services">Services</a>
            <a href="/#faq">FAQ</a>
            <a className="nav-login" href="https://portal.flowstudiogrfx.com/login">Client login</a>
            <a className="nav-cta" href="/#intake">Start a project <ArrowRight size={14} /></a>
          </nav>
        </div>
      </header>

      <section className="snapshot-hero section">
        <div className="wrap">
          <p className="section-label mono">Free tool</p>
          <div className="section-heading">
            <h1 className="display">What's your site<br />missing?</h1>
            <p>Drop in your website and we'll check it for the SEO and site-health basics that affect whether people actually find you — free, no strings.</p>
          </div>

          {status !== 'done' && (
            <form onSubmit={handleSubmit} className="snapshot-form">
              <input
                required
                placeholder="yourbusiness.com"
                value={form.url}
                onChange={(e) => updateField('url', e.target.value)}
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <input
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
                    placeholder="Competitor website (optional)"
                    value={form.competitor1}
                    onChange={(e) => updateField('competitor1', e.target.value)}
                  />
                  <input
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
            <div className="snapshot-results">
              {result.pageSpeed && (
                <div className="snapshot-scores">
                  <ScoreCard label="Performance" value={result.pageSpeed.performance} />
                  <ScoreCard label="SEO" value={result.pageSpeed.seo} />
                  <ScoreCard label="Accessibility" value={result.pageSpeed.accessibility} />
                </div>
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
                <p>We just emailed a copy of this to our team — if you'd like help fixing any of this, let's talk.</p>
                <a href="/#intake" className="button button-solid">Start a project <ArrowRight size={16} /></a>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <a className="logo footer-logo" href="/">
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" />
          </a>
          <span className="mono">Independent design studio / © 2026</span>
          <div className="footer-contact">
            <a className="mono footer-email" href="mailto:admin@flowstudiogrfx.com">admin@flowstudiogrfx.com</a>
            <span className="mono footer-response">We reply within 1 business day</span>
          </div>
        </div>
      </footer>
    </main>
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
  primary: { url: string; pageSpeed: PageSpeedScores | null; checks: CheckResult[] }
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
        </tbody>
      </table>
    </div>
  )
}
