// Shared Mailgun sender — used by the intake form and the business snapshot
// tool so there's one place that knows how to actually send an email.
export async function sendEmail(params: { to: string; replyTo?: string; subject: string; html: string }) {
  const apiKey = process.env.MAILGUN_API_KEY
  const domain = process.env.MAILGUN_DOMAIN || 'flowstudiogrfx.com'
  if (!apiKey) {
    throw new Error('Email service is not configured.')
  }

  const form = new URLSearchParams()
  form.set('from', 'Flow Studio <admin@flowstudiogrfx.com>')
  form.set('to', params.to)
  form.set('subject', params.subject)
  form.set('html', params.html)
  if (params.replyTo) form.set('h:Reply-To', params.replyTo)

  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to send email: ${errText}`)
  }
}
