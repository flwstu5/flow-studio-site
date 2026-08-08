export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string // ISO
  readTime: string
  tag: string
  body: BlogBlock[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: '5-things-your-website-needs-before-launch',
    title: '5 things your website needs before you launch',
    excerpt: 'The basics that get skipped when a site ships fast — and the ones that quietly cost you traffic and trust for years after.',
    date: '2026-08-08',
    readTime: '4 min read',
    tag: 'Website design & dev',
    body: [
      {
        type: 'p',
        text: "Most small business websites launch on a deadline. Someone needs a site live before an event, a rebrand, or a slow month turns into a slower quarter — so the basics that don't show up in a screenshot get skipped. The problem is those basics are exactly what determines whether people find the site at all.",
      },
      {
        type: 'p',
        text: "Here are the five things we check first on every site, and the ones we see missing most often on sites that launched in a hurry.",
      },
      { type: 'h2', text: '1. A real page title and description' },
      {
        type: 'p',
        text: "The text that shows up in a Google search result and when a link gets shared isn't automatic — it has to be written. A generic or missing title costs clicks even when the site ranks. This is the single most common issue we find on new sites.",
      },
      { type: 'h2', text: '2. One clear heading per page' },
      {
        type: 'p',
        text: "Search engines and screen readers both use your page's heading structure to understand what the page is actually about. A page with no clear H1, or five different ones, sends a confused signal — even if it looks fine visually.",
      },
      { type: 'h2', text: '3. A site that actually works on a phone' },
      {
        type: 'p',
        text: 'More than half of local searches happen on a phone. A site that looks great on a laptop but breaks, overlaps, or requires pinch-zooming on mobile is losing the majority of its potential visitors before they even see the offer.',
      },
      { type: 'h2', text: '4. HTTPS, a favicon, and the other trust signals' },
      {
        type: 'p',
        text: "Small things, but they add up: a padlock in the address bar, a favicon in the browser tab, images that have alt text. None of these are flashy, but together they're the difference between a site that reads as professional and one that reads as unfinished.",
      },
      { type: 'h2', text: '5. A robots.txt and sitemap.xml' },
      {
        type: 'p',
        text: "These two small files tell search engines what your site has and what to crawl. Without them, it can take search engines significantly longer to find and index new pages — sometimes they never fully do.",
      },
      {
        type: 'p',
        text: "Curious which of these your own site is missing? Run it through our free Website Snapshot tool — it checks all five (plus a few more) and gives you a plain-English breakdown in under a minute.",
      },
    ],
  },
  {
    slug: 'how-often-to-refresh-your-flyer-design',
    title: 'How often should you refresh your flyer design?',
    excerpt: "Set-it-and-forget-it branding goes stale faster than most business owners think. Here's how to know when it's time.",
    date: '2026-08-08',
    readTime: '3 min read',
    tag: 'Flyer subscription',
    body: [
      {
        type: 'p',
        text: "One flyer, run for a year straight, does a specific kind of damage: not because it's bad, but because it stops being seen. Regulars stop reading it. New customers assume the promo is outdated even when it isn't. Familiarity is useful for a brand, but invisible is not.",
      },
      { type: 'h2', text: 'The short answer' },
      {
        type: 'p',
        text: "For most local businesses posting regularly on social or printing for in-store display, every 2–4 weeks is the sweet spot. Frequent enough to stay current and match whatever's actually happening in the business (new specials, seasonal shifts, events), infrequent enough that it doesn't feel chaotic.",
      },
      { type: 'h2', text: "Signs it's time for a refresh" },
      {
        type: 'ul',
        items: [
          "Engagement on the same post or flyer has visibly dropped off",
          'The offer, hours, or pricing on it is out of date',
          "It doesn't match a season, holiday, or current promotion",
          "You can't remember the last time you swapped it",
        ],
      },
      { type: 'h2', text: 'Why a subscription beats one-off requests' },
      {
        type: 'p',
        text: "The businesses that stay visible aren't the ones with the single best flyer — they're the ones that never go stale, because updating it is built into a routine instead of something that has to be remembered, requested, and paid for individually each time. That consistency is the entire idea behind a recurring design plan: fresh creative on a schedule, without it becoming a monthly to-do you have to chase down.",
      },
      {
        type: 'p',
        text: 'If your current flyer has been up for more than a month, that alone is worth a second look.',
      },
    ],
  },
  {
    slug: 'brand-identity-vs-just-a-logo',
    title: "Brand identity vs. just a logo: what's the difference",
    excerpt: "A logo is one piece of a brand identity, not the whole thing. Here's what's actually included — and why it matters once you start designing anything else.",
    date: '2026-08-08',
    readTime: '4 min read',
    tag: 'Brand identity',
    body: [
      {
        type: 'p',
        text: "\"Can you make me a logo\" is one of the most common requests we get, and it's usually standing in for something bigger. A logo is a single mark. A brand identity is the system that makes everything you put out — a flyer, a website, a business card, a social post — look like it came from the same place.",
      },
      { type: 'h2', text: "What's actually in a brand identity" },
      {
        type: 'ul',
        items: [
          'The logo itself, plus variations for different uses (a wordmark, a submark for small spaces, a version that works on dark backgrounds)',
          'A defined color palette — not just "the colors I like," but ones chosen and tested to work together across print and screen',
          'Typography — which fonts you use for headlines vs. body text, and why',
          'Usage rules — spacing, sizing, what not to do with the logo, so it stays consistent no matter who touches it next',
        ],
      },
      { type: 'h2', text: 'Why this matters before you design anything else' },
      {
        type: 'p',
        text: "Without a brand identity, every new piece — a new flyer, a new page on the website, a new social template — starts from scratch. Colors drift. Fonts change project to project. Nothing looks like it belongs together, even if each individual piece looks fine on its own. That inconsistency is subtle, but customers notice it, even if they can't name what's off.",
      },
      {
        type: 'p',
        text: "With a brand identity in place, every future piece gets faster and cheaper to produce, because the decisions are already made. That's the real return on investment — not just liking the logo, but never having to reinvent the look from zero again.",
      },
      {
        type: 'p',
        text: 'If what you have right now is a logo and nothing else, that\'s a completely normal place to start — it just means the next step is building the system around it.',
      },
    ],
  },
  {
    slug: 'behind-the-build-bridgeway-collective',
    title: 'Behind the build: Bridgeway Collective',
    excerpt: 'A new website, a rebrand, and a networking event with tickets live on day one — how the project actually came together.',
    date: '2026-08-08',
    readTime: '3 min read',
    tag: 'Case study',
    body: [
      {
        type: 'p',
        text: 'Bridgeway Collective came to us with a big vision and a deadline: a rebrand and a new website that needed to be ready in time for their Small Business Growth & Networking Experience, with ticket sales live through the site from day one.',
      },
      { type: 'h2', text: 'The starting point' },
      {
        type: 'p',
        text: "Aaliyah, Bridgeway's founder, had a clear picture of what the organization stood for — a movement connecting entrepreneurs with the resources, mentors, and community to get to their next level — but translating that into a brand and a working site is a different skill set entirely. That's the gap we work in.",
      },
      { type: 'h2', text: 'What we built' },
      {
        type: 'ul',
        items: [
          'A rebrand: refined visual identity across the site and event materials',
          'A new website built to explain the mission clearly to first-time visitors',
          'Event ticketing live through the site ahead of the September 12 event at BMO Tower in Downtown Milwaukee',
        ],
      },
      { type: 'h2', text: 'How the process actually went' },
      {
        type: 'p',
        text: "This wasn't a hand-off-and-wait project. It was long calls, real changes, and more than a few pivots as the vision sharpened along the way — which is normal, and honestly the part that makes the final result feel right instead of just finished. In Aaliyah's words, from the process:",
      },
      {
        type: 'p',
        text: '"You didn\'t just build me a website. You helped me create a digital home for a vision that means so much to me."',
      },
      { type: 'h2', text: 'The result' },
      {
        type: 'p',
        text: "New brand, new website, new venue, bigger vision — and tickets moving through the new site before launch day was even over. That's the version of \"done\" we're aiming for on every project: not just live, but actually working for the business behind it.",
      },
    ],
  },
]

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug) ?? null
}
