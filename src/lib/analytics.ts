// Thin wrapper around Plausible's custom event tracking (window.plausible is
// defined by the script tag loaded in __root.tsx). Safe to call even if the
// script hasn't loaded yet or is blocked by an ad blocker.
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void
  }
}

export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return
  try {
    window.plausible?.(eventName, props ? { props } : undefined)
  } catch {
    // never let analytics break the app
  }
}
