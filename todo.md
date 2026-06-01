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

## Phase 4 — Blog ✅

### 4.1 Index
- [x] Editorial list: date + title + 1-line excerpt
- [x] Tag chips in block-print style

### 4.2 Post template
- [x] Wide reading column (~70ch)
- [x] Drop-cap on first paragraph
- [x] `PullQuote` in rose-madder
- [x] Footnote support (remark-gfm)
- [x] Reading time estimate

### 4.3 Feeds
- [x] `/rss.xml` route
- [x] `/sitemap.xml` route includes blog posts

---

## Phase 5 — About + Contact ✅

### 5.1 About
- [x] Two-column layout: portrait (kantha frame) + bio
- [x] Stitched vertical timeline with marigold knots at milestones
- [x] "Currently" block (manually editable in MDX)
- [x] Optional press / features section

### 5.2 Contact page
- [x] Short note + form (name, email, subject, message)
- [x] Form validation (zod + react-hook-form)
- [x] Direct contact links (email, Instagram, Behance, LinkedIn)

### 5.3 Contact API
- [x] `app/api/contact/route.ts`
- [x] Resend integration; verify domain or use Resend onboarding domain initially
- [x] Honeypot field
- [x] Rate limit (IP-based, e.g. Upstash Ratelimit or in-memory for MVP)
- [x] Success animation: stitched envelope closes
- [x] Error state with retry

---

## Phase 6 — Quirk Pass ✅

- [x] Mascot: peacock SVG, idle wing sway, click bow + sparkle, bottom-right, md+ only, hidden under reduced-motion
- [x] Cursor: needle-and-thread trail (canvas), fine pointer + non-reduced motion only
- [x] Scribbled arrows on transition links (already on home teasers, journal "all entries", case-study "next project", footer back-to-top)
- [x] Section heading stitches itself in (`StitchHeading`) — applied once on home "Recent projects" only
- [x] **Audit** — keeps/cuts:
  - **Kept**: Mascot (rare, corner, dismissible by ignoring), CursorThread (desktop only, doesn't block input, low-opacity), StitchHeading (used sparingly), ScribbleArrow (already restrained).
  - **Cut**: Did NOT sprinkle StitchHeading across every section header — that would push past the "one delightful surprise per scroll-screen" budget.
  - **Cut**: No fabric-swatch peel-back image hover yet — JaliReveal already handles section reveals; doubling up would compete.

---

## Phase 7 — Polish & Launch ✅ (implementation; human verification noted)

### 7.1 SEO + metadata
- [x] Per-page `<title>`, `<meta description>`, OG, Twitter card (root + project/blog [slug])
- [x] `robots.ts` (Next 16 file convention)
- [x] `sitemap.ts` (already shipped Phase 4; includes blog + projects)
- [x] Person (root) + CreativeWork (projects) + BlogPosting (posts) JSON-LD
- [x] `manifest.ts` (PWA manifest w/ palette theme + bg)
- [ ] Favicon set (16/32/180/512) — only default `favicon.ico` ships; replace when final mark is ready

### 7.2 Performance
- [x] `next/image` already used for content imagery (AVIF + WebP auto via next.config)
- [x] Font preload — only Fraunces (display) preloaded; Inter + Caveat `preload: false`
- [ ] LCP / CLS targets — needs WebPageTest / Lighthouse run on deployed URL
- [ ] Code-split Lenis / motion further if profiling shows them on critical path

### 7.3 Accessibility
- [x] Reduced-motion gating on every animated component (Mascot, CursorThread, StitchHeading, Nav, PageTransition)
- [x] Focus rings via global `:focus-visible` rule (marigold-deep)
- [x] All in-tree images have descriptive alt (portrait, project covers — placeholders descriptive)
- [ ] axe / manual audit on deployed build — needs browser run

### 7.4 Error pages
- [x] Custom 404 (`app/not-found.tsx`) — "That thread came loose" + LooseThread SVG
- [x] Custom 500 (`app/error.tsx`) — "A stitch dropped" + reset button + digest ref
- [x] LooseThread illustration component

### 7.5 Analytics
- [x] `@vercel/analytics` installed + mounted in root layout
- [x] No cookies set by Vercel Analytics — no banner required

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
