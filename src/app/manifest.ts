import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "LEMARK — HPL полного цикла", short_name: "LEMARK", description: "Производство HPL-пластика полного цикла", start_url: "/", display: "standalone", background_color: "#090A0A", theme_color: "#E31E3A", lang: "ru", icons: [{ src: "/favicon.png", sizes: "any", type: "image/png" }] };
}
