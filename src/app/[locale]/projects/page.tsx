import { getAllProjects, getAllTags } from "@/lib/content";
import { ProjectsPageClient } from "./projects-client";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const projects = await getAllProjects(locale);
  const tags = await getAllTags(locale);

  return <ProjectsPageClient projects={projects} tags={tags} />;
}
