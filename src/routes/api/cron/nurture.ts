import { createFileRoute } from '@tanstack/react-router'
import { getAdminClient } from '../../../server/supabaseAdmin'
import { sendEmail } from '../../../server/email'
import { SERVICE_MAP, type CheckResult } from '../../../server/snapshot'

// Triggered by Vercel Cron (see vercel.json) once a day. Sends a 3-day and
// a 7-day follow-up to public snapshot leads who haven't been nurtured yet,
// then stops — this is a two-email drip, not an ongoing sequence.
//
// Auth: Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on
// its own cron requests when the CRON_SECRET env var is set. Set the same
// value in Vercel env vars and this route checks it matches.

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
const SITE_ORIGIN = 'https://www.flowstudiogrfx.com'

type LeadRow = {
  id: string
  email: string
  business: string | null
  url: string
  grade_letter: string | null
  opportunity_count: number | null
  checks: CheckResult[] | null
}

function topOpportunities(checks: CheckResult[] | null, n: number) {
  return (checks ?? []).filter((c) => c.status !== 'pass').slice(0, n)
}

function buildIntakeUrl(business: string | null, opportunities: CheckResult[]) {
  const lines = opportunities.map((c) => `- ${c.label}: ${SERVICE_MAP[c.id]?.fix ?? c.detail}`).join('\n')
  const message = `Following up on the free site check${business ? ` for ${business}` : ''}. Still interested in help with:\n${lines}`
  const params = new URLSearchParams({ serviceType: 'Website design & dev', message })
  return `${SITE_ORIGIN}/?${params.toString()}#intake`
}

function opportunityListHtml(opportunities: CheckResult[]) {
  return opportunities
    .map((c) => `<li><strong>${c.label}:</strong> ${SERVICE_MAP[c.id]?.fix ?? c.detail}</li>`)
    .join('')
}

async function sendThreeDay(admin: ReturnType<typeof getAdminClient>, lead: LeadRow) {
  const opportunities = topOpportunities(lead.checks, 3)
  const intakeUrl = buildIntakeUrl(lead.business, opportunities)
  const label = lead.business || lead.url

  await sendEmail({
    to: lead.email,
    subject: `Quick recap of your free site check for ${label}`,
    html: `
      <p>Hey — a few days ago you ran a free site check on ${lead.url}${lead.grade_letter ? ` and it came back a ${lead.grade_letter}` : ''}.</p>
      ${opportunities.length > 0 ? `<p>Here's what stood out:</p><ul>${opportunityListHtml(opportunities)}</ul>` : ''}
      <p>Happy to walk through any of this or just fix it outright — <a href="${intakeUrl}">start a project</a> and we'll pick up right where the report left off.</p>
      <p>— Flow Studio</p>
    `,
  })

  await admin.from('snapshot_leads').update({ nurture_3day_sent_at: new Date().toISOString() }).eq('id', lead.id)
}

async function sendSevenDay(admin: ReturnType<typeof getAdminClient>, lead: LeadRow) {
  const opportunities = topOpportunities(lead.checks, 5)
  const intakeUrl = buildIntakeUrl(lead.business, opportunities)
  const label = lead.business || lead.url

  await sendEmail({
    to: lead.email,
    subject: `Last look at ${label}'s site before we stop bugging you`,
    html: `
      <p>Last note on this, promise — it's been about a week since your free site check on ${lead.url}, and ${lead.opportunity_count ?? 'a few'} opportunit${lead.opportunity_count === 1 ? 'y is' : 'ies are'} still sitting there unaddressed.</p>
      ${opportunities.length > 0 ? `<ul>${opportunityListHtml(opportunities)}</ul>` : ''}
      <p>If now's not the time, no worries — this is the last check-in you'll get from us on this. If it is, <a href="${intakeUrl}">let's get started</a>.</p>
      <p>— Flow Studio</p>
    `,
  })

  await admin.from('snapshot_leads').update({ nurture_7day_sent_at: new Date().toISOString() }).eq('id', lead.id)
}

export const Route = createFileRoute('/api/cron/nurture')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET
        if (!secret) {
          return Response.json({ ok: false, error: 'CRON_SECRET is not configured.' }, { status: 500 })
        }
        const auth = request.headers.get('authorization')
        if (auth !== `Bearer ${secret}`) {
          return Response.json({ ok: false, error: 'Unauthorized.' }, { status: 401 })
        }

        const admin = getAdminClient()
        const threeDaysAgo = new Date(Date.now() - THREE_DAYS_MS).toISOString()
        const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS).toISOString()

        const { data: due3 } = await admin
          .from('snapshot_leads')
          .select('id, email, business, url, grade_letter, opportunity_count, checks')
          .is('nurture_3day_sent_at', null)
          .is('unsubscribed_at', null)
          .lte('created_at', threeDaysAgo)

        // Only send the 7-day follow-up to leads who already got the 3-day
        // one — keeps the drip strictly sequential even for a freshly
        // launched backlog of old leads.
        const { data: due7 } = await admin
          .from('snapshot_leads')
          .select('id, email, business, url, grade_letter, opportunity_count, checks')
          .not('nurture_3day_sent_at', 'is', null)
          .is('nurture_7day_sent_at', null)
          .is('unsubscribed_at', null)
          .lte('created_at', sevenDaysAgo)

        let sent3 = 0
        let sent7 = 0
        const errors: string[] = []

        for (const lead of (due3 ?? []) as LeadRow[]) {
          try {
            await sendThreeDay(admin, lead)
            sent3 += 1
          } catch (err) {
            errors.push(`3-day for ${lead.email}: ${err instanceof Error ? err.message : String(err)}`)
          }
        }

        for (const lead of (due7 ?? []) as LeadRow[]) {
          try {
            await sendSevenDay(admin, lead)
            sent7 += 1
          } catch (err) {
            errors.push(`7-day for ${lead.email}: ${err instanceof Error ? err.message : String(err)}`)
          }
        }

        return Response.json({ ok: true, sent3, sent7, errors })
      },
    },
  },
})
