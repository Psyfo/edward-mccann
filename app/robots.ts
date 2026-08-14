import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export default function robots(): MetadataRoute.Robots {
  // Fail safe: indexing is refused unless a deployment explicitly opts in.
  // A staging box that forgets to set anything stays out of search results,
  // which is the failure we want if we are going to have one.
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
