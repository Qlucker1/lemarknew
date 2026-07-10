import type { MetadataRoute } from "next";
import { siteFacts } from "@/content/site-facts";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteFacts.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
