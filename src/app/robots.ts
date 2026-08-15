import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Was a static robots.txt with the apex domain hardcoded; generating it keeps
// the host in step with SITE_URL.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
