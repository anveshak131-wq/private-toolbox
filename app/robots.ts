import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/vault-*", "/api/"],
    },
    sitemap: "https://private-toolbox.pages.dev/sitemap.xml",
  };
}