# Portfolio Build — Todo

Tracking file for the plan in `plan.md`. Check items off as they ship. Each phase ends with a deploy + a real-content review.

Legend:
- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[!]` blocked / needs decision

---

## Phase 0 — Foundations

### 0.1 Repo + tooling
- [x] Init Next.js 16 (App Router, TypeScript, ESLint, no src) — note: scaffold installs 16, not 15
- [x] Add Tailwind CSS v4 + PostCSS config
- [x] Add Prettier + `prettier-plugin-tailwindcss`
- [x] Configure absolute imports (`@/*`) in `tsconfig.json`
- [x] Add `.editorconfig`, `.nvmrc`
- [x] Commit baseline; push to GitHub

### 0.2 Design tokens
- [x] Create tokens in `app/globals.css` (Tailwind v4 `@theme` block — no separate tokens.css needed)
- [x] Map tokens to Tailwind theme (`@theme` registers `--color-*` and `--font-*`)
- [x] Wire typeface stack: Fraunces, Inter, Caveat via `next/font`
- [x] Add paper-grain texture overlay utility class (`.paper-grain` + `/public/textures/paper-grain.svg`)
- [x] Build a `/styleguide` route showing palette + type scale + button states

### 0.3 Content pipeline
- [x] Install MDX deps: `next-mdx-remote`, `gray-matter`, `zod`
- [x] Define frontmatter schema for projects (zod)
- [x] Define frontmatter schema for blog posts (zod)
- [x] Build `lib/mdx.ts` loader + type-safe getters (`getAllProjects`, `getProjectBySlug`, `getFeaturedProjects`, `getAllPosts`, `getPostBySlug`)
- [x] Seed `content/projects/silk-route.mdx` and `content/blog/welcome.mdx`

### 0.4 Deploy
- [ ] Connect repo to Vercel _(needs user auth)_
- [ ] Confirm preview deploys work on PRs
- [ ] Add `NEXT_PUBLIC_SITE_URL` + placeholder env vars
- [ ] Verify "hello world" loads on the production URL

### 0.5 Known issues / notes
- Node 20.17 installed; Next 16 wants 20.19+ or 22. `.nvmrc` set to `22`. Recommend `nvm install 22 && nvm use`.
- Scaffold installs Next 16.2.6 (newer than plan's "Next 15"). Stayed on 16; no MDX/Tailwind incompatibilities encountered.
- Tailwind v4: no separate `tailwind.config.ts` — all theme in `app/globals.css` via `@theme`.

---

## Phase 1 — Layout Shell

### 1.1 Primitives
- [x] `StitchBorder` — SVG rect with `stroke-dasharray`, configurable color/weight/dash/gap/radius
- [x] `JaliReveal` — inline SVG `<pattern>` with `currentColor` strokes, fade gradient mask
- [x] `ScribbleArrow` — hand-drawn SVG arrow, rotates per `direction` prop
- [x] `PaperSurface` — polymorphic wrapper, 4 tones, applies grain

### 1.2 Global layout
- [x] `app/(site)/layout.tsx` with `<Nav>`, `<PageTransition>`, `<Footer>`
- [x] `Nav`: wordmark left, 5 links right, active state with `layoutId` marigold underline
- [x] `Nav` mobile: hamburger → full-screen panel with jali backdrop, staggered link entrance
- [x] `Footer`: socials, credit line, `BackToTop` with scribble arrow
- [x] Nav keyboard-accessible: Esc closes mobile, body scroll lock when open, aria-expanded/controls

### 1.3 Motion plumbing
- [x] motion + Lenis installed (Phase 0)
- [x] `prefers-reduced-motion` respected in SmoothScrollProvider, PageTransition, Nav, BackToTop
- [x] `PageTransition` wrapper: fade + rise on path change, AnimatePresence mode="wait"

### 1.4 Placeholder routes (so nav works during build)
- [x] /projects, /blog, /about, /contact — minimal placeholders pointing to upcoming phase

---

## Phase 2 — Home

### 2.1 Hero
- [ ] Layout: name + tagline + CTA on left, framed image right
- [ ] SVG block-print border on hero image, animates in on load
- [ ] Background jali bleed from right edge
- [ ] Marigold CTA "See the work" → `/projects`

### 2.2 Featured projects
- [ ] Read MDX projects, filter `featured: true`, sort by date
- [ ] Asymmetric grid: one large + two stacked
- [ ] Tile: cover + title + palette swatch row
- [ ] Hover: lift + marigold underline + swatch animation

### 2.3 About teaser
- [ ] Short paragraph + portrait with kantha-stitch frame
- [ ] "More about me →" with scribbled arrow

### 2.4 Latest journal
- [ ] Pull 3 most recent blog posts
- [ ] Horizontal card row (cover, date in Caveat, title in serif)

### 2.5 Contact strip
- [ ] Full-width indigo band with marigold text + email + Instagram
- [ ] Hover state on links

### 2.6 QA
- [ ] Reduced-motion fallback verified
- [ ] Lighthouse pass on home (>90 each category)
- [ ] iOS Safari + Android Chrome check

---

## Phase 3 — Projects

### 3.1 Index page
- [ ] Filter chips: category (Couture / RTW / Textile / Collaboration) + year
- [ ] Client-side filter state (URL-synced via `searchParams`)
- [ ] Masonry grid
- [ ] Hover: fabric-swatch peel-back reveal to secondary image
- [ ] Loading skeleton: animated dashed border

### 3.2 Case study template (`[slug]/page.tsx`)
- [ ] Cover: full-bleed hero + serif title overlay
- [ ] Meta strip: year, role, materials, collaborators
- [ ] Concept: paragraph + mood board grid (4–6 images)
- [ ] Process: alternating text/image rows
- [ ] Final pieces: large editorial images
- [ ] Palette: named swatch row
- [ ] Next-project card with scribbled arrow

### 3.3 MDX components
- [ ] `SwatchRow` — accepts array of `{hex, name}`
- [ ] `MaterialList`
- [ ] `MoodBoard`
- [ ] `ProcessRow` — text + image side-by-side, alternating
- [ ] `PullQuote`

### 3.4 Real content
- [ ] Author 2–3 real case studies with her
- [ ] Pressure-test the template against real photos (not lorem)
- [ ] Reshoot or pull any weak images

### 3.5 SEO
- [ ] `generateStaticParams` for all slugs
- [ ] Per-project OG image via `@vercel/og`
- [ ] Structured data: `CreativeWork`

---

## Phase 4 — Blog

### 4.1 Index
- [ ] Editorial list: date + title + 1-line excerpt
- [ ] Tag chips in block-print style

### 4.2 Post template
- [ ] Wide reading column (~70ch)
- [ ] Drop-cap on first paragraph
- [ ] `PullQuote` in rose-madder
- [ ] Footnote support
- [ ] Reading time estimate

### 4.3 Feeds
- [ ] `/rss.xml` route
- [ ] `/sitemap.xml` route includes blog posts

---

## Phase 5 — About + Contact

### 5.1 About
- [ ] Two-column layout: portrait (kantha frame) + bio
- [ ] Stitched vertical timeline with marigold knots at milestones
- [ ] "Currently" block (manually editable in MDX)
- [ ] Optional press / features section

### 5.2 Contact page
- [ ] Short note + form (name, email, subject, message)
- [ ] Form validation (zod + react-hook-form)
- [ ] Direct contact links (email, Instagram, Behance, LinkedIn)

### 5.3 Contact API
- [ ] `app/api/contact/route.ts`
- [ ] Resend integration; verify domain or use Resend onboarding domain initially
- [ ] Honeypot field
- [ ] Rate limit (IP-based, e.g. Upstash Ratelimit or in-memory for MVP)
- [ ] Success animation: stitched envelope closes
- [ ] Error state with retry

---

## Phase 6 — Quirk Pass

- [ ] Choose mascot (peacock / elephant / tailor's mannequin) and illustrate
- [ ] Mascot idle animation + click reaction
- [ ] Cursor effect: needle-and-thread trail (desktop only, reduced-motion off)
- [ ] Scribbled arrows on inter-page transition links
- [ ] Section headers stitch themselves on scroll-in
- [ ] **Audit**: each quirk earns its place. Cut anything distracting.

---

## Phase 7 — Polish & Launch

### 7.1 SEO + metadata
- [ ] Per-page `<title>`, `<meta description>`, OG, Twitter card
- [ ] `robots.txt`
- [ ] `sitemap.xml`
- [ ] Person + CreativeWork structured data
- [ ] Favicon set (16, 32, 180, 512) + manifest

### 7.2 Performance
- [ ] LCP < 2.0s on 4G (test via WebPageTest)
- [ ] CLS < 0.05
- [ ] AVIF + WebP via `next/image`
- [ ] Code-split Lenis / Framer where not needed
- [ ] Font preload only display face

### 7.3 Accessibility
- [ ] All color pairs ≥ AA (axe + manual)
- [ ] Reduced-motion fallback verified on every animation
- [ ] Focus rings visible (marigold-deep)
- [ ] All images have descriptive alt
- [ ] Keyboard nav: gallery, filters, contact, mobile menu

### 7.4 Error pages
- [ ] Custom 404 ("thread came loose" stitched illustration)
- [ ] Custom 500

### 7.5 Analytics
- [ ] Plausible or Vercel Analytics installed
- [ ] Verify no cookie banner needed

### 7.6 Pre-launch QA
- [ ] iOS Safari, Android Chrome, desktop Safari, Firefox, Chrome
- [ ] Test on real devices, not just emulators
- [ ] Contact form end-to-end test (real email delivered)
- [ ] Broken-link scan
- [ ] Spell check across all MDX content

### 7.7 Launch
- [ ] Buy domain (if not done)
- [ ] Configure DNS on Vercel
- [ ] Configure Resend domain DNS (SPF, DKIM)
- [ ] Production smoke test
- [ ] Announce

---

## Open Questions (block Phase 1)

- [!] Logo / custom wordmark, or Fraunces-set name?
- [!] Bilingual? Devanagari for name or tagline?
- [!] Shop / commerce now or later?
- [!] Newsletter signup on blog?
- [!] Which two craft references anchor the visual language? (Recommend: block print + kantha)

---

## Content Checklist (from her)

- [ ] 8–12 hero-quality images per project (raw, uncropped)
- [ ] Project metadata per project (title, year, role, materials, collaborators, 100-word blurb)
- [ ] Portrait photo (square + landscape crops)
- [ ] Bio: short (50 words) + long (200 words)
- [ ] CV PDF (optional)
- [ ] Logo / wordmark direction
- [ ] Social handles (Instagram, Behance, LinkedIn, email)

---

## Backlog (post-launch)

- [ ] CMS UI layer (Sanity or Tina) over existing MDX
- [ ] Commerce (Shopify Hydrogen or Stripe checkout)
- [ ] Newsletter (Buttondown or Resend Broadcasts)
- [ ] Press kit page
- [ ] Multi-language (i18n routing)
