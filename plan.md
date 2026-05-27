# Portfolio Website — Fashion Designer (Indian Craft Aesthetic)

A deep implementation plan for a personal portfolio site that is colorful, elegant, quirky, and rooted in Indian craft visual language — without sliding into kitsch. The site will function as a working designer's portfolio, not a decorative microsite, so navigation, performance, and content management matter as much as the aesthetic.

---

## 1. Design Philosophy

### 1.1 Tone

- **Primary**: elegant, considered, editorial. Treat the site like a printed lookbook with motion.
- **Secondary**: playful, hand-made, slightly imperfect. Quirk should feel like a designer's hand, not a developer's CSS trick.
- **Anti-pattern**: avoid Bollywood-poster maximalism, mandala overlays, or stock "ethnic" graphics. The Indian craft reference is structural (block-print grids, kantha stitching, jali lattice symmetry, miniature painting palette), not surface-level decoration.

### 1.2 Indian craft references to draw from

| Craft | Visual element to translate |
|---|---|
| Block printing (Bagru, Sanganer) | Repeating motif borders, slightly mis-registered overlays, textured fills |
| Kantha embroidery | Hand-drawn dashed strokes, irregular line work as dividers |
| Phulkari | Geometric grid of color blocks, diagonal symmetry |
| Madhubani / Pichwai | Border framing, illustrated mascot or section ornaments |
| Jali (lattice screens) | Section dividers as cut-out patterns, hover reveal masks |
| Bandhani | Dotted texture as background grain |
| Indigo / natural dye | Color washes, gradient backgrounds with paper texture |

Pick **two or three**, not all. Strong identity comes from restraint.

### 1.3 Quirk budget

Quirky elements must be **earned** and **rare**. Rule of thumb: one delightful surprise per scroll-screen, max. Candidates:
- Cursor as a needle-and-thread trail on desktop.
- Section headers that "stitch" themselves on scroll-in.
- A scribbled hand-drawn arrow that points to the next project.
- A small illustrated mascot (peacock, elephant, or a stylized tailor's mannequin) that idles in a corner and reacts to clicks.
- Image hover: a "fabric swatch" peel-back reveal.

If a feature does not pass the test *"would a print art director approve?"*, cut it.

---

## 2. Color System

A complementary palette built around **deep indigo + warm marigold**, balanced with neutrals drawn from raw cotton and aged paper. This pair is historically grounded (indigo dyeing + marigold/turmeric dyeing are both core Indian textile traditions) and is a true complementary pair on the color wheel.

### 2.1 Tokens

```
--ink-indigo:      #1F2A56   /* primary text, deep backgrounds */
--indigo-deep:     #14193A   /* darkest, used sparingly */
--indigo-soft:     #3A4A8A   /* secondary text on light bg */

--marigold:        #E8A33D   /* primary accent, CTAs */
--marigold-deep:   #C97A1A   /* hover, active states */
--saffron:         #F2C36B   /* tertiary accent, highlights */

--rose-madder:     #B5495B   /* second accent, used for tags / quirks */
--leaf-green:      #6B8E4E   /* third accent, used sparingly for blog tags */

--paper:           #F6EFE2   /* primary background, warm off-white */
--paper-deep:      #ECE2CE   /* card backgrounds */
--cotton:          #FAF6EC   /* lightest surface */
--char-ink:        #2A2620   /* body text on paper, never pure black */
```

### 2.2 Pairing rules

- Body text: `--char-ink` on `--paper`. Never pure black on pure white.
- Primary CTA: `--marigold` background, `--ink-indigo` text.
- Headings: `--ink-indigo` on `--paper`, or `--saffron` on `--indigo-deep`.
- Accents (`--rose-madder`, `--leaf-green`) appear only in tags, link underlines, and the mascot — never as section backgrounds.
- Dark mode: invert to `--indigo-deep` background, `--paper` text, marigold remains the CTA.

### 2.3 Texture layer

Every large surface gets a subtle paper-grain noise overlay (SVG turbulence or a small PNG tile at ~4% opacity). This is what stops the palette from looking like a flat tech-startup site.

---

## 3. Typography

A three-typeface system. Pair a high-contrast display serif with a humanist sans and a single handwritten accent face.

| Role | Typeface | Notes |
|---|---|---|
| Display / Hero | **Fraunces** (variable) or **DM Serif Display** | Italic optical sizes for editorial feel |
| Body / UI | **Inter** or **General Sans** | Workhorse; 16px base, 1.6 line-height |
| Accent / Handwritten | **Caveat** or a custom SVG word-mark | Used only for pull quotes, scribbled annotations |
| Optional: a Devanagari display face | **Yatra One** or **Mukta Mahee** | For her name or a tagline if she wants a transliteration |

Rules: max two weights per face on screen; use italic, not bold, for emphasis in body copy (editorial cue).

---

## 4. Information Architecture

```
/                       Home
/projects               Projects index
/projects/[slug]        Project case study
/blog                   Blog index
/blog/[slug]            Blog post
/about                  About me
/contact                Contact
```

Global nav: a thin top bar with the wordmark on the left, five links on the right. On mobile, collapses into a hamburger that opens a full-screen panel with a jali-lattice cut-out backdrop.

Footer: social icons (Instagram, Behance, LinkedIn, email), a tiny credit line, a back-to-top stitched-line button.

---

## 5. Page Specifications

### 5.1 Home

Goal: in 5 seconds, communicate *who she is*, *what she makes*, and *that this site is worth scrolling*.

**Sections, top to bottom:**

1. **Hero**
   - Left: her name in display serif, a one-line tagline ("Textile-led fashion designer. Jaipur → Delhi."), a marigold CTA "See the work".
   - Right: a single hero image — a hand on fabric, or a draped form — with a block-print border frame. On load, the border draws itself (SVG stroke animation).
   - Background: paper texture with a faint jali pattern bleeding from the right edge.

2. **Featured projects** (3 tiles)
   - Asymmetric grid: one large tile, two stacked smaller tiles.
   - Each tile: image + project title + a small "swatch row" of the project's color palette.
   - Hover: the image lifts slightly, a marigold underline draws under the title, and the swatch row animates.

3. **About teaser**
   - A short paragraph + a portrait photo with a hand-drawn frame (SVG, kantha-stitch style).
   - Link: "More about me →" with a scribbled arrow.

4. **Latest from the journal** (3 blog cards, horizontal)
   - Small cards: cover image, date in handwritten accent, title in serif.

5. **Contact strip**
   - A full-width band in `--indigo-deep` with marigold text: "Let's make something." + email + Instagram link.

### 5.2 Projects index

- Filter chips at the top: by category (Couture, Ready-to-wear, Textile, Collaboration) and by year.
- Masonry grid (CSS columns or a JS layout lib only if needed). Each card: cover, title, year, two-word category tag.
- Hover: swatch peel-back reveal showing a secondary detail image.
- Empty/loading state: a stitched skeleton (animated dashed border).

### 5.3 Project case study (`/projects/[slug]`)

Structure mirrors a printed lookbook spread:

1. **Cover**: full-bleed hero image, project title overlaid in serif.
2. **Meta strip**: year, role, materials, collaborators.
3. **Concept**: one short paragraph + a "mood board" gallery (4–6 images in a free-form grid).
4. **Process**: alternating text/image rows, sketches and fabric swatches included.
5. **Final pieces**: large editorial images, one or two per row.
6. **Color & material palette**: a row of named swatches.
7. **Next project**: card link with the scribbled arrow.

Content authored in **MDX** so she can embed images and the occasional custom component (swatch row, materials list) inline.

### 5.4 Blog

- Index: list of posts, each row = date + title + 1-line excerpt. Editorial, not card-heavy.
- Post: long-form MDX with a wide reading column (~70ch), drop-cap on first paragraph, pull-quote component in `--rose-madder`, footnote support.
- Tags shown as small block-print-style chips.

### 5.5 About me

- A two-column layout: portrait on the left in a kantha-stitched frame, bio on the right.
- Below: a timeline (education, residencies, exhibitions) drawn as a stitched vertical line with marigold knots at each milestone.
- A "Currently" block — what she's working on, listening to, reading. Updated manually, gives the site a heartbeat.
- A press / features section if relevant.

### 5.6 Contact

- A short note ("Best way to reach me is email. I reply within a week.").
- Form: name, email, subject, message. Submits to a serverless endpoint that emails her via Resend.
- Honeypot field + rate-limit on the API route.
- Success state: a hand-drawn stitched envelope animates closed.
- Direct links: email, Instagram, Behance, LinkedIn.

---

## 6. Technical Stack

### 6.1 Framework

**Next.js 15 (App Router) + TypeScript**.
- Static generation for all content pages (`generateStaticParams` on `[slug]` routes).
- Server actions for the contact form.
- Image optimization via `next/image` with remote patterns for the CMS host.

### 6.2 Styling

**Tailwind CSS v4** with a custom theme that exposes the color tokens above as Tailwind colors and the typefaces as `font-display`, `font-body`, `font-accent`.

Component primitives via **shadcn/ui**, restyled aggressively — out-of-the-box shadcn looks generic; everything gets re-skinned to match the palette and typography.

### 6.3 Content

**MDX + a file-based content layer** (Contentlayer 2 or a thin custom loader using `next-mdx-remote`).

- `/content/projects/*.mdx`
- `/content/blog/*.mdx`
- Frontmatter: title, slug, date, cover, gallery, palette, tags, category, year.

This avoids the cost and lock-in of a hosted CMS for a single-author site. If she wants a UI later, layer **Sanity** or **Tina** on top — content stays in MDX.

### 6.4 Motion

**Framer Motion** for component-level animation (page transitions, hover states, stitch-draw effects).
**Lenis** for smooth scroll (subtle, not aggressive).
SVG path drawing for the stitched borders (`stroke-dasharray` + `stroke-dashoffset`).

Respect `prefers-reduced-motion` everywhere — animation falls back to opacity fades.

### 6.5 Forms & email

**Resend** for transactional email from the contact form. Free tier covers this use case.

### 6.6 Hosting

**Vercel**. Auto-deploys from `main`. Preview deploys for every PR so she can review before publishing.

### 6.7 Analytics

**Plausible** or **Vercel Analytics**. No cookies, no banner needed.

---

## 7. Project Structure

```
bubu-personal-website/
├── app/
│   ├── (site)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Home
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── api/contact/route.ts
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn primitives, restyled
│   ├── layout/                      # Nav, Footer, PageFrame
│   ├── motion/                      # StitchBorder, JaliReveal, ScribbleArrow
│   ├── content/                     # SwatchRow, MaterialList, PullQuote, MoodBoard
│   └── mascot/                      # Idle peacock SVG + interactions
├── content/
│   ├── projects/*.mdx
│   └── blog/*.mdx
├── lib/
│   ├── mdx.ts                       # loader + frontmatter parsing
│   ├── palette.ts                   # palette token helpers
│   └── seo.ts
├── public/
│   ├── textures/paper-grain.png
│   ├── patterns/jali.svg
│   ├── patterns/block-print-border.svg
│   └── fonts/...
└── styles/tokens.css
```

---

## 8. Implementation Phases

### Phase 0 — Foundations (1–2 days)
- Init Next.js 15 + TypeScript + Tailwind v4.
- Wire color tokens, typefaces, paper-grain texture.
- Set up MDX loader, content folder, sample project + blog post.
- Deploy "hello world" to Vercel.

### Phase 1 — Layout shell (2 days)
- Build `Nav`, `Footer`, `PageFrame`.
- Implement the stitched-border SVG primitive and the jali-reveal component as reusable.
- Mobile nav with the full-screen jali panel.

### Phase 2 — Home (2–3 days)
- Hero with SVG-drawn block-print border.
- Featured projects grid (data from MDX frontmatter, sorted by `featured: true`).
- About teaser, blog teaser, contact strip.
- Polish hover/scroll motion. Verify reduced-motion fallback.

### Phase 3 — Projects (3 days)
- Index page with filter chips.
- Case-study template with all section blocks as MDX components.
- Author 2–3 real case studies with her so the design is pressure-tested against real content, not lorem ipsum.

### Phase 4 — Blog (1–2 days)
- Index and post template.
- Pull-quote, drop-cap, footnote components.
- RSS feed at `/rss.xml`.

### Phase 5 — About + Contact (2 days)
- About page with the stitched timeline.
- Contact form + Resend integration + rate limit + honeypot.
- Success animation.

### Phase 6 — Quirk pass (1–2 days)
- Add the mascot, choose one cursor effect, add scribbled arrows on transition links.
- Audit: is each quirk earning its place? Cut anything that distracts.

### Phase 7 — Polish & launch (2 days)
- Lighthouse pass: target 95+ on Performance, Accessibility, Best Practices, SEO.
- OG images: generate per-page via `@vercel/og` using the palette.
- Sitemap, robots, structured data (Person + CreativeWork).
- 404 and 500 pages in-style (stitched "thread came loose" illustration).
- Cross-browser + real-device check (iOS Safari is the usual culprit).

Total: roughly **2.5–3 weeks** of focused work.

---

## 9. Accessibility

- All color pairs pass WCAG AA (the indigo + marigold pair clears AA Large; body text is `--char-ink` on `--paper` which clears AAA).
- Every animation gated on `prefers-reduced-motion`.
- Focus rings are visible and use `--marigold-deep` so they fit the palette.
- All images have descriptive alt text — for a designer's portfolio this is both an a11y requirement and a craft signal.
- Keyboard nav tested for the gallery, filters, and contact form.

---

## 10. Performance Targets

- LCP < 2.0s on 4G.
- CLS < 0.05.
- All hero / cover images served as AVIF with WebP fallback via `next/image`.
- Fonts: `next/font` with `display: swap`, preload only the display face.
- SVG patterns are inlined when small, referenced when large.
- Lenis and Framer Motion code-split off the home route where possible.

---

## 11. Content & Asset Checklist (for her)

Before Phase 2 starts, collect:
- 8–12 hero-quality images per project (raw, uncropped).
- Project metadata: title, year, role, materials, collaborators, 100-word concept blurb.
- Portrait photo (square + landscape crops).
- Bio: short (50 words), long (200 words).
- Resume / CV PDF if she wants it linked.
- Logo or wordmark (we can sketch a custom serif-italic wordmark in week one).
- Social handles.

The site's quality is bounded by the photography. If any project's images are weak, reshoot or hold the project from the index.

---

## 12. Open Questions

1. Does she want a logo / wordmark, or is her name set in Fraunces enough?
2. Bilingual? Devanagari for her name or any taglines?
3. Shop / commerce now or later? (Plan above assumes "later"; Shopify Hydrogen or a Stripe-checkout MVP can bolt on.)
4. Newsletter signup on the blog?
5. Which two craft references from §1.2 should anchor the visual language? (Recommend: **block print** + **kantha**.)

Resolve these before Phase 1.
