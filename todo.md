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
- [x] Layout: name + tagline + CTA on left, framed image right
- [x] SVG block-print border (`HeroBorder`) with `pathLength` draw-in on mount
- [x] Background jali bleed from right edge
- [x] Marigold CTA "See the work" → `/projects` with scribble arrow

### 2.2 Featured projects
- [x] Read MDX projects, filter `featured: true`, sort by date
- [x] Asymmetric grid: 1 large + 2 stacked (scales gracefully for N=1,2)
- [x] Tile: cover + category/year + title + palette swatch row
- [x] Hover: lift + marigold underline grow + swatch scale
- [x] 2 additional sample projects added (`bandhani-monsoon`, `jamdani-quietude`)

### 2.3 About teaser
- [x] Portrait placeholder in `StitchBorder` (kantha-stitch frame)
- [x] Short paragraph + "More about me →" with scribbled arrow

### 2.4 Latest journal
- [x] Pull 3 most recent posts from MDX
- [x] 3-column card row: date in Caveat, title in serif, excerpt clamp-2

### 2.5 Contact strip
- [x] Full-width indigo band with marigold text + jali bleed left
- [x] CTA + Instagram link, hover states

### 2.6 QA
- [x] Reduced-motion fallback in HeroBorder, Reveal, PageTransition, Nav, SmoothScroll
- [ ] Lighthouse pass on home (>90 each category) _(blocked: needs deployed URL or local serve)_
- [ ] iOS Safari + Android Chrome check _(blocked: real-device testing)_

### 2.7 Notes
- Real photos not yet supplied → `EditorialPlaceholder` renders palette-band SVG covers from MDX `palette` frontmatter. Swaps to real images once `/public/projects/<slug>/cover.jpg` arrives (cover string already pointing there).
- `Reveal` component (`whileInView`) added in `components/motion/Reveal.tsx` for scroll-triggered fade-in.

---

## Phase 3 — Projects

### 3.1 Index page
- [x] Filter chips: category + year (`FilterChips` client component)
- [x] URL-synced filter state via `useSearchParams` + `router.replace`
- [x] Page kept static — `ProjectsBrowser` filters client-side off URL
- [x] Masonry grid (CSS columns, 1/2/3 cols by breakpoint), aspect ratios rotate
- [x] Empty-filter "nothing here" state
- [x] `SkeletonTile` (dashed border + sweep) for future Suspense fallbacks
- [ ] Hover: fabric-swatch peel-back reveal to secondary image _(deferred: needs real secondary photos)_

### 3.2 Case study template (`[slug]/page.tsx`)
- [x] `CaseStudyCover`: full-bleed editorial cover + serif title overlay + jali bleed
- [x] `MetaStrip`: year, role, materials, collaborators
- [x] Concept body via MDX
- [x] Mood board section (frontmatter-driven `moodBoard` array)
- [x] Process: alternating text/image rows (frontmatter-driven `processRows`)
- [x] `PaletteSection`: named swatch row
- [x] `NextProject` card with scribble arrow
- [x] `not-found.tsx`
- [x] `generateStaticParams` + `generateMetadata`

### 3.3 Content components
- [x] `PullQuote` (MDX-embeddable, prose-only attrs)
- [x] `MaterialList` (page-level, fed by frontmatter)
- [x] `MoodBoard` (page-level, handles missing src via `EditorialPlaceholder`)
- [x] `ProcessRow` (page-level, alternating)
- [x] `SwatchRow` (page-level)
- [x] `MdxRenderer`: element overrides + PullQuote only

### 3.4 Real content
- [ ] Author 2–3 real case studies with her _(blocked: needs her input + photos)_
- [ ] Pressure-test against real photos _(blocked)_
- [ ] Reshoot or pull weak images _(blocked)_

### 3.5 SEO
- [x] `generateStaticParams` for all slugs
- [ ] Per-project OG image via `@vercel/og` _(deferred to Phase 7)_
- [ ] Structured data: `CreativeWork` _(deferred to Phase 7)_

### 3.6 Notes / Workarounds
- `next-mdx-remote@6` + Next 16 + Turbopack: complex JSX expression props
  in MDX bodies (arrays of objects, etc.) evaluate to undefined inside the
  RSC payload, crashing components at `.map`. Reproduced even with
  `<SwatchRow swatches={"x"} />`. Workaround: MDX scope restricted to
  prose + `PullQuote` (string + children only). Structured blocks
  (mood board, process rows, materials, palette) live in frontmatter
  and render at page level — this is also a cleaner authoring model.
- Filter UX uses client-side filtering off URL params so `/projects`
  stays statically prerendered.

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
