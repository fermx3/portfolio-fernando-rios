import { getFeaturedProjects } from "@/lib/content";
import { FeaturedProjectsClient } from "./featured-projects-client";

export async function FeaturedProjects({ locale = "en" }: { locale?: string }) {
  const projects = await getFeaturedProjects(locale);

  return <FeaturedProjectsClient projects={projects} />;
}
