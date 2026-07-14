import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

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
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('Email service is not configured.')
    }

    const html = `
      <h2>New project brief</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business:</strong> ${data.business}</p>
      <p><strong>Service type:</strong> ${data.serviceType}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Brief:</strong></p>
      <p>${data.message.replace(/\n/g, '<br />')}</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Flow Studio Intake <onboarding@resend.dev>',
        to: 'hello@flowstudio.design',
        reply_to: data.email,
        subject: `New project brief — ${data.serviceType}`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Failed to send intake email: ${errText}`)
    }

    return { success: true }
  })
