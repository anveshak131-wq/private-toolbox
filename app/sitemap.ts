import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://private-toolbox.pages.dev";

  const routes = [
    "",
    "/image-compressor",
    "/pdf-merger",
    "/image-to-pdf",
    "/image-resizer",
    "/qr-generator",
    "/privacy-redactor",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}