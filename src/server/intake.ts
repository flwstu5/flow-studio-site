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
    // 1. Email Flow Studio with the full brief, as before.
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
      to: 'hello@flowstudio.design',
      replyTo: data.email,
      subject: `New project brief — ${data.serviceType}`,
      html: briefHtml,
    })

    // 2. Create their portal account, same as subscribers get automatically.
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
        // Don't fail the whole submission if account creation has an issue —
        // the brief email above already went through, so the lead isn't lost.
        console.error('Failed to create portal account:', createError.message)
      } else {
        await supabase.from('clients').insert({
          auth_user_id: created.user.id,
          email: data.email,
          business_name: data.business,
          client_type: 'project',
          tier: null,
        })

        // 3. Welcome email to the client with their portal login info.
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
      }
    }

    return { success: true }
  })
