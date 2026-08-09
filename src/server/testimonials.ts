import { createServerFn } from '@tanstack/react-start'
import { getAdminClient } from './supabaseAdmin'

// Testimonials are curated in the client portal (staff turns a rated
// request's feedback into a quote, then publishes it) — this just reads
// whatever's currently published, newest first. Falls back to an empty
// list on any error so the homepage always has something to show (the
// component keeps a hardcoded default testimonial for that case).
export const getApprovedTestimonials = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, business_name, quote, role, result')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Failed to load testimonials:', error.message)
      return { testimonials: [] }
    }

    return { testimonials: data ?? [] }
  } catch (err) {
    console.error('Failed to load testimonials:', err)
    return { testimonials: [] }
  }
})
