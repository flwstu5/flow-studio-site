import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { sendEmail } from './email'
import { getAdminClient } from './supabaseAdmin'

const IntakeSchema = z.object({
  name: z.string().min(1),
  business: z.string().min(1),
  serviceType: z.string().min(1),
  budget: z.string().min(1),
  message: z.string().min(1),
  email: z.string().email(),
})

export const submitIntake = createServerFn({ method: 'POST' })
  .inputValidator(IntakeSchema)
  .handler(async ({ data }) => {
    // 1. Create their portal account, same as subscribers get automatically.
    // Fully wrapped so nothing here can throw — a failure just gets folded
    // into a status note that rides along in the lead email below, instead
    // of disappearing into a server log nobody checks.
    let onboardingNote = ''
    try {
      const supabase = getAdminClient()

      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', data.email)
        .maybeSingle()

      if (existing) {
        onboardingNote = 'Portal account already existed for this email — no changes made.'
      } else {
        const { data: created, error: createError } = await supabase.auth.admin.createUser({
          email: data.email,
          email_confirm: true,
        })

        if (createError) {
          onboardingNote = `⚠️ Portal account creation FAILED: ${createError.message}. Set them up manually.`
        } else {
          await supabase.from('clients').insert({
            auth_user_id: created.user.id,
            email: data.email,
            business_name: data.business,
            client_type: 'project',
            tier: null,
          })

          // Welcome email to the client — sent via Mailgun from admin@flowstudiogrfx.com.
          // Still wrapped in its own try/catch so a failure here never breaks
          // the submission; the note below is what surfaces it to you.
          try {
            await sendEmail({
              to: data.email,
              subject: 'Your Flow Studio client portal is ready',
              html: `
                <h2>Thanks, ${data.name}!</h2>
                <p>We received your project brief and will be in touch shortly.</p>
                <p>You also now have access to your client portal, where you'll be able to track this project and any files we send your way.</p>
                <p><a href="https://portal.flowstudiogrfx.com/login">Log in here</a> using this email address (${data.email}) — you'll receive a one-time code, no password needed.</p>
              `,
            })
            onboardingNote = 'Portal account created and welcome email sent successfully.'
          } catch (welcomeEmailError) {
            const reason = welcomeEmailError instanceof Error ? welcomeEmailError.message : String(welcomeEmailError)
            onboardingNote = `⚠️ Portal account was created, but the welcome email FAILED to send (${reason}). This client doesn't know they have a portal login yet — check your Mailgun domain/API key, then invite them manually in the meantime.`
          }
        }
      }
    } catch (accountError) {
      const reason = accountError instanceof Error ? accountError.message : String(accountError)
      onboardingNote = `⚠️ Portal onboarding step failed entirely: ${reason}. Set them up manually.`
    }

    // 2. Email you the full brief, plus the onboarding status above. This MUST
    // succeed for the submission to count as successful — it's the actual
    // lead notification, and now it's also the only place you'll see whether
    // this client actually got their portal invite.
    const briefHtml = `
      <h2>New project brief</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business:</strong> ${data.business}</p>
      <p><strong>Service type:</strong> ${data.serviceType}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Brief:</strong></p>
      <p>${data.message.replace(/\n/g, '<br />')}</p>
      <hr />
      <p><strong>Portal onboarding status:</strong><br />${onboardingNote}</p>
    `
    await sendEmail({
      to: 'admin@flowstudiogrfx.com',
      replyTo: data.email,
      subject: `New project brief — ${data.serviceType}`,
      html: briefHtml,
    })

    return { success: true }
  })
