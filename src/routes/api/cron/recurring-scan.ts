import { createFileRoute } from '@tanstack/react-router'
import { getAdminClient } from '../../../server/supabaseAdmin'
import { scanSite, computeGrade } from '../../../server/snapshot'

// Triggered by Vercel Cron (see vercel.json) weekly. Auto re-checks every
// portal client with a website on file — but deliberately PageSpeed-only:
// scanSite() only touches the free, ~unlimited PageSpeed API and plain
// fetch() for on-page checks. It never calls the Places API, so this can
// run for every client every week without going near the 1,000/month
// Places free-tier cap. Competitor/GBP data still requires a manual staff
// "Run snapshot" click, same as before.
//
// Auth: same CRON_SECRET pattern as /api/cron/nurture.

export const Route = createFileRoute('/api/cron/recurring-scan')({
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

        const { data: clients, error: clientsError } = await admin
          .from('clients')
          .select('id, website_url')
          .not('website_url', 'is', null)

        if (clientsError) {
          return Response.json({ ok: false, error: clientsError.message }, { status: 500 })
        }

        let scanned = 0
        const errors: string[] = []

        for (const client of clients ?? []) {
          if (!client.website_url) continue
          try {
            const scan = await scanSite(client.website_url)
            if (!scan.ok) {
              errors.push(`${client.website_url}: site unreachable`)
              continue
            }

            const grade = computeGrade(scan.checks, scan.pageSpeed)
            const opportunityCount = scan.checks.filter((c) => c.status !== 'pass').length

            await admin.from('snapshots').insert({
              client_id: client.id,
              url: scan.url,
              grade_letter: grade.letter,
              grade_percent: grade.percent,
              opportunity_count: opportunityCount,
              checks: scan.checks,
              page_speed: scan.pageSpeed,
              reviews: null,
              competitors: null,
            })
            scanned += 1
          } catch (err) {
            errors.push(`${client.website_url}: ${err instanceof Error ? err.message : String(err)}`)
          }
        }

        return Response.json({ ok: true, scanned, errors })
      },
    },
  },
})
