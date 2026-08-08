import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { sendEmail } from './email'
import { getAdminClient } from './supabaseAdmin'

const SnapshotSchema = z.object({
  url: z.string().min(1),
  email: z.string().email(),
  business: z.string().optional(),
  competitor1: z.string().optional(),
  competitor2: z.string().optional(),
})

export type CheckStatus = 'pass' | 'warn' | 'fail'

export type CheckResult = {
  id: string
  label: string
  status: CheckStatus
  detail: string
}

export type PageSpeedScores = {
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

  const socialPlatforms: { name: string; pattern: RegExp }[] = [
    { name: 'Facebook', pattern: /facebook\.com\// },
    { name: 'Instagram', pattern: /instagram\.com\// },
    { name: 'LinkedIn', pattern: /linkedin\.com\// },
    { name: 'X/Twitter', pattern: /(?:twitter\.com|x\.com)\// },
    { name: 'TikTok', pattern: /tiktok\.com\// },
    { name: 'YouTube', pattern: /youtube\.com\// },
  ]
  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1])
  const foundPlatforms = socialPlatforms.filter((p) => hrefs.some((h) => p.pattern.test(h)))
  checks.push({
    id: 'social-links',
    label: 'Social profiles linked',
    status: foundPlatforms.length >= 3 ? 'pass' : foundPlatforms.length >= 1 ? 'warn' : 'fail',
    detail:
      foundPlatforms.length > 0
        ? `Linked to ${foundPlatforms.length} of 6 major platforms (${foundPlatforms.map((p) => p.name).join(', ')}).`
        : 'No links to Facebook, Instagram, LinkedIn, X, TikTok, or YouTube found on the page.',
  })

  return checks
}

export type SiteScan =
  | { ok: true; url: string; html: string; checks: CheckResult[]; pageSpeed: PageSpeedScores | null }
  | { ok: false; url: string }

export async function scanSite(rawUrl: string): Promise<SiteScan> {
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

type PlaceInfo = {
  websiteUri: string | null
  displayName: string | null
  rating: number | null
  userRatingCount: number | null
  businessStatus: string | null
}

// One search does double duty: it's how we auto-discover competitors AND
// how we find the business's own Google Business Profile (by matching a
// result's website back to the site we just scanned). Requesting rating +
// review count bumps this into the Enterprise+Atmosphere field tier.
async function searchNearbyBusinesses(context: BusinessContext): Promise<PlaceInfo[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('Places search skipped: GOOGLE_PLACES_API_KEY is not set in this environment.')
    return []
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.websiteUri,places.displayName,places.rating,places.userRatingCount,places.businessStatus',
      },
      body: JSON.stringify({
        textQuery: `${context.category} in ${context.locality}`,
        maxResultCount: 10,
      }),
    })
    clearTimeout(timeout)
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error(`Places API request failed (${res.status}) for query "${context.category} in ${context.locality}":`, errText)
      return []
    }

    const data = await res.json()
    const places = Array.isArray(data?.places) ? data.places : []
    const withWebsite = places.filter((p: any) => typeof p?.websiteUri === 'string').length
    if (places.length === 0) {
      console.error(`Places API returned zero results for query "${context.category} in ${context.locality}". Raw response:`, JSON.stringify(data).slice(0, 500))
    } else {
      console.error(`Places API returned ${places.length} result(s) for "${context.category} in ${context.locality}", ${withWebsite} with a websiteUri set:`, places.map((p: any) => p?.displayName?.text ?? '?').join(', '))
    }

    return places.map((p: any): PlaceInfo => ({
      websiteUri: typeof p?.websiteUri === 'string' ? p.websiteUri : null,
      displayName: typeof p?.displayName?.text === 'string' ? p.displayName.text : null,
      rating: typeof p?.rating === 'number' ? p.rating : null,
      userRatingCount: typeof p?.userRatingCount === 'number' ? p.userRatingCount : null,
      businessStatus: typeof p?.businessStatus === 'string' ? p.businessStatus : null,
    }))
  } catch (err) {
    console.error('Places request threw:', err instanceof Error ? err.message : err)
    return []
  }
}

function pickCompetitorUrls(places: PlaceInfo[], excludeHost: string | null): string[] {
  const urls: string[] = []
  const seen = new Set<string>()
  for (const p of places) {
    if (!p.websiteUri) continue
    const host = safeHostname(p.websiteUri)
    if (!host || host === excludeHost || seen.has(host)) continue
    seen.add(host)
    urls.push(p.websiteUri)
    if (urls.length >= 2) break
  }
  return urls
}

function findPlaceForUrl(places: PlaceInfo[], url: string): PlaceInfo | null {
  const host = safeHostname(url)
  if (!host) return null
  return places.find((p) => p.websiteUri && safeHostname(p.websiteUri) === host) ?? null
}

async function runPageSpeed(url: string): Promise<PageSpeedScores | null> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  if (!apiKey) {
    console.error('PageSpeed skipped: GOOGLE_PAGESPEED_API_KEY is not set in this environment.')
    return null
  }

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

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error(`PageSpeed API request failed (${res.status}):`, errText)
      return null
    }
    const data = await res.json()
    const categories = data?.lighthouseResult?.categories
    if (!categories) {
      console.error('PageSpeed API response missing lighthouseResult.categories:', JSON.stringify(data).slice(0, 500))
      return null
    }

    return {
      performance: Math.round((categories.performance?.score ?? 0) * 100),
      seo: Math.round((categories.seo?.score ?? 0) * 100),
      accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    }
  } catch (err) {
    console.error('PageSpeed request threw:', err instanceof Error ? err.message : err)
    return null
  }
}

function emailChecklist(checks: CheckResult[]) {
  return checks.map((c) => `<li><strong>${c.status.toUpperCase()}</strong> — ${c.label}: ${c.detail}</li>`).join('')
}

// Maps each check to the real Flow Studio service that fixes it, plus a
// one-line pitch. Used to turn a diagnostic report into a sales prompt —
// both in the lead email (for staff on a call) and on the results page
// (for the visitor themselves). Kept to services that actually exist on
// the pricing page so this never overpromises.
export const SERVICE_MAP: Record<string, { service: string; fix: string }> = {
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

function buildPitchSummary(checks: CheckResult[]) {
  const opportunities = checks.filter((c) => c.status !== 'pass')
  if (opportunities.length === 0) return ''

  const byService = new Map<string, string[]>()
  for (const c of opportunities) {
    const mapping = SERVICE_MAP[c.id]
    if (!mapping) continue
    const list = byService.get(mapping.service) ?? []
    list.push(c.label)
    byService.set(mapping.service, list)
  }
  if (byService.size === 0) return ''

  const rows = [...byService.entries()]
    .map(([service, labels]) => `<li><strong>${service}</strong> — fixes ${labels.length}: ${labels.join(', ')}</li>`)
    .join('')

  return `<hr /><h3>Suggested pitch</h3><ul>${rows}</ul>`
}

export type Grade = { percent: number; letter: string }

export function computeGrade(checks: CheckResult[], pageSpeed: PageSpeedScores | null): Grade {
  const points = checks.reduce((sum, c) => sum + (c.status === 'pass' ? 2 : c.status === 'warn' ? 1 : 0), 0)
  const maxPoints = checks.length * 2
  let ratio = maxPoints > 0 ? points / maxPoints : 0

  if (pageSpeed) {
    const avg = (pageSpeed.performance + pageSpeed.seo + pageSpeed.accessibility) / 3 / 100
    ratio = (ratio + avg) / 2
  }

  const percent = Math.round(ratio * 100)
  const letter = percent >= 90 ? 'A' : percent >= 80 ? 'B' : percent >= 70 ? 'C' : percent >= 60 ? 'D' : 'F'
  return { percent, letter }
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

    let nearbyPlaces: PlaceInfo[] = []
    const context = detectBusinessContext(primary.html)
    if (context) {
      nearbyPlaces = await searchNearbyBusinesses(context)

      if (competitorUrls.length === 0) {
        const discovered = pickCompetitorUrls(nearbyPlaces, safeHostname(primary.url))
        if (discovered.length > 0) {
          competitorUrls = discovered
          competitorSource = 'auto'
        }
      }
    }

    const ownListing = nearbyPlaces.length > 0 ? findPlaceForUrl(nearbyPlaces, primary.url) : null
    if (context) {
      // Only add this check when we actually had enough info to search —
      // otherwise "not found" would be a false negative, not a real finding.
      primary.checks.push(
        ownListing
          ? {
              id: 'gbp',
              label: 'Google Business Profile',
              status: ownListing.businessStatus === 'OPERATIONAL' ? 'pass' : 'warn',
              detail: `Found — ${ownListing.rating ?? '—'}★ (${ownListing.userRatingCount ?? 0} review${ownListing.userRatingCount === 1 ? '' : 's'}).`,
            }
          : {
              id: 'gbp',
              label: 'Google Business Profile',
              status: 'warn',
              detail: "We couldn't find a Google Business Profile linking back to this site nearby — it may be unclaimed, incomplete, or just outside our search match.",
            },
      )
    }

    const competitors = await Promise.all(competitorUrls.map((url) => scanSite(url)))
    const competitorReviews = competitors.map((c) => (c.ok ? findPlaceForUrl(nearbyPlaces, c.url) : null))

    const grade = computeGrade(primary.checks, primary.pageSpeed)

    const opportunityCount = primary.checks.filter((c) => c.status !== 'pass').length

    try {
      const competitorHtml = competitors
        .map((c, i) => {
          const label = competitorReviews[i]?.displayName || safeHostname(c.url) || `Competitor ${i + 1}`
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
          <p><strong>Overall grade:</strong> ${grade.letter} (${grade.percent}%)</p>
          <ul>${emailChecklist(primary.checks)}</ul>
          ${buildPitchSummary(primary.checks)}
          ${competitorHtml ? `<hr /><h3>Competitors they're up against (${competitorSource === 'auto' ? 'auto-discovered nearby' : 'submitted manually'})</h3>${competitorHtml}` : ''}
        `,
      })
    } catch {
      // Don't fail the whole request just because the notification email
      // failed — the visitor should still see their results.
    }

    const competitorPayload = competitors.map((c, i) => ({
      url: c.url,
      ok: c.ok,
      pageSpeed: c.ok ? c.pageSpeed : null,
      reviews: competitorReviews[i]
        ? { rating: competitorReviews[i]!.rating, count: competitorReviews[i]!.userRatingCount }
        : null,
    }))
    const primaryReviews = ownListing ? { rating: ownListing.rating, count: ownListing.userRatingCount } : null

    // If this email belongs to an existing portal client, save the report
    // so it shows up as a reminder in their dashboard and in staff view.
    // Best-effort — a save failure here should never break the response
    // the visitor is waiting on.
    try {
      const admin = getAdminClient()
      const { data: existingClient } = await admin
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .maybeSingle()

      if (existingClient) {
        await admin.from('snapshots').insert({
          client_id: existingClient.id,
          url: primary.url,
          grade_letter: grade.letter,
          grade_percent: grade.percent,
          opportunity_count: opportunityCount,
          checks: primary.checks,
          page_speed: primary.pageSpeed,
          reviews: primaryReviews,
          competitors: competitorPayload,
        })
      }
    } catch {
      // snapshots table may not exist yet, or the insert failed — the
      // visitor's report above is unaffected either way.
    }

    // Save every public lead — client or not — so the nurture-email cron
    // has something to follow up on. Separate table and separate try/catch
    // from the client-snapshots save above so neither one can block the
    // other or the visitor's response.
    try {
      const admin = getAdminClient()
      await admin.from('snapshot_leads').insert({
        email: data.email,
        business: data.business ?? null,
        url: primary.url,
        grade_letter: grade.letter,
        grade_percent: grade.percent,
        opportunity_count: opportunityCount,
        checks: primary.checks,
        page_speed: primary.pageSpeed,
        reviews: primaryReviews,
      })
    } catch {
      // snapshot_leads table may not exist yet, or the insert failed — the
      // visitor's report above is unaffected either way.
    }

    return {
      ok: true as const,
      url: primary.url,
      pageSpeed: primary.pageSpeed,
      checks: primary.checks,
      grade,
      reviews: primaryReviews,
      competitorSource,
      competitors: competitors.map((c, i) => ({
        label: competitorReviews[i]?.displayName || safeHostname(c.url) || `Competitor ${i + 1}`,
        url: c.url,
        ok: c.ok,
        pageSpeed: c.ok ? c.pageSpeed : null,
        checks: c.ok ? c.checks : [],
        reviews: competitorPayload[i].reviews,
      })),
    }
  })
