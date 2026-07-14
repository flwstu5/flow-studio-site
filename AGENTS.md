# Flow Studio Project Guide

## Architecture

This is a single-page marketing site built with TanStack Start, React, and TypeScript. TanStack Router supplies file-based routing and the Netlify Vite adapter handles deployment output.

## Key Directories

- `src/routes/` contains the root document and page routes.
- `src/routes/index.tsx` contains the Flow Studio landing page, content data, navigation behavior, and reveal interactions.
- `src/styles.css` contains the complete responsive design system and all visual treatments.
- `public/` contains static assets served directly by Vite.
- `.netlify/` contains platform-generated context and result files; it is not application source.

## Coding Conventions

- Use TypeScript and functional React components.
- Keep route components in `src/routes/` and use TanStack file-route conventions.
- Use semantic HTML, visible keyboard focus, and reduced-motion fallbacks.
- Use CSS custom properties for shared colors and typography.
- Preserve the print-production aesthetic: warm paper, off-black ink, muted red press colors, hard borders, mono metadata, and subtle texture.
- Prefer CSS artwork and lightweight SVG primitives over decorative image dependencies.

## Non-Obvious Decisions

The portfolio visuals are original CSS compositions rather than remote images. This keeps the page reliable, fast, and visually cohesive without requiring external asset hosting. Project and plan calls to action use pre-addressed email links because no intake endpoint or customer form destination was supplied.

## Commands

- `npm run dev` starts local development.
- `npm run build` creates the production build.
