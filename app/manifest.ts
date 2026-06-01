import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Bubu",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F6EFE2",
    theme_color: "#1F2A56",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
