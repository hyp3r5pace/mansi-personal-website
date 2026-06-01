import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/mdx";
import { SITE } from "@/lib/site";
import { CaseStudyCover } from "@/components/projects/CaseStudyCover";
import { MetaStrip } from "@/components/projects/MetaStrip";
import { PaletteSection } from "@/components/projects/PaletteSection";
import { NextProject } from "@/components/projects/NextProject";
import { MdxRenderer } from "@/components/content/MdxRenderer";
import { MoodBoard } from "@/components/content/MoodBoard";
import { ProcessRow } from "@/components/content/ProcessRow";
import { MaterialList } from "@/components/content/MaterialList";

type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const url = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.excerpt,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.excerpt,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getAllProjects();
  const currentIndex = all.findIndex((p) => p.slug === project.slug);
  const next = all[(currentIndex + 1) % all.length] ?? null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.excerpt,
    creator: { "@type": "Person", name: SITE.author },
    dateCreated: project.date.toISOString(),
    keywords: project.tags.join(", "),
    inLanguage: "en",
    url: `${SITE.url}/projects/${project.slug}`,
    genre: project.category,
  };

  return (
    <main className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CaseStudyCover project={project} />
      <MetaStrip project={project} />

      <article className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
        <MdxRenderer source={project.body} />
      </article>

      {project.moodBoard.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <header className="mb-6">
            <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
              Mood
            </p>
            <h2 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic">
              References
            </h2>
          </header>
          <MoodBoard images={project.moodBoard} />
        </section>
      ) : null}

      {project.processRows.length > 0 ? (
        <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
          <header className="mb-6">
            <p className="text-char-ink/55 font-mono text-[10px] uppercase tracking-widest">
              Process
            </p>
            <h2 className="font-display text-ink-indigo mt-1 text-3xl tracking-tight italic">
              How it was made
            </h2>
          </header>
          {project.processRows.map((row, i) => (
            <ProcessRow
              key={i}
              image={row.image}
              align={row.align ?? (i % 2 === 0 ? "right" : "left")}
              caption={row.caption}
            >
              <p>{row.text}</p>
            </ProcessRow>
          ))}
        </section>
      ) : null}

      {project.materials.length > 0 || project.collaborators.length > 0 ? (
        <section className="mx-auto w-full max-w-3xl px-6 pb-4 sm:px-10">
          {project.materials.length > 0 ? (
            <MaterialList items={project.materials} title="Materials" />
          ) : null}
          {project.collaborators.length > 0 ? (
            <MaterialList items={project.collaborators} title="Collaborators" />
          ) : null}
        </section>
      ) : null}

      <PaletteSection project={project} />

      {next && next.slug !== project.slug ? <NextProject next={next} /> : null}
    </main>
  );
}
