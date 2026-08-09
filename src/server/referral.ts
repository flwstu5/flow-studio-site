import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { sendEmail } from './email'
import { getAdminClient } from './supabaseAdmin'

const ReferralSchema = z.object({
  referrerName: z.string().min(1),
  referrerEmail: z.string().email(),
  referredBusiness: z.string().min(1),
  referredEmail: z.string().email().optional().or(z.literal('')),
})

function generateCode() {
  // Short, easy to read aloud/type — 6 uppercase alphanumeric chars.
  return crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
}

// Creates a referral record and hands the referrer a code to share. The
// code gets redeemed later in submitIntake (see intake.ts) if the referred
// business enters it on their project brief — redemption just flags the
// row and notifies admin@ to apply the free month manually, since we don't
// touch billing/Stripe automatically from here.
export const submitReferral = createServerFn({ method: 'POST' })
  .inputValidator(ReferralSchema)
  .handler(async ({ data }) => {
    const code = generateCode()
    const supabase = getAdminClient()

    const { error } = await supabase.from('referrals').insert({
      code,
      referrer_name: data.referrerName,
      referrer_email: data.referrerEmail,
      referred_business: data.referredBusiness,
      referred_email: data.referredEmail || null,
      status: 'pending',
    })

    if (error) {
      throw new Error(error.message)
    }

    try {
      await sendEmail({
        to: data.referrerEmail,
        subject: 'Your Flow Studio referral code',
        html: `
          <h2>Thanks for the referral, ${data.referrerName}!</h2>
          <p>Your code is: <strong style="font-size:20px; letter-spacing:2px;">${code}</strong></p>
          <p>Share it with ${data.referredBusiness} — have them mention it when they submit their project brief at
          <a href="https://flowstudiogrfx.com#intake">flowstudiogrfx.com</a>. Once their subscription starts, we'll
          apply a free month to your account.</p>
        `,
      })
    } catch (emailError) {
      // Don't fail the referral over the confirmation email — the code is
      // already saved, and it's shown on-screen right after this returns.
      console.error('Referral confirmation email failed:', emailError)
    }

    await sendEmail({
      to: 'admin@flowstudiogrfx.com',
      replyTo: data.referrerEmail,
      subject: `New referral — ${data.referredBusiness}`,
      html: `
        <h2>New referral</h2>
        <p><strong>Referrer:</strong> ${data.referrerName} (${data.referrerEmail})</p>
        <p><strong>Referred business:</strong> ${data.referredBusiness}</p>
        ${data.referredEmail ? `<p><strong>Their email:</strong> ${data.referredEmail}</p>` : ''}
        <p><strong>Code:</strong> ${code}</p>
      `,
    })

    return { code }
  })
