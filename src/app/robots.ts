import type { MetadataRoute } from "next";
import { siteFacts } from "@/content/site-facts";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: `${siteFacts.siteUrl}/sitemap.xml`, host: siteFacts.siteUrl };
}
