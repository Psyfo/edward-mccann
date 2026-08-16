import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

/*
 * Three voices, served from this repository.
 *
 * These were loaded with next/font/google, which fetches at build time and so
 * made every build depend on reaching Google; one CI build failed exactly that
 * way. The files are checked in by tools/fetch-fonts.mjs (SIL OFL, so
 * self-hosting is permitted), which also keeps only the weights the stylesheets
 * actually use.
 *
 * Production may swap these for licensed futura-pt and Adobe Garamond Pro under
 * the practice's own account. The CSS variables are the only contract.
 */
const jost = localFont({
  src: [
    { path: "../../public/fonts/jost-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/jost-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jost",
  display: "swap",
});

const garamond = localFont({
  src: [
    { path: "../../public/fonts/garamond-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/garamond-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-garamond",
  display: "swap",
});

const mono = localFont({
  src: [{ path: "../../public/fonts/mono-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Edward McCann Architecture",
    template: "%s — Edward McCann Architecture",
  },
  description:
    "Edward McCann Architecture is an RIBA Chartered and ARB registered practice in Hackney, East London. Houses, places to eat and drink, objects and public work.",
  openGraph: {
    type: "website",
    siteName: "Edward McCann Architecture",
    locale: "en_GB",
  },
  // No icons block here on purpose. Next serves icon.svg and apple-icon.png
  // from this folder at hashed URLs of its own choosing, and writes the link
  // tags to match. Naming them here instead pointed the browser at /icon.svg,
  // which is not a URL the build ever produces, so the favicon 404d.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${jost.variable} ${garamond.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
