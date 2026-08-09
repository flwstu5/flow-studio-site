import { useEffect, useState, type FormEvent } from 'react'
import { ArrowDownRight, ArrowRight, Check, Facebook, Instagram, Linkedin, Menu, X } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { submitIntake } from '../server/intake'
import { submitReferral } from '../server/referral'
import { trackEvent } from '../lib/analytics'

export const Route = createFileRoute('/')({
  component: FlowStudio,
  head: () => ({
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }),
      },
    ],
  }),
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
    price: '70',
    description: 'Best for small businesses that post occasionally.',
    features: ['2 digital flyers per month', '1 revision per flyer', '48–72 hour turnaround', 'Instagram + Facebook sizes'],
    color: 'dark',
    checkoutUrl: 'https://buy.stripe.com/9B6cN40NN0CSg1Q16c9sk00',
    askFirst: 'Have a question before you buy?',
  },
  {
    name: 'Growth',
    note: 'Best value',
    price: '150',
    description: 'Content-ready, with something new to post every week.',
    features: ['4 digital flyers per month', '2 revisions per flyer', 'All social media sizes', 'Priority turnaround', 'Basic captions included'],
    color: 'mid',
    featured: true,
    checkoutUrl: 'https://buy.stripe.com/9B68wObsrbhwcPE5ms9sk01',
    askFirst: 'Not sure yet? Ask us first',
  },
  {
    name: 'Premium',
    price: '275',
    description: 'For brands that need a consistent marketing rhythm.',
    features: ['8 digital flyers per month', '2 revisions per flyer', 'Multiple platform sizes', 'Priority turnaround', 'Captions + promo wording', '1 animated flyer monthly'],
    color: 'light',
    checkoutUrl: 'https://buy.stripe.com/3cIfZg2VV1GWg1Q0289sk02',
    askFirst: 'Have a question before you buy?',
  },
]

const websitePlans = [
  {
    name: 'Starter Site',
    price: '900',
    description: 'A clean, professional single-page site to get you online fast.',
    features: ['1-page custom layout', 'Mobile optimized', 'Contact form included', '1 week turnaround', '1 round of revisions'],
    color: 'dark',
    checkoutUrl: 'https://buy.stripe.com/aFabJ0bsretI8zobKQ9sk03',
    askFirst: 'Have a question before you buy?',
  },
  {
    name: 'Growth Site',
    note: 'Most popular',
    price: '2,400',
    description: 'A full multi-page site built around your brand and services.',
    features: ['Up to 6 pages', 'Fully custom design', 'SEO setup included', '2 rounds of revisions', '2–3 week turnaround', '30 days of post-launch tweaks'],
    color: 'mid',
    featured: true,
    checkoutUrl: 'https://buy.stripe.com/28E14m0NNgBQ5nc3ek9sk04',
    askFirst: 'Not sure yet? Ask us first',
  },
  {
    name: 'Full Custom Build',
    price: '4,500+',
    description: 'For businesses that need integrations, animation, or complex features.',
    features: ['Unlimited pages', 'Custom functionality & integrations', 'Motion & interaction design', 'Priority turnaround', 'Dedicated revisions', '30 days of post-launch support'],
    color: 'light',
  },
]

const hostingPlans = [
  { name: 'Basic Hosting', price: '20', features: ['Reliable hosting', 'SSL & security included', 'Uptime monitoring'] },
  { name: 'Hosting + Edits', price: '40', features: ['Everything in Basic', 'Up to 2 small edits/month', 'Domain renewal handled'], featured: true },
  { name: 'Priority Care', price: '65', features: ['Everything in Edits', 'Priority email support', 'Same-week update turnaround'] },
]

const steps = [
  ['Subscribe', 'Pick a plan. No contracts — pause or cancel whenever the calendar gets quiet.'],
  ['Submit a request', 'Drop your flyer brief into the queue: event, promotion, menu, or announcement.'],
  ['Get a draft', 'A considered, on-brand design lands back in your inbox, ready to review.'],
  ['Revise & ship', 'Request changes if needed, then download polished print- and web-ready files.'],
]

const faqs = [
  {
    q: 'What happens right after I pay?',
    a: "You'll get a portal login within one business day, plus a short intake form so we can lock in scope — brand assets, references, deadlines. Website projects start with a kickoff note; flyer subscriptions start taking requests immediately.",
  },
  {
    q: "What if I don't like the first draft?",
    a: "Every tier includes revision rounds — use them. Tell us specifically what's off (color, layout, tone) and we'll redraw it. If a flyer or site genuinely misses the brief after all included revisions, flag it and we'll make it right before you spend an extra dollar.",
  },
  {
    q: 'Who owns the final files?',
    a: 'You do. Once a project is paid in full, the delivered files — logo, site code, flyer assets — are yours to use anywhere. Subscription flyers are yours to keep even if you later pause or cancel.',
  },
  {
    q: 'Can I cancel or pause the flyer subscription?',
    a: "Anytime. No contracts. Pause when things are quiet, resume when they're not — you'll only be billed for active months.",
  },
  {
    q: 'Do I have to buy hosting with a website project?',
    a: 'No. Hosting plans are optional. Take your finished site anywhere, or let us keep it fast and updated for a flat monthly fee.',
  },
  {
    q: 'How fast is turnaround, really?',
    a: "Flyer drafts land per your plan's stated window (48–72 hrs on Starter, faster on Growth/Premium). Website timelines are 1 week (Starter Site) to 2–3 weeks (Growth Site); Full Custom Build timelines are scoped per project.",
  },
  {
    q: "What if I'm not sure which package fits?",
    a: 'Email us or use "Ask us first" next to any package above — a two-minute reply beats guessing.',
  },
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
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const [intakeForm, setIntakeForm] = useState({
    name: '',
    email: '',
    business: '',
    serviceType: 'Logo & brand design',
    budget: '',
    message: '',
    referralCode: '',
  })
  const [intakeStatus, setIntakeStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const [referralForm, setReferralForm] = useState({
    referrerName: '',
    referrerEmail: '',
    referredBusiness: '',
    referredEmail: '',
  })
  const [referralStatus, setReferralStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [referralCodeResult, setReferralCodeResult] = useState('')

  const [customForm, setCustomForm] = useState({
    name: '',
    email: '',
    business: '',
    currentSite: '',
    goals: '',
    budget: '',
    timeline: '',
  })
  const [customStatus, setCustomStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  function updateIntakeField(field: string, value: string) {
    setIntakeForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateCustomField(field: string, value: string) {
    setCustomForm((prev) => ({ ...prev, [field]: value }))
  }

  function updateReferralField(field: string, value: string) {
    setReferralForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleReferralSubmit(e: FormEvent) {
    e.preventDefault()
    setReferralStatus('sending')
    try {
      const result = await submitReferral({ data: referralForm })
      setReferralCodeResult(result.code)
      setReferralStatus('sent')
      trackEvent('Referral Submitted')
    } catch {
      setReferralStatus('error')
    }
  }

  async function handleIntakeSubmit(e: FormEvent) {
    e.preventDefault()
    setIntakeStatus('sending')
    try {
      await submitIntake({ data: intakeForm })
      setIntakeStatus('sent')
      trackEvent('Intake Submitted', { serviceType: intakeForm.serviceType })
    } catch {
      setIntakeStatus('error')
    }
  }

  async function handleCustomSubmit(e: FormEvent) {
    e.preventDefault()
    setCustomStatus('sending')
    try {
      await submitIntake({
        data: {
          name: customForm.name,
          email: customForm.email,
          business: customForm.business,
          serviceType: 'Full Custom Website Build',
          budget: customForm.budget,
          message: `Current site: ${customForm.currentSite || 'None'}\nTimeline: ${customForm.timeline}\n\nGoals & why they need a full custom build:\n${customForm.goals}`,
        },
      })
      setCustomStatus('sent')
      trackEvent('Intake Submitted', { serviceType: 'Full Custom Website Build' })
    } catch {
      setCustomStatus('error')
    }
  }

  // Supports deep-linking from the snapshot tool with a prefilled brief:
  // /?serviceType=...&message=...&business=...&email=...#intake
  // Also supports referral links: /?ref=CODE#intake prefills the referral
  // code field so it rides along with their project brief.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const serviceType = params.get('serviceType')
    const message = params.get('message')
    const business = params.get('business')
    const email = params.get('email')
    const ref = params.get('ref')
    if (!serviceType && !message && !business && !email && !ref) return
    setIntakeForm((prev) => ({
      ...prev,
      serviceType: serviceType ?? prev.serviceType,
      message: message ?? prev.message,
      business: business ?? prev.business,
      email: email ?? prev.email,
      referralCode: ref ?? prev.referralCode,
    }))
    document.getElementById('intake')?.scrollIntoView({ block: 'start' })
  }, [])

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element))
    return () => reveal.disconnect()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox])

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <header className="site-header">
        <div className="wrap nav-inner">
          <a className="logo" href="#top" aria-label="Flow Studio home" onClick={closeMenu}>
            <img src="/logo-full1.png" alt="Flow Studio" className="logo-image" width="350" height="303" />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#subscription">Flyer subscription</a>
            <a href="#websites">Website pricing</a>
            <a href="#how">How it works</a>
            <a href="#faq">FAQ</a>
            <a href="#work">Work</a>
            <a href="/blog">Blog</a>
            <a href="/snapshot">Free Site Check</a>
            <a className="nav-login" href="https://portal.flowstudiogrfx.com/login">Client login</a>
            <a className="nav-cta" href="#intake">Start a project <ArrowRight size={14} /></a>
          </nav>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile navigation">
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#subscription" onClick={closeMenu}>Flyer subscription</a>
          <a href="#websites" onClick={closeMenu}>Website pricing</a>
          <a href="#how" onClick={closeMenu}>How it works</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="/blog" onClick={closeMenu}>Blog</a>
          <a href="/snapshot" onClick={closeMenu}>Free Site Check</a>
          <a href="https://portal.flowstudiogrfx.com/login" onClick={closeMenu}>Client login</a>
          <a href="#intake" onClick={closeMenu}>Start a project <ArrowRight size={16} /></a>
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
                  <a href="#intake" className="button button-solid">Start a project <ArrowDownRight size={18} /></a>
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
                {plan.askFirst && (
                  <a
                    className="ask-first"
                    href={`mailto:admin@flowstudiogrfx.com?subject=${encodeURIComponent(`Question about ${plan.name} plan`)}`}
                  >
                    {plan.askFirst} →
                  </a>
                )}
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

      <section className="website-pricing section" id="websites">
        <div className="wrap reveal">
          <p className="section-label mono">02.5 / Website design & dev</p>
          <div className="section-heading">
            <h2 className="display">A site built<br />to convert.</h2>
            <p>One-time project pricing — pick the scope that fits, or start small and grow into it. Payment plans available on request.</p>
          </div>
          <div className="plan-grid website-grid">
            {websitePlans.map((plan) => (
              <article className={`plan website-plan ${plan.featured ? 'featured' : ''}`} key={plan.name}>
                {plan.featured && <span className="best-value mono">Most popular</span>}
                <div className="plan-name mono"><i className={plan.color} />{plan.name}{plan.note && ` / ${plan.note}`}</div>
                <div className="price"><span>$</span>{plan.price}</div>
                <p className="plan-description">{plan.description}</p>
                <div className="tear-line" />
                <ul>
                  {plan.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}
                </ul>
                {plan.checkoutUrl ? (
                  <a href={plan.checkoutUrl} className={`button ${plan.featured ? 'button-solid' : 'button-outline'}`}>Get started<ArrowRight size={16} /></a>
                ) : (
                  <a href="#custom-build" className={`button ${plan.featured ? 'button-solid' : 'button-outline'}`}>Tell us about your project<ArrowRight size={16} /></a>
                )}
                {plan.askFirst && (
                  <a
                    className="ask-first"
                    href={`mailto:admin@flowstudiogrfx.com?subject=${encodeURIComponent(`Question about ${plan.name}`)}`}
                  >
                    {plan.askFirst} →
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="hosting-block">
            <p className="section-label mono" style={{ marginTop: 60 }}>Optional / Ongoing hosting & care</p>
            <p className="hosting-intro">Skip the hassle of managing hosting yourself — we keep your site fast, secure, and updated.</p>
            <div className="hosting-grid">
              {hostingPlans.map((plan) => (
                <div className={`hosting-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>
                  <div className="hosting-name mono">{plan.name}</div>
                  <div className="hosting-price"><span>$</span>{plan.price}<small>/mo</small></div>
                  <ul>
                    {plan.features.map((f) => <li key={f}><Check size={13} />{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="custom-build-form" id="custom-build">
            <p className="section-label mono" style={{ marginTop: 70 }}>Full Custom Build / Project scoping</p>
            <div className="section-heading">
              <h2 className="display">Tell us what<br />you need built.</h2>
              <p>Custom builds start with a conversation — walk us through your goals so we can scope it accurately.</p>
            </div>

            {customStatus === 'sent' ? (
              <p style={{ fontWeight: 600 }}>Got it — thanks! We'll review your project and follow up shortly.</p>
            ) : (
              <form onSubmit={handleCustomSubmit} style={{ display: 'grid', gap: 14, maxWidth: 560 }}>
                <input required aria-label="Your name" placeholder="Your name" value={customForm.name} onChange={(e) => updateCustomField('name', e.target.value)} />
                <input required type="email" aria-label="Email address" placeholder="Email address" value={customForm.email} onChange={(e) => updateCustomField('email', e.target.value)} />
                <input required aria-label="Business / brand name" placeholder="Business / brand name" value={customForm.business} onChange={(e) => updateCustomField('business', e.target.value)} />
                <input aria-label="Current website (if any)" placeholder="Current website (if any)" value={customForm.currentSite} onChange={(e) => updateCustomField('currentSite', e.target.value)} />
                <input required aria-label="Ideal timeline" placeholder="Ideal timeline (e.g. 6 weeks, flexible)" value={customForm.timeline} onChange={(e) => updateCustomField('timeline', e.target.value)} />
                <input required aria-label="Budget range" placeholder="Budget range" value={customForm.budget} onChange={(e) => updateCustomField('budget', e.target.value)} />
                <textarea
                  required
                  rows={5}
                  aria-label="Project goals"
                  placeholder="What are you building, and why does it need a full custom build? (integrations, animations, complex features, etc.)"
                  value={customForm.goals}
                  onChange={(e) => updateCustomField('goals', e.target.value)}
                />
                <button type="submit" className="button button-solid" disabled={customStatus === 'sending'}>
                  {customStatus === 'sending' ? 'Sending…' : 'Submit project details'} <ArrowRight size={17} />
                </button>
                {customStatus === 'error' && (
                  <p style={{ color: '#a31e22', fontSize: 13 }}>Something went wrong — try again, or email admin@flowstudiogrfx.com directly.</p>
                )}
              </form>
            )}
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

      <section className="faq section" id="faq">
        <div className="wrap reveal">
          <p className="section-label mono">03.5 / Before you sign</p>
          <div className="section-heading">
            <h2 className="display">A few things<br />worth knowing.</h2>
            <p>The questions we get most, answered up front.</p>
          </div>
          <div className="faq-list">
            {faqs.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary className="faq-question">{item.q}</summary>
                <p className="faq-answer">{item.a}</p>
              </details>
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
            <button
              type="button"
              className="work-card work-brand"
              onClick={() => setLightbox({ src: '/work-logo-hall-of-fame.png', alt: 'Hall of Fame Pet Care logo mark' })}
            >
              <div className="poster-brand poster-image">
                <img src="/work-logo-hall-of-fame.png" alt="Hall of Fame Pet Care logo mark" width="900" height="326" loading="lazy" decoding="async" />
              </div>
              <div className="work-caption"><span>Hall of Fame Pet Care</span><small className="mono">Logo &amp; brand design</small></div>
            </button>
            <a className="work-card work-web" href="https://www.outthemudhauling.com" target="_blank" rel="noopener noreferrer">
              <div className="browser">
                <div className="browser-bar"><i /><i /><i /></div>
                <div className="browser-body browser-image">
                  <img src="/work-web-out-the-mud.jpg" alt="Out The Mud Hauling homepage hero" width="1000" height="429" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="work-caption"><span>Out The Mud Hauling</span><small className="mono">Web design</small></div>
            </a>
            <button
              type="button"
              className="work-card work-flyer"
              onClick={() => setLightbox({ src: '/work-flyer-designer-dinners.jpg', alt: 'Designer Dinners by Jaq flyer' })}
            >
              <div className="flyer-stack flyer-image">
                <img src="/work-flyer-designer-dinners.jpg" alt="Designer Dinners by Jaq flyer" width="900" height="900" loading="lazy" decoding="async" />
              </div>
              <div className="work-caption"><span>Designer Dinners by Jaq</span><small className="mono">Flyer design</small></div>
            </button>
          </div>
        </div>
      </section>

      <section className="testimonials section" id="testimonials">
        <div className="wrap reveal">
          <p className="section-label mono">05 / What clients say</p>
          <div className="section-heading">
            <h2 className="display">Don't take<br />our word for it.</h2>
            <p>Real feedback from people we've built for.</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "It's one thing to hire somebody who can do the work. It's another thing to work with somebody who
              genuinely puts their ALL into what they do — someone who cares about the outcome, listens to your
              vision, and treats what you're building like it actually matters. You didn't just build me a website.
              You helped me create a digital home for a vision that means so much to me."
            </p>
            <div className="testimonial-attribution">
              <span className="testimonial-name">Aaliyah Garcia</span>
              <span className="mono testimonial-role">Founder, Bridgeway Collective</span>
            </div>
            <p className="mono testimonial-result">
              Website design &amp; launch — live in time for their Small Business Growth &amp; Networking Experience,
              with ticket sales through the new site from day one.
            </p>
          </div>
        </div>
      </section>

      <section className="referral section" id="referral">
        <div className="wrap reveal">
          <p className="section-label mono">06 / Referrals</p>
          <div className="section-heading">
            <h2 className="display">Know a business<br />that needs this?</h2>
            <p>Refer them to Flow Studio — when they mention your code in their project brief, you both get a free month on any flyer subscription plan.</p>
          </div>

          {referralStatus === 'sent' ? (
            <div className="testimonial-card" style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600, fontSize: 18 }}>
                Your referral code: <span className="mono">{referralCodeResult}</span>
              </p>
              <p>
                Share it with {referralForm.referredBusiness || 'them'} — have them enter it when they submit their
                project brief. Once their subscription starts, we'll apply your free month.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleReferralSubmit}
              style={{ display: 'grid', gap: 14, maxWidth: 480, margin: '28px auto 0', textAlign: 'left' }}
            >
              <input
                required
                aria-label="Your name"
                placeholder="Your name"
                value={referralForm.referrerName}
                onChange={(e) => updateReferralField('referrerName', e.target.value)}
              />
              <input
                required
                type="email"
                aria-label="Your email"
                placeholder="Your email"
                value={referralForm.referrerEmail}
                onChange={(e) => updateReferralField('referrerEmail', e.target.value)}
              />
              <input
                required
                aria-label="Business you're referring"
                placeholder="Business you're referring"
                value={referralForm.referredBusiness}
                onChange={(e) => updateReferralField('referredBusiness', e.target.value)}
              />
              <input
                type="email"
                aria-label="Their email (optional)"
                placeholder="Their email (optional)"
                value={referralForm.referredEmail}
                onChange={(e) => updateReferralField('referredEmail', e.target.value)}
              />
              <button type="submit" className="button button-solid" disabled={referralStatus === 'sending'}>
                {referralStatus === 'sending' ? 'Sending…' : 'Get my referral code'} <ArrowRight size={17} />
              </button>
              {referralStatus === 'error' && (
                <p style={{ color: '#a31e22', fontSize: 13 }}>
                  Something went wrong — try again, or email admin@flowstudiogrfx.com directly.
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      <section className="final-cta" id="intake">
        <div className="wrap reveal">
          <div className="cta-proof">
            <RegMark position="tl" /><RegMark position="tr" /><RegMark position="bl" /><RegMark position="br" />
            <p className="section-label mono">Start here / New business</p>
            <h2 className="display">Tell us what<br />you're building<span>.</span></h2>
            <p>One-off project or ongoing flyers — either way, it starts with a short brief and an honest conversation.</p>

            {intakeStatus === 'sent' ? (
              <p style={{ marginTop: 24, fontWeight: 600 }}>
                Got it — thanks! We'll be in touch shortly.
              </p>
            ) : (
              <form
                onSubmit={handleIntakeSubmit}
                style={{ display: 'grid', gap: 14, maxWidth: 480, margin: '28px auto 0', textAlign: 'left' }}
              >
                <input
                  required
                  aria-label="Your name"
                  placeholder="Your name"
                  value={intakeForm.name}
                  onChange={(e) => updateIntakeField('name', e.target.value)}
                />
                <input
                  required
                  type="email"
                  aria-label="Email address"
                  placeholder="Email address"
                  value={intakeForm.email}
                  onChange={(e) => updateIntakeField('email', e.target.value)}
                />
                <input
                  required
                  aria-label="Business / brand name"
                  placeholder="Business / brand name"
                  value={intakeForm.business}
                  onChange={(e) => updateIntakeField('business', e.target.value)}
                />
                <select
                  aria-label="Service type"
                  value={intakeForm.serviceType}
                  onChange={(e) => updateIntakeField('serviceType', e.target.value)}
                >
                  <option>Logo & brand design</option>
                  <option>Website design & dev</option>
                  <option>Digital & print graphics</option>
                  <option>Flyer subscription</option>
                  <option>Something else</option>
                </select>
                <input
                  required
                  aria-label="Budget range"
                  placeholder="Budget range (e.g. $500–1000)"
                  value={intakeForm.budget}
                  onChange={(e) => updateIntakeField('budget', e.target.value)}
                />
                <textarea
                  required
                  rows={4}
                  aria-label="Project details"
                  placeholder="Tell us about the project"
                  value={intakeForm.message}
                  onChange={(e) => updateIntakeField('message', e.target.value)}
                />
                <input
                  aria-label="Referral code (optional)"
                  placeholder="Referral code (optional)"
                  value={intakeForm.referralCode}
                  onChange={(e) => updateIntakeField('referralCode', e.target.value)}
                />
                <button type="submit" className="button button-solid" disabled={intakeStatus === 'sending'}>
                  {intakeStatus === 'sending' ? 'Sending…' : 'Submit project brief'} <ArrowRight size={17} />
                </button>
                {intakeStatus === 'error' && (
                  <p style={{ color: '#a31e22', fontSize: 13 }}>
                    Something went wrong sending that — try again, or email admin@flowstudiogrfx.com directly.
                  </p>
                )}
              </form>
            )}

            <div className="button-row centered" style={{ marginTop: 20 }}>
              <a href="#subscription" className="button button-outline">View flyer plans</a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <a className="logo footer-logo" href="#top">
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
            <span className="mono footer-response">We reply within 1 business day</span>
            <div className="footer-legal">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button type="button" className="lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>
            <X size={22} />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </main>
  )
}