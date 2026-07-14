import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, Check, Menu, X } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: FlowStudio,
})

const services = [
  {
    title: 'Digital & print graphics',
    text: 'Social sets, ads, packaging, and signage — designed for the format it ships in.',
    type: 'Project-based',
    color: 'dark',
  },
  {
    title: 'Logo & brand design',
    text: 'Mark, palette, type system, and guidelines that hold up across every touchpoint.',
    type: 'Project-based',
    color: 'mid',
  },
  {
    title: 'Website design & dev',
    text: 'Designed and built — from a single landing page to a complete multi-page site.',
    type: 'Project-based',
    color: 'light',
  },
  {
    title: 'Flyer design',
    text: 'Recurring flyers for promos, events, and specials — submit a request, get a design back.',
    type: 'Subscription',
    color: 'blend',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '99',
    description: 'Best for small businesses that post occasionally.',
    features: ['2 digital flyers per month', '1 revision per flyer', '48–72 hour turnaround', 'Instagram + Facebook sizes'],
    color: 'dark',
    checkoutUrl: 'https://buy.stripe.com/9B6cN40NN0CSg1Q16c9sk00',
  },
  {
    name: 'Growth',
    note: 'Best value',
    price: '175',
    description: 'Content-ready, with something new to post every week.',
    features: ['4 digital flyers per month', '2 revisions per flyer', 'All social media sizes', 'Priority turnaround', 'Basic captions included'],
    color: 'mid',
    featured: true,
    checkoutUrl: 'https://buy.stripe.com/9B68wObsrbhwcPE5ms9sk01',
  },
  {
    name: 'Premium',
    price: '300',
    description: 'For brands that need a consistent marketing rhythm.',
    features: ['8 digital flyers per month', '2 revisions per flyer', 'Multiple platform sizes', 'Priority turnaround', 'Captions + promo wording', '1 animated flyer monthly'],
    color: 'light',
    checkoutUrl: 'https://buy.stripe.com/3cIfZg2VV1GWg1Q0289sk02',
  },
]

const steps = [
  ['Subscribe', 'Pick a plan. No contracts — pause or cancel whenever the calendar gets quiet.'],
  ['Submit a request', 'Drop your flyer brief into the queue: event, promotion, menu, or announcement.'],
  ['Get a draft', 'A considered, on-brand design lands back in your inbox, ready to review.'],
  ['Revise & ship', 'Request changes if needed, then download polished print- and web-ready files.'],
]

function RegMark({ position }: { position: string }) {
  return (
    <svg className={`regmark ${position}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  )
}

function FlowStudio() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element))
    return () => reveal.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <header className="site-header">
        <div className="wrap nav-inner">
          <a className="logo logo-bordered" href="#top" aria-label="Flow Studio home" onClick={closeMenu}>
            <span className="display">Flow Studio</span>
            <span className="ink-dots" aria-hidden="true"><i /><i /><i /></span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#subscription">Flyer subscription</a>
            <a href="#how">How it works</a>
            <a href="#work">Work</a>
            <a className="nav-login" href="https://flow-studio-portal-e19up3nkk-fl-ow-studio.vercel.app/login">Client login</a>
            <a className="nav-cta" href="mailto:hello@flowstudio.design?subject=New%20project%20brief">Start a project <ArrowRight size={14} /></a>
          </nav>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#subscription" onClick={closeMenu}>Flyer subscription</a>
          <a href="#how" onClick={closeMenu}>How it works</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="https://flow-studio-portal-e19up3nkk-fl-ow-studio.vercel.app/login" onClick={closeMenu}>Client login</a>
          <a href="mailto:hello@flowstudio.design?subject=New%20project%20brief" onClick={closeMenu}>Start a project <ArrowRight size={16} /></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="wrap">
          <div className="proof hero-enter">
            <RegMark position="tl" /><RegMark position="tr" /><RegMark position="bl" /><RegMark position="br" />
            <div className="proof-meta mono">
              <div>
                <span>Job № 0417 — Proof approved</span>
                <div className="swatches" aria-label="Press color swatches"><i /><i /><i /><i /></div>
              </div>
              <span>Run: open<br />Press: online</span>
            </div>
            <div className="approval-stamp">Design<br />on press</div>
            <div className="hero-layout">
              <div>
                <p className="eyebrow mono">Independent creative studio / Est. 2020</p>
                <h1 className="display">Brand, print<br />& web design<span>.</span><br />Plus flyers,<br />on repeat<span>.</span></h1>
              </div>
              <div className="hero-copy">
                <p>Full-service graphic design for logos, brand identity, and websites — with a flyer subscription that keeps fresh work landing every month, no re-briefing required.</p>
                <div className="button-row">
                  <a href="mailto:hello@flowstudio.design?subject=New%20project%20brief" className="button button-solid">Start a project <ArrowDownRight size={18} /></a>
                  <a href="#subscription" className="button button-outline">See flyer plans</a>
                </div>
              </div>
            </div>
            <div className="proof-footer mono"><span>CMYK / 300 DPI</span><span>Trim 1180 × 650</span><span>Sheet 01 of 01</span></div>
          </div>
        </div>
      </section>

      <section className="services section" id="services">
        <div className="wrap reveal">
          <p className="section-label mono">01 / Services</p>
          <div className="section-heading">
            <h2 className="display">Every format<br />your brand touches.</h2>
            <p>One studio from first sketch to final export — digital, print, identity, and screen.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article className="service-card" key={service.title}>
                <div className={`service-tab ${service.color}`} />
                <span className="service-number mono">0{index + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="service-type mono">{service.type}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="subscription section" id="subscription">
        <div className="wrap reveal">
          <p className="section-label mono light-label">02 / Flyer subscription</p>
          <div className="section-heading subscription-heading">
            <h2 className="display">Stay consistent.<br /><em>Stay visible.</em></h2>
            <p>Professional flyers every month, without booking one by one. Send requests through your queue and get on-brand work back on schedule.</p>
          </div>
          <div className="plan-grid">
            {plans.map((plan) => (
              <article className={`plan ${plan.featured ? 'featured' : ''}`} key={plan.name}>
                {plan.featured && <span className="best-value mono">Most ordered</span>}
                <div className="plan-name mono"><i className={plan.color} />{plan.name}{plan.note && ` / ${plan.note}`}</div>
                <div className="price"><span>$</span>{plan.price}<small>/ month</small></div>
                <p className="plan-description">{plan.description}</p>
                <div className="tear-line" />
                <ul>
                  {plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}
                </ul>
                <a href={plan.checkoutUrl} className={`button ${plan.featured ? 'button-paper' : 'button-outline'}`}>Choose {plan.name}<ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
          <div className="addons">
            <p className="mono">Add to any run</p>
            <div><span>Motion flyer</span><strong>+$40–75</strong></div>
            <div><span>Rush delivery / under 24 hrs</span><strong>+$35</strong></div>
            <div><span>Extra revision</span><strong>+$15–25</strong></div>
            <div><span>Additional size</span><strong>+$10</strong></div>
          </div>
        </div>
      </section>

      <section className="how section" id="how">
        <div className="wrap reveal">
          <p className="section-label mono">03 / How it works</p>
          <div className="section-heading">
            <h2 className="display">A queue,<br />not a quote.</h2>
            <p>Less admin. More finished work. A simple process designed to keep momentum moving.</p>
          </div>
          <div className="steps">
            {steps.map(([title, text], index) => (
              <article className="step" key={title}>
                <div className="step-top"><span className="mono">0{index + 1}</span><i /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="wrap reveal">
          <p className="section-label mono">04 / Selected work</p>
          <div className="section-heading">
            <h2 className="display">Recent jobs,<br />fresh off press.</h2>
            <p>A mix of identities, websites, and campaign work made to be seen in the real world.</p>
          </div>
          <div className="work-grid">
            <article className="work-card work-brand">
              <div className="poster-brand"><span>LOW<br />TIDE</span><small>COFFEE CO.</small></div>
              <div className="work-caption"><span>Low Tide Coffee</span><small className="mono">Brand identity / 2026</small></div>
            </article>
            <article className="work-card work-web">
              <div className="browser"><div className="browser-bar"><i /><i /><i /></div><div className="browser-body"><span>FORM / 07</span><strong>Objects for<br />quiet rooms.</strong><button>Explore collection</button></div></div>
              <div className="work-caption"><span>Form House</span><small className="mono">Web design / 2026</small></div>
            </article>
            <article className="work-card work-flyer">
              <div className="flyer-stack"><div className="flyer back">FRI<br />28</div><div className="flyer front"><small>AFTER DARK</small><strong>HOUSE<br />GUESTS</strong><span>10PM — LATE</span></div></div>
              <div className="work-caption"><span>House Guests</span><small className="mono">Flyer series / 2025</small></div>
            </article>
          </div>
        </div>
      </section>

      <section className="final-cta" id="intake">
        <div className="wrap reveal">
          <div className="cta-proof">
            <RegMark position="tl" /><RegMark position="tr" /><RegMark position="bl" /><RegMark position="br" />
            <p className="section-label mono">Start here / New business</p>
            <h2 className="display">Tell us what<br />you’re building<span>.</span></h2>
            <p>One-off project or ongoing flyers — either way, it starts with a short brief and an honest conversation.</p>
            <div className="button-row centered">
              <a href="mailto:hello@flowstudio.design?subject=New%20project%20brief" className="button button-solid">Submit a project brief <ArrowRight size={17} /></a>
              <a href="#subscription" className="button button-outline">View flyer plans</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <a className="logo footer-logo" href="#top"><span className="display">Flow Studio</span><span className="ink-dots"><i /><i /><i /></span></a>
          <span className="mono">Independent design studio / © 2026</span>
          <a className="mono footer-email" href="mailto:hello@flowstudio.design">hello@flowstudio.design</a>
        </div>
      </footer>
    </main>
  )
}
