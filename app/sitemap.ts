import type { MetadataRoute } from "next";
import { byNumber } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edwardmccann.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/archive", "/practice", "/press", "/contact"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projects = byNumber.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...pages, ...projects];
}
