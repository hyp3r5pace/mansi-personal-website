import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const TITLE_DEFAULT = "Bubu — Fashion Designer";
const DESCRIPTION =
  "Textile-led fashion designer working between Bengaluru, Bagru, and Sanganer. Block print, kantha, natural dye, and considered everyday wear.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE_DEFAULT,
    template: "%s · Bubu",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  keywords: [
    "fashion designer",
    "natural dye",
    "block print",
    "kantha",
    "Indian craft",
    "textile",
    "Bengaluru",
    "Jaipur",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    locale: "en_IN",
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "Journal RSS" }],
    },
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bubu",
  url: SITE.url,
  jobTitle: "Fashion Designer",
  description: DESCRIPTION,
  sameAs: [
    "https://instagram.com/",
    "https://behance.net/",
    "https://linkedin.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="paper-grain bg-paper text-char-ink flex min-h-full flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
