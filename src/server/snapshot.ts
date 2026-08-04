import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { sendEmail } from './email'

const SnapshotSchema = z.object({
  url: z.string().min(1),
  email: z.string().email(),
  business: z.string().optional(),
  competitor1: z.string().optional(),
  competitor2: z.string().optional(),
})

type CheckStatus = 'pass' | 'warn' | 'fail'

type CheckResult = {
  id: string
  label: string
  status: CheckStatus
  detail: string
}

type PageSpeedScores = {
  performance: number
  seo: number
  accessibility: number
}

function normalizeUrl(input: string) {
  let value = input.trim()
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`
  return value
}

async function fetchText(url: string, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'FlowStudioSnapshotBot/1.0 (+https://www.flowstudiogrfx.com)' },
    })
    return { ok: res.ok, status: res.status, finalUrl: res.url || url, text: res.ok ? await res.text() : '' }
  } finally {
    clearTimeout(timeout)
  }
}

async function checkPathExists(baseUrl: string, path: string) {
  try {
    const target = new URL(path, baseUrl).toString()
    const res = await fetch(target, { method: 'GET', redirect: 'follow' })
    return res.ok
  } catch {
    return false
  }
}

function runOnPageChecks(html: string, finalUrl: string): CheckResult[] {
  const checks: CheckResult[] = []

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch?.[1]?.trim() ?? ''
  if (!title) {
    checks.push({ id: 'title', label: 'Page title', status: 'fail', detail: 'No <title> tag found — this is one of the strongest signals search engines use.' })
  } else if (title.length < 15 || title.length > 65) {
    checks.push({ id: 'title', label: 'Page title', status: 'warn', detail: `Title is ${title.length} characters — aim for 15–65 so it doesn't get cut off in search results.` })
  } else {
    checks.push({ id: 'title', label: 'Page title', status: 'pass', detail: `Good length (${title.length} characters).` })
  }

  const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)
  const description = descMatch?.[1]?.trim() ?? ''
  if (!description) {
    checks.push({ id: 'description', label: 'Meta description', status: 'fail', detail: "Missing — this is the snippet Google shows under your title in search results." })
  } else if (description.length < 50 || description.length > 160) {
    checks.push({ id: 'description', label: 'Meta description', status: 'warn', detail: `${description.length} characters — aim for 50–160 for the best display in search results.` })
  } else {
    checks.push({ id: 'description', label: 'Meta description', status: 'pass', detail: 'Good length and present.' })
  }

  const h1Matches = html.match(/<h1[^>]*>/gi) ?? []
  if (h1Matches.length === 0) {
    checks.push({ id: 'h1', label: 'Main heading (H1)', status: 'fail', detail: 'No H1 tag found — pages should have one clear main heading.' })
  } else if (h1Matches.length > 1) {
    checks.push({ id: 'h1', label: 'Main heading (H1)', status: 'warn', detail: `Found ${h1Matches.length} H1 tags — more than one can dilute the page's focus.` })
  } else {
    checks.push({ id: 'h1', label: 'Main heading (H1)', status: 'pass', detail: 'Exactly one H1, as recommended.' })
  }

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? []
  const imgsWithAlt = imgTags.filter((tag) => /alt=["'][^"']+["']/i.test(tag))
  if (imgTags.length === 0) {
    checks.push({ id: 'alt', label: 'Image alt text', status: 'pass', detail: 'No images on the page to check.' })
  } else {
    const pct = Math.round((imgsWithAlt.length / imgTags.length) * 100)
    checks.push({
      id: 'alt',
      label: 'Image alt text',
      status: pct === 100 ? 'pass' : pct >= 50 ? 'warn' : 'fail',
      detail: `${pct}% of images (${imgsWithAlt.length}/${imgTags.length}) have alt text.`,
    })
  }

  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  checks.push({
    id: 'viewport',
    label: 'Mobile-friendly tag',
    status: hasViewport ? 'pass' : 'fail',
    detail: hasViewport ? 'Viewport meta tag present.' : 'No viewport meta tag — the site may not render properly on phones.',
  })

  const isHttps = finalUrl.startsWith('https://')
  checks.push({
    id: 'https',
    label: 'Secure connection (HTTPS)',
    status: isHttps ? 'pass' : 'fail',
    detail: isHttps ? 'Site loads over HTTPS.' : 'Site is not on HTTPS — this hurts trust and search rankings.',
  })

  const hasOg = /<meta[^>]+property=["']og:title["']/i.test(html) && /<meta[^>]+property=["']og:image["']/i.test(html)
  checks.push({
    id: 'social',
    label: 'Social share preview',
    status: hasOg ? 'pass' : 'warn',
    detail: hasOg ? 'Open Graph tags found — links will preview nicely when shared.' : 'No Open Graph tags — links shared on social or text will look bare.',
  })

  const hasSchema = /application\/ld\+json/i.test(html)
  checks.push({
    id: 'schema',
    label: 'Structured data',
    status: hasSchema ? 'pass' : 'warn',
    detail: hasSchema ? 'Structured data (schema.org) found.' : 'No structured data found — adding it can earn richer search results.',
  })

  const hasFavicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html)
  checks.push({
    id: 'favicon',
    label: 'Favicon',
    status: hasFavicon ? 'pass' : 'warn',
    detail: hasFavicon ? 'Favicon tag found.' : 'No favicon link found in the page head.',
  })

  return checks
}

type SiteScan =
  | { ok: true; url: string; html: string; checks: CheckResult[]; pageSpeed: PageSpeedScores | null }
  | { ok: false; url: string }

async function scanSite(rawUrl: string): Promise<SiteScan> {
  const targetUrl = normalizeUrl(rawUrl)

  const [pageResult, robotsOk, sitemapOk, pageSpeed] = await Promise.all([
    fetchText(targetUrl).catch(() => null),
    checkPathExists(targetUrl, '/robots.txt'),
    checkPathExists(targetUrl, '/sitemap.xml'),
    runPageSpeed(targetUrl),
  ])

  if (!pageResult || !pageResult.ok) {
    return { ok: false, url: targetUrl }
  }

  const checks = runOnPageChecks(pageResult.text, pageResult.finalUrl)
  checks.push({
    id: 'robots',
    label: 'robots.txt',
    status: robotsOk ? 'pass' : 'warn',
    detail: robotsOk ? 'Found — search engines have clear crawl instructions.' : 'Not found at /robots.txt.',
  })
  checks.push({
    id: 'sitemap',
    label: 'sitemap.xml',
    status: sitemapOk ? 'pass' : 'warn',
    detail: sitemapOk ? 'Found — helps search engines discover all your pages.' : 'Not found at /sitemap.xml.',
  })

  return { ok: true, url: targetUrl, html: pageResult.text, checks, pageSpeed }
}

type BusinessContext = { category: string; locality: string }

// Best-effort: only works when the site has schema.org LocalBusiness (or
// similar) structured data with an address. Sites without it — often the
// exact sites this tool flags for missing SEO fundamentals — just won't
// get auto-discovered competitors. The manual competitor fields are the
// reliable fallback for those.
function detectBusinessContext(html: string): BusinessContext | null {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]

  for (const match of blocks) {
    try {
      const parsed = JSON.parse(match[1].trim())
      const raw = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.['@graph']) ? parsed['@graph'] : [parsed]

      for (const item of raw) {
        const type = item?.['@type']
        const address = item?.address
        const locality = address?.addressLocality
        const region = address?.addressRegion
        if (typeof type === 'string' && typeof locality === 'string' && locality.trim()) {
          const category = type.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
          const location = typeof region === 'string' && region.trim() ? `${locality}, ${region}` : locality
          return { category, locality: location }
        }
      }
    } catch {
      // not parseable JSON-LD — skip this block and keep looking
    }
  }

  return null
}

function safeHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

async function findCompetitors(context: BusinessContext, excludeUrl: string): Promise<string[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return []

  const excludeHost = safeHostname(excludeUrl)

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.websiteUri,places.displayName',
      },
      body: JSON.stringify({
        textQuery: `${context.category} in ${context.locality}`,
        maxResultCount: 6,
      }),
    })
    clearTimeout(timeout)
    if (!res.ok) return []

    const data = await res.json()
    const places = Array.isArray(data?.places) ? data.places : []

    const urls: string[] = []
    for (const place of places) {
      const site = place?.websiteUri
      if (typeof site !== 'string') continue
      const host = safeHostname(site)
      if (!host || host === excludeHost) continue
      if (urls.some((u) => safeHostname(u) === host)) continue
      urls.push(site)
      if (urls.length >= 2) break
    }
    return urls
  } catch {
    return []
  }
}

async function runPageSpeed(url: string): Promise<PageSpeedScores | null> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  if (!apiKey) return null

  try {
    const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
    endpoint.searchParams.set('url', url)
    endpoint.searchParams.set('key', apiKey)
    endpoint.searchParams.set('strategy', 'mobile')
    for (const c of ['performance', 'seo', 'accessibility']) endpoint.searchParams.append('category', c)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)
    const res = await fetch(endpoint.toString(), { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) return null
    const data = await res.json()
    const categories = data?.lighthouseResult?.categories
    if (!categories) return null

    return {
      performance: Math.round((categories.performance?.score ?? 0) * 100),
      seo: Math.round((categories.seo?.score ?? 0) * 100),
      accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    }
  } catch {
    return null
  }
}

function emailChecklist(checks: CheckResult[]) {
  return checks.map((c) => `<li><strong>${c.status.toUpperCase()}</strong> — ${c.label}: ${c.detail}</li>`).join('')
}

export const runSnapshot = createServerFn({ method: 'POST' })
  .inputValidator(SnapshotSchema)
  .handler(async ({ data }) => {
    const primary = await scanSite(data.url)

    if (!primary.ok) {
      try {
        await sendEmail({
          to: 'admin@flowstudiogrfx.com',
          replyTo: data.email,
          subject: `Snapshot lead (site unreachable) — ${primary.url}`,
          html: `<p><strong>Email:</strong> ${data.email}</p><p><strong>Business:</strong> ${data.business ?? '—'}</p><p><strong>URL:</strong> ${primary.url}</p><p>Couldn't fetch the site to scan it — may be down, blocking automated requests, or the URL is wrong. Still a real lead worth a manual look.</p>`,
        })
      } catch {
        // best-effort — don't block the response on this
      }
      return {
        ok: false as const,
        error: "We couldn't reach that site — double-check the URL and try again.",
      }
    }

    let competitorUrls = [data.competitor1, data.competitor2].filter(
      (v): v is string => !!v && v.trim().length > 0,
    )
    let competitorSource: 'manual' | 'auto' | 'none' = competitorUrls.length > 0 ? 'manual' : 'none'

    if (competitorUrls.length === 0) {
      const context = detectBusinessContext(primary.html)
      if (context) {
        const discovered = await findCompetitors(context, primary.url)
        if (discovered.length > 0) {
          competitorUrls = discovered
          competitorSource = 'auto'
        }
      }
    }

    const competitors = await Promise.all(competitorUrls.map((url) => scanSite(url)))

    const opportunityCount = primary.checks.filter((c) => c.status !== 'pass').length

    try {
      const competitorHtml = competitors
        .map((c, i) => {
          const label = `Competitor ${i + 1}`
          if (!c.ok) return `<p><strong>${label} (${c.url}):</strong> couldn't be reached.</p>`
          return `
            <p><strong>${label}: ${c.url}</strong></p>
            ${c.pageSpeed ? `<p>PageSpeed (mobile): Performance ${c.pageSpeed.performance}, SEO ${c.pageSpeed.seo}, Accessibility ${c.pageSpeed.accessibility}</p>` : ''}
            <ul>${emailChecklist(c.checks)}</ul>
          `
        })
        .join('')

      await sendEmail({
        to: 'admin@flowstudiogrfx.com',
        replyTo: data.email,
        subject: `New snapshot lead — ${data.business || data.email} (${opportunityCount} opportunities found)`,
        html: `
          <h2>New business snapshot lead</h2>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Business:</strong> ${data.business ?? '—'}</p>
          <p><strong>Site scanned:</strong> ${primary.url}</p>
          ${primary.pageSpeed ? `<p><strong>PageSpeed scores (mobile):</strong> Performance ${primary.pageSpeed.performance}, SEO ${primary.pageSpeed.seo}, Accessibility ${primary.pageSpeed.accessibility}</p>` : '<p><em>PageSpeed scoring not configured — showing on-page checks only.</em></p>'}
          <ul>${emailChecklist(primary.checks)}</ul>
          ${competitorHtml ? `<hr /><h3>Competitors they're up against (${competitorSource === 'auto' ? 'auto-discovered nearby' : 'submitted manually'})</h3>${competitorHtml}` : ''}
        `,
      })
    } catch {
      // Don't fail the whole request just because the notification email
      // failed — the visitor should still see their results.
    }

    return {
      ok: true as const,
      url: primary.url,
      pageSpeed: primary.pageSpeed,
      checks: primary.checks,
      competitorSource,
      competitors: competitors.map((c, i) => ({
        label: `Competitor ${i + 1}`,
        url: c.url,
        ok: c.ok,
        pageSpeed: c.ok ? c.pageSpeed : null,
        checks: c.ok ? c.checks : [],
      })),
    }
  })
