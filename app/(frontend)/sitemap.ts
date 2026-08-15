import type { MetadataRoute } from "next";
import { getByNumber } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/archive", "/practice", "/press", "/contact"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projects = (await getByNumber()).map((p) => ({
    url: `${base}/projects/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...pages, ...projects];
}
