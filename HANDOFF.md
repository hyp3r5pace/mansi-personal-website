# HANDOFF — Mansi Pandey portfolio

Context for any agent picking up this project. Read `AGENTS.md` too (it warns:
this is Next.js **16** with breaking changes — read `node_modules/next/dist/docs/`
before writing Next code; `middleware` is deprecated → `proxy`).

## What it is
Personal portfolio for **Mansi Pandey**, fashion & textile designer (New Delhi).
Static, content-driven, image-led. Sections: Home, Projects (case studies),
About, Contact. Blog exists but is **hidden** (feature-flagged off).

## Stack & architecture
- **Next.js 16 App Router** (Turbopack), **Tailwind v4**, TypeScript, `motion`.
- Content = **MDX files in git** (no CMS/DB). Loaded at build by `lib/mdx.ts`
  (`getAllProjects`/`getAllPosts`, `gray-matter` + zod schemas). Bodies render
  via `next-mdx-remote`.
- Deployed on **Vercel**; every push to `main` auto-deploys.

## Facts
- Local dir: `/Users/creativether/bubu-personal-website` (folder name is stale;
  repo/site are "mansi"). 
- GitHub: **hyp3r5pace/mansi-personal-website** (`origin`).
- Vercel project: **bubu-personal-website** (team `hyp3r5paces-projects`),
  domain **mansi.work** (live, SSL) + `bubu-personal-website.vercel.app`.
- Vercel CLI is linked + authed locally (`vercel … --scope hyp3r5paces-projects`).
  Vercel MCP plugin available (read-only: deploys/logs/projects; **no env write**).

## Central config — `lib/site.ts`
Single source of truth: `SITE` (name, url, role, email, socials[], location,
seo), `COPY` (per-page/section text), derived `TITLE_*`/`SITE_DOMAIN`, and
**`FEATURES = { blog: false }`**. Rebrand/retune here — components don't hardcode.
Socials are real (Instagram @ansh_kinsu, Behance mansipandey3, LinkedIn).

## Content model
- **Projects**: `content/projects/*.mdx` → `ProjectFrontmatterSchema` (`lib/mdx.ts`).
  Key fields: `title, slug, date, year, category` (enum: Couture | Ready-to-wear
  | Textile | Collaboration), `role, materials, collaborators, cover,
  coverImage{src,width,height}, palette[{name,hex}], tags, featured, excerpt,
  lookbook[{src,alt,width,height,caption?,layout?}]`. Images in
  `public/projects/<slug>/`.
  - Rendering: `CaseStudyCover` (real cover or palette placeholder),
    `ProjectGallery` (auto-rhythm: ratio≥2.2→full-bleed, portraits→paired,
    else contained; **lightbox** w/ keyboard+swipe), palette/meta/next-project.
  - 10 projects, **ordered by `date` = real Behance posting date** (desc).
    `year` is set to the **posting year** so labels match order (titles may
    still say a different collection year). `featured: true` → home (maku,
    banjaran).
- **Blog**: `content/blog/*.mdx`, `BlogFrontmatterSchema` (`draft` field hides
  posts). **Hidden** via `FEATURES.blog`: nav link, home `JournalTeaser`,
  footer RSS, `/blog`+`/blog/[slug]` (404), blog OG images, sitemap, `/rss.xml`,
  layout RSS alternate all gate on it. Flip to `true` to restore everything.
- **About**: `content/about.mdx`. Real portrait at `public/about/mansi.jpg`
  (`KanthaPortrait`, q90). Bio/timeline/`currently` now hold her **real**
  info (sourced from LinkedIn/Behance, Jun 5): fashion & textile designer,
  New Delhi; B.Des Fashion Design from **NIFT** (2018–22, couture/styling);
  career: **MAKU Textiles** (Kolkata, 2022–24) → **péro** (New Delhi,
  2024–26) → **Lead Fashion Designer at Dressfolk** (dressfolk.com, Mar 2026–
  now, handloom label); grad collection = B.R.A.T. `press: []`
  (none real → section hidden). Site email + `author` in `lib/site.ts` also
  set to real (`hello@mansi.work`, "Mansi Pandey"). ⚠ LinkedIn itself blocks
  scrapers (HTTP 999) — use WebSearch + Behance (public) to source her facts.
- **Home hero image**: real photo at `public/home/home_page.jpg` (1200×1600
  portrait, EXIF orientation already normal — no strip needed), wired into
  `components/home/Hero.tsx` via `next/image` (q90, `priority`), replacing the
  `EditorialPlaceholder`. It's a process shot (Mansi at her design wall). The
  home **AboutTeaser** square + the **About** page already have her; hero =
  the work. `EditorialPlaceholder` still used by AboutTeaser.

## Projects index UI (gotchas baked in)
- **Row-major CSS grid**, uniform `aspect-[4/5]` tiles (`ProjectsGrid`). Do NOT
  use CSS multi-column masonry — it fills column-major and scrambles the visible
  date order.
- Tag filter (`FilterChips`): multi-select, **AND** within+across groups,
  URL-synced (`?tag=`). Tags are frequency-ordered; shows top 8 + a **"+N more"
  dropdown** (42 tags otherwise swamp the page).
- `next/image` quality **90** for project/cover imagery; allowlisted in
  `next.config.ts` `images.qualities: [75, 90]`.

## RECURRING TASK — import a Behance project (do it like the existing 10)
1. `curl -sSL -A "<browser UA>" <behance-url> -o /tmp/x.html` — **`-L` is
   mandatory** (some image variants 302-redirect; without `-L` you get empty
   files).
2. Extract module image filenames in document order; dedup by first appearance
   (= gallery order; the only thing ahead is og:image/preload = the cover).
3. **Highest-res variant per image**, priority: `max_3840_webp > 2800_webp >
   max_1200_webp > fs_webp > 1400_webp > hd_webp > disp`. Note: `fs_webp` is
   NOT always largest; `hd_webp` is often tiny (720px); `disp` is the original
   but sometimes smaller. Download → detect type with `file` → rename
   `NN.{webp|jpg|png}` into `public/projects/<slug>/`.
4. **Text modules** (captions under images): server-rendered in the HTML as
   `font-size:<n>px;">TEXT` divs (NOT a `type:"text"` JSON). Extract them +
   their **byte offsets**, sort against image offsets, attach each as a
   `caption` to the image it describes. Use them — they're her words.
5. **Publish date**: `WebFetch` the page for "publication date" (not reliably in
   raw HTML). Set `date` + `year` to it.
6. **Cover pick**: a crop-friendly ~1.4 landscape. Avoid ultra-wide strips
   (sliver/blur in tiles) and low-res. All-portrait decks: cover band-crops in
   the 21/9 hero but the grid tile is fine.
7. Write `content/projects/<slug>.mdx` (schema above) with `coverImage` (real
   dims via `sips`), `lookbook` entries (real dims), her intro/captions.
   `npm run build` (validates frontmatter), commit, push.
8. Palette + generic alt text are usually **eyeballed/placeholder** — flag them.

## Live integrations (Vercel prod env — all set)
- `NEXT_PUBLIC_SITE_URL=https://mansi.work`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
  (916000864688 → wa.me button).
- Contact form (`components/contact/ContactForm.tsx` → `app/api/contact/route.ts`):
  honeypot + **Turnstile (optional — skips if no secret)** + 3/hr/IP rate-limit
  + **Resend**. Delivers to `pandeymansi990@gmail.com` from `hello@mansi.work`
  (domain verified in Resend). Env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
  ⚠ Resend key was pasted in chat once — consider rotating.

## Parked / not on main
- **`feat/behance-ingestion`** branch = a full owner-only **admin** (iron-session
  password auth, GitHub-commit, Vercel Blob, Claude-vision drafting, `/admin/ingest`
  UI). Built, tested, then **removed from main** (env cleaned). Reusable
  foundation for a future blog editor. A plan for that blog editor (and this
  hide-blog work) lives in `~/.claude/plans/`.

## Gotchas & things that failed (don't relearn these)
- **Shell**: shell is **zsh** — `mapfile` doesn't exist; `for x in *.webp` errors
  on no-match (use `for x in *`); `du` is aliased to `dust` (use `stat`/`ls`).
  Long download loops **backgrounded by the harness sometimes don't persist
  writes** (race) — run foreground or re-verify file counts.
- **EXIF orientation**: phone photos / `sips -r` leave an orientation tag (e.g.
  6) → browsers rotate the image even when pixels are upright; the image viewer
  ignores EXIF so it *looks* fine to the agent. Fix = strip EXIF (Pillow). pip is
  PEP-668 blocked → `python3 -m venv /tmp/x && /tmp/x/bin/pip install Pillow`.
- **`vercel env add`**: piping with `printf '%s'` (no newline) stored **empty**
  for some vars — use `echo "value" | vercel env add NAME production`.
  `vercel env pull` shows `""` for sensitive vars (can't read back) — verify via
  live behavior, not the pull.
- **`NEXT_PUBLIC_*` bake at build** — must redeploy after changing them.
- **Vercel "Add Project"** kept scaffolding NEW empty repos from a template
  instead of importing the existing repo. Use **import existing repo** (or
  `vercel link` + `vercel git connect`); the Vercel GitHub App must have access
  to the (private) repo.
- **Resend** test sender `onboarding@resend.dev` only delivers to your own signup
  email; arbitrary recipients require a **verified domain**.

## Build / verify
- `npm run build` (also validates all MDX frontmatter — a bad file fails the
  build, which is the safety gate). `npx eslint <files>` / `npx tsc --noEmit`.
- Commits end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
  Push `main` → auto-deploy. Verify prod via Vercel MCP `list_deployments` or
  `curl https://mansi.work/...`.
