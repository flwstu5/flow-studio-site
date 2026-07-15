import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const IntakeSchema = z.object({
  name: z.string().min(1),
  business: z.string().min(1),
  serviceType: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().min(1),
  email: z.string().email(),
})

function getAdminClient() {
  return createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function sendEmail(params: { to: string; replyTo?: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('Email service is not configured.')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Flow Studio <onboarding@resend.dev>',
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to send email: ${errText}`)
  }
}

export const submitIntake = createServerFn({ method: 'POST' })
  .inputValidator(IntakeSchema)
  .handler(async ({ data }) => {
    // 1. Email you the full brief. This MUST succeed for the submission to
    // count as successful — it's the actual lead notification.
    // NOTE: using your personal email here since hello@flowstudio.design
    // isn't a real inbox yet. Update this once you have a verified domain
    // and a real business inbox set up.
    const briefHtml = `
      <h2>New project brief</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business:</strong> ${data.business}</p>
      <p><strong>Service type:</strong> ${data.serviceType}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Brief:</strong></p>
      <p>${data.message.replace(/\n/g, '<br />')}</p>
    `
    await sendEmail({
      to: 'denzaylewilliams@gmail.com',
      replyTo: data.email,
      subject: `New project brief — ${data.serviceType}`,
      html: briefHtml,
    })

    // 2. Create their portal account, same as subscribers get automatically.
    // Wrapped so that any failure here (including the welcome email below,
    // which will currently fail for anyone but your own Resend-registered
    // address until a domain is verified) doesn't break the submission —
    // the lead notification above already succeeded, so nothing is lost.
    try {
      const supabase = getAdminClient()

      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .maybeSingle()

      if (!existing) {
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email: data.email,
          email_confirm: true,
        })

        if (createError) {
          console.error('Failed to create portal account:', createError.message)
        } else {
          await supabase.from('clients').insert({
            auth_user_id: created.user.id,
            email: data.email,
            business_name: data.business,
            client_type: 'project',
            tier: null,
          })

          // Welcome email to the client — will currently fail for any email
          // other than your own until a domain is verified in Resend. That's
          // expected and caught below, not a bug.
          try {
            await sendEmail({
              to: data.email,
              subject: 'Your Flow Studio client portal is ready',
              html: `
                <h2>Thanks, ${data.name}!</h2>
                <p>We received your project brief and will be in touch shortly.</p>
                <p>You also now have access to your client portal, where you'll be able to track this project and any files we send your way.</p>
                <p><a href="https://flow-studio-portal-e19up3nkk-fl-ow-studio.vercel.app/login">Log in here</a> using this email address (${data.email}) — you'll receive a one-time code, no password needed.</p>
              `,
            })
          } catch (welcomeEmailError) {
            console.error('Welcome email not sent (expected until domain verified):', welcomeEmailError)
          }
        }
      }
    } catch (accountError) {
      console.error('Portal account creation step failed:', accountError)
    }

    return { success: true }
  })
