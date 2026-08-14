import type { Metadata } from "next";
import { EB_Garamond, Jost, Spline_Sans_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

// Three voices, self-hosted by next/font so there is no third-party request
// and no layout shift. Production may swap these for licensed futura-pt and
// Adobe Garamond Pro under the practice's own account; the CSS variables are
// the only contract.
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const mono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
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
