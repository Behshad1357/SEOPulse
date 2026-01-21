import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://seopulse.digital";

  // Static pages
  const staticPages = [
    "",
    "/pricing",
    "/login",
    "/signup",
    "/about",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
    "/unsubscribe",
  ];

  // Blog posts
  const blogPosts = [
    "/blog/what-is-google-search-console",
    "/blog/improve-click-through-rate",
    "/blog/ai-seo-tools-2026",
    "/blog/small-business-seo-guide",
  ];

  const allPages = [...staticPages, ...blogPosts];

  return allPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/pricing" ? 0.9 : path.startsWith("/blog") ? 0.8 : 0.7,
  }));
}