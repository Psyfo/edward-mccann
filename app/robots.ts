import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export default function robots(): MetadataRoute.Robots {
  // Staging deployments should never be indexed; only the production host is
  // allowed, and it is identified by NEXT_PUBLIC_SITE_URL.
  const isProduction = base.includes("edwardmccann.studio");

  return {
    rules: isProduction
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
