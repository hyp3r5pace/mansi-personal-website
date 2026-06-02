This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuration

All user-facing text and identity live in **`lib/site.ts`** — edit there to
rebrand or retune the site without touching components.

### `SITE` — identity, brand, and contact

| Field | Purpose |
|-------|---------|
| `url` | Canonical site URL. Override per-env with `NEXT_PUBLIC_SITE_URL`. |
| `name` | Studio name for metadata, manifest, and feed titles (e.g. "Mansi — Studio"). |
| `shortName` | Compact brand name (manifest `short_name`, OG footer). |
| `wordmark` | Brand text in the nav + hero. |
| `author` | Person name for authorship / structured data. |
| `role` | Professional role; pairs with the name in page titles. |
| `description` | One-line description for meta + RSS. |
| `seoDescription` | Longer description for SEO meta + Person JSON-LD. |
| `keywords` | Meta keywords array. |
| `tagline` | Hero blurb under the wordmark. |
| `copyrightLine` | Footer copyright suffix (year is prepended). |
| `ogHeadline` / `ogSubhead` | Text on the home Open Graph image. |
| `location.eyebrow` | Short label shown as the hero eyebrow. |
| `location.line` | Full location sentence on the contact page. |
| `email` | Primary contact address (footer, contact page, mail fallback). |
| `socials[]` | External profiles: `{ label, handle, href }`. |
| `whatsappGreeting` | Message pre-filled into the WhatsApp chat link. |

Derived exports: `SITE_DOMAIN` (URL without protocol), `TITLE_DEFAULT`
(`"<author> — <role>"`), `TITLE_TEMPLATE` (`"%s · <shortName>"`).

### `COPY` — page and section copy

Grouped by where it appears. `eyebrow` = the small script label above a
heading; `intro` = the lede paragraph; `link` = a "view all" link label.

| Group | Keys |
|-------|------|
| `hero` | `ctaPrimary`, `ctaSecondary`, `caption`, `imageTitle` |
| `featured` | `eyebrow`, `heading`, `link` |
| `aboutTeaser` | `eyebrow`, `heading`, `body`, `link`, `imageTitle` |
| `journalTeaser` | `eyebrow`, `heading`, `link` |
| `footer` | `eyebrow` |
| `projectsPage` | `eyebrow`, `heading`, `intro` |
| `blogPage` | `eyebrow`, `heading`, `intro` |
| `contactPage` | `eyebrow`, `heading`, `intro`, `directHeading` |

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | optional | Production URL; defaults to `https://mansi.studio`. |
| `RESEND_API_KEY` | contact form | Resend key; without it the form returns 503. |
| `CONTACT_TO_EMAIL` | optional | Inbox for form mail; defaults to `SITE.email`. |
| `CONTACT_FROM_EMAIL` | optional | Verified sender; defaults to a Resend test sender. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | contact form | Cloudflare Turnstile public key. |
| `TURNSTILE_SECRET_KEY` | contact form | Turnstile secret (server-side verify). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional | E.164 digits, no `+`. Empty hides the WhatsApp button. |

> Page `<title>` and per-route meta `description` still live in each page's
> `metadata` export (`app/.../page.tsx`); everything else routes through
> `lib/site.ts`.

## Importing projects from Behance (Studio admin)

The site owner can import a Behance project without touching code, git, or the
terminal.

**Using it (owner):**
1. Go to **`/admin`** and sign in with the studio password.
2. Paste a Behance project link and press **Import**. The tool fetches the
   images at their highest resolution, and (if configured) drafts alt text,
   captions, a cover, and a colour palette.
3. On the **Review** screen, edit anything — title, web address, date,
   category, tags, colours, per-image alt/captions, reorder, choose the cover,
   hide decorative crops.
4. Press **Publish to site**. The project goes live in a minute or two.
5. **`/admin/projects`** lists everything with a **Remove** action.

**How it works:** images are stored in Vercel Blob; the project's small MDX
file is committed to the repo via the GitHub API, which triggers a redeploy.
The generated file is validated against the project schema before commit, so a
bad import can't break the site.

**Setup (one-time, developer):** set the admin variables in `.env.example`
(`ADMIN_PASSWORD`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`,
`BLOB_READ_WRITE_TOKEN`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`). The
draft import route can take ~30s for image-heavy projects, so its serverless
function needs `maxDuration` ≥ 60 (Vercel Pro). Without Blob/GitHub tokens the
importer falls back to writing into `public/` and `content/` locally — handy
for development.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
